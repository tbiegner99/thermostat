const express = require("express");
const { container } = require("./wiring");
const thresholdController = container.resolve("thresholdController");
const heatingController = container.resolve("systemController");

const router = express.Router();
const thresholdRouter = express.Router();
router.use("/thresholds", thresholdRouter);

thresholdRouter.get("/", thresholdController.getThresholds);
thresholdRouter.put("/margin", thresholdController.updateMargin);
thresholdRouter.put("/heating", thresholdController.updateHeatThreshold);
thresholdRouter.put("/cooling", thresholdController.updateCoolingThreshold);

const heatingRouter = express.Router();
heatingRouter.get("/", heatingController.getSystemStatus);
heatingRouter.put("/heating/override/on", heatingController.overrideHeating);
heatingRouter.put("/cooling/override/on", heatingController.overrideCooling);
heatingRouter.put(
  "/heating/override/off",
  heatingController.disableHeatingOverride
);
heatingRouter.put(
  "/cooling/override/off",
  heatingController.disableCoolingOverride
);
router.use("/system", heatingRouter);
module.exports = router;
