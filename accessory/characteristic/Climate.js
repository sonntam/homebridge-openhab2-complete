'use strict';

const {addNumericSensorCharacteristic,
    addNumericSensorCharacteristicWithTransformation,
    addNumericSensorActorCharacteristic,
    addNumericSensorActorCharacteristicWithDistinctTransformation
} = require('./Numeric');

const CLIMATE_CONFIG = {
    waterLevelItem: "waterLevelItem",
    rotationSpeedItem: "rotationSpeedItem",
    currentHumidityItem: "currentHumidityItem",
    targetHumidityItem: "targetHumidityItem",
    currentTempItem: "currentTempItem",
    targetTempItem: "targetTempItem",
    heatingThresholdTempItem: "heatingThresholdTempItem",
    coolingThresholdTempItem: "coolingThresholdTempItem",
    dehumidifierThresholdItem: "dehumidifierThresholdItem",
    humidifierThresholdItem: "humidifierThresholdItem",
    tempUnit: "tempUnit", // 'Celsius' (default), 'Fahrenheit'
    minTemp: "minTemp",
    maxTemp: "maxTemp",
    minStep: "minStep"
};

const DEFAULT_MIN_TEMP = -100;
const DEFAULT_MAX_TEMP = 200;
const DEFAULT_MIN_STEP = 0.1;

function addWaterLevelCharacteristic(service, optional) {
    addNumericSensorCharacteristic.bind(this)(service, service.getCharacteristic(this.Characteristic.WaterLevel), {item: CLIMATE_CONFIG.waterLevelItem}, optional);
}

function addRotationSpeedCharacteristic(service, optional) {
    addNumericSensorActorCharacteristic.bind(this)(service, service.getCharacteristic(this.Characteristic.RotationSpeed), {item: CLIMATE_CONFIG.rotationSpeedItem}, optional);
}

function addCurrentRelativeHumidityCharacteristic(service, optional) {
    addNumericSensorCharacteristic.bind(this)(service, service.getCharacteristic(this.Characteristic.CurrentRelativeHumidity), {item: CLIMATE_CONFIG.currentHumidityItem}, optional);
}

function addTargetRelativeHumidityCharacteristic(service, optional) {
    addNumericSensorActorCharacteristic.bind(this)(service, service.getCharacteristic(this.Characteristic.TargetRelativeHumidity), {item: CLIMATE_CONFIG.targetHumidityItem}, optional);
}

function addCurrentTemperatureCharacteristic(service, optional) {
    let thisMinTemp = this._config[CLIMATE_CONFIG.minTemp] !== undefined ? parseFloat(this._config[CLIMATE_CONFIG.minTemp]) : DEFAULT_MIN_TEMP;
    let thisMaxTemp = this._config[CLIMATE_CONFIG.maxTemp] !== undefined ? parseFloat(this._config[CLIMATE_CONFIG.maxTemp]) : DEFAULT_MAX_TEMP;
    let thisMinStep = this._config[CLIMATE_CONFIG.minStep] !== undefined ? parseFloat(this._config[CLIMATE_CONFIG.minStep]) : DEFAULT_MIN_STEP;

    let transformation = this._config[CLIMATE_CONFIG.tempUnit] === "Fahrenheit" ? _convertFahrenheitToCelsius : parseFloat;

    let currentTemperatureCharacteristic = service.getCharacteristic(this.Characteristic.CurrentTemperature);
    currentTemperatureCharacteristic.setProps({
        minValue: thisMinTemp,
        maxValue: thisMaxTemp,
        minStep: thisMinStep
    });

    addNumericSensorCharacteristicWithTransformation.bind(this)(service,
        currentTemperatureCharacteristic,
        {item: CLIMATE_CONFIG.currentTempItem},
        transformation,
        optional
    );
}

function addTargetTemperatureCharacteristic(service, optional) {
    let thisMinTemp = this._config[CLIMATE_CONFIG.minTemp] !== undefined ? parseFloat(this._config[CLIMATE_CONFIG.minTemp]) : DEFAULT_MIN_TEMP;
    let thisMaxTemp = this._config[CLIMATE_CONFIG.maxTemp] !== undefined ? parseFloat(this._config[CLIMATE_CONFIG.maxTemp]) : DEFAULT_MAX_TEMP;
    let thisMinStep = this._config[CLIMATE_CONFIG.minStep] !== undefined ? parseFloat(this._config[CLIMATE_CONFIG.minStep]) : DEFAULT_MIN_STEP;

    let getTransformation = this._config[CLIMATE_CONFIG.tempUnit] === "Fahrenheit" ? _convertFahrenheitToCelsius : parseFloat;
    let setTransformation = this._config[CLIMATE_CONFIG.tempUnit] === "Fahrenheit" ? _convertCelsiusToFahrenheit : parseFloat;

    let targetTemperatureCharacteristic = service.getCharacteristic(this.Characteristic.TargetTemperature);
    targetTemperatureCharacteristic.setProps({
        minValue: thisMinTemp,
        maxValue: thisMaxTemp,
        minStep: thisMinStep
    });
    addNumericSensorActorCharacteristicWithDistinctTransformation.bind(this)(service,
        targetTemperatureCharacteristic,
        {item: CLIMATE_CONFIG.targetTempItem},
        setTransformation,
        getTransformation,
        optional
    );
}

function _convertFahrenheitToCelsius(val) {
    return (((parseFloat(val)-32)*5)/9);
}

function _convertCelsiusToFahrenheit(val) {
    return (((parseFloat(val) * 9)/5) + 32);
}

function addCoolingThresholdCharacteristic(service, optional) {
    addNumericSensorActorCharacteristic.bind(this)(service, service.getCharacteristic(this.Characteristic.CoolingThresholdTemperature), {item: CLIMATE_CONFIG.coolingThresholdTempItem}, optional);
}

function addHeatingThresholdCharacteristic(service, optional) {
    addNumericSensorActorCharacteristic.bind(this)(service, service.getCharacteristic(this.Characteristic.HeatingThresholdTemperature), {item: CLIMATE_CONFIG.heatingThresholdTempItem}, optional);
}

function addRelativeHumidityDehumidifierThresholdCharacteristic(service, optional) {
    addNumericSensorActorCharacteristic.bind(this)(service, service.getCharacteristic(this.Characteristic.RelativeHumidityDehumidifierThreshold), {item: CLIMATE_CONFIG.dehumidifierThresholdItem}, optional);
}

function addRelativeHumidityHumidifierThresholdCharacteristic(service, optional) {
    addNumericSensorActorCharacteristic.bind(this)(service, service.getCharacteristic(this.Characteristic.RelativeHumidityHumidifierThreshold), {item: CLIMATE_CONFIG.humidifierThresholdItem}, optional);
}

function addTemperatureDisplayUnitsCharacteristic(service) {
    switch (this._config[CLIMATE_CONFIG.tempUnit]) {
        default:
        case 'Celsius':
            this._tempUnit = this.Characteristic.TemperatureDisplayUnits.CELSIUS;
            break;
        case 'Fahrenheit':
            this._tempUnit = this.Characteristic.TemperatureDisplayUnits.FAHRENHEIT;
            break;
    }

    service.getCharacteristic(this.Characteristic.TemperatureDisplayUnits)
        .setValue(this._tempUnit);
}

module.exports = {
    addWaterLevelCharacteristic,
    addRotationSpeedCharacteristic,
    addCurrentRelativeHumidityCharacteristic,
    addCurrentTemperatureCharacteristic,
    addCoolingThresholdCharacteristic,
    addHeatingThresholdCharacteristic,
    addTemperatureDisplayUnitsCharacteristic,
    addTargetRelativeHumidityCharacteristic,
    addTargetTemperatureCharacteristic,
    addRelativeHumidityDehumidifierThresholdCharacteristic,
    addRelativeHumidityHumidifierThresholdCharacteristic
};