// main - this color a large background, base - this color for dot border,
// secondary - this color for date's background

const categoryData = {
  amountYear: 100,
  arrayData: [
    {
      category: 'Kindheit & Jugend',
      colors: { main: '#f8ecb2', secondary: '#e4d28e', base: '#ebcc3c' },
      date: { from: 1930, to: 1944 },
    },
    {
      category: 'Flucht',
      colors: { main: '#fccb8e', secondary: '#e6b26f', base: '#e78b0a' },
      date: { from: 1944, to: 1945 },
    },
    {
      category: 'Ausbildung',
      colors: { main: '#f5aea8', secondary: '#e29d93', base: '#e25d60' },
      date: { from: 1945, to: 1958 },
    },
    {
      category: 'Familiengründung',
      colors: { main: '#c4a5a3', secondary: '#a88b85', base: '#825251' },
      date: { from: 1958, to: 1962 },
    },
    {
      category: 'Familie & Firma',
      colors: { main: '#c2cebd', secondary: '#a5b19e', base: '#7b9376' },
      date: { from: 1962, to: 1982 },
    },
    {
      category: 'Witwe',
      colors: { main: '#b9bac9', secondary: '#9a9bb1', base: '#686c91' },
      date: { from: 1982, to: 1986 },
    },
    {
      category: 'Witwe & Großmutter',
      colors: { main: '#dbc6da', secondary: '#bb9cbb', base: '#a1659f' },
      date: { from: 1986, to: 2016 },
    },
    {
      category: '',
      colors: { main: '#dde2e1', secondary: '#ced2d0', base: '#c0c9ce' },
      date: { from: 2016, to: 2030 },
    },
  ],
};

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

drawCircleWithOneColor((canvas.width - 50) / 2, canvas.width * (0.038 / 2), '#EAE9EB');
drawCircleWithOneColor(radius, canvas.width * (0.036 / 2), '#F2F2F2');

const deg = 360;
drawTriangle();

let img = new Image();
img.src = 'images/image.jpg';
let imgSize = radius;
let imgX = centerX - imgSize / 2;
let imgY = centerY - imgSize / 2;
img.onload = function () {
  ctx.drawImage(img, imgX, imgY, imgSize, imgSize);
};

const endAngleLittleCircle = startAngle + 4 * Math.PI;
ctx.beginPath();
ctx.arc(centerX, centerY, imgSize / 2, startAngle, endAngleLittleCircle);
ctx.lineWidth = 10;
ctx.strokeStyle = '#FFFFFF';
ctx.stroke();
ctx.restore();
ctx.clip();

drawDotsForBigCircle();

function drawDotsForBigCircle() {
  const { arrayData, amountYear } = categoryData;
  let numberOfPoints = amountYear;
  let divisions = 2;
  let angleStep = (endAngle - startAngle) / numberOfPoints;
  let adjustedStartAngle = startAngle + angleStep / divisions;
  const firstDate = arrayData[0].date.from;
  const lastDate = arrayData[categoryData.arrayData.length - 1].date.to;
  const numberOfYears = lastDate - firstDate;

  for (let i = firstDate; i < lastDate; i++) {
    const angle = adjustedStartAngle + (i - firstDate) * angleStep;
    const dateX = centerX + (radius - canvas.width * 0.014) * Math.cos(angle);
    const dateY = centerY + (radius - canvas.width * 0.014) * Math.sin(angle);
    const fontSizeDate = canvas.width * 0.008;
    const dotX = centerX + (radius + canvas.width * 0.0046) * Math.cos(angle);
    const dotY = centerY + (radius + canvas.width * 0.0046) * Math.sin(angle);
    const dotSize = canvas.width * (0.012 / 2);
    const borderWidth = 2.5;
    let bgColor;
    let borderColor;

    arrayData.map((item) => {
      if (item.date.to >= i && item.date.from <= i) {
        bgColor = item.colors.main;
        borderColor = item.colors.secondary;
      }
    });

    drawOneDot('dot--lg', dotX + dotSize / 2, dotY, dotSize, canvasWrapper, bgColor, borderColor, borderWidth);
    addTextForCircle(
      dateX - dotSize / 4,
      dateY - dotSize / 4,
      fontSizeDate,
      numberOfYears,
      angle,
      canvasWrapper,
      i,
      firstDate
    );
  }
}

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function drawTriangle() {
  const { arrayData } = categoryData;
  let startingAngle = -Math.PI / 2;

  for (let i = 0; i < arrayData.length; i++) {
    const year = arrayData[i].date.to === arrayData[i].date.from ? 1 : arrayData[i].date.to - arrayData[i].date.from;
    let interval = (year * deg) / 100;
    let arcSize = degreesToRadians(interval);
    let endingAngle = startingAngle + arcSize;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startingAngle, endingAngle, false);
    ctx.fillStyle = arrayData[i].colors.base;
    ctx.lineTo(centerX, centerY);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius - 3, startingAngle, endingAngle, false);
    ctx.fillStyle = arrayData[i].colors.secondary;
    ctx.lineTo(centerX, centerY);
    ctx.fill();
    ctx.closePath();

    const mainSizeRadius = canvas.width * 0.027;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius - mainSizeRadius, startingAngle, endingAngle, false);
    ctx.fillStyle = arrayData[i].colors.main;
    ctx.lineTo(centerX, centerY);
    ctx.fill();
    ctx.closePath();

    startingAngle = endingAngle;
  }
}

function drawCircleWithOneColor(radius, lineWidth, strokeStyle) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
}

function addTextForCircle(x, y, fontSize, numberOfPoints, angle, parent, index, firstDate) {
  const el = document.createElement('span');
  el.innerHTML = index;
  el.classList.add('number');
  el.style.fontSize = `${fontSize}px`;
  el.style.top = `${y - fontSize / 2}px`;
  el.style.left = `${x - fontSize}px`;
  const i = index - firstDate;

  if (i < numberOfPoints / 2) {
    el.style.transform = `rotate(${angle}rad)`;
  } else {
    el.style.transform = `rotate(${angle + Math.PI}rad)`;
  }

  parent.appendChild(el);
}

function drawOneDot(className, x, y, size, parent, bgColor, borderColor, borderWidth) {
  const el = document.createElement('span');
  el.classList.add(className);
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.background = `${bgColor}`;
  el.style.borderStyle = 'solid';
  el.style.borderColor = `${borderColor}`;
  el.style.top = `${y - size / 2}px`;
  el.style.left = `${x - size}px`;

  if (canvas.width > 1200) {
    el.style.borderWidth = `${borderWidth}px`;
  } else {
    el.style.borderWidth = `${borderWidth / 2}px`;
  }

  parent.appendChild(el);
}
