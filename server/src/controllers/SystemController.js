class SystemController {
  constructor({ heatingService }) {
    this.heatingService = heatingService;
    this.getSystemStatus = this.getSystemStatus.bind(this);
    this.overrideHeating = this.overrideHeating.bind(this);
    this.disableHeatingOverride = this.disableHeatingOverride.bind(this);
    this.overrideCooling = this.overrideCooling.bind(this);
    this.disableCoolingOverride = this.disableCoolingOverride.bind(this);
  }
  async getSystemStatus(req, res, next) {
    const systemStatus = await this.heatingService.getSystemStatus();
    res.status(200).send(systemStatus);
  }

  async overrideHeating(req, res, next) {
    this.heatingService.overrideHeat(true);
    const systemStatus = await this.heatingService.getSystemStatus();
    res.status(200).send(systemStatus);
  }

  async disableHeatingOverride(req, res, next) {
    this.heatingService.disableHeatingOverride();
    const systemStatus = await this.heatingService.getSystemStatus();
    res.status(200).send(systemStatus);
  }

  async overrideCooling(req, res, next) {
    this.heatingService.overrideCooling(true);
    const systemStatus = await this.heatingService.getSystemStatus();
    res.status(200).send(systemStatus);
  }

  async disableCoolingOverride(req, res, next) {
    this.heatingService.disableCoolingOverride();
    const systemStatus = await this.heatingService.getSystemStatus();
    res.status(200).send(systemStatus);
  }
}

module.exports = SystemController;
