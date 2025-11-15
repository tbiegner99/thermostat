import { Request, Response, NextFunction } from 'express';

interface ThresholdService {
  updateHeatingThreshold(threshold: number): Promise<void>;
  updateCoolingThreshold(threshold: number): Promise<void>;
  updateMargin(margin: number): Promise<void>;
  getThresholds(): Promise<any>;
}

interface ThresholdControllerDependencies {
  thresholdService: ThresholdService;
}

class ThresholdController {
  private thresholdService: ThresholdService;

  constructor({ thresholdService }: ThresholdControllerDependencies) {
    this.thresholdService = thresholdService;
    this.updateHeatThreshold = this.updateHeatThreshold.bind(this);
    this.updateCoolingThreshold = this.updateCoolingThreshold.bind(this);
    this.updateMargin = this.updateMargin.bind(this);
    this.getThresholds = this.getThresholds.bind(this);
  }

  async updateHeatThreshold(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.thresholdService.updateHeatingThreshold(req.body.heatThreshold);
      this.getThresholds(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async updateCoolingThreshold(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.thresholdService.updateCoolingThreshold(req.body.coolingThreshold);
      this.getThresholds(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async updateMargin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.thresholdService.updateMargin(req.body.margin);
      this.getThresholds(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async getThresholds(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const thresholds = await this.thresholdService.getThresholds();
      res.status(200).send(thresholds);
    } catch (error) {
      next(error);
    }
  }
}

export = ThresholdController;
