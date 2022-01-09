class ThresholdDatasource {
  constructor({ settingsFile, fs }) {
    this.settingsFile = settingsFile;
    this.fs = fs;
  }

  async readSettings() {
    const content = await this.fs.readFile(this.settingsFile);
    const settings = JSON.parse(content);
    return settings;
  }

  async update(settings) {
    try {
      const currentSettings = await this.readSettings();
      const newSettings = { ...currentSettings, ...settings };
      await this.fs.writeFile(this.settingsFile, JSON.stringify(newSettings, undefined, 4));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  updateMargin(margin) {
    return this.update({ margin });
  }

  updateHeatThreshold(heatThreshold) {
    return this.update({ heatThreshold });
  }

  updateCoolingThreshold(coolingThreshold) {
    return this.update({ coolingThreshold });
  }
}

module.exports = ThresholdDatasource;
