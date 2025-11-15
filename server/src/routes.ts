import * as express from 'express';
import { container } from './wiring';

const thresholdController: any = container.resolve('thresholdController');
const systemController: any = container.resolve('systemController');

const router = express.Router();
const thresholdRouter = express.Router();
router.use('/thresholds', thresholdRouter);

thresholdRouter.get('/', thresholdController.getThresholds);
thresholdRouter.put('/margin', thresholdController.updateMargin);
thresholdRouter.put('/heating', thresholdController.updateHeatThreshold);
thresholdRouter.put('/cooling', thresholdController.updateCoolingThreshold);

const heatingRouter = express.Router();
heatingRouter.get('/', systemController.getSystemStatus);
heatingRouter.put('/heating/override/on', systemController.overrideHeating);
heatingRouter.put('/cooling/override/on', systemController.overrideCooling);
heatingRouter.put('/heating/override/off', systemController.disableHeatingOverride);
heatingRouter.put('/cooling/override/off', systemController.disableCoolingOverride);
router.use('/system', heatingRouter);

export = router;
