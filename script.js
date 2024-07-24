let canvas = document.getElementById('canvas');
const canvasWrapper = document.querySelector('.canvas-wrapper');
let ctx = canvas.getContext('2d');

const numberDivisibleForCanvasSize = 2;
canvas.width = window.innerWidth;
canvas.height = window.innerWidth;

let centerX = canvas.width / 2;
let centerY = canvas.height / 2;
let radius = canvas.width / 3.5;
let startAngle = -Math.PI / 2;
let endAngle = startAngle + 2 * Math.PI;

drawCircleWithOneColor((canvas.width - 50) / 2, canvas.width * (0.034 / 2), '#EAE9EB');
drawCircleWithOneColor(radius, canvas.width * (0.028 / 2), '#F2F2F2');

const deg = 360;

const arrayInterval = [
  { color: '#F8ECB2', int: (15 * deg) / 100 },
  { color: '#FCCB8E', int: (1 * deg) / 100 },
  { color: '#F5AEA8', int: (13 * deg) / 100 },
  { color: '#C4A5A3', int: (4 * deg) / 100 },
  { color: '#C2CEBD', int: (19 * deg) / 100 },
  { color: '#B9BAC9', int: (4 * deg) / 100 },
  { color: '#DBC6DA', int: (31 * deg) / 100 },
  { color: '#DDE2E1', int: (13 * deg) / 100 },
];

draw();
drawDots();

let img = new Image();
img.src = 'images/image.jpg';
let imgSize = radius;
let imgX = centerX - imgSize / 2;
let imgY = centerY - imgSize / 2;
img.onload = function () {
  ctx.drawImage(img, imgX, imgY, imgSize, imgSize);
};

endAngle = startAngle + 4 * Math.PI;
ctx.beginPath();
ctx.arc(centerX, centerY, imgSize / 2, startAngle, endAngle);
ctx.lineWidth = 10;
ctx.strokeStyle = '#FFFFFF';
ctx.stroke();
ctx.restore();
ctx.clip();

function drawDots() {
  let numberOfPoints = 75;
  let divisions = 2;
  let angleStep = (endAngle - startAngle) / numberOfPoints;
  startAngle = startAngle + angleStep / divisions;

  for (let i = 0; i < numberOfPoints; i++) {
    let angle = startAngle + i * angleStep;
    x = centerX + (radius - canvas.width * 0.012) * Math.cos(angle);
    y = centerY + (radius - canvas.width * 0.012) * Math.sin(angle);

    const el = document.createElement('span');
    let font = canvas.width * 0.008;
    el.innerHTML = '1933';
    el.classList.add('date');
    el.style.fontSize = `${font}px`;
    el.style.top = `${y - font / 2}px`;
    el.style.left = `${x - font}px`;

    if (i < numberOfPoints / 2) {
      el.style.transform = `rotate(${angle}rad)`;
    } else {
      el.style.transform = `rotate(${angle + Math.PI}rad)`;
    }
    canvasWrapper.appendChild(el);

    x = centerX + (radius + canvas.width * 0.003) * Math.cos(angle);
    y = centerY + (radius + canvas.width * 0.003) * Math.sin(angle);
    ctx.beginPath();

    if (canvas.width > 1200) {
      ctx.lineWidth = 3;
    } else {
      ctx.lineWidth = 1.5;
    }

    ctx.arc(x, y, canvas.width * (0.0037 / 2), startAngle, endAngle);
    ctx.strokeStyle = '#333333';
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.fill();
  }
}

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function draw() {
  let startingAngle = -Math.PI / 2;

  for (let i = 0; i < arrayInterval.length; i++) {
    let interval = arrayInterval[i].int;
    let arcSize = degreesToRadians(interval);
    let endAngle = startingAngle + arcSize;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startingAngle, endAngle, false);
    ctx.lineTo(centerX, centerY);
    ctx.fillStyle = arrayInterval[i].color;
    ctx.fill();
    ctx.closePath();

    startingAngle = endAngle;
  }
}

function drawCircleWithOneColor(radius, lineWidth, strokeStyle) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
}
