import EventEmitter from 'events';
import { MQTT_EVENTS } from '../constants/MqttEvents';
import { Mode } from '../models/mode';

interface ThresholdDatasource {
  readSettings(): Promise<any>;
  updateMode(mode: Mode): Promise<any>;
  updateMargin(margin: number): Promise<void>;
  updateHeatThreshold(heatingThreshold: number): Promise<void>;
  updateCoolingThreshold(coolingThreshold: number): Promise<void>;
}

interface HeatingService {
  setMargin(margin: number): void;
  setHeatingThreshold(heatingThreshold: number): void;
  setCoolingThreshold(coolingThreshold: number): void;
  setMode(mode: Mode): void;
  performCheck(): void;
}

interface ThresholdServiceDependencies {
  thresholdDatasource: ThresholdDatasource;
  heatingService: HeatingService;
  events: EventEmitter;
}

export default class ThresholdService {
  private thresholdDao: ThresholdDatasource;
  private heatingService: HeatingService;
  private events: EventEmitter;

  constructor({ thresholdDatasource, heatingService, events }: ThresholdServiceDependencies) {
    this.thresholdDao = thresholdDatasource;
    this.heatingService = heatingService;
    this.events = events;
    this.setupMqttHandlers();
  }
  private setupMqttHandlers(): void {
    if (!this.events) return;
    console.log('threshold service setting up events');
    // Handle mode changes from Home Assistant
    this.events.on(MQTT_EVENTS.SET_MODE, (mode: string) => {
      console.log(`MQTT: Setting mode to ${mode}`);
      this.setMode(mode);
    });
    // Handle dual setpoint commands
    this.events.on(MQTT_EVENTS.SET_HEATING_THRESHOLD, (temperature: number) => {
      console.log(`MQTT: Setting heating threshold to ${temperature}°C`);
      this.updateHeatingThreshold(temperature);
    });

    this.events.on(MQTT_EVENTS.SET_COOLING_THRESHOLD, (temperature: number) => {
      console.log(`MQTT: Setting cooling threshold to ${temperature}°C`);
      this.updateCoolingThreshold(temperature);
    });

    // Handle manual override commands
    this.events.on(MQTT_EVENTS.SET_HEATING, (enable: boolean) => {
      console.log(`MQTT: Setting heating override to ${enable}`);
      this.setMode(Mode.HEATING);
    });

    // Handle manual override commands
    this.events.on(MQTT_EVENTS.TURN_ON, (enable: boolean) => {
      console.log(`MQTT: Setting heating override to ${enable}`);
      this.setMode(Mode.AUTO);
    });

    this.events.on(MQTT_EVENTS.TURN_OFF, (enable: boolean) => {
      console.log(`MQTT: Setting heating override to ${enable}`);
      this.setMode(Mode.OFF);
    });

    this.events.on(MQTT_EVENTS.SET_COOLING, (enable: boolean) => {
      console.log(`MQTT: Setting cooling override to ${enable}`);
      this.setMode(Mode.COOLING);
    });
  }

  getThresholds(): Promise<any> {
    return this.thresholdDao.readSettings();
  }

  async setMode(mode: string): Promise<void> {
    await this.thresholdDao.updateMode(mode as Mode);
    this.heatingService.setMode(mode as Mode);
    this.events?.emit(MQTT_EVENTS.MODE_UPDATED, mode);
  }

  async updateMargin(margin: number): Promise<void> {
    await this.thresholdDao.updateMargin(margin);
    this.heatingService.setMargin(margin);
  }

  async updateHeatingThreshold(heatingThreshold: number): Promise<void> {
    await this.thresholdDao.updateHeatThreshold(heatingThreshold);
    this.heatingService.setHeatingThreshold(heatingThreshold);
    this.events?.emit(MQTT_EVENTS.HEATING_THRESHOLD_UPDATED, {
      value: heatingThreshold,
    });
  }

  async updateCoolingThreshold(coolingThreshold: number): Promise<void> {
    await this.thresholdDao.updateCoolingThreshold(coolingThreshold);
    this.heatingService.setCoolingThreshold(coolingThreshold);
    this.events?.emit(MQTT_EVENTS.COOLING_THRESHOLD_UPDATED, {
      value: coolingThreshold,
    });
  }
}
