---
title: 'ESPHome Smart Irrigation'
date: '2024-06-14'
author: paranerd
draft: false
categories:
  - 'how-to'
  - 'esphome'
credit:
  url: https://unsplash.com/de/fotos/wasserspritzer-auf-braunem-holzpfosten-1_K74KTKke8?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash
  author: 'Hamed Taha | Unsplash'
---

When I installed an irrigation system in my yard quite some years ago it was clear to me that I wasn't going with the "official" controller. It was expensive, didn't come with WiFi out of the box (that would have cost a hefty premium), thus was difficult or even impossible to integrate and it just wasn't flexible enough.

**Here's my setup:**

- 8 Valves
- 13 sprinklers
- 2 drip hoses
- 5 zones each comprised of one or more sprinklers, hoses or a combination

In addition I wanted an automation to iterate over the zones in a predefined order with predefined timings. Given those requirements, I then settled for 2 Sonoff 4CH Pro R2 flashed with Tasmota which worked flawlessly ever since. However, time has passed and the Smart Home landscape has evolved. This led me to re-evaluate my setup and I came to the conclusion that ESPHome was now easy and yet powerful enough to replace Tasmota on all my devices with it.

### The Software

ESPHome is absolutely fantastic both for its simplicity, flexibility and not least its declarative nature.

Even though my architecture up to this point worked quite well it was essentially built as a collection of helpers which were all over the place and most of all lacked a critical feature: I built an automation for each valve to force-stop it after a certain time. Both as a way to just start a valve and have it shut down automatically, but also as sort of a safety if something went wrong with the automations to not have them running indefinitely.

This led to an interesting problem, though: What if Home Assistant triggered a valve but then restarted and lost track of what was going on? I fixed this by introducing another Automation to stop all valves on Home Assistant startup. But what if Home Assistant did not restart but stayed offline? To be honest, this never happened during sprinkler runtime, but there's always the possibility and I didn't have an answer for it - until I discovered ESPHome. This made it possible to have most of the logic on the board itself, so connectivity issues don't pose a threat anymore.

So I went on, installed the [configuration](https://devices.esphome.io/devices/Sonoff-4CH-Pro-R2) from ESPHome's library and all was well. But then I discovered the `sprinkler` controller and it blew my mind! All those years I've been creating various Automations, Scripts and other helpers in Home Assistant to provide good control over the individual valves as well as the automated iteration. The sprinkler controller looked like everything I've manually built and fine tuned over the years with some additional perks like the option to dynamically set the sprinkler runtime. And what's more is that it does all of this in a much nicer package with even more possibilities - or so I thought.

#### Using the built-in sprinkler component

Let's have a look at my initial attempt:

```yaml { linenos=table }
esphome:
  name: irrigation
  friendly_name: Irrigation

esp32:
  board: esp32dev
  framework:
    type: arduino

# Enable logging
logger:

# Enable Home Assistant API
api:
  encryption:
    key: 'my-key'

ota:
  platform: esphome
  password: 'my-password'

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: 'Irrigation Hotspot'
    password: 'password'

captive_portal:

# Device Specific Config
binary_sensor:
  - platform: status
    name: 'Status'

sprinkler:
  # Valve controller
  - id: valve_controller
    main_switch: 'Alle Sprenger'
    auto_advance_switch: 'Alle Sprenger Automatik'
    valve_open_delay: 5s
    valves:
      - valve_switch: 'Sprenger 1'
        enable_switch: 'Sprenger 1 aktiv'
        run_duration_number:
          name: 'Sprenger 1 Dauer'
          initial_value: 20
          unit_of_measurement: min
          min_value: 1
          max_value: 60
        valve_switch_id: valve_1
      - valve_switch: 'Sprenger 2'
        enable_switch: 'Sprenger 2 aktiv'
        run_duration_number:
          name: 'Sprenger 2 Dauer'
          initial_value: 20
          unit_of_measurement: min
          min_value: 1
          max_value: 60
        valve_switch_id: valve_2
      - valve_switch: 'Sprenger 3'
        enable_switch: 'Sprenger 3 aktiv'
        run_duration_number:
          name: 'Sprenger 3 Dauer'
          initial_value: 20
          unit_of_measurement: min
          min_value: 1
          max_value: 60
        valve_switch_id: valve_3
      - valve_switch: 'Sprenger 4'
        enable_switch: 'Sprenger 4 aktiv'
        run_duration_number:
          name: 'Sprenger 4 Dauer'
          initial_value: 20
          unit_of_measurement: min
          min_value: 1
          max_value: 60
        valve_switch_id: valve_4
      - valve_switch: 'Sprenger 5'
        enable_switch: 'Sprenger 5 aktiv'
        run_duration_number:
          name: 'Sprenger 5 Dauer'
          initial_value: 20
          unit_of_measurement: min
          min_value: 1
          max_value: 60
        valve_switch_id: valve_5
      - valve_switch: 'Sprenger 6'
        enable_switch: 'Sprenger 6 aktiv'
        run_duration_number:
          name: 'Sprenger 6 Dauer'
          initial_value: 20
          unit_of_measurement: min
          min_value: 1
          max_value: 60
        valve_switch_id: valve_6
      - valve_switch: 'Sprenger 7'
        enable_switch: 'Sprenger 7 aktiv'
        run_duration_number:
          name: 'Sprenger 7 Dauer'
          initial_value: 20
          unit_of_measurement: min
          min_value: 1
          max_value: 60
        valve_switch_id: valve_7
      - valve_switch: 'Sprenger 8'
        enable_switch: 'Sprenger 8 aktiv'
        run_duration_number:
          name: 'Sprenger 8 Dauer'
          initial_value: 20
          unit_of_measurement: min
          min_value: 1
          max_value: 60
        valve_switch_id: valve_8

  # Zone controller
  - id: zone_controller
    main_switch: 'Alle Zonen'
    auto_advance_switch: 'Alle Zonen Automatik'
    valve_open_delay: 5s
    valves:
      - valve_switch: 'Zone 1'
        enable_switch: 'Zone 1 aktiv'
        run_duration_number:
          name: 'Zone 1 Dauer'
          initial_value: 15
          unit_of_measurement: min
          min_value: 1
          max_value: 60
        valve_switch_id: zone_1
      - valve_switch: 'Zone 2'
        enable_switch: 'Zone 2 aktiv'
        run_duration_number:
          name: 'Zone 2 Dauer'
          initial_value: 15
          unit_of_measurement: min
          min_value: 1
          max_value: 60
        valve_switch_id: zone_2
      - valve_switch: 'Zone 3'
        enable_switch: 'Zone 3 aktiv'
        run_duration_number:
          name: 'Zone 3 Dauer'
          initial_value: 10
          unit_of_measurement: min
          min_value: 1
          max_value: 60
        valve_switch_id: zone_3
      - valve_switch: 'Zone 4'
        enable_switch: 'Zone 4 aktiv'
        run_duration_number:
          name: 'Zone 4 Dauer'
          initial_value: 15
          unit_of_measurement: min
          min_value: 1
          max_value: 60
        valve_switch_id: zone_4
      - valve_switch: 'Zone 5'
        enable_switch: 'Zone 5 aktiv'
        run_duration_number:
          name: 'Zone 5 Dauer'
          initial_value: 30
          unit_of_measurement: min
          min_value: 1
          max_value: 60
        valve_switch_id: zone_5

switch:
  # Individual valves
  - platform: gpio
    id: valve_1
    name: 'Sprenger 1'
    icon: 'mdi:sprinkler'
    pin: GPIO16
    on_turn_on:
      - delay: 60min
      - switch.turn_off: valve_1
  - platform: gpio
    id: valve_2
    name: 'Sprenger 2'
    icon: 'mdi:sprinkler'
    pin: GPIO14
    on_turn_on:
      - delay: 60min
      - switch.turn_off: valve_2
  - platform: gpio
    id: valve_3
    name: 'Sprenger 3'
    icon: 'mdi:sprinkler'
    pin: GPIO12
    on_turn_on:
      - delay: 60min
      - switch.turn_off: valve_3
  - platform: gpio
    id: valve_4
    name: 'Sprenger 4'
    icon: 'mdi:sprinkler'
    pin: GPIO13
    on_turn_on:
      - delay: 60min
      - switch.turn_off: valve_4
  - platform: gpio
    id: valve_5
    name: 'Sprenger 5'
    icon: 'mdi:sprinkler'
    pin: GPIO15
    on_turn_on:
      - delay: 60min
      - switch.turn_off: valve_5
  - platform: gpio
    id: valve_6
    name: 'Sprenger 6'
    icon: 'mdi:sprinkler'
    pin: GPIO0
    on_turn_on:
      - delay: 60min
      - switch.turn_off: valve_6
  - platform: gpio
    id: valve_7
    name: 'Sprenger 7'
    icon: 'mdi:sprinkler'
    pin: GPIO4
    on_turn_on:
      - delay: 60min
      - switch.turn_off: valve_7
  - platform: gpio
    id: valve_8
    name: 'Sprenger 8'
    icon: 'mdi:sprinkler'
    pin: GPIO5
    on_turn_on:
      - delay: 60min
      - switch.turn_off: valve_8

  # Valves grouped in zones
  - platform: template
    id: zone_1
    name: 'Zone 1'
    lambda: |-
      return id(valve_1).state || id(valve_8).state;
    turn_on_action:
      - switch.turn_on: valve_1
      - switch.turn_on: valve_8
    turn_off_action:
      - switch.turn_off: valve_1
      - switch.turn_off: valve_8
  - platform: template
    id: zone_2
    name: 'Zone 2'
    lambda: |-
      return id(valve_2).state;
    turn_on_action:
      - switch.turn_on: valve_2
    turn_off_action:
      - switch.turn_off: valve_2
  - platform: template
    id: zone_3
    name: 'Zone 3'
    lambda: |-
      return id(valve_3).state;
    turn_on_action:
      - switch.turn_on: valve_3
    turn_off_action:
      - switch.turn_off: valve_3
  - platform: template
    id: zone_4
    name: 'Zone 4'
    lambda: |-
      return id(valve_4).state || id(valve_5).state;
    turn_on_action:
      - switch.turn_on: valve_4
      - switch.turn_on: valve_5
    turn_off_action:
      - switch.turn_off: valve_4
      - switch.turn_off: valve_5
  - platform: template
    id: zone_5
    name: 'Zone 5'
    lambda: |-
      return id(valve_6).state || id(valve_7).state;
    turn_on_action:
      - switch.turn_on: valve_6
      - switch.turn_on: valve_7
    turn_off_action:
      - switch.turn_off: valve_6
      - switch.turn_off: valve_7
```

Below the regular "framework" at the top there's the `sprinkler` controllers. First one for all individual valves, then another for the zones. The valve switches all directly link to their corresponding GPIO switch while the zone switches link to template switches I used to group valves together.

At first this looked really nice but the closer I looked the more it became clear that this was not very well suited for my needs.

The zone switches for example were a necessary "hack" to circumvent the `sprinkler` controller itself not being able to operate multiple switches in parallel.

Another drawback was the fact that even with those virtual zone switches you couldn't stop one valve in a zone without stopping **all** valves in that zone. Since we often need this feature for various reasons (e.g. having laundry in reach of a particular sprinkler) this wasn't feasible. There were many minor details about this approach that didn't quite fit which caused me to give it a complete overhaul.

#### All manual

Determined to get this up and running with ESPHome I invested many more hours into crafting the following:

```yaml { linenos=table }
esphome:
  name: irrigation
  friendly_name: Irrigation

esp32:
  board: esp32dev
  framework:
    type: arduino

# Enable logging
logger:

# Enable Home Assistant API
api:
  encryption:
    key: 'my-key'

ota:
  platform: esphome
  password: 'my-password'

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: 'Irrigation Hotspot'
    password: 'password'

captive_portal:

binary_sensor:
  - platform: status
    name: 'Status'

substitutions:
  max_runtime: '60'
  valve_open_delay: 5s

script:
  # Execution helpers to allow for delays to be cancelled
  - id: valve_1_on_off
    then:
      - switch.turn_on: valve_1
      - delay: !lambda 'return id(valve_1_duration).state * 1000;'
      - switch.turn_off: valve_1
  - id: valve_2_on_off
    then:
      - switch.turn_on: valve_2
      - delay: !lambda 'return id(valve_2_duration).state * 1000;'
      - switch.turn_off: valve_2
  - id: valve_3_on_off
    then:
      - switch.turn_on: valve_3
      - delay: !lambda 'return id(valve_3_duration).state * 1000;'
      - switch.turn_off: valve_3
  - id: valve_4_on_off
    then:
      - switch.turn_on: valve_4
      - delay: !lambda 'return id(valve_4_duration).state * 1000;'
      - switch.turn_off: valve_4
  - id: valve_5_on_off
    then:
      - switch.turn_on: valve_5
      - delay: !lambda 'return id(valve_5_duration).state * 1000;'
      - switch.turn_off: valve_5
  - id: valve_6_on_off
    then:
      - switch.turn_on: valve_6
      - delay: !lambda 'return id(valve_6_duration).state * 1000;'
      - switch.turn_off: valve_6
  - id: valve_7_on_off
    then:
      - switch.turn_on: valve_7
      - delay: !lambda 'return id(valve_7_duration).state * 1000;'
      - switch.turn_off: valve_7
  - id: valve_8_on_off
    then:
      - switch.turn_on: valve_8
      - delay: !lambda 'return id(valve_8_duration).state * 1000;'
      - switch.turn_off: valve_8

switch:
  # Valves
  - platform: gpio
    id: valve_1
    name: 'Sprenger 1'
    icon: 'mdi:sprinkler'
    pin: GPIO16
    on_turn_on:
      then:
        - script.execute: valve_1_on_off
    on_turn_off:
      then:
        - script.stop: valve_1_on_off
  - platform: gpio
    id: valve_2
    name: 'Sprenger 2'
    icon: 'mdi:sprinkler'
    pin: GPIO14
    on_turn_on:
      then:
        - script.execute: valve_2_on_off
    on_turn_off:
      then:
        - script.stop: valve_2_on_off
  - platform: gpio
    id: valve_3
    name: 'Sprenger 3'
    icon: 'mdi:sprinkler'
    pin: GPIO12
    on_turn_on:
      then:
        - script.execute: valve_3_on_off
    on_turn_off:
      then:
        - script.stop: valve_3_on_off
  - platform: gpio
    id: valve_4
    name: 'Sprenger 4'
    icon: 'mdi:sprinkler'
    pin: GPIO13
    on_turn_on:
      then:
        - script.execute: valve_4_on_off
    on_turn_off:
      then:
        - script.stop: valve_4_on_off
  - platform: gpio
    id: valve_5
    name: 'Sprenger 5'
    icon: 'mdi:sprinkler'
    pin: GPIO15
    on_turn_on:
      then:
        - script.execute: valve_5_on_off
    on_turn_off:
      then:
        - script.stop: valve_5_on_off
  - platform: gpio
    id: valve_6
    name: 'Sprenger 6'
    icon: 'mdi:sprinkler'
    pin: GPIO0
    on_turn_on:
      then:
        - script.execute: valve_6_on_off
    on_turn_off:
      then:
        - script.stop: valve_6_on_off
  - platform: gpio
    id: valve_7
    name: 'Sprenger 7'
    icon: 'mdi:sprinkler'
    pin: GPIO4
    on_turn_on:
      then:
        - script.execute: valve_7_on_off
    on_turn_off:
      then:
        - script.stop: valve_7_on_off
  - platform: gpio
    id: valve_8
    name: 'Sprenger 8'
    icon: 'mdi:sprinkler'
    pin: GPIO5
    on_turn_on:
      then:
        - script.execute: valve_8_on_off
    on_turn_off:
      then:
        - script.stop: valve_8_on_off

  # Valves Enabled
  - platform: template
    id: valve_1_enabled
    name: 'Sprenger 1 aktiv'
    icon: 'mdi:check-circle-outline'
    optimistic: True
  - platform: template
    id: valve_2_enabled
    name: 'Sprenger 2 aktiv'
    icon: 'mdi:check-circle-outline'
    optimistic: True
  - platform: template
    id: valve_3_enabled
    name: 'Sprenger 3 aktiv'
    icon: 'mdi:check-circle-outline'
    optimistic: True
  - platform: template
    id: valve_4_enabled
    name: 'Sprenger 4 aktiv'
    icon: 'mdi:check-circle-outline'
    optimistic: True
  - platform: template
    id: valve_5_enabled
    name: 'Sprenger 5 aktiv'
    icon: 'mdi:check-circle-outline'
    optimistic: True
  - platform: template
    id: valve_6_enabled
    name: 'Sprenger 6 aktiv'
    icon: 'mdi:check-circle-outline'
    optimistic: True
  - platform: template
    id: valve_7_enabled
    name: 'Sprenger 7 aktiv'
    icon: 'mdi:check-circle-outline'
    optimistic: True
  - platform: template
    id: valve_8_enabled
    name: 'Sprenger 8 aktiv'
    icon: 'mdi:check-circle-outline'
    optimistic: True

  # Zones
  - platform: template
    id: zone_1
    name: 'Zone 1'
    icon: 'mdi:sprinkler-variant'
    lambda: |-
      return id(valve_1).state || id(valve_8).state;
    turn_on_action:
      then:
        - if:
            condition:
              - switch.is_on: valve_1_enabled
            then:
              - number.set:
                  id: valve_1_duration
                  value: !lambda 'return id(zone_1_duration).state;'
              - switch.turn_on: valve_1
        - if:
            condition:
              - switch.is_on: valve_8_enabled
            then:
              - number.set:
                  id: valve_8_duration
                  value: !lambda 'return id(zone_1_duration).state;'
              - switch.turn_on: valve_8
        - delay: !lambda 'return id(zone_1_duration).state * 1000;'
        - switch.turn_off: zone_1
    turn_off_action:
      then:
        - switch.turn_off: valve_1
        - switch.turn_off: valve_8
  - platform: template
    id: zone_2
    name: 'Zone 2'
    icon: 'mdi:sprinkler-variant'
    lambda: |-
      return id(valve_2).state;
    turn_on_action:
      then:
        - if:
            condition:
              - switch.is_on: valve_2_enabled
            then:
              - number.set:
                  id: valve_2_duration
                  value: !lambda 'return id(zone_2_duration).state;'
              - switch.turn_on: valve_2
        - delay: !lambda 'return id(zone_2_duration).state * 1000;'
        - switch.turn_off: zone_2
    turn_off_action:
      then:
        - switch.turn_off: valve_2
  - platform: template
    id: zone_3
    name: 'Zone 3'
    icon: 'mdi:sprinkler-variant'
    lambda: |-
      return id(valve_3).state;
    turn_on_action:
      then:
        - if:
            condition:
              - switch.is_on: valve_3_enabled
            then:
              - number.set:
                  id: valve_3_duration
                  value: !lambda 'return id(zone_3_duration).state;'
              - switch.turn_on: valve_3
        - delay: !lambda 'return id(zone_3_duration).state * 1000;'
        - switch.turn_off: zone_3
    turn_off_action:
      then:
        - switch.turn_off: valve_3
  - platform: template
    id: zone_4
    name: 'Zone 4'
    icon: 'mdi:sprinkler-variant'
    lambda: |-
      return id(valve_4).state || id(valve_5).state;
    turn_on_action:
      then:
        - if:
            condition:
              - switch.is_on: valve_4_enabled
            then:
              - number.set:
                  id: valve_4_duration
                  value: !lambda 'return id(zone_4_duration).state;'
              - switch.turn_on: valve_4
        - if:
            condition:
              - switch.is_on: valve_5_enabled
            then:
              - number.set:
                  id: valve_5_duration
                  value: !lambda 'return id(zone_4_duration).state;'
              - switch.turn_on: valve_5
        - delay: !lambda 'return id(zone_4_duration).state * 1000;'
        - switch.turn_off: zone_4
    turn_off_action:
      then:
        - switch.turn_off: valve_4
        - switch.turn_off: valve_5
  - platform: template
    id: zone_5
    name: 'Zone 5'
    icon: 'mdi:sprinkler-variant'
    lambda: |-
      return id(valve_6).state || id(valve_7).state;
    turn_on_action:
      then:
        - if:
            condition:
              - switch.is_on: valve_6_enabled
            then:
              - number.set:
                  id: valve_6_duration
                  value: !lambda 'return id(zone_5_duration).state;'
              - switch.turn_on: valve_6
        - if:
            condition:
              - switch.is_on: valve_7_enabled
            then:
              - number.set:
                  id: valve_7_duration
                  value: !lambda 'return id(zone_5_duration).state;'
              - switch.turn_on: valve_7
        - delay: !lambda 'return id(zone_5_duration).state * 1000;'
        - switch.turn_off: zone_5
    turn_off_action:
      then:
        - switch.turn_off: valve_6
        - switch.turn_off: valve_7

  # Zones Enabled
  - platform: template
    id: zone_1_enabled
    name: 'Zone 1 aktiv'
    icon: 'mdi:check-circle-outline'
    optimistic: True
  - platform: template
    id: zone_2_enabled
    name: 'Zone 2 aktiv'
    icon: 'mdi:check-circle-outline'
    optimistic: True
  - platform: template
    id: zone_3_enabled
    name: 'Zone 3 aktiv'
    icon: 'mdi:check-circle-outline'
    optimistic: True
  - platform: template
    id: zone_4_enabled
    name: 'Zone 4 aktiv'
    icon: 'mdi:check-circle-outline'
    optimistic: True
  - platform: template
    id: zone_5_enabled
    name: 'Zone 5 aktiv'
    icon: 'mdi:check-circle-outline'
    optimistic: True

  # Automation
  - platform: template
    id: automation
    name: 'Automation'
    icon: 'mdi:robot'
    #lambda: |-
    #  return id(zone_1).state || id(zone_2).state || id(zone_3).state || id(zone_4).state || id(zone_5).state;
    optimistic: True
    turn_on_action:
      then:
        - if:
            condition:
              - switch.is_on: zone_1_enabled
            then:
              - switch.turn_on: zone_1
              - delay: !lambda 'return id(zone_1_duration).state * 1000;'
              - delay: $valve_open_delay
        - if:
            condition:
              - switch.is_on: zone_2_enabled
            then:
              - switch.turn_on: zone_2
              - delay: !lambda 'return id(zone_2_duration).state * 1000;'
              - delay: $valve_open_delay
        - if:
            condition:
              - switch.is_on: zone_3_enabled
            then:
              - switch.turn_on: zone_3
              - delay: !lambda 'return id(zone_3_duration).state * 1000;'
              - delay: $valve_open_delay
        - if:
            condition:
              - switch.is_on: zone_4_enabled
            then:
              - switch.turn_on: zone_4
              - delay: !lambda 'return id(zone_4_duration).state * 1000;'
              - delay: $valve_open_delay
        - if:
            condition:
              - switch.is_on: zone_5_enabled
            then:
              - switch.turn_on: zone_5
              - delay: !lambda 'return id(zone_5_duration).state * 1000;'
        - switch.turn_off: automation
    turn_off_action:
      then:
        - switch.turn_off: zone_1
        - switch.turn_off: zone_2
        - switch.turn_off: zone_3
        - switch.turn_off: zone_4
        - switch.turn_off: zone_5

number:
  # Sprinkler Durations
  - platform: template
    name: 'Sprenger 1 Dauer'
    id: valve_1_duration
    icon: 'mdi:timer'
    optimistic: true
    min_value: 1
    max_value: $max_runtime
    initial_value: 20
    step: 1
    unit_of_measurement: min
  - platform: template
    name: 'Sprenger 2 Dauer'
    id: valve_2_duration
    icon: 'mdi:timer'
    optimistic: true
    min_value: 1
    max_value: $max_runtime
    initial_value: 20
    step: 1
    unit_of_measurement: min
  - platform: template
    name: 'Sprenger 3 Dauer'
    id: valve_3_duration
    icon: 'mdi:timer'
    optimistic: true
    min_value: 1
    max_value: $max_runtime
    initial_value: 20
    step: 1
    unit_of_measurement: min
  - platform: template
    name: 'Sprenger 4 Dauer'
    id: valve_4_duration
    icon: 'mdi:timer'
    optimistic: true
    min_value: 1
    max_value: $max_runtime
    initial_value: 20
    step: 1
    unit_of_measurement: min
  - platform: template
    name: 'Sprenger 5 Dauer'
    id: valve_5_duration
    icon: 'mdi:timer'
    optimistic: true
    min_value: 1
    max_value: $max_runtime
    initial_value: 20
    step: 1
    unit_of_measurement: min
  - platform: template
    name: 'Sprenger 6 Dauer'
    id: valve_6_duration
    icon: 'mdi:timer'
    optimistic: true
    min_value: 1
    max_value: $max_runtime
    initial_value: 20
    step: 1
    unit_of_measurement: min
  - platform: template
    name: 'Sprenger 7 Dauer'
    id: valve_7_duration
    icon: 'mdi:timer'
    optimistic: true
    min_value: 1
    max_value: $max_runtime
    initial_value: 20
    step: 1
    unit_of_measurement: min
  - platform: template
    name: 'Sprenger 8 Dauer'
    id: valve_8_duration
    icon: 'mdi:timer'
    optimistic: true
    min_value: 1
    max_value: $max_runtime
    initial_value: 20
    step: 1
    unit_of_measurement: min

  # Zone Durations
  - platform: template
    name: 'Zone 1 Dauer'
    id: zone_1_duration
    icon: 'mdi:timer'
    optimistic: true
    min_value: 1
    max_value: $max_runtime
    initial_value: 20
    step: 1
    unit_of_measurement: min
  - platform: template
    name: 'Zone 2 Dauer'
    id: zone_2_duration
    icon: 'mdi:timer'
    optimistic: true
    min_value: 1
    max_value: $max_runtime
    initial_value: 20
    step: 1
    unit_of_measurement: min
  - platform: template
    name: 'Zone 3 Dauer'
    id: zone_3_duration
    icon: 'mdi:timer'
    optimistic: true
    min_value: 1
    max_value: $max_runtime
    initial_value: 20
    step: 1
    unit_of_measurement: min
  - platform: template
    name: 'Zone 4 Dauer'
    id: zone_4_duration
    icon: 'mdi:timer'
    optimistic: true
    min_value: 1
    max_value: $max_runtime
    initial_value: 20
    step: 1
    unit_of_measurement: min
  - platform: template
    name: 'Zone 5 Dauer'
    id: zone_5_duration
    icon: 'mdi:timer'
    optimistic: true
    min_value: 1
    max_value: $max_runtime
    initial_value: 20
    step: 1
    unit_of_measurement: min
```

The top section remained basically unchanged, however below it nearly everything is different.

Since I no longer had the "magic" behind the `sprinkler` controller, i.e. all the implicit controls like duration and automation, I had to spell it all out explicitly. While being extremely tedious this provided me with exactly the flexibility I was missing from my previous approaches.

Here are the most notable parts:

The new configuration still has GPIO switches to control the individual valves. But instead of controlling them directly I'm now using a `script` because without it when you start a valve with a 10 minute runtime, then stop it after 8 minutes and immediately restart it it will only run for another 2 minutes before delay kicks in and stops it. Scripts work differently in that stopping the script will also cancel the delay.

The zones now have conditions to check if a valve is enabled or not, thus allowing a zone to run even if not all valves are involved. Another highlight is that the zone will automatically set the valves' runtimes to match the zone. There was an intermittent version which set the zone's runtime according to the maximum runtime of its child valves:

```yaml
turn_on_action:
  then:
    - number.set:
        id: zone_1_duration
        value: !lambda 'return max(id(valve_1_duration).state, id(valve_8_duration).state)'
```

This would allow a valve to be shut down before the end of the zone's runtime:

- Valve 1: 10min runtime
- Valve 8: 15min runtime
- Zone 1: max(10min, 15min) = 15min runtime

The automation now also respects each zone's enabled status. Together with the same mechanism in each of the zones this setup is super flexible and allows for the automation to only open the valves you want it to.

### The Hardware
