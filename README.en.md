# HejHome Z26 installation guide

[한국어](README.ko.md) · [Overview](README.md)

This converter mitigates a reproduced self-leave issue affecting the HejHome Smart Color Bulb Z26. It reads the Basic cluster's `appVersion` attribute every 120 seconds while retaining the usual Tuya RGB+CCT features.

## Compatibility

| Field | Tested value |
| --- | --- |
| Retail model | `GKZ-LB431RGBCW-E26` |
| Zigbee model | `TS0505B` |
| Manufacturer | `_TZ3210_cnicaghm` |
| Application / hardware / stack version | `66` / `1` / `0` |
| Endpoint | `1` |
| Tested software | Zigbee2MQTT 2.13.0 and 2.14.1 |

The manufacturer fingerprint must match exactly. Other products can report `TS0505B` while using different firmware. This repository provides an external converter, not an OTA firmware update.

## Installation

1. Confirm the model and manufacturer in Zigbee2MQTT's device information.
2. Download and review [`hejhome-z26.mjs`](external_converter/hejhome-z26.mjs). External converters execute JavaScript inside Zigbee2MQTT.
3. Place it in the `external_converters` directory beside Zigbee2MQTT's `configuration.yaml`, or save its contents through **Settings → Dev console → External converters**. Replace any earlier converter for this same fingerprint rather than loading both.
4. On Zigbee2MQTT 2.11.0 and later, enable external JavaScript in the configuration:

   ```yaml
   advanced:
     enable_external_js: true
   ```

5. Restart Zigbee2MQTT. Confirm the bulb is recognized as `TS0505B_1_cnicaghm` with an external definition.

An already paired bulb does not need to be reset or re-paired to load this converter. No separate polling automation is needed. See the official [external converter documentation](https://www.zigbee2mqtt.io/advanced/more/external_converters.html).

## Verify and troubleshoot

Temporarily enable debug logging and look for `hejhome_z26_app_version_keepalive` with a 120-second interval, followed by successful `genBasic` read responses. The tested firmware returns `appVersion: 66`. Restore your usual logging level afterward.

Confirm fresh device responses beyond the former 8–10-minute failure window. A retained MQTT state alone does not prove connectivity. If the bulb is unresponsive, check whether mains power is available and whether other Zigbee devices can communicate. Power loss, routing problems, and an explicit network leave are different failure modes.

If the converter fails to load, inspect Zigbee2MQTT's startup error and check the file location, JavaScript setting, and duplicate definitions. Do not reset the bulb merely to troubleshoot a converter-loading error.

## Evidence and limitations

GOQUAL's [official Homey app changelog](https://homey.app/en-us/app/com.hejhome.iot/Hejhome/) describes an `appVersion` keep-alive for the same approximately ten-minute self-leave symptom. Its driver uses 30 seconds; this converter uses an empirically tested 120 seconds.

Testing covered two production lots with application version 66. The reproduced self-leave was prevented during the observed polling periods. Continuous long-term reliability, the optimal interval, and the firmware's internal mechanism have not been established. Some communication interruptions occurred outside the controlled observations and were not attributable to the converter. This workaround does not guarantee uninterrupted availability or correct every lighting-command timeout.

See [technical evidence](evidence/observations.md) for the baseline, observed results, and interpretation limits.

## Built-in support

Support has been proposed in [converter PR #13122](https://github.com/Koenkk/zigbee-herdsman-converters/pull/13122) with [device documentation PR #5490](https://github.com/Koenkk/zigbee2mqtt.io/pull/5490). A submitted PR does not mean the device definition is available in a release.

Keep using this external converter until a Zigbee2MQTT release includes the built-in definition. After upgrading to that version, remove the external converter and restart Zigbee2MQTT. Confirm the bulb uses the built-in `GKZ-LB431RGBCW-E26` definition. Re-pairing is not required.

## Reporting an issue

Include the retail model, manufacturer fingerprint, firmware version, Zigbee2MQTT version, and a short redacted error excerpt. State whether the symptom is a network leave, a timeout, or a converter-loading failure. Korean and English reports are welcome.

Do not upload credentials, IEEE addresses, full configuration files, household device names, or household activity logs.

## License

[MIT](LICENSE-CODE) for code and [CC BY 4.0](LICENSE-DOCUMENTATION.md) for the report text and photograph composite, subject to the stated exclusions.
