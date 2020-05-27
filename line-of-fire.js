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
  ctx.lineWidth = 1;
  ctx.fillStyle = "#503000";
  ctx.fillRect(185, 175 - intercept, 30, 50);
  ctx.strokeRect(185, 175 - intercept, 30, 50);

  // Lazor beam
  ctx.strokeStyle = "#f00000";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 200 + 200 * slope - intercept);
  ctx.lineTo(400, 200 - 200 * slope - intercept);
  ctx.stroke();

  // Lazor cannon
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.fillStyle = "#a0a0a0";
  let angle = Math.atan(slope);
  ctx.beginPath();
  ctx.moveTo(200 + 25 * Math.cos(angle + 0.25), 200 - intercept - 25 * Math.sin(angle + 0.25));
  ctx.lineTo(200 + 25 * Math.cos(angle - 0.25), 200 - intercept - 25 * Math.sin(angle - 0.25));
  ctx.lineTo(200 + 25 * Math.cos(angle + Math.PI + 0.25), 200 - intercept - 25 * Math.sin(angle + Math.PI + 0.25));
  ctx.lineTo(200 + 25 * Math.cos(angle + Math.PI - 0.25), 200 - intercept - 25 * Math.sin(angle + Math.PI - 0.25));
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
