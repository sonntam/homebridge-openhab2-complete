'use strict';

const {Accessory} = require('../util/Accessory');
const {addNumericSensorCharacteristic} = require('./characteristic/NumericSensor');
const {addBatteryWarningCharacteristic} = require('./characteristic/Battery');

class TemperatureSensorAccessory extends Accessory {
    constructor(platform, config) {
        super(platform, config);

        this._services = [
            this._getAccessoryInformationService('Temperature Sensor'),
            this._getPrimaryService()
        ]
    }

    _getPrimaryService() {
        this._log.debug(`Creating temperature sensor service for ${this.name}`);
        let primaryService = new this.Service.TemperatureSensor(this.name);
        addNumericSensorCharacteristic.bind(this)(this.Characteristic.CurrentTemperature);
        addBatteryWarningCharacteristic.bind(this)(primaryService);
        return primaryService;
    }
}

const type = "temp";

function createAccessory(platform, config) {
    return new TemperatureSensorAccessory(platform, config);
}

module.exports = {createAccessory, type};

