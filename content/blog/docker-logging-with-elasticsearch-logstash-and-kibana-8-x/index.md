---
title: 'Docker Logging With Elasticsearch Logstash and Kibana 8.x'
date: 2023-06-02T19:42:03+01:00
draft: false
author: paranerd
categories: 
  - "general"
credit:
  url: https://unsplash.com/de/fotos/schwarz-silber-kamera-auf-schwarzem-stander-DYLsNF8hNho?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash
  author: 'Joe Gadd | Unsplash'
---

The [ELK-Stack](https://www.elastic.co/what-is/elk-stack) is one of the most popular logging platforms. It is flexible, well integrated and most of
all: extremely powerful! But with great power comes… great complexity. It took me many hours (more
than I’d like to admit) and a lot of very frustrating trial and error to get everything talk to each other the
right way. This was larely due to me being completely new to the world of Elasticsearch but also due to
the fact that there are countless broken and/or outdated tutorials out there. Especially the new (and very
welcome!) default security features took some digging to work appropriately.

To save everyone else from going through the same agony I put together this tutorial. If it reaches only
reaches a single poor soul early on their journey, this will have been worthwhile.

If you’re like me, you will not be very interested in too many words, you want stuff to copy and paste. So
here we go!

This first bit is mostly adapted from the [official Elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html). However, I couldn’t, for
whatever reason, get the „Single-node cluster“ section to work, so I adapted the „Multi-node cluster“
examples to work with a single node, instead.

First, we need to set some environment variables:

```bash { linenos=table }
# Password for the 'elastic' user (>= 6 characters)
ELASTIC_PASSWORD=pass

# Password for the 'kibana_system' user (>= 6 characters)
KIBANA_PASSWORD=pass

# Password for the 'logstash_system' user
LOGSTASH_SYSTEM_PASSWORD=pass

# 'logstash_internal' user
LOGSTASH_INTERNAL_USERNAME=logstash_internal
LOGSTASH_INTERNAL_PASSWORD=pass

# Version of Elastic products
STACK_VERSION=8.7.0

# Set the cluster name
CLUSTER_NAME=docker-cluster

# Set to 'basic' or 'trial' to automatically start the 30-day trial
LICENSE=basic

# Port to expose Elasticsearch HTTP API to the host
ES_PORT=9200

# Port to expose Kibana to the host
KIBANA_PORT=5601
```

Those variables are being used in the docker-compose.yaml below. It is not at all necessary to oursource
them into an extra, because you could just as well set the ${references} to their respective values but it
makes things a lot easier so we’re going to stick with it.

Next up is the „meat“ of it all: the `docker-compose.yaml`

```yaml { linenos=table }
services:
  setup:
    image: docker.elastic.co/elasticsearch/elasticsearch:${STACK_VERSION}
    volumes:
      - ./certs:/usr/share/elasticsearch/config/certs
    user: "0"
    command: >
      bash -c '
        if [ x${ELASTIC_PASSWORD} == x ]; then
          echo "Set the ELASTIC_PASSWORD environment variable in the .env file";
          exit 1;
        elif [ x${KIBANA_PASSWORD} == x ]; then
          echo "Set the KIBANA_PASSWORD environment variable in the .env file";
          exit 1;
        fi;
        if [ ! -f config/certs/ca.zip ]; then
          echo "Creating CA";
          bin/elasticsearch-certutil ca --silent --pem -out config/certs/ca.zip;
          unzip config/certs/ca.zip -d config/certs;
        fi;
        if [ ! -f config/certs/certs.zip ]; then
          echo "Creating certs";
          echo -ne \
          "instances:\n"\
          "  - name: es01\n"\
          "    dns:\n"\
          "      - es01\n"\
          "      - localhost\n"\
          "    ip:\n"\
          "      - 127.0.0.1\n"\
          > config/certs/instances.yml;
          bin/elasticsearch-certutil cert --silent --pem -out config/certs/certs.zip --in config/certs/instances.yml --ca-cert config/certs/ca/ca.crt --ca-key config/certs/ca/ca.key;
          unzip config/certs/certs.zip -d config/certs;
        fi;
        echo "Waiting for Elasticsearch availability";
        until curl -s --cacert config/certs/ca/ca.crt https://es01:9200 | grep -q "missing authentication credentials"; do sleep 30; done;
        echo "Setting kibana_system password";
        until curl -s -X POST --cacert config/certs/ca/ca.crt -u "elastic:${ELASTIC_PASSWORD}" -H "Content-Type: application/json" https://es01:9200/_security/user/kibana_system/_password -d "{\"password\":\"${KIBANA_PASSWORD}\"}" | grep -q "^{}"; do sleep 10; done;
        echo "Create logstash_writer role";
        until curl -s -X POST --cacert config/certs/ca/ca.crt -u "elastic:${ELASTIC_PASSWORD}" -H "Content-Type: application/json" https://es01:9200/_security/role/logstash_writer -d "{\"cluster\":[\"manage_index_templates\",\"manage_ilm\",\"monitor\"],\"indices\":[{\"names\":[\"logs-*\",\".ds.*\",\"syslog-*\",\"unifi-*\"],\"privileges\":[\"write\",\"create\",\"create_index\",\"manage\",\"manage_ilm\"]}]}" | grep -q "^{\"role\":{\"created\":true}}"; do sleep 10; done;
        echo "Create logstash_internal user";
        until curl -s -X POST --cacert config/certs/ca/ca.crt -u "elastic:${ELASTIC_PASSWORD}" -H "Content-Type: application/json" https://es01:9200/_security/user/logstash_internal -d "{\"password\":\"${LOGSTASH_INTERNAL_PASSWORD}\",\"roles\":[\"logstash_writer\"]}" | grep -q "^{\"created\":true}"; do sleep 10; done;
        echo "Create Agent Policy";
        until curl -s -X POST -u "elastic:${ELASTIC_PASSWORD}" -H "Content-Type: application/json" -H "kbn-xsrf: true" kibana:5601/api/fleet/agent_policies?sys_monitoring=true -d "{\"name\":\"Agent policy 1\",\"namespace\":\"default\",\"monitoring_enabled\":[\"logs\",\"metrics\"]}" | grep -q "^{\"item\""; do sleep 10; done;
        echo "All done!";
      '

  es01:
    image: elasticsearch:${STACK_VERSION}
    depends_on:
      - setup
    environment:
      - discovery.type=single-node
      - node.name=es01
      - ELASTIC_PASSWORD=${ELASTIC_PASSWORD}
      - xpack.security.enabled=true
      - xpack.security.http.ssl.enabled=true
      - xpack.security.http.ssl.key=certs/es01/es01.key
      - xpack.security.http.ssl.certificate=certs/es01/es01.crt
      - xpack.security.http.ssl.certificate_authorities=certs/ca/ca.crt
      - xpack.security.transport.ssl.enabled=true
      - xpack.security.transport.ssl.key=certs/es01/es01.key
      - xpack.security.transport.ssl.certificate=certs/es01/es01.crt
      - xpack.security.transport.ssl.certificate_authorities=certs/ca/ca.crt
      - xpack.security.transport.ssl.verification_mode=certificate
      - xpack.license.self_generated.type=${LICENSE}
    volumes:
      - ./certs:/usr/share/elasticsearch/config/certs
      - ./es01/:/usr/share/elasticsearch/data
    mem_limit: "1g"
    restart: unless-stopped

  redis:
    image: redis:6.2
    restart: unless-stopped

  logstash-agent:
    image: logstash:${STACK_VERSION}
    environment:
      - node.name=logstashAgent
      - xpack.monitoring.enabled=false
    volumes:
      - ./logstash/agent:/etc/logstash
      - ./certs:/etc/logstash/config/certs
    command: logstash -f /etc/logstash/logstash.conf
    depends_on:
      - es01
    ports:
      - 10514:10514/tcp
      - 10514:10514/udp
      - 10515:10515
      - 12201:12201/udp
    restart: unless-stopped

  logstash-central:
    image: logstash:${STACK_VERSION}
    environment:
      - node.name=logstashCentral
      - xpack.monitoring.enabled=false
      - ELASTICSEARCH_USERNAME=${LOGSTASH_INTERNAL_USERNAME}
      - ELASTICSEARCH_PASSWORD=${LOGSTASH_INTERNAL_PASSWORD}
    volumes:
      - ./logstash/central:/etc/logstash
      - ./certs:/etc/logstash/config/certs
    command: logstash -f /etc/logstash/logstash.conf
    depends_on:
      - es01
    restart: unless-stopped

  kibana:
    image: kibana:${STACK_VERSION}
    ports:
      - 5601:5601
    environment:
      - xpack.monitoring.collection.enabled=true
      - SERVER_PUBLICBASEURL=https://kibana.thegermancoder.com
      - ELASTICSEARCH_HOSTS=https://es01:9200
      - ELASTICSEARCH_USERNAME=kibana_system
      - ELASTICSEARCH_PASSWORD=${KIBANA_PASSWORD}
      - ELASTICSEARCH_SSL_CERTIFICATEAUTHORITIES=config/certs/ca/ca.crt
    depends_on:
      - es01
    volumes:
      - ./certs:/usr/share/kibana/config/certs
      - ./kibana:/usr/share/kibana/data
    restart: unless-stopped
```

Lemme explain…
 
We are looking at 6 containers:
– „setup“ is used for the initial, well… setup
– „es01“ holds Elasticsearch
– „logstash-agent“
– „logstash-central“
– „redis“
– „kibana“ contains, you guessed it: the Kibana instance!
 
Looks like much but it’s a very robust setup that way. We could do without the ‚logstash-agent‘ and the 
‚redis‘ container but I find that they make the system more resilient and more scalable – more on that 
below.
 
Let’s disect a little further.

## Services

### setup

After checking if all the passwords are set it creates the certification authority as well as the TLS-
certificates (if they don’t exist already). Those are important for secure inter-container communication,
which is enabled by default in v8.x and has been my main struggle deploying this.

Finally it sets up separate users and their passwords for Kibana and Logstash so that communication
works as expected.

### es01

This one has a bunch of ‚xpack.security’ environment variables for establishing secure connections to all
connecting services (i.e. Kibana and Logstash).

Note: The original documentation mentions setting ‚ulimits‘ as well but for some reason that wasn’t
working for me at all. Maybe due to the fact that I’m running this inside of a Linux Container (LXC) on
Proxmox, I’m not entirely sure. If you have a solution to this, please let me know!

‚es01‘ sharing the same ‚./certs‘ directory where ‚setup‘ was so kind to put all necessary files into.

### redis

We use a Redis database as some sort of a „cache“ for incoming log messages. Nothing to configure here,
I like that!

### logstash-agent

This is where all the log messages will arrive. Its only job is to take those incoming messages and pipe 
them into a redis database (coming up).
It is configured via a ‚logstash.conf‘ that we’ll have a look at below.
 
We open port 10514 for TCP and UDP instead of the default port 514 to avoid clashes.

### logstash-central

The second logstash instance will pull logs from the Redis „cache“, apply formatting, filters and the like
to then forward (output) them to Elasticsearch

The beauty of having 3 containers (agent, central and redis) compared only having ‚central‘ receive,
process and deliver all log messages on its own is that it’s way more scalable. Processing log messages
takes time, not much but enough to potentially become a bottleneck. By using the ‚agent‘ as the entry and
‚redis‘ as a cache we can make sure that we gather all incoming logs. Then ‚central‘ can take all the time
it needs to process and deliver to Elasticsearch.
If at some point the ‚agent‘ should be overwhelmed, we can simply spin up an ‚agent-2‘, ‚agent-3‘, … to
share the load. Redis I expect to be capable enough to just handle everything we throw at it but of course
one may also scale this.

### kibana

Finally, the only part we’ll actually interact with: Kibana.
Not much to do here, just listen on port 5601 for external access, provide it with username and password
for the ‚kibana_system‘ user, make sure we’re all using the same certificates and off we go!

## Logstash configurations

Well, not quite yet. First, we need to add some Logstash configurations so that everything is routed and
processed the way we need it.

In the folder where your ‚docker-compose.yaml‘ resides, create two folders:

`mkdir logstash/{agent,central}`

We’re going to configure the `agent` in `logstash/agent/logstash.conf`:

```bash { linenos=table }
input {
    gelf {
        port => 12201
    }

    udp {
        type => "syslog"
        port => 10514
    }

    tcp {
        type => "syslog"
        port => 10514
    }
}

output {
    redis {
        host => "redis"
        data_type => "list"
        key => "logstash"
    }
}
```

The above is telling this Logstash instance to listen on port 12201 and output everything to Redis.

Next up is `central` in `logstash/central/logstash.conf`:

```bash { linenos=table }
input {
  redis {
    host => "redis"
    type => "redis-input"
    data_type => "list"
    key => "logstash"
  }
}

filter {
  if [type] == "syslog" {
    # Syslog
    if [message] =~ "sequenceId" {
      # Synology
      grok {
        match => { "message" => '<%{POSINT:syslog_pri}>%{INT:version} %{TIMESTAMP_ISO8601:timestamp} %{HOSTNAME:hostname} %{DATA:syslog_program} - - (?:\[.+sequenceId="%{POSINT:message_id}"])? %{GREEDYDATA:log_message}' }
        add_field => [ "source", "%{hostname}" ]
      }
      syslog_pri { }
    } else {
      # All other syslogs
      grok {
        match => { "message" => "%{SYSLOGTIMESTAMP:timestamp} %{SYSLOGHOST:hostname} %{DATA:program}(?:\[%{POSINT:pid}\])?: %{GREEDYDATA:log_message}" }
        add_field => [ "source", "%{hostname}" ]
      }
      date {
        match => [ "timestamp", "MMM  d HH:mm:ss", "MMM dd HH:mm:ss" ]
        target => "timestamp"
      }
    }
  } else if [container_name] {
    # Docker
    # Move GELF 'host' to ECS 'host.hostname'
    mutate {
      rename => { "[host]" => "[host][hostname]" }
    }

    if [container_name] == "home-assistant" {
      # Home Assistant
      grok {
        match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{WORD:log_level} \(%{WORD:thread}\) \[%{NOTSPACE:namespace}\] %{GREEDYDATA:log_message}" }
        add_field => [ "[host][name]", "%{container_name}" ]
      }
    } else if [container_name] == "photoprism" {
      # PhotoPrism
      grok {
        match => { "message" => "time=\"%{TIMESTAMP_ISO8601:timestamp}\" level\=%{WORD:log_level} msg\=\"%{GREEDYDATA:log_message}\"" }
        add_field => [ "[host][name]", "%{container_name}" ]
      }
    } else {
      # All other containers
      grok {
        match => { "message" => "%{IP:client_ip} \- %{USERNAME:username} \[%{HTTPDATE:timestamp}\] \"%{WORD:http_method} %{NOTSPACE:path} HTTP/%{NUMBER:http_version}\" %{NUMBER:http_status} %{NUMBER:bytes} \"%{NOTSPACE:referrer}\" \"%{GREEDYDATA:user_agent}\"(?: \"%{IP:forwarded_for}\")?" }
        add_field => [ "[host][name]", "%{container_name}" ]
        add_field => [ "log_message", "%{message}" ]
      }
    }
  }

  if [hostname] and ![host][hostname] {
    mutate {
      copy => { "[hostname]" => "[host][hostname]" }
    }
  }

  if [hostname] and ![host][name] {
    mutate {
      copy => { "[hostname]" => "[host][name]" }
    }
  }

  # Use "source_host" as "host.ip"
  if [source_host] and ![host][ip] {
    mutate {
      copy => { "source_host" => "[host][ip]" }
    }
  }

  # Remove "message" if correctly parsed
  if "_grokparsefailure" not in [tags] {
    mutate {
      remove_field => ["message"]
    }
  }
}

output {
    elasticsearch {
      hosts => ["https://es01:9200"]
      ssl => true
      ssl_certificate_verification => true
      cacert => '/etc/logstash/config/certs/ca/ca.crt'
      user => "${ELASTICSEARCH_USERNAME}"
      password => "${ELASTICSEARCH_PASSWORD}"
    }
}
```

This works basically the same as the `agent` in that it has an input and an output. However, this time the
Redis database is the `input` and the output will be `elasticsearch`. The config can be copied and pasted
as-is because we’re accessing the `ELASTICSEARCH_USERNAME` and
`ELASTICSEARCH_PASSWORD` environment variables that we set in the `docker-compose.yaml`.

With that done we can simply run

```bash { linenos=table }
docker compose up -d
```

... and wait…
Starting up Kibana can take a minute or two, so you have to be patient.
Once everything is up and running, you’ll be greeted with a nice login screen.

You can now enter your username and password of the ‚elastic‘ user, but you’ll not find any logs in it.
How could you? We didn’t set that up, yet! So let’s finally do that!

## Send logs from Docker

Sending logs from Docker to a remote server is really simple. I’ll show you 2 ways you can do it.

### Set up logging per container

Adding the following to any `docker-compose.yaml` will result in the logs being sent to the remote
logging server only for that particular container:

```yaml { linenos=table }
logging:
  driver: gelf
  options:
    gelf-address: 'udp://[ip of your logging server]:12201'
```

What’s nice is that as of Docker version 20.10 you can send logs to a remote server but still access logs
locally via [docker logs](https://docs.docker.com/config/containers/logging/dual-logging/#overview).
Prior to that docker logs wasn’t available anymore in that case.

### Set up logging for all containers

The first method is great if you only want to send logs for particular containers. If you want ALL the
logs, adding the snippet to all compose files would be very cumbersome. To make it easier, you can
simply add the following to `/etc/docker/daemon.json` (you may have to create this file if it doesn’t exist,
yet):

```json { linenos=table }
"log-driver": "gelf",
"log-opts": {
  "gelf-address": "udp://[ip of your logging server]:12201"
}
```

Restart your docker daemon:

```bash { linenos=table }
service docker restart
```

Now you should see log messages flowing into Kibana for you to be evaluated and analyzed.

I hope this tutorial saved you the precious hours it cost me not having it.
Happy Logging!
