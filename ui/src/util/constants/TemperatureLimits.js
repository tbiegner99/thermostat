//values are in celcius

const HeatingLimits = {
  min: 10, //50F
  max: (5 / 9) * (80 - 32), //80F
};

const CoolingLimits = {
  min: (5 / 9) * (60 - 32), //60F
  max: (5 / 9) * (100 - 32), //100F
};

export { HeatingLimits, CoolingLimits };
