// Width and height of battlefield
const FIELD_WIDTH = 400;
const FIELD_HEIGHT = 400;
// Maximum horizontal and vertical coordinate on the battlefield,
// from an in-game perspective where (0, 0) is the center instead of the upper-left corner
const FIELD_H_SPAN = FIELD_WIDTH / 2;
const FIELD_V_SPAN = FIELD_HEIGHT / 2;

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

// Interval at which to always draw labels of coordinates
// (e.g. the y-axis will be labeled with the y-value at every multiple of this)
const COORD_LABEL_INTERVAL = 50;
// x-coordinate at which to draw labels on the y-axis
const Y_AXIS_LABEL_X_COORD = FIELD_H_SPAN + 20;

function initialize() {
  let field = document.getElementById("battlefield");
  field.width = FIELD_WIDTH;
  field.height = FIELD_HEIGHT;

  drawBattlefield();
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
  ctx.strokeStyle = "#f00000";
  ctx.lineWidth = LAZOR_BEAM_WIDTH;
  ctx.beginPath();
  let leftEdgeY = fieldToCanvasY(slope * canvasToFieldX(0) + intercept);
  let rightEdgeY = fieldToCanvasY(slope * canvasToFieldX(FIELD_WIDTH) + intercept);
  ctx.moveTo(0, leftEdgeY);
  ctx.lineTo(FIELD_WIDTH, rightEdgeY);
  ctx.stroke();

  // Lazor cannon
  ctx.strokeStyle = "black";
  ctx.lineWidth = CART_FOREGROUND_BORDER_WIDTH;
  ctx.fillStyle = "#a0a0a0";
  // Lazor angle is negative arctangent because the slope is in gameplay coordinates,
  // whereas we want the lazor angle in canvas coordinates,
  // so we need to account for the reversal of the vertical directionality between the two coordinate systems
  let lazorAngle = -Math.atan(slope);
  // The corner of the lazor cannon that's clockwise (CW) from the lazor beam on the same side
  let cornerAngleCW = lazorAngle - CANNON_CORNER_ANGLE;
  let offsetXCW = CANNON_RADIUS * Math.cos(cornerAngleCW);
  let offsetYCW = CANNON_RADIUS * Math.sin(cornerAngleCW);
  // The corner of the lazor cannon that's counterclockwise (CCW) from the lazor beam on the same side
  let cornerAngleCCW = lazorAngle + CANNON_CORNER_ANGLE;
  let offsetXCCW = CANNON_RADIUS * Math.cos(cornerAngleCCW);
  let offsetYCCW = CANNON_RADIUS * Math.sin(cornerAngleCCW);
  ctx.beginPath();
  ctx.moveTo(cartCenterX + offsetXCCW, cartCenterY + offsetYCCW);
  ctx.lineTo(cartCenterX + offsetXCW, cartCenterY + offsetYCW);
  ctx.lineTo(cartCenterX - offsetXCCW, cartCenterY - offsetYCCW);
  ctx.lineTo(cartCenterX - offsetXCW, cartCenterY - offsetYCW);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

// Changes the firing angle preview and the linear-function equivalent to reflect changes
// to the numerator or denominator of the slope
function changeSlope() {
  updateFunction();
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
