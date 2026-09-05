# HejHome Z26 Zigbee2MQTT keep-alive

헤이홈 Z26 전구가 연결 후 약 8–10분 뒤 Zigbee 네트워크에서 이탈하는 현상을 완화하는 외부 컨버터입니다. 정확히 `TS0505B` / `_TZ3210_cnicaghm`인 제품에만 적용됩니다.

[한국어 설치 안내](README.ko.md) · [English installation guide](README.en.md) · [Technical evidence](evidence/observations.md)

![HejHome Z26](images/GKZ-LB431RGBCW-E26.png)

## 동작과 적용 범위

- 제품 모델은 `GKZ-LB431RGBCW-E26`입니다.
- `genBasic.appVersion`을 120초마다 읽으며, 별도 keep-alive 자동화는 필요하지 않습니다.
- 펌웨어 버전 66인 두 생산 lot에서 시험했습니다.
- 관찰된 self-leave를 억제했지만, 연속적인 장기 신뢰성과 최적 polling 간격은 확립되지 않았습니다.

기존 연결을 유지한 상태에서 [설치 안내](README.ko.md)에 따라 적용하세요. 다른 제조사 fingerprint의 `TS0505B`에는 적용하지 마세요. 펌웨어 자체를 수정하거나 모든 전원·통신 문제를 해결하는 방법은 아닙니다.

## English overview

This external converter mitigates the HejHome Z26's reproduced network leave after approximately 8–10 minutes. It matches only `TS0505B` / `_TZ3210_cnicaghm` and reads `genBasic.appVersion` every 120 seconds.

Tested on two production lots with application version 66. Periodic reads prevented the reproduced self-leave during observed testing. Continuous long-term reliability and the optimal polling interval have not been established.

See the [English guide](README.en.md) for installation, verification, troubleshooting, and limitations. The [technical evidence](evidence/observations.md) summarizes the device-specific findings and GOQUAL's corroborating workaround.

## Upstream support

[Converter PR #13122](https://github.com/Koenkk/zigbee-herdsman-converters/pull/13122) · [Device documentation PR #5490](https://github.com/Koenkk/zigbee2mqtt.io/pull/5490)

정식 버전에 내장 정의가 포함되기 전까지 외부 컨버터를 유지하세요. Keep the external converter until a Zigbee2MQTT release includes the built-in definition.

## License

[MIT](LICENSE-CODE) for the converter. [CC BY 4.0](LICENSE-DOCUMENTATION.md) for the report text and photograph composite, subject to the stated exclusions.
