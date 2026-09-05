# HejHome Z26 technical evidence

[Overview](../README.md) · [Installation](../README.en.md)

## Device identification

Both tested bulbs reported `TS0505B` / `_TZ3210_cnicaghm`, application version 66, hardware version 1, and stack version 0. The retail model is `GKZ-LB431RGBCW-E26`.

![Retail packaging, specifications, and product marking](../images/hejhome-z26-identification.png)

The image identifies the product and one tested production lot. Model, certification, and production-lot markings describe the product, not its Zigbee network identity.

## Reproduced baseline

| Production lot | Condition | Result |
| --- | --- | --- |
| `LOT26D15`, manufactured 2026-04 | No keep-alive | Network leave after 8 min 24 s |
| `LOT26B30`, manufactured 2026-02 | Level-control override, no keep-alive | Network leave after 10 min 19 s |

An explicit network leave and removal from the Zigbee device database distinguish this symptom from a stale Home Assistant state. Re-pairing, changing the level-control command, and updating the coordinator firmware did not independently establish reliable operation.

## Keep-alive results

The external converter reads endpoint 1, cluster `genBasic`, attribute `appVersion`.

| Test | Observation |
| --- | --- |
| 30-second polling | Repeated version reads succeeded; a timed-out read recovered on the next cycle |
| 120-second polling | Repeated reads succeeded beyond the reproduced failure window |
| `LOT26B30` with 120-second polling | No leave observed in an approximately 34-hour observation period |
| `LOT26D15` with 120-second polling | Remained connected beyond its reproduced failure window |
| Lighting control | Brightness commands succeeded during initial validation |
| Subsequent compatibility check | Both bulbs answered state, brightness, and color-temperature reads with the converter on Zigbee2MQTT 2.14.1 |

Initial testing used Zigbee2MQTT 2.13.0. The later compatibility check used converter library 26.105.0. This does not establish uninterrupted availability between tests. Communication interruptions outside the controlled observations could not be attributed to the converter.

## Independent corroboration

GOQUAL's [official Hejhome Homey app](https://homey.app/en-us/app/com.hejhome.iot/Hejhome/) version 1.1.17 describes changing the Z26 keep-alive from a five-minute `zclVersion` read to a 30-second `appVersion` read to address approximately ten-minute self-leaves.

This supports the symptom and general workaround. It does not independently validate this converter's 120-second interval.

## Interpretation limits

- Evidence covers two production lots with application version 66.
- Periodic `appVersion` reads prevented the reproduced self-leave during observed testing. This is a mitigation, not a demonstrated firmware repair.
- Continuous long-term reliability and the optimal polling interval have not been established.
- The firmware mechanism and whether other attributes would be equally effective remain unknown.
- Successful polling does not guarantee every lighting command succeeds or rule out power and routing failures.
- Findings must not be generalized to other `TS0505B` manufacturer fingerprints.
