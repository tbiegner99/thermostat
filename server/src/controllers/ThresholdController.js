class ThresholdController {
  constructor({ thresholdService }) {
    this.thresholdService = thresholdService;
    this.updateHeatThreshold = this.updateHeatThreshold.bind(this);
    this.updateCoolingThreshold = this.updateCoolingThreshold.bind(this);
    this.updateMargin = this.updateMargin.bind(this);
    this.getThresholds = this.getThresholds.bind(this);
  }
  async updateHeatThreshold(req, res, next) {
    await this.thresholdService.updateHeatingThreshold(req.body.heatThreshold);
    this.getThresholds(req, res, next);
  }

  async updateCoolingThreshold(req, res, next) {
    await this.thresholdService.updateCoolingThreshold(
      req.body.coolingThreshold
    );
    this.getThresholds(req, res, next);
  }

  async updateMargin(req, res, next) {
    await this.thresholdService.updateMargin(req.body.margin);
    this.getThresholds(req, res, next);
  }

  async getThresholds(req, res, next) {
    const thresholds = await this.thresholdService.getThresholds();
    res.status(200).send(thresholds);
  }
}

module.exports = ThresholdController;
