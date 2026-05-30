const nconf = require('nconf');
nconf.file({ file: './config/config.json' });

const envisalinkPassword = nconf.get('alarm:envisalink:password');

/**
 * Get the alarm password - uses provided code or falls back to config
 * @param {String} code - Optional code passed from client
 * @returns {String} - alarm code
 */
function get_alarmPassword(code) {
    return code || nconf.get('alarm:alarmpassword') || '';
}

/**
 * Class used to implement all Honeywell commands
 * Methods now accept an optional code parameter to override config password
 */
class honeywell__commands  {
    constructor() {
    }
    // Send the Arm command to Alarm
    alarmArm(code) {
        return get_alarmPassword(code)+2+'\r\n';
    }
    // Send the ArmAway command to Alarm
    alarmArmAway(code) {
        return get_alarmPassword(code)+2+'\r\n';
    }
    // Send the ArmStay command to Alarm
    alarmArmStay(code) {
        return get_alarmPassword(code)+3+'\r\n';
    }
    // Send the ArmNight command to Alarm
    alarmArmNight(code) {
        return get_alarmPassword(code)+7+'\r\n';
    }
    // Send the Disarm command to Alarm
    alarmDisarm(code) {
        return get_alarmPassword(code)+1+'\r\n';
    }
    // Send the Enable Chime command to Alarm
    alarmChimeToggle(code) {
        return get_alarmPassword(code)+9+'\r\n';
    }
    // This command will send the code to EnvisaLink when ever necessary
    alarmEnvisalinkLogin() {
        return envisalinkPassword+'\r\n';
    }
    // Key Buttons
    alarmSpeedKeyA() {
        return 'A'+'\r\n';
    }
    alarmSpeedKeyB() {
        return 'B'+'\r\n';
    }
    alarmSpeedKeyC() {
        return 'C'+'\r\n';
    }
    alarmSpeedKeyD() {
        return 'D'+'\r\n';
    }
}
exports.honeywell__commands = honeywell__commands