class ThresholdService {
  constructor({ thresholdDatasource, heatingService }) {
    this.thresholdDao = thresholdDatasource;
    this.heatingService = heatingService;
  }
  getThresholds() {
    return this.thresholdDao.readSettings();
  }

  async updateMargin(margin) {
    await this.thresholdDao.updateMargin(margin);
    this.heatingService.setMargin(margin);
  }

  async updateHeatingThreshold(heatingThreshold) {
    await this.thresholdDao.updateHeatThreshold(heatingThreshold);
    this.heatingService.setHeatingThreshold(heatingThreshold);
  }

  async updateCoolingThreshold(coolingThreshold) {
    await this.thresholdDao.updateCoolingThreshold(coolingThreshold);
    this.heatingService.setCoolingThreshold(coolingThreshold);
  }
}

module.exports = ThresholdService;
