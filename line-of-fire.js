//
// BEGIN SECTION: Graphics and game configuration constants
//

// Number of pixels per point of coordinate on the gameplay grid.
// For example, an x-coordinate of 3 from the player's perspective
// would correspond to the point 3 * SCALE pixels to the right of
// the center of the canvas from a graphics perspective.
const SCALE = 8;

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
const RAIL_WIDTH_PIXELS = 2;

// x-coordinate of the right side of the railway.
// This value and its negative are also the coordinates enemies will end up at
// if they reach the railway and start damaging it.
const RAIL_X_COORD = 1;
// Distance between the two rails of the railway
const RAIL_HALF_WHEELSPAN_PIXELS = RAIL_X_COORD * SCALE;
const RAIL_WHEELSPAN_PIXELS = 2 * RAIL_HALF_WHEELSPAN_PIXELS;

// X-coordinates of the two rails (from a graphics perspective)
const LEFT_RAIL_COORD_PIXELS = CANVAS_H_SPAN - RAIL_HALF_WHEELSPAN_PIXELS;
const RIGHT_RAIL_COORD_PIXELS = CANVAS_H_SPAN + RAIL_HALF_WHEELSPAN_PIXELS;

// Configuration for the cross-street in the middle which shows where the horizontal axis is
const DIST_FROM_ROAD_CENTER_TO_CENTER_OF_ROAD_BORDER_PIXELS = 20;
const ROAD_BORDER_THICKNESS_PIXELS = 5;
const ROAD_CENTER_LINE_THICKNESS_PIXELS = 3;
const ROAD_CENTER_LINE_DASH_LENGTH_PIXELS = 15;
const ROAD_CENTER_LINE_DASH_GAP_PIXELS = 5;

// Sizing values relating to the crossbars in the railway
const CROSSBAR_SPACING_PIXELS = 10;
const CROSSBAR_OVERSHOOT_PIXELS = 3;
const CROSSBAR_LEFT_END_PIXELS = LEFT_RAIL_COORD_PIXELS - CROSSBAR_OVERSHOOT_PIXELS;
const CROSSBAR_RIGHT_END_PIXELS = RIGHT_RAIL_COORD_PIXELS + CROSSBAR_OVERSHOOT_PIXELS;

// Sizes of cart components
const CART_BACKGROUND_BORDER_WIDTH_PIXELS = 1;
const CART_FOREGROUND_BORDER_WIDTH_PIXELS = 2;
const CART_BASE_WIDTH_PIXELS = 3.5 * RAIL_HALF_WHEELSPAN_PIXELS;
const CART_BASE_HEIGHT_PIXELS = CART_BASE_WIDTH_PIXELS * 5 / 3;
const LAZOR_BEAM_WIDTH_PIXELS = 3;
// Total width and height of cannon (not just distance from center)
const CANNON_LENGTH_PIXELS = CART_BASE_HEIGHT_PIXELS * 15 / 16;
const CANNON_WIDTH_PIXELS = CANNON_LENGTH_PIXELS / 4;
// Distance from the center of the cart to a corner of the cannon
const CANNON_RADIUS_PIXELS = Math.sqrt(CANNON_WIDTH_PIXELS * CANNON_WIDTH_PIXELS + CANNON_LENGTH_PIXELS * CANNON_LENGTH_PIXELS) / 2;
// Positive angle between the direction of the lazor beam
// and the direction from the center of the cart to a corner of the cannon
const CANNON_CORNER_ANGLE = Math.atan2(CANNON_WIDTH_PIXELS, CANNON_LENGTH_PIXELS);
// Thickness of ALL lines used in the on-battlefield firing preview
const CART_PREVIEW_LINE_WIDTH_PIXELS = 2;

// Colors and styles that we want to use in multiple places
const LAZOR_COLOR = "#f00000";
const CANNON_OUTLINE = "black";
const CANNON_FILL = "#a0a0a0";
const CART_PREVIEW_COLOR = "#c03800";

// Maximum absolute value of numerator and denominator of slope.
// Numerator ranges from negative of this value to this value.
// Denominator ranges from 1 to this value.
const AIMING_RANGE = 20;

// Graphics related to the aiming mechanism depicted in the slope preview
// (see function drawSlopePreview for how these are used)
const GUIDE_WHEEL_CURVE_RADIUS_PIXELS = 3;
const GUIDE_WHEEL_CENTER_SPAN_PIXELS = 4;
const GUIDE_TRACK_THICKNESS_PIXELS = 1;
const GUIDE_WHEEL_SPACING_FROM_PISTON_CENTER_PIXELS = 3;
const GUIDE_FRAME_THICKNESS_PIXELS = 2;
const MARGIN_BEYOND_LEFT_GUIDE_WHEELS_PIXELS = 2;
const SUPPORT_FRAME_THICKNESS_PIXELS = 20;
const PISTON_INNER_THICKNESS_PIXELS = 3;
const PISTON_OUTER_THICKNESS_PIXELS = 7;
const PIVOT_RADIUS_PIXELS = 3;
// How much to scale up the lazor beam and the cannon barrel
const SLOPE_PREVIEW_SCALE_FACTOR = 2.0;
// Amount of extra space to provide on each side of the slope preview
// (so that the mechanism should fit entirely inside the preview canvas)
const GUIDE_WHEEL_MAX_DIST_FROM_PISTON_CENTER_PIXELS = GUIDE_WHEEL_SPACING_FROM_PISTON_CENTER_PIXELS + 2 * GUIDE_WHEEL_CURVE_RADIUS_PIXELS + GUIDE_WHEEL_CENTER_SPAN_PIXELS;
// Width and height of slope preview canvas
// (size is 1 for the center, plus the range and margin on both sides)
const SLOPE_PREVIEW_CANVAS_SPAN = AIMING_RANGE + GUIDE_WHEEL_MAX_DIST_FROM_PISTON_CENTER_PIXELS;
const SLOPE_PREVIEW_CANVAS_SIZE = 2 * SLOPE_PREVIEW_CANVAS_SPAN + 1;

// Interval at which to always draw labels of coordinates
// (e.g. the y-axis will be labeled with the y-value at every multiple of this)
const COORD_LABEL_INTERVAL = 5;
// x-coordinate at which to draw labels on the y-axis
const Y_AXIS_LABEL_X_COORD_PIXELS = RIGHT_RAIL_COORD_PIXELS + 10;

// Maximum number of messages to show in the advisory queue at one time
const MAX_ADVISORIES_SHOWN = 10;

// Number of enemies that need to be defeated in the early stages in order to proceed to the next stage
const BASIC_STAGE_DURATION = 3;

// Data to define the different stages of the game. The meaning of the fields is as follows.
// intro: The message to show to the player at the start of the stage.
// safe: If true, the game will not move and spawn enemies unless the player eliminates all the enemies.
// spawn: A function which will be called every turn to generate a list of enemy types to be spawned.
// checkSpawns: A function which, if present, will be called on an array of newly spawned enemies after spawning
//     in order to fix any issues present (e.g. making sure both enemies can be hit with one shot in stage 3)
// end: A function to determine when to end the stage and move on to the next stage.
// locked: A list of controls that will NOT be reactivated after showing results, during this stage
const STAGES = [
  // Stage 0
  {
    intro: "You are now in game stage 0. The first small monsters are starting to show up one at a time."
      + " You should have no trouble picking them off before they reach the railway.",
    safe: true,
    spawn: function() { return [ENEMY_TYPES.runner]; },
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
    spawn: function() { return [ENEMY_TYPES.runner]; },
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
    spawn: function() { return [ENEMY_TYPES.runner]; },
    end: function() { return stageKills >= BASIC_STAGE_DURATION; },
    locked: ["numerator", "denominator"],
  },
  // Stage 3
  {
    intro: "You are now in game stage 3. This stage has yet to be fully defined."
      + " Now, even if you miss, new enemies will spawn and surviving enemies will move closer."
      + " This is the last stage of the game for now.",
    safe: false,
    spawn: function() { return [ENEMY_TYPES.runner, ENEMY_TYPES.runner]; },
    checkSpawns: function(spawned) { ensureCombo(spawned[0], spawned[1]); },
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
    minSpeed: FIELD_H_SPAN * 9 / 16,
    maxSpeed: FIELD_H_SPAN * 11 / 16,
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

// List of enemies which are currently on the battlefield, each with the following fields:
// type: The type of the enemy, taken as an object from ENEMY_TYPES
// radiusPixels: Radius of the enemy in canvas units (i.e. graphical pixels)
// health: The enemy's current health; how many times the enemy still needs to be hit to destroy it
// speed: How far the enemy moves, measured in battlefield units (i.e. Cartesian grid coordinates)
// x, y: The coordinates of the center of the enemy, measured in battlefield units
// threat: 0 or undefined if the enemy hasn't reached the rail yet, 1 if attacking the rail, 2 if attacking the cart
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
  cartIntercept = +intcBox.value;
  updateFunction();

  let slopePrev = document.getElementById("slope-prev");
  slopePrev.width = SLOPE_PREVIEW_CANVAS_SIZE;
  slopePrev.height = SLOPE_PREVIEW_CANVAS_SIZE;

  spawnEnemies();
  drawBattlefield(false);
  drawSlopePreview();
}

function drawBattlefield(includeLazor = true, includePreview = false) {
  let ctx = document.getElementById("battlefield").getContext("2d");
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawTerrain(ctx);
  drawCart(ctx, includeLazor);
  if (includePreview) {
    drawCart(ctx, true, true);
  }
  drawEnemies(ctx);
}

function drawTerrain(ctx) {
  // Cross street indicating location of horizontal axis
  let xAxisCanvasY = fieldToCanvasY(0);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2 * DIST_FROM_ROAD_CENTER_TO_CENTER_OF_ROAD_BORDER_PIXELS + 1;
  ctx.beginPath();
  ctx.moveTo(0, xAxisCanvasY);
  ctx.lineTo(CANVAS_WIDTH, xAxisCanvasY);
  ctx.stroke();
  // Borders at edges of road
  ctx.strokeStyle = "white";
  ctx.lineWidth = ROAD_BORDER_THICKNESS_PIXELS;
  ctx.beginPath();
  let borderCanvasY = xAxisCanvasY + DIST_FROM_ROAD_CENTER_TO_CENTER_OF_ROAD_BORDER_PIXELS;
  ctx.moveTo(0, borderCanvasY);
  ctx.lineTo(CANVAS_WIDTH, borderCanvasY);
  borderCanvasY = xAxisCanvasY - DIST_FROM_ROAD_CENTER_TO_CENTER_OF_ROAD_BORDER_PIXELS;
  ctx.moveTo(0, borderCanvasY);
  ctx.lineTo(CANVAS_WIDTH, borderCanvasY);
  ctx.stroke();
  // Road center line
  ctx.strokeStyle = "#ffff00";
  ctx.lineWidth = ROAD_CENTER_LINE_THICKNESS_PIXELS;
  ctx.setLineDash([ROAD_CENTER_LINE_DASH_LENGTH_PIXELS, ROAD_CENTER_LINE_DASH_GAP_PIXELS]);
  ctx.beginPath();
  // (start a bit to the left so the alignment of the dashes
  // relative to the edges of the field doesn't look too artificial)
  ctx.moveTo(-Math.floor(ROAD_CENTER_LINE_DASH_LENGTH_PIXELS / 3), xAxisCanvasY);
  ctx.lineTo(CANVAS_WIDTH, xAxisCanvasY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Railway and height labels
  ctx.strokeStyle = "#404040";
  ctx.lineWidth = RAIL_WIDTH_PIXELS;
  ctx.beginPath();
  ctx.moveTo(LEFT_RAIL_COORD_PIXELS, 0);
  ctx.lineTo(LEFT_RAIL_COORD_PIXELS, CANVAS_HEIGHT);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(RIGHT_RAIL_COORD_PIXELS, 0);
  ctx.lineTo(RIGHT_RAIL_COORD_PIXELS, CANVAS_HEIGHT);
  ctx.stroke();
  for (let y = 0; y <= CANVAS_HEIGHT; y += CROSSBAR_SPACING_PIXELS) {
    ctx.beginPath();
    ctx.moveTo(CROSSBAR_LEFT_END_PIXELS, y);
    ctx.lineTo(CROSSBAR_RIGHT_END_PIXELS, y);
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
    ctx.fillText(y, Y_AXIS_LABEL_X_COORD_PIXELS, fieldToCanvasY(y));
  }
}

function drawEnemies(ctx) {
  for (let enemy of enemies) {
    let canvasX = fieldToCanvasX(enemy.x);
    let canvasY = fieldToCanvasY(enemy.y);
    // PLACEHOLDER IMPLEMENTATION - we'll probably put a "draw this" function as one of the fields of each enemy type
    ctx.fillStyle = enemy.health > 0 ? "#dd00dd" : "#608060";
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, enemy.radiusPixels, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function drawCart(ctx, includeLazor, preview = false) {
  // Turn on dotted line effect if this is a firing preview
  if (preview) {
    ctx.setLineDash([6, 4]);
  }

  // Variables for general location of the cart,
  // depending on whether this is a preview or the current location
  let cartCenterCanvasX = fieldToCanvasX(0);
  let cartCenterCanvasY = fieldToCanvasY(preview ? getNumber("intercept") : cartIntercept);
  let slope = preview ? getNumber("numerator") / getNumber("denominator") : cartSlope;
  let intc = preview ? getNumber("intercept") : cartIntercept;

  // Cart base
  ctx.strokeStyle = preview ? CART_PREVIEW_COLOR : "#101000";
  ctx.lineWidth = preview ? CART_PREVIEW_LINE_WIDTH_PIXELS : CART_BACKGROUND_BORDER_WIDTH_PIXELS;
  ctx.fillStyle = "#503000";
  let cartLeftCanvasX = cartCenterCanvasX - CART_BASE_WIDTH_PIXELS / 2;
  let cartTopCanvasY = cartCenterCanvasY - CART_BASE_HEIGHT_PIXELS / 2;
  if (!preview) {
    ctx.fillRect(cartLeftCanvasX, cartTopCanvasY, CART_BASE_WIDTH_PIXELS, CART_BASE_HEIGHT_PIXELS);
  }
  ctx.strokeRect(cartLeftCanvasX, cartTopCanvasY, CART_BASE_WIDTH_PIXELS, CART_BASE_HEIGHT_PIXELS);

  // Lazor beam
  if (includeLazor) {
    ctx.strokeStyle = preview ? CART_PREVIEW_COLOR : LAZOR_COLOR;
    ctx.lineWidth = preview ? CART_PREVIEW_LINE_WIDTH_PIXELS : LAZOR_BEAM_WIDTH_PIXELS;
    ctx.beginPath();
    let leftEdgeCanvasY = fieldToCanvasY(slope * canvasToFieldX(0) + intc);
    let rightEdgeCanvasY = fieldToCanvasY(slope * canvasToFieldX(CANVAS_WIDTH) + intc);
    ctx.moveTo(0, leftEdgeCanvasY);
    ctx.lineTo(CANVAS_WIDTH, rightEdgeCanvasY);
    ctx.stroke();
  }

  // Lazor cannon
  drawCannonBarrel(ctx, cartCenterCanvasX, cartCenterCanvasY, slope, 1, preview);

  // Turn off dotted line effect
  if (preview) {
    ctx.setLineDash([]);
  }
}

// Code for drawing the cannon barrel (used in both the battlefield and the firing angle preview).
// Scaling factor is used to make the firing angle preview use a different size scale;
// a scalingFactor of 1 is assumed to be the size that the cannon is drawn on the battlefield.
function drawCannonBarrel(ctx, centerCanvasX, centerCanvasY, slope, scalingFactor = 1, preview = false) {
  let scaledRadiusPixels = CANNON_RADIUS_PIXELS * scalingFactor;

  ctx.strokeStyle = preview ? CART_PREVIEW_COLOR : CANNON_OUTLINE;
  ctx.lineWidth = preview ? CART_PREVIEW_LINE_WIDTH_PIXELS : CART_FOREGROUND_BORDER_WIDTH_PIXELS;
  ctx.fillStyle = CANNON_FILL;

  // Lazor angle is negative arctangent because the slope is in gameplay coordinates,
  // whereas we want the lazor angle in canvas coordinates,
  // so we need to account for the reversal of the vertical directionality between the two coordinate systems
  let lazorAngle = -Math.atan(slope);
  // The corner of the lazor cannon that's clockwise (CW) from the lazor beam on the same side
  let cornerAngleCW = lazorAngle - CANNON_CORNER_ANGLE;
  let offsetCanvasXCW = scaledRadiusPixels * Math.cos(cornerAngleCW);
  let offsetCanvasYCW = scaledRadiusPixels * Math.sin(cornerAngleCW);
  // The corner of the lazor cannon that's counterclockwise (CCW) from the lazor beam on the same side
  let cornerAngleCCW = lazorAngle + CANNON_CORNER_ANGLE;
  let offsetCanvasXCCW = scaledRadiusPixels * Math.cos(cornerAngleCCW);
  let offsetCanvasYCCW = scaledRadiusPixels * Math.sin(cornerAngleCCW);
  ctx.beginPath();
  ctx.moveTo(centerCanvasX + offsetCanvasXCCW, centerCanvasY + offsetCanvasYCCW);
  ctx.lineTo(centerCanvasX + offsetCanvasXCW, centerCanvasY + offsetCanvasYCW);
  ctx.lineTo(centerCanvasX - offsetCanvasXCCW, centerCanvasY - offsetCanvasYCCW);
  ctx.lineTo(centerCanvasX - offsetCanvasXCW, centerCanvasY - offsetCanvasYCW);
  ctx.closePath();
  ctx.stroke();
  if (!preview) {
    ctx.fill();
  }
}

function drawSlopePreview() {
  let ctx = document.getElementById("slope-prev").getContext("2d");
  ctx.clearRect(0, 0, SLOPE_PREVIEW_CANVAS_SIZE, SLOPE_PREVIEW_CANVAS_SIZE);
  let num = getNumber("numerator")
  let denom = getNumber("denominator");
  let slope = num / denom;

  let pistonCenterCanvasY = SLOPE_PREVIEW_CANVAS_SPAN - num;

  // Guide wheels
  let leftWheelCenterCanvasX = MARGIN_BEYOND_LEFT_GUIDE_WHEELS_PIXELS + GUIDE_WHEEL_CURVE_RADIUS_PIXELS;
  let rightWheelCenterCanvasX = SLOPE_PREVIEW_CANVAS_SPAN - GUIDE_WHEEL_CURVE_RADIUS_PIXELS;
  let upperWheelOriginCanvasY = pistonCenterCanvasY - GUIDE_WHEEL_SPACING_FROM_PISTON_CENTER_PIXELS - GUIDE_WHEEL_CURVE_RADIUS_PIXELS;
  let lowerWheelOriginCanvasY = pistonCenterCanvasY + GUIDE_WHEEL_SPACING_FROM_PISTON_CENTER_PIXELS + GUIDE_WHEEL_CURVE_RADIUS_PIXELS + GUIDE_WHEEL_CENTER_SPAN_PIXELS;
  drawGuideWheel(ctx, leftWheelCenterCanvasX, upperWheelOriginCanvasY);
  drawGuideWheel(ctx, leftWheelCenterCanvasX, lowerWheelOriginCanvasY);
  drawGuideWheel(ctx, rightWheelCenterCanvasX, upperWheelOriginCanvasY);
  drawGuideWheel(ctx, rightWheelCenterCanvasX, lowerWheelOriginCanvasY);

  // Tracks holding guide wheels
  ctx.strokeStyle = "#909090";
  ctx.lineWidth = GUIDE_TRACK_THICKNESS_PIXELS;
  ctx.beginPath();
  let trackXCanvasCoords = [
    leftWheelCenterCanvasX - GUIDE_WHEEL_CURVE_RADIUS_PIXELS + 1,
    leftWheelCenterCanvasX + GUIDE_WHEEL_CURVE_RADIUS_PIXELS - 1,
    rightWheelCenterCanvasX - GUIDE_WHEEL_CURVE_RADIUS_PIXELS + 1,
    rightWheelCenterCanvasX + GUIDE_WHEEL_CURVE_RADIUS_PIXELS - 1,
  ];
  for (let x of trackXCanvasCoords) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, SLOPE_PREVIEW_CANVAS_SIZE);
  }
  ctx.stroke();

  // Frame connecting guide wheels to piston
  let upperWheelCenterCanvasY = upperWheelOriginCanvasY - GUIDE_WHEEL_CENTER_SPAN_PIXELS / 2;
  let lowerWheelCenterCanvasY = lowerWheelOriginCanvasY - GUIDE_WHEEL_CENTER_SPAN_PIXELS / 2;
  ctx.strokeStyle = "#500000";
  ctx.lineWidth = GUIDE_FRAME_THICKNESS_PIXELS;
  ctx.beginPath();
  ctx.moveTo(leftWheelCenterCanvasX, upperWheelCenterCanvasY);
  ctx.lineTo(leftWheelCenterCanvasX, lowerWheelCenterCanvasY);
  ctx.moveTo(rightWheelCenterCanvasX, upperWheelCenterCanvasY);
  ctx.lineTo(rightWheelCenterCanvasX, lowerWheelCenterCanvasY);
  ctx.stroke();
  // Piston
  ctx.strokeStyle = "#700000";
  ctx.lineWidth = PISTON_INNER_THICKNESS_PIXELS;
  ctx.beginPath();
  ctx.moveTo(leftWheelCenterCanvasX - PISTON_INNER_THICKNESS_PIXELS / 2, pistonCenterCanvasY);
  ctx.lineTo(rightWheelCenterCanvasX + PISTON_INNER_THICKNESS_PIXELS / 2, pistonCenterCanvasY);
  ctx.stroke();
  ctx.strokeStyle = "#900000";
  ctx.lineWidth = PISTON_OUTER_THICKNESS_PIXELS;
  ctx.beginPath();
  ctx.moveTo(denom + SLOPE_PREVIEW_CANVAS_SPAN + PIVOT_RADIUS_PIXELS + 1, pistonCenterCanvasY);
  ctx.lineTo(denom + SLOPE_PREVIEW_CANVAS_SPAN - AIMING_RANGE - PIVOT_RADIUS_PIXELS, pistonCenterCanvasY);
  ctx.stroke();

  // Pivot attaching cannon to aiming mechanism
  ctx.fillStyle = "#0000f0";
  ctx.beginPath();
  ctx.arc(denom + SLOPE_PREVIEW_CANVAS_SPAN, pistonCenterCanvasY, PIVOT_RADIUS_PIXELS, 0, 2 * Math.PI);
  ctx.fill();

  // Cannon, supporting structures, and lazor beam (set to be mostly transparent)
  ctx.globalAlpha = 0.2;
  // Cannon support frame
  ctx.strokeStyle = "#c0c0c0";
  ctx.lineWidth = SUPPORT_FRAME_THICKNESS_PIXELS;
  ctx.beginPath();
  ctx.moveTo(SLOPE_PREVIEW_CANVAS_SPAN, 0);
  ctx.lineTo(SLOPE_PREVIEW_CANVAS_SPAN, SLOPE_PREVIEW_CANVAS_SIZE);
  ctx.stroke();
  // Larger pivot attaching the cannon to the support frame
  ctx.fillStyle = "#0000a0";
  ctx.beginPath();
  ctx.arc(SLOPE_PREVIEW_CANVAS_SPAN, SLOPE_PREVIEW_CANVAS_SPAN, 2 * PIVOT_RADIUS_PIXELS, 0, 2 * Math.PI);
  ctx.fill();
  // Lazor beam
  ctx.strokeStyle = LAZOR_COLOR;
  ctx.lineWidth = LAZOR_BEAM_WIDTH_PIXELS * SLOPE_PREVIEW_SCALE_FACTOR;
  ctx.beginPath();
  ctx.moveTo(0, SLOPE_PREVIEW_CANVAS_SPAN * (1 + slope));
  ctx.lineTo(SLOPE_PREVIEW_CANVAS_SIZE, SLOPE_PREVIEW_CANVAS_SPAN * (1 - slope));
  ctx.stroke();
  // Cannon barrel
  drawCannonBarrel(ctx, SLOPE_PREVIEW_CANVAS_SPAN, SLOPE_PREVIEW_CANVAS_SPAN, slope, SLOPE_PREVIEW_SCALE_FACTOR);
  // Reset transparency to "completely opaque" since that's what we want everywhere except here
  ctx.globalAlpha = 1.0;
}
// For the slope preview, draws a guide wheel whose lower curve is centered at (canvasX, canvasY)
function drawGuideWheel(ctx, canvasX, canvasY) {
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(canvasX, canvasY, GUIDE_WHEEL_CURVE_RADIUS_PIXELS, 0, Math.PI);
  ctx.arc(canvasX, canvasY - GUIDE_WHEEL_CENTER_SPAN_PIXELS, GUIDE_WHEEL_CURVE_RADIUS_PIXELS, Math.PI, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
}

// Changes the firing angle preview, the linear-function equivalent, and the on-battlefield preview
// to reflect changes to the numerator or denominator of the slope
function changeSlope() {
  updateFunction();
  drawSlopePreview();
  drawBattlefield(false, true);
}

// Changes the linear-function equivalent and the on-battlefield preview to reflect changes to the intercept
function changeIntercept() {
  updateFunction();
  drawBattlefield(false, true);
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
  for (let enemy of enemies) {
    let dx = event.offsetX - fieldToCanvasX(enemy.x);
    let dy = event.offsetY - fieldToCanvasY(enemy.y);
    if (dx * dx + dy * dy <= enemy.radiusPixels * enemy.radiusPixels) {
      // TODO: update to provide more information about the enemy, and maybe be able to handle multiple overlapping enemies
      message += " with an enemy of radius " + canvasToFieldDistance(enemy.radiusPixels).toFixed(2)
        + " and speed " + enemy.speed
        + " at (" + enemy.x + ", " + enemy.y + ")";
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
  let advisoryHTML = "<table>";
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
      advisoryHTML += '<tr style="opacity:' + opacity + ';">';
    } else {
      advisoryHTML += "<tr>";
    }
    advisoryHTML += '<td><button'
      + ' onclick="advisories.splice(' + (advisories.length - distanceFromEnd) + ', 1); updateAdvisoryDisplay();"'
      + '>&#10060;</button></td>';
    advisoryHTML += "<td>" + advisoriesShown[i] + "</td></tr>";
  }
  advisoryHTML += "</table>";
  document.getElementById("advisory-queue").innerHTML = advisoryHTML;
}

function fireLazor() {
  // Button shouldn't be clickable if we're currently showing results
  // (need to wait to redraw new enemies before firing next shot)
  if (showingResults) {
    return;
  }

  for (let controlElementId of CONTROL_ELEMENT_IDS) {
    document.getElementById(controlElementId).disabled = true;
  }

  showingResults = true;
  cartIntercept = getNumber("intercept");
  cartSlope = getNumber("numerator") / getNumber("denominator");

  for (let enemy of enemies) {
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

  for (let controlElementId of CONTROL_ELEMENT_IDS) {
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

  // Have surviving enemies move (unless we're in one of the "safe" stages)
  if (!currentStage.safe) {
    let newThreats = 0;
    for (let enemy of enemies) {
      // Skip any enemies that are already at the rail
      // TODO: These enemies should instead damage the rail or move toward the cart
      if (enemy.threat) {
        continue;
      }
      // To make the calculations easier, we'll temporarily pretend that every enemy is on the right side of the map.
      let newX = Math.abs(enemy.x) - enemy.speed;
      if (newX <= RAIL_X_COORD) {
        // TODO: Determine whether the enemy has hit the cart or the rail; if the former, do different stuff here
        enemy.threat = 1;
        newX = RAIL_X_COORD;
        newThreats++;
      }
      enemy.x = enemy.x > 0 ? newX : -newX;
    }
    if (newThreats > 0) {
      // TODO: Update this message once close-range combat mechanics have been implemented
      let message = (newThreats === 1) ? "An enemy has" : (newThreats + " enemies have");
      message += " reached the railway! ";
      message += (newThreats === 1) ? "It" : "They";
      message += " should be damaging the rails, but that hasn't been implemented yet.";
      advisories.push(message);
      updateAdvisoryDisplay();
    }
  }
}

// Spawn new enemies according to the rules of the current game stage
function spawnEnemies() {
  let spawned = [];
  for (let enemyType of currentStage.spawn()) {
    spawned.push(spawnEnemy(enemyType));
  }

  if (currentStage.checkSpawns) {
    currentStage.checkSpawns(spawned);
  }
}

// Spawn a single new enemy of the given type.
// The spawned enemy will be added to the list of enemies, and also returned from this function.
function spawnEnemy(enemyType) {
  let enemy = {
    type: enemyType,
    radiusPixels: randomFromRealRange(enemyType.minRadiusPixels, enemyType.maxRadiusPixels),
    health: enemyType.startingHealth,
  };

  // Choose speed and x-position until we have an x-position where the lazor can hit the enemy at SOME y.
  // TODO: Consider whether this needs to be modified to ensure the enemy doesn't require an unhittable slope
  //       (For example, if the slope needs to be approximately 13.5, you can't get closer than 13 or 14 if the controls have a range of 20)

  // First, we do some calculations that don't change depending on the random parts of the spawning process.
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

  // Now that we have the values calculated above, we'll randomize the enemy, then repeat if it can't be hit.
  let minY, maxY;
  do {
    enemy.speed = randomFromIntegerRange(Math.ceil(2 * enemyType.minSpeed), Math.floor(2 * enemyType.maxSpeed)) / 2;

    let distanceOfEntry = randomFromIntegerRange(0, Math.floor(enemy.speed));
    // 50/50 chance of spawning on either the left or the right side
    if (Math.random() < 0.5) {
      enemy.x = FIELD_H_SPAN - distanceOfEntry;
    } else {
      enemy.x = distanceOfEntry - FIELD_H_SPAN;
    }

    // If x > 0, then the most positive slope produces the most positive possible y-coordinate for the spawned enemy,
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
  return enemy;
}

// Ensures that both of the given enemies can be hit with one shot.
// If it's already possible to do so, this function simply verifies that,
// but if not, then it will change their location to make that possible.
function ensureCombo(enemy1, enemy2) {
  // If the two enemies are on opposite sides of the cart,
  // then a straight line between them will definitely intersect the railway
  // at some point on the battlefield, so we don't need to do anything.
  if ((enemy1.x >= 0) !== (enemy2.x >= 0)) {
    return;
  }
  // If the two enemies are at the same location,
  // then any line passing through the smaller will also hit the larger,
  // so we don't need to do anything to make sure they can both be hit.
  if (enemy1.x === enemy2.x && enemy1.y === enemy2.y) {
    return;
  }

  // If the two enemies are in a vertical line, we have to nudge one of them sideways.
  if (enemy1.x === enemy2.x) {
    // Decide which enemy to nudge by flipping a coin
    let enemyToNudge = randomFromOptions(enemy1, enemy2);
    // Nudge the chosen enemy one unit farther away from the center.
    // (Nudging it closer might risk pushing the difficulty higher than we want.)
    enemyToNudge.x += enemyToNudge.x >= 0 ? 1 : -1;
  }

  // Now that we know the two enemies are at different x-coordinates,
  // we can check where a line through their centers would intersect the railway.
  // If that intersection point is beyond the limits of the battlefield,
  // we'll randomly nudge one of the enemies' y-coordinates toward the other
  // until the line between them hits the railway within the battlefield.
  let b = calculateIntercept(enemy1, enemy2);
  while (b < -FIELD_V_SPAN || b > FIELD_V_SPAN) {
    let enemyToNudge = randomFromOptions(enemy1, enemy2);
    // To determine which way we have to move our randomly chosen enemy,
    // we need to determine whether it's higher or lower than the other.
    // Rather than try to figure out whether we've chosen enemy1 or enemy2,
    // we'll just compare to a point halfway between the two enemies,
    // since moving toward that midpoint will be the same as moving toward
    // the other of the two enemies.
    let vMidpoint = (enemy1.y + enemy2.y) / 2;
    enemyToNudge.y += enemyToNudge.y >= vMidpoint ? -1 : 1;

    b = calculateIntercept(enemy1, enemy2);
  }

  // TODO: Consider double-checking if the controls can actually be set to
  // values that make the LAZOR pass within the margin of error for both enemies
}

// Given two objects which have fields named "x" and "y",
// calculates the y-intercept of a line passing through
// both points (obj1.x, obj1.y) and (obj2.x, obj2.y).
// If the two points are the same or lie on a vertical line, returns NaN.
function calculateIntercept(obj1, obj2) {
  let run = obj2.x - obj1.x;
  if (run === 0) {
    return NaN;
  }
  let rise = obj2.y - obj1.y;
  let slope = rise / run;
  return obj1.y - slope * obj1.x;
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
  let distanceLimit = canvasToFieldDistance(enemy.radiusPixels + LAZOR_BEAM_WIDTH_PIXELS / 2);
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

// Returns a randomly chosen one of its arguments.
function randomFromOptions(...options) {
  return options[Math.floor(Math.random() * options.length)];
}
