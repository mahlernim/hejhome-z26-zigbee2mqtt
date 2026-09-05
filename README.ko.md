# 헤이홈 Z26 설치 안내

[English](README.en.md) · [개요](README.md)

헤이홈 스마트 컬러 전구 Z26의 재현된 self-leave 현상을 완화하는 외부 컨버터입니다. Basic cluster의 `appVersion`을 120초마다 읽으며 기존 Tuya RGB+CCT 기능을 유지합니다.

## 호환성

| 항목 | 시험한 값 |
| --- | --- |
| 제품 모델 | `GKZ-LB431RGBCW-E26` |
| Zigbee model | `TS0505B` |
| Manufacturer | `_TZ3210_cnicaghm` |
| Application / hardware / stack version | `66` / `1` / `0` |
| Endpoint | `1` |
| 시험한 소프트웨어 | Zigbee2MQTT 2.13.0 및 2.14.1 |

Manufacturer fingerprint가 정확히 일치해야 합니다. 같은 `TS0505B` 이름을 사용하는 제품도 펌웨어가 다를 수 있습니다. 이 저장소는 외부 컨버터를 제공하며 OTA 펌웨어 업데이트를 제공하지 않습니다.

## 설치

1. Zigbee2MQTT 장치 정보에서 model과 manufacturer를 확인하세요.
2. [`hejhome-z26.mjs`](external_converter/hejhome-z26.mjs)를 내려받아 코드를 확인하세요. 외부 컨버터는 Zigbee2MQTT 내부에서 JavaScript로 실행됩니다.
3. Zigbee2MQTT의 `configuration.yaml` 옆에 있는 `external_converters` 폴더에 파일을 넣거나 **Settings → Dev console → External converters**에서 내용을 저장하세요. 같은 fingerprint용 기존 컨버터가 있다면 중복으로 로드하지 말고 교체하세요.
4. Zigbee2MQTT 2.11.0 이상에서는 설정에서 외부 JavaScript를 활성화하세요.

   ```yaml
   advanced:
     enable_external_js: true
   ```

5. Zigbee2MQTT를 재시작하고 전구가 외부 정의의 `TS0505B_1_cnicaghm`으로 인식되는지 확인하세요.

이미 페어링된 전구를 초기화하거나 다시 페어링할 필요는 없습니다. 별도 polling 자동화도 필요하지 않습니다. 자세한 내용은 [공식 외부 컨버터 문서](https://www.zigbee2mqtt.io/advanced/more/external_converters.html)를 참고하세요.

## 확인과 문제 해결

잠시 debug 로그를 활성화하여 `hejhome_z26_app_version_keepalive`의 간격이 120초인지 확인하세요. 이후 `genBasic` 읽기 응답이 들어오는지 확인하세요. 시험한 펌웨어는 `appVersion: 66`을 반환합니다. 확인 후 평소 로그 수준으로 되돌리세요.

기존 실패 구간인 8–10분을 넘긴 뒤에도 새로운 장치 응답이 오는지 확인하세요. MQTT에 남아 있는 상태만으로는 실제 연결 여부를 판단할 수 없습니다. 전구가 응답하지 않으면 전원 공급 여부와 다른 Zigbee 장치의 통신 상태를 확인하세요. 전원 차단, 라우팅 문제, 명시적인 네트워크 이탈은 서로 다른 현상입니다.

컨버터가 로드되지 않으면 시작 로그의 오류, 파일 위치, 외부 JavaScript 설정, 중복 정의를 확인하세요. 컨버터 로딩 오류를 해결하기 위해 전구부터 초기화하지 마세요.

## 근거와 한계

GOQUAL의 [공식 Homey 앱 변경 이력](https://homey.app/en-us/app/com.hejhome.iot/Hejhome/)에도 약 10분 뒤 self-leave를 막기 위한 `appVersion` keep-alive가 명시되어 있습니다. 해당 드라이버는 30초를 사용하며, 이 컨버터는 경험적으로 시험한 120초를 사용합니다.

Application version 66인 두 생산 lot에서 시험했습니다. 관찰된 polling 구간에서는 재현되던 self-leave를 억제했습니다. 연속적인 장기 신뢰성, 최적 간격, 펌웨어 내부 원인은 확립되지 않았습니다. 통제된 관찰 외에는 일부 통신 중단이 있었지만 컨버터 때문인지 판단할 수 없었습니다. 이 방법이 모든 통신 중단이나 조명 명령 timeout을 해결하는 것은 아닙니다.

기준 조건, 관찰 결과와 해석 범위는 [기술 근거](evidence/observations.md)에 정리했습니다.

## 내장 지원

[컨버터 PR #13122](https://github.com/Koenkk/zigbee-herdsman-converters/pull/13122)와 [장치 문서 PR #5490](https://github.com/Koenkk/zigbee2mqtt.io/pull/5490)로 지원을 제안했습니다. PR 제출만으로 정식 버전에 포함되는 것은 아닙니다.

내장 정의가 포함된 Zigbee2MQTT 버전이 출시되기 전까지 이 외부 컨버터를 유지하세요. 해당 버전으로 업데이트한 뒤에는 외부 컨버터를 제거하고 Zigbee2MQTT를 재시작하세요. 내장 `GKZ-LB431RGBCW-E26` 정의를 사용하는지 확인하세요. 다시 페어링할 필요는 없습니다.

## 문제 제보

제품 모델, manufacturer fingerprint, 펌웨어 및 Zigbee2MQTT 버전, 식별 정보를 제거한 짧은 오류 내용을 포함하세요. 네트워크 이탈, timeout, 컨버터 로딩 실패 중 어떤 현상인지 설명하세요. 한국어와 영어 제보 모두 가능합니다.

인증 정보, IEEE 주소, 전체 설정 파일, 가정 내 장치 이름이나 생활 기록은 올리지 마세요.

## 라이선스

코드는 [MIT](LICENSE-CODE), 보고서와 사진 합성물은 명시된 예외를 제외하고 [CC BY 4.0](LICENSE-DOCUMENTATION.md)을 적용합니다.
