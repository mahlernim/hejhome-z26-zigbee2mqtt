# 헤이홈 Z26의 8–10분 후 Zigbee 네트워크 이탈 문제

[Full technical report in English](README.md)

## 요약

헤이홈 스마트 컬러 전구 Z26 두 개에서 같은 문제가 발생했다. 두 전구 모두 Zigbee 식별 정보가 `TS0505B` / `_TZ3210_cnicaghm`이었고, 페어링 직후에는 정상 작동했지만 각각 **8분 24초**, **10분 19초** 뒤 Zigbee2MQTT에 `leaveInd`를 남기고 네트워크에서 이탈했다.

공장 초기화와 재페어링, 새 전구로 교체, 밝기 명령 방식 변경, CC2652P2 coordinator firmware 업데이트만으로는 문제가 해결되지 않았다.

결정적인 단서는 GOQUAL의 공식 HejHome Homey driver 변경 이력에서 찾았다. Version 1.1.17은 Z26의 약 10분 후 self-leave 문제를 해결하기 위해 keep-alive를 `zclVersion` 5분 간격에서 `appVersion` 30초 간격으로 변경했다고 명시한다.

이를 바탕으로 Zigbee2MQTT external converter에 Basic cluster의 `appVersion`을 **120초마다 읽는 poll**을 추가했다. 이 문서를 처음 공개한 시점에는 약 9시간 동안 전구가 네트워크에 남아 계속 poll에 응답했다. 중간에 조명 명령 timeout 한 번이 있었지만 Zigbee의 정상적인 retry/recovery 과정에서 회복했으며 새로운 leave event는 관찰되지 않았다.

현재 결론은 “관찰 기간 동안 self-leave를 억제했다”이다. Firmware 자체를 수정한 것이 아니므로 영구적으로 해결됐다고 단정하지 않는다.

## 대상 제품

| 항목 | 값 |
| --- | --- |
| 제품 | 헤이홈 스마트 컬러 전구 Z26 |
| 모델명 | `GKZ-LB431RGBCW-E26` |
| Zigbee model | `TS0505B` |
| Manufacturer fingerprint | `_TZ3210_cnicaghm` |
| App / hardware / stack version | `66` / `1` / `0` |
| 현재 시험 제품 | 2026년 4월 제조, lot `26D15` |

## 우회 방법

[`external_converter/hejhome-z26.mjs`](external_converter/hejhome-z26.mjs)를 Zigbee2MQTT의 `external_converters` 폴더에 설치한다. 이 converter는 정확히 `TS0505B` / `_TZ3210_cnicaghm` fingerprint에만 적용되며 `genBasic.appVersion`을 120초 간격으로 읽는다.

GOQUAL의 Homey driver는 30초 간격을 사용한다. 120초는 우리가 관찰한 8–10분 failure window 안에서 여러 번의 poll 실패를 허용하면서 traffic을 줄이기 위해 선택한 경험적 값이다. 다른 간격을 체계적으로 비교한 결과는 아직 없다.

상세한 재현 기록, 실패한 시도, 설치법, 관련 근거와 한계는 [영문 기술 보고서](README.md)에 정리했다.

## 주의

- `_TZ3210_cnicaghm`이 아닌 다른 `TS0505B` 제품에 결과를 일반화하면 안 된다.
- External converter는 Zigbee2MQTT 내부에서 JavaScript로 실행되므로 코드를 검토한 뒤 사용해야 한다.
- Zigbee IEEE address, network key, 가정 내 entity name 등은 issue에 올리지 않는 것이 좋다.
- 같은 제품을 사용한다면 제조년월, lot, `appVersion`, polling interval과 관찰 시간을 공유해주면 도움이 된다.
