//
// BEGIN SECTION: Graphics and game configuration constants
//

// Number of pixels per point of coordinate on the gameplay grid.
// For example, an x-coordinate of 3 from the player's perspective
// would correspond to the point 3 * SCALE pixels to the right of
// the center of the canvas from a graphics perspective.
const SCALE = 10;

// Maximum horizontal and vertical coordinate on the battlefield,
// from an in-game perspective where (0, 0) is the center instead of the upper-left corner
const FIELD_H_SPAN = 50;
const FIELD_V_SPAN = 30;
// Same as above, but in pixel coordinates instead of gameplay coordinates
const CANVAS_H_SPAN = FIELD_H_SPAN * SCALE;
const CANVAS_V_SPAN = FIELD_V_SPAN * SCALE;
// Width and height of battlefield
// (adding 1 in order to have a 0 coordinate in the center, plus the span on both sides)
const CANVAS_WIDTH = 2 * CANVAS_H_SPAN + 1;
const CANVAS_HEIGHT = 2 * CANVAS_V_SPAN + 1;

// Width of each individual track or crossbar in the railway
const RAIL_WIDTH = 2;
// Distance between the two rails of the railway
const RAIL_WHEELSPAN = 20;
const RAIL_HALF_WHEELSPAN = RAIL_WHEELSPAN / 2;

// X-coordinates of the two rails (from a graphics perspective)
const LEFT_RAIL_COORD = CANVAS_H_SPAN - RAIL_HALF_WHEELSPAN;
const RIGHT_RAIL_COORD = CANVAS_H_SPAN + RAIL_HALF_WHEELSPAN;

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
const COORD_LABEL_INTERVAL = 5;
// x-coordinate at which to draw labels on the y-axis
const Y_AXIS_LABEL_X_COORD = RIGHT_RAIL_COORD + 10;

// Maximum number of messages to show in the advisory queue at one time
const MAX_ADVISORIES_SHOWN = 10;

// Number of enemies that need to be defeated in the early stages in order to proceed to the next stage
const BASIC_STAGE_DURATION = 3;

// Data to define the different stages of the game. The meaning of the fields is as follows.
// intro: The message to show to the player at the start of the stage.
// safe: If true, the game will not move and spawn enemies unless the player eliminates all the enemies.
// end: A function to determine when to end the stage and move on to the next stage.
// locked: A list of controls that will NOT be reactivated after showing results, during this stage
const STAGES = [
  // Stage 0
  {
    intro: "You are now in game stage 0. The first small monsters are starting to show up one at a time."
      + " You should have no trouble picking them off before they reach the railway.",
    safe: true,
    end: function() { return stageKills >= BASIC_STAGE_DURATION; },
    locked: [],
  },
  // Stage 1
  {
    intro: "You are now in game stage 1. Something has jammed the motor!"
      + " You won't be able to change the cart location until we get that fixed."
      + " Fortunately, the monsters are still small and only showing up one at a time,"
      + " so you'll still be able to pick them all off before they reach the railway.",
    safe: true,
    end: function() { return stageKills >= BASIC_STAGE_DURATION; },
    locked: ["intercept"],
  },
  // Stage 2
  {
    intro: "You are now in game stage 2. We had to use parts from the aiming controls to fix the motor!"
      + " You can now move the cart again, but you won't be able to change the firing angle for now."
      + " Don't worry, we're working on a solution to allow the aiming controls to work without those parts."
      + " The monsters are still small and only showing up one at a time, so you'll still be able to pick them off"
      + " before they reach the railway. We should have the fix in place before things start to get worse.",
    safe: true,
    end: function() { return stageKills >= BASIC_STAGE_DURATION; },
    locked: ["numerator", "denominator"],
  },
  // Stage 3
  {
    intro: "You are now in game stage 3. This stage has yet to be fully defined."
      + " Enemies will now spawn even if you miss. This is the last stage of the game for now.",
    safe: false,
    end: function() { return false; },
    locked: [],
  },
];

// Data to define the different types of enemies in the game
const ENEMY_TYPES = {
  runner: {
    minRadiusPixels: 5,
    maxRadiusPixels: 8,
    startingHealth: 1,
    minSpeed: FIELD_H_SPAN * 3 / 4,
    maxSpeed: FIELD_H_SPAN * 15 / 16,
  },
};

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

// Current stage of the game
var currentStageNumber = -1;
var currentStage = null;
// Counter for how many aliens have been killed this stage (which helps to determine when to advance to the next stage)
var stageKills = 0;

//
// END of constants and state variables, BEGIN functional code
//

function initialize() {
  // TODO: Let players choose what stage to start with
  currentStageNumber = 0;
  currentStage = STAGES[currentStageNumber];
  stageKills = 0;

  advisories = [
    "Hostile aliens are sending monsters to attack our main railway, hoping to disrupt our supply lines!"
      + " Repel the attack with our brand-new Large Alien Zapper On Rails, or LAZOR for short."
      + " Try to hold them off long enough for the main army to arrive with our alien allies!",
    'The "Vertical Offset" and "Arm Extension" controls affect the angle you shoot at,'
      + ' as shown in the preview next to them. "Cart Position" sets where the center of your vehicle'
      + ' will be when you shoot, as indicated by the labels next to the railway.'
      + ' Once you\'ve set those all where you want them, click the "FIRE!" button to take your shot!',
    'If any part of the LAZOR beam passes through any part of an enemy, it will count as a hit.'
      + ' If it looks like you scored a hit but the game doesn\'t count it as one,'
      + ' that\'s because you missed by less than a pixel.',
    currentStage.intro,
  ];
  updateAdvisoryDisplay();

  let field = document.getElementById("battlefield");
  field.width = CANVAS_WIDTH;
  field.height = CANVAS_HEIGHT;

  let numBox = document.getElementById("numerator");
  numBox.min = -AIMING_RANGE;
  numBox.max = AIMING_RANGE;
  let denomBox = document.getElementById("denominator");
  denomBox.max = AIMING_RANGE;
  let intcBox = document.getElementById("intercept");
  let cartRange = Math.floor(canvasToFieldY(0));
  intcBox.min = -cartRange;
  intcBox.max = cartRange;

  // Set the cart's starting location away from the absolute center of the battlefield, to make it look less artificial
  // and also to minimize potential confusion about whether the cart is on the railway or the street
  numBox.value = 3;
  denomBox.value = 8;
  cartSlope = numBox.value / denomBox.value;
  intcBox.value = Math.floor(-0.42 * cartRange);
  cartIntercept = intcBox.value;
  updateFunction();

  let slopePrev = document.getElementById("slope-prev");
  slopePrev.width = SLOPE_PREVIEW_SIZE;
  slopePrev.height = SLOPE_PREVIEW_SIZE;

  spawnEnemies();
  drawBattlefield(false);
  drawSlopePreview();
}

function drawBattlefield(includeLazor = true) {
  let ctx = document.getElementById("battlefield").getContext("2d");
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
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
  ctx.lineTo(CANVAS_WIDTH, xAxisCanvasY);
  ctx.stroke();
  // Borders at edges of road
  ctx.strokeStyle = "white";
  ctx.lineWidth = ROAD_BORDER_THICKNESS;
  ctx.beginPath();
  let borderY = xAxisCanvasY + DIST_FROM_ROAD_CENTER_TO_CENTER_OF_ROAD_BORDER;
  ctx.moveTo(0, borderY);
  ctx.lineTo(CANVAS_WIDTH, borderY);
  borderY = xAxisCanvasY - DIST_FROM_ROAD_CENTER_TO_CENTER_OF_ROAD_BORDER;
  ctx.moveTo(0, borderY);
  ctx.lineTo(CANVAS_WIDTH, borderY);
  ctx.stroke();
  // Road center line
  ctx.strokeStyle = "#ffff00";
  ctx.lineWidth = ROAD_CENTER_LINE_THICKNESS;
  ctx.setLineDash([ROAD_CENTER_LINE_DASH_LENGTH, ROAD_CENTER_LINE_DASH_GAP]);
  ctx.beginPath();
  // (start a bit to the left so the alignment of the dashes
  // relative to the edges of the field doesn't look too artificial)
  ctx.moveTo(-Math.floor(ROAD_CENTER_LINE_DASH_LENGTH / 3), xAxisCanvasY);
  ctx.lineTo(CANVAS_WIDTH, xAxisCanvasY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Railway and height labels
  ctx.strokeStyle = "#404040";
  ctx.lineWidth = RAIL_WIDTH;
  ctx.beginPath();
  ctx.moveTo(LEFT_RAIL_COORD, 0);
  ctx.lineTo(LEFT_RAIL_COORD, CANVAS_HEIGHT);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(RIGHT_RAIL_COORD, 0);
  ctx.lineTo(RIGHT_RAIL_COORD, CANVAS_HEIGHT);
  ctx.stroke();
  for (let y = 0; y <= CANVAS_HEIGHT; y += CROSSBAR_SPACING) {
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
  for (let y = maxYLabel; fieldToCanvasY(y) <= CANVAS_HEIGHT; y -= COORD_LABEL_INTERVAL) {
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
    ctx.arc(canvasX, canvasY, enemy.radiusPixels, 0, 2 * Math.PI);
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
    let rightEdgeY = fieldToCanvasY(cartSlope * canvasToFieldX(CANVAS_WIDTH) + cartIntercept);
    ctx.moveTo(0, leftEdgeY);
    ctx.lineTo(CANVAS_WIDTH, rightEdgeY);
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
  let message = "Pointing at: (" + canvasToFieldX(event.offsetX).toFixed(1) + ", " + canvasToFieldY(event.offsetY).toFixed(1) + ")";
  for (enemy of enemies) {
    let dx = event.offsetX - fieldToCanvasX(enemy.x);
    let dy = event.offsetY - fieldToCanvasY(enemy.y);
    if (dx * dx + dy * dy <= enemy.radiusPixels * enemy.radiusPixels) {
      // TODO: update to provide more information about the enemy, and maybe be able to handle multiple overlapping enemies
      message += " with an enemy of radius " + canvasToFieldDistance(enemy.radiusPixels).toFixed(2) + " at (" + enemy.x + ", " + enemy.y + ")";
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
  let advisoriesShown = advisories.slice(-MAX_ADVISORIES_SHOWN);
  for (let i = 0; i < advisoriesShown.length; i++) {
    // We'll start to fade some older advisories once enough new ones show up.
    // If the maximum number of advisories is being shown, then we'll fade the oldest three.
    // If we have fewer advisories, we'll fade any which are old enough that they would be in the oldest three
    // if we had enough older messages to reach the maximum.
    let distanceFromEnd = advisoriesShown.length - i; // newest message is 1
    let newness = MAX_ADVISORIES_SHOWN - distanceFromEnd; // oldest advisory that could be shown would be 0
    if (newness < 3) {
      let opacity = (newness + 1) / 4;
      advisoryHTML += '<p style="opacity:' + opacity + ';">';
    } else {
      advisoryHTML += "<p>";
    }
    advisoryHTML += advisoriesShown[i] + "</p>";
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
  if (currentStage.safe && enemies.length > 0) {
    advisories.push("Missed! Since this is an early stage of the game, you're being given another chance to hit your target. "
      + "In later stages of the game, even if you miss, new enemies will spawn and surviving enemies will advance toward the railway!");
    updateAdvisoryDisplay();
  } else {
    if (currentStage.end()) {
      currentStageNumber++;
      currentStage = STAGES[currentStageNumber];
      stageKills = 0;
      advisories.push(currentStage.intro);
      updateAdvisoryDisplay();
    }
    spawnEnemies();
  }

  for (controlElementId of CONTROL_ELEMENT_IDS) {
    if (!currentStage.locked.includes(controlElementId)) {
      document.getElementById(controlElementId).disabled = false;
    }
  }
  showingResults = false;
  drawBattlefield(false);
}

// Remove any destroyed enemies, and have surviving enemies do their movement
function updateEnemies() {
  // Get rid of any enemies whose health has been completely depleted (and update kill count)
  let previousEnemyCount = enemies.length;
  enemies = enemies.filter(enemy => enemy.health > 0);
  stageKills += previousEnemyCount - enemies.length;

  // TODO: have surviving enemies move (unless we're in one of the "safe" stages)
}

// Spawn new enemies according to the rules of the current game stage
function spawnEnemies() {
  // PLACEHOLDER IMPLEMENTATION - just randomly put an enemy somewhere on the battlefield
  // TODO: choose different types and quantities of enemies depending on the game stage
  let enemyType = ENEMY_TYPES.runner;
  // TODO: Make sure it's always possible to hit the enemy during stages where some controls are locked!
  // (Also: Ideally, the last enemy before a locking stage should probably spawn somewhere that
  // you can hit it without using TOO extreme a positioning.)
  let enemy = {
    type: enemyType,
    radiusPixels: randomFromRealRange(enemyType.minRadiusPixels, enemyType.maxRadiusPixels),
    health: enemyType.startingHealth,
  };

  // Choose speed and x-position until we have an x-position where the lazor can hit the enemy at SOME y.
  // TODO: Consider whether this needs to be modified to ensure the enemy doesn't require an unhittable slope
  //       (For example, if the slope needs to be approximately 13.5, you can't get closer than 13 or 14 if the controls have a range of 20)
  let minY, maxY;
  do {
    enemy.speed = randomFromRealRange(enemyType.minSpeed, enemyType.maxSpeed);

    let distanceOfEntry = randomFromIntegerRange(0, Math.floor(enemy.speed));
    // 50/50 chance of spawning on either the left or the right side
    if (Math.random() < 0.5) {
      enemy.x = FIELD_H_SPAN - distanceOfEntry;
    } else {
      enemy.x = distanceOfEntry - FIELD_H_SPAN;
    }

    let minNumerator, maxNumerator;
    if (currentStage.locked.includes("numerator")) {
      minNumerator = getNumber("numerator");
      maxNumerator = minNumerator;
    } else {
      minNumerator = +document.getElementById("numerator").min;
      maxNumerator = +document.getElementById("numerator").max;
    }
    // We only need the minimum denominator, since that's what determines what the steepest possible slope is
    // (and the steepest positive and negative slope are what tells us what our y-range is)
    let minDenom;
    if (currentStage.locked.includes("denominator")) {
      minDenom = getNumber("denominator");
    } else {
      minDenom = +document.getElementById("denominator").min;
    }
    let minSlope = minNumerator / minDenom;
    let maxSlope = maxNumerator / minDenom;

    let minIntercept, maxIntercept;
    if (currentStage.locked.includes("intercept")) {
      minIntercept = getNumber("intercept");
      maxIntercept = minIntercept;
    } else {
      minIntercept = +document.getElementById("intercept").min;
      maxIntercept = +document.getElementById("intercept").max;
    }

    // If x > 0, then the most positive slope produces the most positive possible y-coordinate,
    // and the most negative slope produces the most negative possible y-coordinate.
    // But if x < 0, then the opposite is the case.
    let steepestSlopeToPositive = maxSlope;
    let steepestSlopeToNegative = minSlope;
    if (enemy.x < 0) {
      steepestSlopeToPositive = minSlope;
      steepestSlopeToNegative = maxSlope;
    }
    minY = Math.max(-FIELD_V_SPAN, Math.ceil(steepestSlopeToNegative * enemy.x + minIntercept));
    maxY = Math.min(FIELD_V_SPAN, Math.floor(steepestSlopeToPositive * enemy.x + maxIntercept));
  } while (minY > maxY);

  enemy.y = randomFromIntegerRange(minY, maxY);

  enemies.push(enemy);
}

// Applies any effects the lazor beam has on the given enemy
// (usually reducing health if the lazor hits the enemy)
function checkLazorEffects(enemy) {
  if (lazorHitsEnemy(enemy)) {
    enemy.health--;
  }
}

// Determines whether the lazor hits the given enemy,
// assuming the lazor is pointed along the line indicated by the cartSlope and cartIntercept variables
function lazorHitsEnemy(enemy) {
  // The lazor touches the enemy if its center line is within this distance of the enemy's center.
  let distanceLimit = canvasToFieldDistance(enemy.radiusPixels + LAZOR_BEAM_WIDTH / 2);
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
  return (x - CANVAS_H_SPAN) / SCALE;
}
function canvasToFieldY(y) {
  return (CANVAS_V_SPAN - y) / SCALE;
}
function canvasToFieldDistance(d) {
  return d / SCALE;
}
function fieldToCanvasX(x) {
  return x * SCALE + CANVAS_H_SPAN;
}
function fieldToCanvasY(y) {
  return CANVAS_V_SPAN - y * SCALE;
}
function fieldToCanvasDistance(d) {
  return d * SCALE;
}

// Returns a random number between bound1 and bound2 (bound2 is excluded due to use of Math.random())
function randomFromRealRange(bound1, bound2) {
  return bound1 + (bound2 - bound1) * Math.random();
}

// Returns a random integer which is at least min and at most max.
// Behavior is unspecified if max is less than min, or if either input isn't an integer.
function randomFromIntegerRange(min, max) {
  let numOptions = max - min + 1;
  return min + Math.floor(Math.random() * numOptions);
}
