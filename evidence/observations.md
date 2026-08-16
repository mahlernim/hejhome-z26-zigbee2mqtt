# Sanitized observations

This file preserves the evidence needed to evaluate the case without publishing household entity names, Zigbee IEEE addresses, network identifiers, or complete private logs.

## Baseline

| Unit | Condition | Observation |
| --- | --- | --- |
| 2026-04 `LOT26D15` | Paired without keep-alive | Network leave observed 8 min 24 s after joining |
| 2026-02 `LOT26B30` | Paired with a level-control command override but no keep-alive | Network leave observed 10 min 19 s after joining |

For the 2026-02 `LOT26B30` unit, the Zigbee2MQTT database entry disappeared immediately after the leave. A retained Home Assistant `on` state was therefore not evidence of continued connectivity.

## Coordinator update

The CC2652P2-class coordinator was updated from Z-Stack revision `20210320` to `20240710`. The existing network was restored and other devices answered direct reads, confirming that the coordinator and mesh were operational. The Z26 nevertheless became registered-but-unresponsive later in the test. The coordinator update was therefore not sufficient.

## 30-second `appVersion` polling

- Repeated Basic-cluster reads returned `appVersion: 66`.
- One read timed out; the bulb answered the next poll approximately 31 seconds later without intervention.
- The bulb crossed the previous ten-minute failure window without leaving.
- A controlled brightness change succeeded after the failure window.

## 120-second `appVersion` polling

- The converter restarted at approximately 01:25 KST on 2026-08-15.
- Six consecutive reads returned `appVersion: 66` during the initial 12-minute validation.
- A later lighting command timed out, but Zigbee retry/recovery completed and subsequent commands succeeded.
- The 2026-02 `LOT26B30` unit remained joined for approximately 34 hours, ending only when the Zigbee2MQTT host underwent a planned maintenance power cycle.
- No leave event was observed during that polling period.

## Preliminary second-unit replication

- After maintenance, the 2026-04 `LOT26D15` unit was installed with the same exact-fingerprint converter and 120-second `appVersion` polling.
- It completed interview with the same `TS0505B` / `_TZ3210_cnicaghm` fingerprint and `66` / `1` / `0` application, hardware, and stack versions.
- It remained online and present in the Zigbee2MQTT database beyond its previous 8 min 24 s failure point and beyond the 10 min 19 s boundary observed with the other unit.
- This was an initial replication check, not a long-term stability result. Follow-up is planned after 24 hours and seven days.

## Interpretation boundary

These observations support a device-specific keep-alive mitigation across two known production lots. They do not establish the firmware's internal mechanism, the longest safe polling interval, or a permanent cure.
