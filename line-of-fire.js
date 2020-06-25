//
// BEGIN SECTION: Graphics and game configuration constants
//

// Maximum horizontal and vertical coordinate on the battlefield,
// from an in-game perspective where (0, 0) is the center instead of the upper-left corner
const FIELD_H_SPAN = 500;
const FIELD_V_SPAN = 300;
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

// Configuration for the cross-street in the middle which shows where the horizontal axis is
const DIST_FROM_ROAD_CENTER_TO_CENTER_OF_ROAD_BORDER = 20;
const ROAD_BORDER_THICKNESS = 5;
const ROAD_CENTER_LINE_THICKNESS = 3;
const ROAD_CENTER_LINE_DASH_LENGTH = 15;
const ROAD_CENTER_LINE_DASH_GAP = 5;

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

// Number of enemies that need to be defeated in the early stages in order to proceed to the next stage
const BASIC_STAGE_DURATION = 5;

// Latest game stage number where the game won't spawn new enemies or move existing ones unless you cleared the battlefield
const MAX_SAFE_STAGE = 2;

// Maximum number of messages to show in the advisory queue at one time
const MAX_ADVISORIES_SHOWN = 10;

//
// BEGIN SECTION: Constants for convenience in referring to things
//

// id fields of inputs used to control the cannon
// (makes it easier to enable/disable all of them at once so they can only be modified when it's time to decide where to fire)
const CONTROL_ELEMENT_IDS = ["numerator", "denominator", "intercept", "fire-button"];

//
// BEGIN SECTION: Variables for tracking game state
//

// Indicates if the game is currently showing results of a lazor shot
var showingResults = false;

// Current position of cart (updated based on controls only when a shot is fired)
var cartIntercept = 0;
var cartSlope = 0;

// List of enemies which are currently on the battlefield.
// This will include their enemy type, current location, and current status (e.g. if a tougher enemy is injured or not).
var enemies = [];

// Messages to communicate with the player about things that happened in the game
var advisories = [];

// Current stage of the game, and a counter to determine when to advance to the next stage
var gameStage = -1;
var stageProgress = 0;

//
// END of constants and state variables, BEGIN functional code
//

function initialize() {
  // TODO: Let players choose what stage to start with
  gameStage = 0;
  stageProgress = 0;

  if (advisories.length > 0) {
    advisories = ["New game started; the messages previously shown here have been deleted."];
    updateAdvisoryDisplay();
  }

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

  // Set the cart's starting location away from the absolute center of the battlefield, to make it look less artificial
  // and also to minimize potential confusion about whether the cart is on the railway or the street
  numBox.value = 3;
  denomBox.value = 8;
  cartSlope = numBox.value / denomBox.value;
  intcBox.value = -142;
  cartIntercept = intcBox.value;

  let slopePrev = document.getElementById("slope-prev");
  slopePrev.width = SLOPE_PREVIEW_SIZE;
  slopePrev.height = SLOPE_PREVIEW_SIZE;

  spawnEnemies();
  drawBattlefield(false);
  drawSlopePreview();
}

function drawBattlefield(includeLazor = true) {
  let ctx = document.getElementById("battlefield").getContext("2d");
  ctx.clearRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);
  drawTerrain(ctx);
  drawEnemies(ctx);
  drawCart(ctx, includeLazor);
}

function drawTerrain(ctx) {
  // Cross street indicating location of horizontal axis
  let xAxisCanvasY = fieldToCanvasY(0);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2 * DIST_FROM_ROAD_CENTER_TO_CENTER_OF_ROAD_BORDER + 1;
  ctx.beginPath();
  ctx.moveTo(0, xAxisCanvasY);
  ctx.lineTo(FIELD_WIDTH, xAxisCanvasY);
  ctx.stroke();
  // Borders at edges of road
  ctx.strokeStyle = "white";
  ctx.lineWidth = ROAD_BORDER_THICKNESS;
  ctx.beginPath();
  let borderY = xAxisCanvasY + DIST_FROM_ROAD_CENTER_TO_CENTER_OF_ROAD_BORDER;
  ctx.moveTo(0, borderY);
  ctx.lineTo(FIELD_WIDTH, borderY);
  borderY = xAxisCanvasY - DIST_FROM_ROAD_CENTER_TO_CENTER_OF_ROAD_BORDER;
  ctx.moveTo(0, borderY);
  ctx.lineTo(FIELD_WIDTH, borderY);
  ctx.stroke();
  // Road center line
  ctx.strokeStyle = "#ffff00";
  ctx.lineWidth = ROAD_CENTER_LINE_THICKNESS;
  ctx.setLineDash([ROAD_CENTER_LINE_DASH_LENGTH, ROAD_CENTER_LINE_DASH_GAP]);
  ctx.beginPath();
  // (start a bit to the left so the alignment of the dashes
  // relative to the edges of the field doesn't look too artificial)
  ctx.moveTo(-Math.floor(ROAD_CENTER_LINE_DASH_LENGTH / 3), xAxisCanvasY);
  ctx.lineTo(FIELD_WIDTH, xAxisCanvasY);
  ctx.stroke();
  ctx.setLineDash([]);

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
    // Skip the y=0 label since it's in the x-axis road, making it difficult to make the label easily visible
    if (y === 0) {
      continue;
    }
    ctx.fillText(y, Y_AXIS_LABEL_X_COORD, fieldToCanvasY(y));
  }
}

function drawEnemies(ctx) {
  for (enemy of enemies) {
    let canvasX = fieldToCanvasX(enemy.x);
    let canvasY = fieldToCanvasY(enemy.y);
    // PLACEHOLDER IMPLEMENTATION - we'll probably put a "draw this" function as one of the fields of each enemy type
    ctx.fillStyle = enemy.health > 0 ? "#dd00dd" : "#608060";
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, enemy.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function drawCart(ctx, includeLazor) {
  // Cart base
  ctx.strokeStyle = "#101000";
  ctx.lineWidth = CART_BACKGROUND_BORDER_WIDTH;
  ctx.fillStyle = "#503000";
  let cartCenterX = fieldToCanvasX(0);
  let cartLeftX = cartCenterX - CART_BASE_WIDTH / 2;
  let cartCenterY = fieldToCanvasY(cartIntercept);
  let cartTopY = cartCenterY - CART_BASE_HEIGHT / 2;
  ctx.fillRect(cartLeftX, cartTopY, CART_BASE_WIDTH, CART_BASE_HEIGHT);
  ctx.strokeRect(cartLeftX, cartTopY, CART_BASE_WIDTH, CART_BASE_HEIGHT);

  // Lazor beam
  if (includeLazor) {
    ctx.strokeStyle = LAZOR_COLOR;
    ctx.lineWidth = LAZOR_BEAM_WIDTH;
    ctx.beginPath();
    let leftEdgeY = fieldToCanvasY(cartSlope * canvasToFieldX(0) + cartIntercept);
    let rightEdgeY = fieldToCanvasY(cartSlope * canvasToFieldX(FIELD_WIDTH) + cartIntercept);
    ctx.moveTo(0, leftEdgeY);
    ctx.lineTo(FIELD_WIDTH, rightEdgeY);
    ctx.stroke();
  }

  // Lazor cannon
  drawCannonBarrel(ctx, cartCenterX, cartCenterY, cartSlope);
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

// Indicates the coordinates (in the game system) of where the mouse is aimed, and any enemies at that location
function describeTarget(event) {
  let fieldX = canvasToFieldX(event.offsetX);
  let fieldY = canvasToFieldY(event.offsetY);
  let message = "Pointing at: (" + fieldX + ", " + fieldY + ")";
  for (enemy of enemies) {
    let dx = fieldX - enemy.x;
    let dy = fieldY - enemy.y;
    if (dx * dx + dy * dy <= enemy.radius * enemy.radius) {
      // TODO: update to provide more information about the enemy, and maybe be able to handle multiple overlapping enemies
      message += " with an enemy of radius " + enemy.radius.toFixed(2) + " at (" + enemy.x.toFixed(2) + ", " + enemy.y.toFixed(2) + ")";
    }
  }
  document.getElementById("mouseover-status").innerHTML = message;
}

// Resets the message provided by describeTarget() back to a "not pointing at stuff" message
function undescribeTarget() {
  document.getElementById("mouseover-status").innerHTML = "Not currently pointing at the battlefield";
}

// Update the advisory queue area to show up to the configured maximum number of the most recent messages
function updateAdvisoryDisplay() {
  let advisoryHTML = "";
  for (advisory of advisories.slice(0, MAX_ADVISORIES_SHOWN)) {
    advisoryHTML += "<p>" + advisory + "</p>";
  }
  document.getElementById("advisory-queue").innerHTML = advisoryHTML;
}

function fireLazor() {
  // Button shouldn't be clickable if we're currently showing results
  // (need to wait to redraw new enemies before firing next shot)
  if (showingResults) {
    return;
  }

  for (controlElementId of CONTROL_ELEMENT_IDS) {
    document.getElementById(controlElementId).disabled = true;
  }

  showingResults = true;
  cartIntercept = getNumber("intercept");
  cartSlope = getNumber("numerator") / getNumber("denominator");

  for (enemy of enemies) {
    checkLazorEffects(enemy);
  }

  drawBattlefield(true);
  let ctx = document.getElementById("battlefield").getContext("2d");
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = "black";
  ctx.font = "18px Arial";
  ctx.fillText("Showing results of shot. Click to proceed.", 10, 10);
}

function clickBattlefield() {
  // So far, clicking the battlefield only matters for clearing and updating the battlefield after seeing the results of a shot
  if (!showingResults) {
    return;
  }

  updateEnemies();
  if (gameStage > MAX_SAFE_STAGE || enemies.length === 0) {
    spawnEnemies();
    if (stageProgress >= BASIC_STAGE_DURATION) {
      gameStage++;
      stageProgress = 0;
      let advisory = "You've defeated enough enemies to advance to stage " + gameStage + "!";
      if (gameStage === 1 + MAX_SAFE_STAGE) {
        advisory += " New enemies will now spawn even if you miss."
      }
      advisories.unshift(advisory);
      updateAdvisoryDisplay();
    }
  } else {
    advisories.unshift("Missed! Since this is an early stage of the game, you're being given another chance to hit your target. "
      + "In later stages of the game, even if you miss, new enemies will spawn and surviving enemies will advance toward the railway!");
    updateAdvisoryDisplay();
  }

  for (controlElementId of CONTROL_ELEMENT_IDS) {
    document.getElementById(controlElementId).disabled = false;
  }
  showingResults = false;
  drawBattlefield(false);
}

// Remove any destroyed enemies, and have surviving enemies do their movement
function updateEnemies() {
  // Get rid of any enemies that don't have more than zero health
  enemies = enemies.filter(enemy => enemy.health > 0);

  // TODO: have surviving enemies move (unless we're in one of the "safe" stages)
}

// Spawn new enemies according to the rules of the current game stage
function spawnEnemies() {
  // PLACEHOLDER IMPLEMENTATION - just randomly put an enemy somewhere on the battlefield
  enemies.push({
    radius: 4 + 8 * Math.random(),
    x: canvasToFieldX(Math.random() * FIELD_WIDTH),
    y: canvasToFieldY(Math.random() * FIELD_HEIGHT),
    health: 1,
  });
}

// Applies any effects the lazor beam has on the given enemy
// (usually reducing health if the lazor hits the enemy)
function checkLazorEffects(enemy) {
  if (lazorHitsEnemy(enemy)) {
    enemy.health--;
    if (enemy.health <= 0) {
      stageProgress++;
    }
  }
}

// Determines whether the lazor hits the given enemy,
// assuming the lazor is pointed along the line indicated by the cartSlope and cartIntercept variables
function lazorHitsEnemy(enemy) {
  // The lazor touches the enemy if its center line is within this distance of the enemy's center.
  let distanceLimit = enemy.radius + LAZOR_BEAM_WIDTH / 2;
  // The distance from the lazor's center line to the center of the enemy is proportional to this amount.
  let scaledDistance = enemy.y - cartSlope * enemy.x - cartIntercept;
  // Since the proportionality constant is the square root of (1 plus the square of the slope),
  // we'll compare the squares of the distances to avoid having to take a square root.
  return scaledDistance * scaledDistance / (cartSlope * cartSlope + 1) <= distanceLimit * distanceLimit;
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
