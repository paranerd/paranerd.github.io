---
title: 'Docker Logging With Elasticsearch Logstash and Kibana 8.x'
date: 2024-03-17T19:42:03+01:00
draft: false
author: paranerd
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

```bash
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
