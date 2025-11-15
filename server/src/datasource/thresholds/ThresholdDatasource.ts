import { promises as fsPromises } from 'fs';

interface ThresholdSettings {
  margin?: number;
  heatThreshold?: number;
  coolingThreshold?: number;
  [key: string]: any;
}

interface ThresholdDatasourceDependencies {
  settingsFile: string;
  fs: typeof fsPromises;
}

class ThresholdDatasource {
  private settingsFile: string;
  private fs: typeof fsPromises;

  constructor({ settingsFile, fs }: ThresholdDatasourceDependencies) {
    this.settingsFile = settingsFile;
    this.fs = fs;
  }

  async readSettings(): Promise<ThresholdSettings> {
    const content = await this.fs.readFile(this.settingsFile, 'utf8');
    const settings = JSON.parse(content) as ThresholdSettings;
    return settings;
  }

  async update(settings: Partial<ThresholdSettings>): Promise<void> {
    try {
      const currentSettings = await this.readSettings();
      const newSettings = { ...currentSettings, ...settings };
      await this.fs.writeFile(this.settingsFile, JSON.stringify(newSettings, undefined, 4));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  updateMargin(margin: number): Promise<void> {
    return this.update({ margin });
  }

  updateHeatThreshold(heatThreshold: number): Promise<void> {
    return this.update({ heatThreshold });
  }

  updateCoolingThreshold(coolingThreshold: number): Promise<void> {
    return this.update({ coolingThreshold });
  }
}

export = ThresholdDatasource;
