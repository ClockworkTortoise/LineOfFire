// Maximum horizontal and vertical coordinate on the battlefield,
// from an in-game perspective where (0, 0) is the center instead of the upper-left corner
const FIELD_H_SPAN = 200;
const FIELD_V_SPAN = 200;
// Width and height of battlefield
// (adding 1 in order to have a 0 coordinate in the center, plus the span on both sides)
const FIELD_WIDTH = 2 * FIELD_H_SPAN + 1;
const FIELD_HEIGHT = 2 * FIELD_V_SPAN + 1;

// Width of each individual track or crossbar in the railway
const RAIL_WIDTH = 2;
// Distance between the two rails of the railway
const RAIL_WHEELSPAN = 20;
const RAIL_HALF_WHEELSPAN = RAIL_WHEELSPAN / 2;

// X-coordinates of the two rails
// (I'm not using the conversion functions here because
// if 1 gameplay-distance unit is changed to something other than 1 pixel,
// then I want the rail wheelspan to still be in pixels without having to change the code here)
const LEFT_RAIL_COORD = FIELD_H_SPAN - RAIL_HALF_WHEELSPAN;
const RIGHT_RAIL_COORD = FIELD_H_SPAN + RAIL_HALF_WHEELSPAN;

// Sizing values relating to the crossbars in the railway
const CROSSBAR_SPACING = 10;
const CROSSBAR_OVERSHOOT = 3;
const CROSSBAR_LEFT_END = LEFT_RAIL_COORD - CROSSBAR_OVERSHOOT;
const CROSSBAR_RIGHT_END = RIGHT_RAIL_COORD + CROSSBAR_OVERSHOOT;

// Sizes of cart components
const CART_BACKGROUND_BORDER_WIDTH = 1;
const CART_FOREGROUND_BORDER_WIDTH = 2;
const CART_BASE_WIDTH = 30;
const CART_BASE_HEIGHT = 50;
const LAZOR_BEAM_WIDTH = 3;
// Total width and height of cannon (not just distance from center)
const CANNON_WIDTH = 12;
const CANNON_LENGTH = 48;
// Distance from the center of the cart to a corner of the cannon
const CANNON_RADIUS = Math.sqrt(CANNON_WIDTH * CANNON_WIDTH + CANNON_LENGTH * CANNON_LENGTH) / 2;
// Positive angle between the direction of the lazor beam
// and the direction from the center of the cart to a corner of the cannon
const CANNON_CORNER_ANGLE = Math.atan2(CANNON_WIDTH, CANNON_LENGTH);

// Colors and styles that we want to use in multiple places
const LAZOR_COLOR = "#f00000";
const CANNON_OUTLINE = "black";
const CANNON_FILL = "#a0a0a0";

// Maximum absolute value of numerator and denominator of slope.
// Numerator ranges from negative of this value to this value.
// Denominator ranges from 1 to this value.
const AIMING_RANGE = 20;

// Graphics related to the aiming mechanism depicted in the slope preview
// (see function drawSlopePreview for how these are used)
const GUIDE_WHEEL_CURVE_RADIUS = 3;
const GUIDE_WHEEL_CENTER_SPAN = 4;
const GUIDE_TRACK_THICKNESS = 1;
const GUIDE_WHEEL_SPACING_FROM_PISTON_CENTER = 3;
const GUIDE_FRAME_THICKNESS = 2;
const MARGIN_BEYOND_LEFT_GUIDE_WHEELS = 2;
const SUPPORT_FRAME_THICKNESS = 20;
const PISTON_INNER_THICKNESS = 3;
const PISTON_OUTER_THICKNESS = 7;
const PIVOT_RADIUS = 3;
// How much to scale up the lazor beam and the cannon barrel
const SLOPE_PREVIEW_SCALE_FACTOR = 2.0;
// Amount of extra space to provide on each side of the slope preview
// (so that the mechanism should fit entirely inside the preview canvas)
const GUIDE_WHEEL_MAX_DIST_FROM_PISTON_CENTER = GUIDE_WHEEL_SPACING_FROM_PISTON_CENTER + 2 * GUIDE_WHEEL_CURVE_RADIUS + GUIDE_WHEEL_CENTER_SPAN;
// Width and height of slope preview canvas
// (size is 1 for the center, plus the range and margin on both sides)
const SLOPE_PREVIEW_SPAN = AIMING_RANGE + GUIDE_WHEEL_MAX_DIST_FROM_PISTON_CENTER;
const SLOPE_PREVIEW_SIZE = 2 * SLOPE_PREVIEW_SPAN + 1;

// Interval at which to always draw labels of coordinates
// (e.g. the y-axis will be labeled with the y-value at every multiple of this)
const COORD_LABEL_INTERVAL = 50;
// x-coordinate at which to draw labels on the y-axis
const Y_AXIS_LABEL_X_COORD = FIELD_H_SPAN + 20;

function initialize() {
  let field = document.getElementById("battlefield");
  field.width = FIELD_WIDTH;
  field.height = FIELD_HEIGHT;

  let numBox = document.getElementById("numerator");
  numBox.min = -AIMING_RANGE;
  numBox.max = AIMING_RANGE;
  let denomBox = document.getElementById("denominator");
  denomBox.max = AIMING_RANGE;
  let intcBox = document.getElementById("intercept");
  let cartRange = canvasToFieldY(0);
  intcBox.min = -cartRange;
  intcBox.max = cartRange;

  let slopePrev = document.getElementById("slope-prev");
  slopePrev.width = SLOPE_PREVIEW_SIZE;
  slopePrev.height = SLOPE_PREVIEW_SIZE;

  drawBattlefield();
  drawSlopePreview();
}

function drawBattlefield() {
  let ctx = document.getElementById("battlefield").getContext("2d");
  ctx.clearRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);
  let slope = getNumber("numerator") / getNumber("denominator");
  let intercept = getNumber("intercept");

  // Railway and height labels
  ctx.strokeStyle = "#404040";
  ctx.lineWidth = RAIL_WIDTH;
  ctx.beginPath();
  ctx.moveTo(LEFT_RAIL_COORD, 0);
  ctx.lineTo(LEFT_RAIL_COORD, FIELD_HEIGHT);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(RIGHT_RAIL_COORD, 0);
  ctx.lineTo(RIGHT_RAIL_COORD, FIELD_HEIGHT);
  ctx.stroke();
  for (let y = 0; y <= FIELD_HEIGHT; y += CROSSBAR_SPACING) {
    ctx.beginPath();
    ctx.moveTo(CROSSBAR_LEFT_END, y);
    ctx.lineTo(CROSSBAR_RIGHT_END, y);
    ctx.stroke();
  }
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "black";
  ctx.font = "12px Arial";
  let maxYLabel = COORD_LABEL_INTERVAL * Math.floor(canvasToFieldY(0) / COORD_LABEL_INTERVAL);
  for (let y = maxYLabel; fieldToCanvasY(y) <= FIELD_HEIGHT; y -= COORD_LABEL_INTERVAL) {
    ctx.fillText(y, Y_AXIS_LABEL_X_COORD, fieldToCanvasY(y));
  }

  // Cart base
  ctx.strokeStyle = "#101000";
  ctx.lineWidth = CART_BACKGROUND_BORDER_WIDTH;
  ctx.fillStyle = "#503000";
  let cartCenterX = fieldToCanvasX(0);
  let cartLeftX = cartCenterX - CART_BASE_WIDTH / 2;
  let cartCenterY = fieldToCanvasY(intercept);
  let cartTopY = cartCenterY - CART_BASE_HEIGHT / 2;
  ctx.fillRect(cartLeftX, cartTopY, CART_BASE_WIDTH, CART_BASE_HEIGHT);
  ctx.strokeRect(cartLeftX, cartTopY, CART_BASE_WIDTH, CART_BASE_HEIGHT);

  // Lazor beam
  ctx.strokeStyle = LAZOR_COLOR;
  ctx.lineWidth = LAZOR_BEAM_WIDTH;
  ctx.beginPath();
  let leftEdgeY = fieldToCanvasY(slope * canvasToFieldX(0) + intercept);
  let rightEdgeY = fieldToCanvasY(slope * canvasToFieldX(FIELD_WIDTH) + intercept);
  ctx.moveTo(0, leftEdgeY);
  ctx.lineTo(FIELD_WIDTH, rightEdgeY);
  ctx.stroke();

  // Lazor cannon
  drawCannonBarrel(ctx, cartCenterX, cartCenterY, slope);
}

// Code for drawing the cannon barrel (used in both the battlefield and the firing angle preview).
// Scaling factor is used to make the firing angle preview use a different size scale;
// a scalingFactor of 1 is assumed to be the size that the cannon is drawn on the battlefield.
function drawCannonBarrel(ctx, centerX, centerY, slope, scalingFactor = 1) {
  let scaledRadius = CANNON_RADIUS * scalingFactor;

  ctx.strokeStyle = CANNON_OUTLINE;
  ctx.lineWidth = CART_FOREGROUND_BORDER_WIDTH;
  ctx.fillStyle = CANNON_FILL;

  // Lazor angle is negative arctangent because the slope is in gameplay coordinates,
  // whereas we want the lazor angle in canvas coordinates,
  // so we need to account for the reversal of the vertical directionality between the two coordinate systems
  let lazorAngle = -Math.atan(slope);
  // The corner of the lazor cannon that's clockwise (CW) from the lazor beam on the same side
  let cornerAngleCW = lazorAngle - CANNON_CORNER_ANGLE;
  let offsetXCW = scaledRadius * Math.cos(cornerAngleCW);
  let offsetYCW = scaledRadius * Math.sin(cornerAngleCW);
  // The corner of the lazor cannon that's counterclockwise (CCW) from the lazor beam on the same side
  let cornerAngleCCW = lazorAngle + CANNON_CORNER_ANGLE;
  let offsetXCCW = scaledRadius * Math.cos(cornerAngleCCW);
  let offsetYCCW = scaledRadius * Math.sin(cornerAngleCCW);
  ctx.beginPath();
  ctx.moveTo(centerX + offsetXCCW, centerY + offsetYCCW);
  ctx.lineTo(centerX + offsetXCW, centerY + offsetYCW);
  ctx.lineTo(centerX - offsetXCCW, centerY - offsetYCCW);
  ctx.lineTo(centerX - offsetXCW, centerY - offsetYCW);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

// begin TODELETE (put here just to help me remember names of constants)
// // Graphics related to the aiming mechanism depicted in the slope preview
// // (see function drawSlopePreview for how these are used)
// const GUIDE_WHEEL_CURVE_RADIUS = 3;
// const GUIDE_WHEEL_CENTER_SPAN = 4;
// const GUIDE_TRACK_THICKNESS = 2;
// const GUIDE_WHEEL_SPACING_FROM_PISTON_CENTER = 3;
// const GUIDE_FRAME_THICKNESS = 2;
// const MARGIN_BEYOND_LEFT_GUIDE_WHEELS = 2;
// const SUPPORT_FRAME_THICKNESS = 10;
// const PISTON_INNER_THICKNESS = 3;
// const PISTON_OUTER_THICKNESS = 7;
// const PIVOT_RADIUS = 3;
// // Amount of extra space to provide on each side of the slope preview
// // (so that the mechanism should fit entirely inside the preview canvas)
// const GUIDE_WHEEL_MAX_DIST_FROM_PISTON_CENTER = GUIDE_WHEEL_SPACING_FROM_PISTON_CENTER + 2 * GUIDE_WHEEL_CURVE_RADIUS + GUIDE_WHEEL_CENTER_SPAN;
// // Width and height of slope preview canvas
// // (size is 1 for the center, plus the range and margin on both sides)
// const SLOPE_PREVIEW_SPAN = AIMING_RANGE + GUIDE_WHEEL_MAX_DIST_FROM_PISTON_CENTER;
// const SLOPE_PREVIEW_SIZE = 2 * SLOPE_PREVIEW_SPAN + 1;
// end TODELETE
function drawSlopePreview() {
  let ctx = document.getElementById("slope-prev").getContext("2d");
  ctx.clearRect(0, 0, SLOPE_PREVIEW_SIZE, SLOPE_PREVIEW_SIZE);
  let num = getNumber("numerator")
  let denom = getNumber("denominator");
  let slope = num / denom;

  let pistonCenterY = SLOPE_PREVIEW_SPAN - num;

  // Guide wheels
  let leftWheelCenterX = MARGIN_BEYOND_LEFT_GUIDE_WHEELS + GUIDE_WHEEL_CURVE_RADIUS;
  let rightWheelCenterX = SLOPE_PREVIEW_SPAN - GUIDE_WHEEL_CURVE_RADIUS;
  let upperWheelOriginY = pistonCenterY - GUIDE_WHEEL_SPACING_FROM_PISTON_CENTER - GUIDE_WHEEL_CURVE_RADIUS;
  let lowerWheelOriginY = pistonCenterY + GUIDE_WHEEL_SPACING_FROM_PISTON_CENTER + GUIDE_WHEEL_CURVE_RADIUS + GUIDE_WHEEL_CENTER_SPAN;
  drawGuideWheel(ctx, leftWheelCenterX, upperWheelOriginY);
  drawGuideWheel(ctx, leftWheelCenterX, lowerWheelOriginY);
  drawGuideWheel(ctx, rightWheelCenterX, upperWheelOriginY);
  drawGuideWheel(ctx, rightWheelCenterX, lowerWheelOriginY);

  // Tracks holding guide wheels
  ctx.strokeStyle = "#909090";
  ctx.lineWidth = GUIDE_TRACK_THICKNESS;
  ctx.beginPath();
  let trackXCoords = [
    leftWheelCenterX - GUIDE_WHEEL_CURVE_RADIUS + 1,
    leftWheelCenterX + GUIDE_WHEEL_CURVE_RADIUS - 1,
    rightWheelCenterX - GUIDE_WHEEL_CURVE_RADIUS + 1,
    rightWheelCenterX + GUIDE_WHEEL_CURVE_RADIUS - 1,
  ];
  for (x of trackXCoords) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, SLOPE_PREVIEW_SIZE);
  }
  ctx.stroke();

  // Frame connecting guide wheels to piston
  let upperWheelCenterY = upperWheelOriginY - GUIDE_WHEEL_CENTER_SPAN / 2;
  let lowerWheelCenterY = lowerWheelOriginY - GUIDE_WHEEL_CENTER_SPAN / 2;
  ctx.strokeStyle = "#500000";
  ctx.lineWidth = GUIDE_FRAME_THICKNESS;
  ctx.beginPath();
  ctx.moveTo(leftWheelCenterX, upperWheelCenterY);
  ctx.lineTo(leftWheelCenterX, lowerWheelCenterY);
  ctx.moveTo(rightWheelCenterX, upperWheelCenterY);
  ctx.lineTo(rightWheelCenterX, lowerWheelCenterY);
  ctx.stroke();
  // Piston
  ctx.strokeStyle = "#700000";
  ctx.lineWidth = PISTON_INNER_THICKNESS;
  ctx.beginPath();
  ctx.moveTo(leftWheelCenterX - PISTON_INNER_THICKNESS / 2, pistonCenterY);
  ctx.lineTo(rightWheelCenterX + PISTON_INNER_THICKNESS / 2, pistonCenterY);
  ctx.stroke();
  ctx.strokeStyle = "#900000";
  ctx.lineWidth = PISTON_OUTER_THICKNESS;
  ctx.beginPath();
  ctx.moveTo(denom + SLOPE_PREVIEW_SPAN + PIVOT_RADIUS + 1, pistonCenterY);
  ctx.lineTo(denom + SLOPE_PREVIEW_SPAN - AIMING_RANGE - PIVOT_RADIUS, pistonCenterY);
  ctx.stroke();

  // Pivot attaching cannon to aiming mechanism
  ctx.fillStyle = "#0000f0";
  ctx.beginPath();
  ctx.arc(denom + SLOPE_PREVIEW_SPAN, pistonCenterY, PIVOT_RADIUS, 0, 2 * Math.PI);
  ctx.fill();

  // Cannon, supporting structures, and lazor beam (set to be mostly transparent)
  ctx.globalAlpha = 0.2;
  // Cannon support frame
  ctx.strokeStyle = "#c0c0c0";
  ctx.lineWidth = SUPPORT_FRAME_THICKNESS;
  ctx.beginPath();
  ctx.moveTo(SLOPE_PREVIEW_SPAN, 0);
  ctx.lineTo(SLOPE_PREVIEW_SPAN, SLOPE_PREVIEW_SIZE);
  ctx.stroke();
  // Larger pivot attaching the cannon to the support frame
  ctx.fillStyle = "#0000a0";
  ctx.beginPath();
  ctx.arc(SLOPE_PREVIEW_SPAN, SLOPE_PREVIEW_SPAN, 2 * PIVOT_RADIUS, 0, 2 * Math.PI);
  ctx.fill();
  // Lazor beam
  ctx.strokeStyle = LAZOR_COLOR;
  ctx.lineWidth = LAZOR_BEAM_WIDTH * SLOPE_PREVIEW_SCALE_FACTOR;
  ctx.beginPath();
  ctx.moveTo(0, SLOPE_PREVIEW_SPAN * (1 + slope));
  ctx.lineTo(SLOPE_PREVIEW_SIZE, SLOPE_PREVIEW_SPAN * (1 - slope));
  ctx.stroke();
  // Cannon barrel
  drawCannonBarrel(ctx, SLOPE_PREVIEW_SPAN, SLOPE_PREVIEW_SPAN, slope, SLOPE_PREVIEW_SCALE_FACTOR);
  // Reset transparency to "completely opaque" since that's what we want everywhere except here
  ctx.globalAlpha = 1.0;
}
// For the slope preview, draws a guide wheel whose lower curve is centered at (x, y)
function drawGuideWheel(ctx, x, y) {
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(x, y, GUIDE_WHEEL_CURVE_RADIUS, 0, Math.PI);
  ctx.arc(x, y - GUIDE_WHEEL_CENTER_SPAN, GUIDE_WHEEL_CURVE_RADIUS, Math.PI, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
}

// Changes the firing angle preview and the linear-function equivalent to reflect changes
// to the numerator or denominator of the slope
function changeSlope() {
  updateFunction();
  drawSlopePreview();
}

// Changes the linear-function equivalent to reflect changes to the intercept
function changeIntercept() {
  updateFunction();
}

// Updates the linear function equivalent to reflect the current values of the slope and intercept inputs
function updateFunction() {
  let num = getNumber("numerator");
  let denom = getNumber("denominator");
  let intc = getNumber("intercept");

  if (num === 0) {
    document.getElementById("equation-prev").innerHTML = "y = " + intc;
  } else {
    let functionText = "y = ";
    if (denom !== 1) {
      functionText += "(" + num + "/" + denom + ")";
    } else if (num === -1) {
      functionText += "-";
    } else if (num !== 1) {
      functionText += num;
    }
    functionText += "x";
    if (intc > 0) {
      functionText += " + " + intc;
    } else if (intc < 0) {
      functionText += " - " + (-intc);
    }
    document.getElementById("equation-prev").innerHTML = functionText;
  }
}

function getValue(inputId) {
  return document.getElementById(inputId).value;
}

function getNumber(inputId) {
  return +getValue(inputId);
}

// Functions to convert between graphics-related canvas coordinates (where (0, 0) is the upper-left corner and y-coordinates increase downward)
// and gameplay-related battlefield coordinates (where (0, 0) is the center and y-coordinates increase upward)
function canvasToFieldX(x) {
  return x - FIELD_H_SPAN;
}
function canvasToFieldY(y) {
  return FIELD_V_SPAN - y;
}
function fieldToCanvasX(x) {
  return x + FIELD_H_SPAN;
}
function fieldToCanvasY(y) {
  return FIELD_V_SPAN - y;
}
