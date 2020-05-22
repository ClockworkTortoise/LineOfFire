function drawBattlefield() {
  let ctx = document.getElementById("battlefield").getContext("2d");
  ctx.clearRect(0, 0, 400, 400);
  let slope = getValue("numerator") / getValue("denominator");
  let intercept = getValue("intercept");

  // Railway and height labels
  ctx.strokeStyle = "#404040";
  ctx.lineWidth = 2;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "black";
  ctx.font = "12px Arial";
  ctx.beginPath();
  ctx.moveTo(190, 0);
  ctx.lineTo(190, 400);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(210, 0);
  ctx.lineTo(210, 400);
  ctx.stroke();
  for (let y = 0; y <= 400; y += 10) {
    ctx.beginPath();
    ctx.moveTo(187, y);
    ctx.lineTo(213, y);
    ctx.stroke();
    if (y % 50 == 0) {
      ctx.fillText(200 - y, 220, y);
    }
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
