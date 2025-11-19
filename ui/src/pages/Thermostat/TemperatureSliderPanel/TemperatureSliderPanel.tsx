import React, { useState, useRef, useEffect } from 'react';
import styles from './TemperatureSliderPanel.module.css';
import TemperatureConverter from '../../../util/unitConverter/TemperatureConverter';

interface TemperatureSliderPanelProps {
  currentTemperature: number;
  currentHumidity?: number;
  heatingThreshold: number;
  coolingThreshold: number;
  minTemperature: number;
  maxTemperature: number;
  isHeatOn: boolean;
  isCoolingOn: boolean;
  unit: string;
  displayUnit: string;
  onHeatingThresholdChange?: (temperature: number) => void;
  onCoolingThresholdChange?: (temperature: number) => void;
  className?: string;
}

const TemperatureSliderPanel: React.FC<TemperatureSliderPanelProps> = ({
  currentTemperature,
  currentHumidity,
  heatingThreshold,
  coolingThreshold,
  minTemperature,
  maxTemperature,
  isHeatOn,
  isCoolingOn,
  unit,
  displayUnit,
  onHeatingThresholdChange,
  onCoolingThresholdChange,
}) => {
  const [isDragging, setIsDragging] = useState<'heating' | 'cooling' | null>(null);
  const [localHeatingThreshold, setLocalHeatingThreshold] = useState(heatingThreshold);
  const [localCoolingThreshold, setLocalCoolingThreshold] = useState(coolingThreshold);
  const svgRef = useRef<SVGSVGElement>(null);

  const size = 400; // Increased from 280 to 560 (2x)
  const center = size / 2;
  const height = (7 * size) / 8;
  const radius = 150; // Increased from 100 to 200 (2x)
  const strokeWidth = 30; // Increased from 20 to 40 (2x)
  const minDeadBand = 2; // Minimum 2 degrees between heating and cooling

  // Sync local state with props when props change (but not during dragging)
  useEffect(() => {
    setLocalHeatingThreshold(heatingThreshold);
  }, [heatingThreshold]);

  useEffect(() => {
    setLocalCoolingThreshold(coolingThreshold);
  }, [coolingThreshold]);

  // Use local state during dragging, props otherwise
  const currentHeatingThreshold = isDragging ? localHeatingThreshold : heatingThreshold;
  const currentCoolingThreshold = isDragging ? localCoolingThreshold : coolingThreshold;

  // Convert temperatures to display unit for UI
  const displayCurrentTemp = new TemperatureConverter(currentTemperature, unit).toUnit(displayUnit);
  const displayHeatingThreshold = new TemperatureConverter(currentHeatingThreshold, unit).toUnit(
    displayUnit
  );
  const displayCoolingThreshold = new TemperatureConverter(currentCoolingThreshold, unit).toUnit(
    displayUnit
  );
  const displayMinTemp = new TemperatureConverter(minTemperature, unit).toUnit(displayUnit);
  const displayMaxTemp = new TemperatureConverter(maxTemperature, unit).toUnit(displayUnit);

  // Check if current temperature is outside the target range
  const isTooHot = displayCurrentTemp > displayCoolingThreshold;
  const isTooCold = displayCurrentTemp < displayHeatingThreshold;
  const isOutsideRange = isTooHot || isTooCold;

  // Convert temperature to angle (270° total arc, starting from -135° to +135°)
  const tempToAngle = (temp: number) => {
    const range = displayMaxTemp - displayMinTemp;
    const normalized = (temp - displayMinTemp) / range;
    return normalized * 270 - 135; // 270° arc: -135° to +135°
  };

  // Convert angle to temperature (in display unit)
  const angleToTemp = (angle: number) => {
    const normalized = (angle + 135) / 270;
    return displayMinTemp + normalized * (displayMaxTemp - displayMinTemp);
  };

  // Get coordinates for a point on the circle
  const getPointOnCircle = (angle: number) => {
    const radian = (angle * Math.PI) / 180;
    return {
      x: center + radius * Math.sin(radian),
      y: center - radius * Math.cos(radian),
    };
  };

  const heatingAngle = tempToAngle(displayHeatingThreshold);
  const coolingAngle = tempToAngle(displayCoolingThreshold);
  const currentAngle = tempToAngle(displayCurrentTemp);

  const heatingPoint = getPointOnCircle(heatingAngle);
  const coolingPoint = getPointOnCircle(coolingAngle);
  const currentPoint = getPointOnCircle(currentAngle);

  // Background arc points (270° arc from -135° to +135°)
  const startPoint = getPointOnCircle(-135);
  const endPoint = getPointOnCircle(135);

  // Handle mouse and touch events for dragging
  const handleMouseDown = (event: React.MouseEvent, knobType: 'heating' | 'cooling') => {
    event.preventDefault();
    setIsDragging(knobType);
  };

  const handleTouchStart = (event: React.TouchEvent, knobType: 'heating' | 'cooling') => {
    event.preventDefault();
    setIsDragging(knobType);
  };

  const getEventCoordinates = (event: MouseEvent | TouchEvent) => {
    if ('touches' in event) {
      // Touch event
      return {
        clientX: event.touches[0]?.clientX || event.changedTouches[0]?.clientX || 0,
        clientY: event.touches[0]?.clientY || event.changedTouches[0]?.clientY || 0,
      };
    } else {
      // Mouse event
      return {
        clientX: event.clientX,
        clientY: event.clientY,
      };
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const coords = getEventCoordinates(event);
    const deltaX = coords.clientX - centerX;
    const deltaY = coords.clientY - centerY;

    let angle = Math.atan2(deltaX, -deltaY) * (180 / Math.PI);

    // Constrain to 270° range: -135° to +135°
    angle = Math.max(-135, Math.min(135, angle));

    let newDisplayTemp = angleToTemp(angle);
    newDisplayTemp = Math.max(displayMinTemp, Math.min(displayMaxTemp, newDisplayTemp));

    // Apply dead band constraint
    if (isDragging === 'heating') {
      // Heating threshold can't be higher than (cooling - minDeadBand)
      const maxHeating = displayCoolingThreshold - minDeadBand;
      newDisplayTemp = Math.min(newDisplayTemp, maxHeating);
    } else if (isDragging === 'cooling') {
      // Cooling threshold must be at least (heating + minDeadBand)
      const minCooling = displayHeatingThreshold + minDeadBand;
      newDisplayTemp = Math.max(newDisplayTemp, minCooling);
    }

    // Convert back to internal unit and update local state
    const internalTemp = new TemperatureConverter(newDisplayTemp, displayUnit).toUnit(unit);

    if (isDragging === 'heating') {
      setLocalHeatingThreshold(internalTemp);
    } else if (isDragging === 'cooling') {
      setLocalCoolingThreshold(internalTemp);
    }
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (!isDragging || !svgRef.current) return;

    event.preventDefault(); // Prevent page scrolling during touch drag

    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const coords = getEventCoordinates(event);
    const deltaX = coords.clientX - centerX;
    const deltaY = coords.clientY - centerY;

    let angle = Math.atan2(deltaX, -deltaY) * (180 / Math.PI);

    // Constrain to 270° range: -135° to +135°
    angle = Math.max(-135, Math.min(135, angle));

    let newDisplayTemp = angleToTemp(angle);
    newDisplayTemp = Math.max(displayMinTemp, Math.min(displayMaxTemp, newDisplayTemp));

    // Apply dead band constraint
    if (isDragging === 'heating') {
      // Heating threshold can't be higher than (cooling - minDeadBand)
      const maxHeating = displayCoolingThreshold - minDeadBand;
      newDisplayTemp = Math.min(newDisplayTemp, maxHeating);
    } else if (isDragging === 'cooling') {
      // Cooling threshold must be at least (heating + minDeadBand)
      const minCooling = displayHeatingThreshold + minDeadBand;
      newDisplayTemp = Math.max(newDisplayTemp, minCooling);
    }

    // Convert back to internal unit and update local state
    const internalTemp = new TemperatureConverter(newDisplayTemp, displayUnit).toUnit(unit);

    if (isDragging === 'heating') {
      setLocalHeatingThreshold(internalTemp);
    } else if (isDragging === 'cooling') {
      setLocalCoolingThreshold(internalTemp);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      // Fire the change event when dragging is finished
      if (isDragging === 'heating') {
        onHeatingThresholdChange?.(localHeatingThreshold);
      } else if (isDragging === 'cooling') {
        onCoolingThresholdChange?.(localCoolingThreshold);
      }
    }
    setIsDragging(null);
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      // Fire the change event when dragging is finished
      if (isDragging === 'heating') {
        onHeatingThresholdChange?.(localHeatingThreshold);
      } else if (isDragging === 'cooling') {
        onCoolingThresholdChange?.(localCoolingThreshold);
      }
    }
    setIsDragging(null);
  };

  // Handle incremental temperature changes with arrow buttons
  const handleHeatingIncrement = () => {
    const currentDisplayTemp = new TemperatureConverter(heatingThreshold, unit).toUnit(displayUnit);
    const newDisplayTemp = Math.min(currentDisplayTemp + 1, displayMaxTemp);

    // Apply dead band constraint
    const maxHeating =
      new TemperatureConverter(coolingThreshold, unit).toUnit(displayUnit) - minDeadBand;
    const constrainedTemp = Math.min(newDisplayTemp, maxHeating);

    const newInternalTemp = new TemperatureConverter(constrainedTemp, displayUnit).toUnit(unit);
    onHeatingThresholdChange?.(newInternalTemp);
  };

  const handleHeatingDecrement = () => {
    const currentDisplayTemp = new TemperatureConverter(heatingThreshold, unit).toUnit(displayUnit);
    const newDisplayTemp = Math.max(currentDisplayTemp - 1, displayMinTemp);
    const newInternalTemp = new TemperatureConverter(newDisplayTemp, displayUnit).toUnit(unit);
    onHeatingThresholdChange?.(newInternalTemp);
  };

  const handleCoolingIncrement = () => {
    const currentDisplayTemp = new TemperatureConverter(coolingThreshold, unit).toUnit(displayUnit);
    const newDisplayTemp = Math.min(currentDisplayTemp + 1, displayMaxTemp);
    const newInternalTemp = new TemperatureConverter(newDisplayTemp, displayUnit).toUnit(unit);
    onCoolingThresholdChange?.(newInternalTemp);
  };

  const handleCoolingDecrement = () => {
    const currentDisplayTemp = new TemperatureConverter(coolingThreshold, unit).toUnit(displayUnit);
    const newDisplayTemp = Math.max(currentDisplayTemp - 1, displayMinTemp);

    // Apply dead band constraint
    const minCooling =
      new TemperatureConverter(heatingThreshold, unit).toUnit(displayUnit) + minDeadBand;
    const constrainedTemp = Math.max(newDisplayTemp, minCooling);

    const newInternalTemp = new TemperatureConverter(constrainedTemp, displayUnit).toUnit(unit);
    onCoolingThresholdChange?.(newInternalTemp);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [
    isDragging,
    displayMinTemp,
    displayMaxTemp,
    displayHeatingThreshold,
    displayCoolingThreshold,
    localHeatingThreshold,
    localCoolingThreshold,
    onHeatingThresholdChange,
    onCoolingThresholdChange,
    unit,
    displayUnit,
  ]);

  return (
    <div>
      <div className={styles.sliderContainer}>
        {/* Left side - Heating */}
        <div className={styles.heatingLabelSide}>
          <div className={styles.heatingLabelTitle}>HEAT</div>
          <div className={styles.temperatureControl}>
            <button
              className={`${styles.arrowButton} ${styles.heatingArrowButton}`}
              onClick={handleHeatingIncrement}
              type="button"
            >
              ▲
            </button>
            <div className={styles.heatingLabelValue}>
              {Math.round(displayHeatingThreshold)}°{displayUnit}
            </div>
            <button
              className={`${styles.arrowButton} ${styles.heatingArrowButton}`}
              onClick={handleHeatingDecrement}
              type="button"
            >
              ▼
            </button>
          </div>
        </div>

        {/* Center - Circular Slider */}
        <div className={styles.circularSlider}>
          <svg
            ref={svgRef}
            width={size}
            height={height}
            className={isDragging ? styles.sliderSvgGrabbing : styles.sliderSvgGrab}
          >
            {/* Background arc - 270° track */}
            <path
              d={`M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 1 1 ${endPoint.x} ${endPoint.y}`}
              className={styles.backgroundArc}
              strokeWidth={strokeWidth}
            />
            {/* Heating zone arc (from start to heating knob) */}
            <path
              d={`M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${
                Math.abs(heatingAngle - -135) > 180 ? 1 : 0
              } 1 ${heatingPoint.x} ${heatingPoint.y}`}
              className={styles.heatingArc}
              strokeWidth={strokeWidth}
            />
            {/* Cooling zone arc (from cooling knob to end) */}
            <path
              d={`M ${coolingPoint.x} ${coolingPoint.y} A ${radius} ${radius} 0 ${
                Math.abs(135 - coolingAngle) > 180 ? 1 : 0
              } 1 ${endPoint.x} ${endPoint.y}`}
              className={styles.coolingArc}
              strokeWidth={strokeWidth}
            />
            {/* Neutral zone arc (between heating and cooling knobs) - Grey */}
            <path
              d={`M ${heatingPoint.x} ${heatingPoint.y} A ${radius} ${radius} 0 ${
                Math.abs(coolingAngle - heatingAngle) > 180 ? 1 : 0
              } 1 ${coolingPoint.x} ${coolingPoint.y}`}
              className={styles.neutralArc}
              strokeWidth={strokeWidth}
            />
            {/* Out-of-range indicator arc (between current temp and target range when outside) */}
            {isOutsideRange && (
              <path
                d={
                  isTooCold
                    ? `M ${currentPoint.x} ${currentPoint.y} A ${radius} ${radius} 0 ${
                        Math.abs(heatingAngle - currentAngle) > 180 ? 1 : 0
                      } 1 ${heatingPoint.x} ${heatingPoint.y}`
                    : `M ${coolingPoint.x} ${coolingPoint.y} A ${radius} ${radius} 0 ${
                        Math.abs(currentAngle - coolingAngle) > 180 ? 1 : 0
                      } 1 ${currentPoint.x} ${currentPoint.y}`
                }
                fill="none"
                stroke={isTooCold ? '#8b2635' : '#0d47a1'}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                opacity={0.85}
                strokeDasharray="6,3"
              />
            )}
            {/* Heating knob */}
            <circle
              cx={heatingPoint.x}
              cy={heatingPoint.y}
              r="20"
              fill="#f44336"
              stroke="#fff"
              strokeWidth="3"
              style={{ cursor: 'pointer' }}
              onMouseDown={(e) => handleMouseDown(e, 'heating')}
              onTouchStart={(e) => handleTouchStart(e, 'heating')}
            />{' '}
            {/* Cooling knob */}
            <circle
              cx={coolingPoint.x}
              cy={coolingPoint.y}
              r={20} // Increased from 12 to 24 (2x)
              className={styles.coolingKnob}
              onMouseDown={(e) => handleMouseDown(e, 'cooling')}
              onTouchStart={(e) => handleTouchStart(e, 'cooling')}
            />
            {/* Current temperature indicator */}
            <circle
              cx={currentPoint.x}
              cy={currentPoint.y}
              r={12} // Increased from 6 to 12 (2x)
              fill={isOutsideRange ? (isTooCold ? '#8b2635' : '#0d47a1') : '#333'}
              stroke="#fff"
              strokeWidth={3} // Increased from 2 to 4 (2x)
              style={{
                filter: isOutsideRange ? 'drop-shadow(0 0 4px rgba(0,0,0,0.4))' : 'none',
              }}
            />
          </svg>

          {/* Center display */}
          <div className={styles.centerDisplay}>
            {/* Heating/Cooling Status Icons */}
            <div className={styles.statusIndicator}>
              {isHeatOn && (
                <span className={styles.heatingIcon} title="Heating On">
                  🔥
                </span>
              )}
              {isCoolingOn && (
                <span className={styles.coolingIcon} title="Cooling On">
                  ❄️
                </span>
              )}
            </div>
            <div className={styles.currentTempText}>
              {Math.round(displayCurrentTemp)}°{displayUnit}
            </div>
            {currentHumidity !== undefined && (
              <div className={styles.currentHumidityText}>{Math.round(currentHumidity)}%</div>
            )}
            <div className={styles.currentLabel}>Current</div>
          </div>
        </div>

        {/* Right side - Cooling */}
        <div className={styles.coolingLabelSide}>
          <div className={styles.coolingLabelTitle}>COOL</div>
          <div className={styles.temperatureControl}>
            <button
              className={`${styles.arrowButton} ${styles.coolingArrowButton}`}
              onClick={handleCoolingIncrement}
              type="button"
            >
              ▲
            </button>
            <div className={styles.coolingLabelValue}>
              {Math.round(displayCoolingThreshold)}°{displayUnit}
            </div>
            <button
              className={`${styles.arrowButton} ${styles.coolingArrowButton}`}
              onClick={handleCoolingDecrement}
              type="button"
            >
              ▼
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemperatureSliderPanel;
