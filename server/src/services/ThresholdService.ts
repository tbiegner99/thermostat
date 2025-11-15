interface ThresholdDatasource {
  readSettings(): Promise<any>;
  updateMargin(margin: number): Promise<void>;
  updateHeatThreshold(heatingThreshold: number): Promise<void>;
  updateCoolingThreshold(coolingThreshold: number): Promise<void>;
}

interface HeatingService {
  setMargin(margin: number): void;
  setHeatingThreshold(heatingThreshold: number): void;
  setCoolingThreshold(coolingThreshold: number): void;
}

interface ThresholdServiceDependencies {
  thresholdDatasource: ThresholdDatasource;
  heatingService: HeatingService;
}

class ThresholdService {
  private thresholdDao: ThresholdDatasource;
  private heatingService: HeatingService;

  constructor({ thresholdDatasource, heatingService }: ThresholdServiceDependencies) {
    this.thresholdDao = thresholdDatasource;
    this.heatingService = heatingService;
  }

  getThresholds(): Promise<any> {
    return this.thresholdDao.readSettings();
  }

  async updateMargin(margin: number): Promise<void> {
    await this.thresholdDao.updateMargin(margin);
    this.heatingService.setMargin(margin);
  }

  async updateHeatingThreshold(heatingThreshold: number): Promise<void> {
    await this.thresholdDao.updateHeatThreshold(heatingThreshold);
    this.heatingService.setHeatingThreshold(heatingThreshold);
  }

  async updateCoolingThreshold(coolingThreshold: number): Promise<void> {
    await this.thresholdDao.updateCoolingThreshold(coolingThreshold);
    this.heatingService.setCoolingThreshold(coolingThreshold);
  }
}

export = ThresholdService;
