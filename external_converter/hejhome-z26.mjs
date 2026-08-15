import * as tuya from 'zigbee-herdsman-converters/lib/tuya';
import {poll} from 'zigbee-herdsman-converters/lib/modernExtend';

// Exact keep-alive quirk for the HejHome Z26 / Tuya TS0505B implementation.
// Read appVersion every 2 minutes to prevent this firmware variant from
// leaving the network after approximately 8-10 minutes while retaining
// enough margin for two consecutive failed polling cycles.
const definition = {
    fingerprint: tuya.fingerprint('TS0505B', ['_TZ3210_cnicaghm']),
    model: 'TS0505B_1_cnicaghm',
    vendor: 'Tuya',
    description: 'HejHome Z26 RGB+CCT light with appVersion keep-alive workaround',
    extend: [
        tuya.modernExtend.tuyaLight({
            colorTemp: {range: [153, 500]},
            color: true,
        }),
        poll({
            key: 'hejhome_z26_app_version_keepalive',
            defaultIntervalSeconds: 120,
            poll: async (device) => {
                await device.getEndpoint(1).read('genBasic', ['appVersion']);
            },
        }),
    ],
    meta: {
        applyRedFix: true,
    },
    configure: (device) => {
        device.getEndpoint(1).saveClusterAttributeKeyValue('lightingColorCtrl', {
            colorCapabilities: 29,
        });
    },
};

export default definition;
