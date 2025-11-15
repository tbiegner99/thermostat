import { Request, Response, NextFunction } from 'express';

interface HeatingService {
  getSystemStatus(): Promise<any>;
  overrideHeat(enable: boolean): void;
  disableHeatingOverride(): void;
  overrideCooling(enable: boolean): void;
  disableCoolingOverride(): void;
}

interface SystemControllerDependencies {
  heatingService: HeatingService;
}

class SystemController {
  private heatingService: HeatingService;

  constructor({ heatingService }: SystemControllerDependencies) {
    this.heatingService = heatingService;
    this.getSystemStatus = this.getSystemStatus.bind(this);
    this.overrideHeating = this.overrideHeating.bind(this);
    this.disableHeatingOverride = this.disableHeatingOverride.bind(this);
    this.overrideCooling = this.overrideCooling.bind(this);
    this.disableCoolingOverride = this.disableCoolingOverride.bind(this);
  }

  async getSystemStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const systemStatus = await this.heatingService.getSystemStatus();
      res.status(200).send(systemStatus);
    } catch (error) {
      next(error);
    }
  }

  async overrideHeating(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.heatingService.overrideHeat(true);
      const systemStatus = await this.heatingService.getSystemStatus();
      res.status(200).send(systemStatus);
    } catch (error) {
      next(error);
    }
  }

  async disableHeatingOverride(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.heatingService.disableHeatingOverride();
      const systemStatus = await this.heatingService.getSystemStatus();
      res.status(200).send(systemStatus);
    } catch (error) {
      next(error);
    }
  }

  async overrideCooling(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.heatingService.overrideCooling(true);
      const systemStatus = await this.heatingService.getSystemStatus();
      res.status(200).send(systemStatus);
    } catch (error) {
      next(error);
    }
  }

  async disableCoolingOverride(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.heatingService.disableCoolingOverride();
      const systemStatus = await this.heatingService.getSystemStatus();
      res.status(200).send(systemStatus);
    } catch (error) {
      next(error);
    }
  }
}

export = SystemController;
