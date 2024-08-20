class CanvasDrawer {
  constructor(canvasId, wrapperSelector, imageSelector, data) {
    this.canvasId = canvasId;
    this.wrapperSelector = wrapperSelector;
    this.imageSelector = imageSelector;
    this.svgNS = 'http://www.w3.org/2000/svg';
    this.data = data;
    this.eventElements = [];
    this.iconElements = [];
    this.eventTextPositions = new Map();
    this.eventIconPositions = new Map();
    this.textDimensions = new Map();
    this.arrows = [];
    this.isOuterIcon = true;
    this.clockAngles = {
      '12:00': -Math.PI / 2,
      '12:30': -Math.PI / 2 + Math.PI / 12,
      '12:45': -Math.PI / 2 + (3 * Math.PI) / 12,
      '1:00': -Math.PI / 3,
      '1:30': -Math.PI / 3 + Math.PI / 12,
      '2:00': -Math.PI / 6,
      '2:30': -Math.PI / 6 + Math.PI / 12,
      '2:40': -Math.PI / 6 + (8 * Math.PI) / 72,
      '2:45': -Math.PI / 6 + (3 * Math.PI) / 12,
      '4:30': Math.PI / 6,
      '4:40': (7 * Math.PI) / 18,
      '4:45': Math.PI / 6 + (3 * Math.PI) / 12,
      '5:00': (5 * Math.PI) / 12,
      '5:30': Math.PI / 3 + Math.PI / 12,
      '6:00': Math.PI / 2,
      '6:30': Math.PI / 2 + Math.PI / 12,
      '7:00': (7 * Math.PI) / 6,
      '7:20': (2 * Math.PI) / 3,
      '7:25': (11 * Math.PI) / 18,
      '7:30': (5 * Math.PI) / 6,
      '7:15': (2 * Math.PI) / 3 + Math.PI / 12,
      '9:00': Math.PI,
      '9:15': Math.PI + Math.PI / 12,
      '9:20': Math.PI + (4 * Math.PI) / 72,
      '9:30': Math.PI + Math.PI / 12,
      '10:00': (7 * Math.PI) / 6,
      '10:30': (7 * Math.PI) / 6 + Math.PI / 12,
      '10:40': (7 * Math.PI) / 6 + (8 * Math.PI) / 72,
      '11:00': (4 * Math.PI) / 3,
      '11:15': (4 * Math.PI) / 3 + Math.PI / 12,
      '11:30': (4 * Math.PI) / 3 + Math.PI / 12,
      '11:59': -Math.PI / 2 - Math.PI / 1800,
    };

    this.initialize();
  }

  async initialize() {
    await this.domReady();

    this.canvas = document.getElementById(this.canvasId);
    this.canvasWrapper = document.querySelector(this.wrapperSelector);
    this.image = document.querySelector(this.imageSelector);
    this.ctx = this.canvas.getContext('2d');

    this.setCanvasSize();
    this.calculateDimensions();

    await this.resourcesReady();

    this.init();
  }

  domReady() {
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
      } else {
        resolve();
      }
    });
  }

  resourcesReady() {
    return new Promise((resolve) => {
      window.addEventListener('load', resolve);
    });
  }

  handleResize() {
    this.setCanvasSize();
    this.calculateDimensions();
    this.init();
  }

  setCanvasSize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerWidth;
  }

  calculateDimensions() {
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.radiusLarge = this.canvas.width - 100;
    this.radius = this.radiusLarge / 3.5;
    this.startAngle = this.clockAngles['12:00'];
    this.endAngle = this.startAngle + 2 * Math.PI;
    this.deg = 360;
    this.maxSpacing = this.canvas.width * 0.005;
    this.minSpacing = this.canvas.width * 0.003;
  }

  init() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawInitialCircles();
    this.drawTriangle();
    this.setImagePosition();
    this.drawOverlappingCircles();
    this.drawNumForCircle();
    this.drawTextForCategories();
    this.drawDotsYearDateIcons();
    this.positionEvents();
    this.drawUpperText(this.data.title);
    this.drawArrowsForEvents();
  }

  // Implemented Events
  positionEvents() {
    const { events, start_date, round_year } = this.data;
    const startYear = new Date(start_date).getFullYear();
    const totalYears = round_year.value;
    const midYear = startYear + Math.floor(totalYears * 0.52);
    const leftEvents = events
      .filter((event) => event.date_parts.year >= midYear)
      .sort((a, b) => b.date_parts.year - a.date_parts.year);
    const rightEvents = events
      .filter((event) => event.date_parts.year < midYear)
      .sort((a, b) => a.date_parts.year - b.date_parts.year);

    this.eventElements = [];
    this.positionEventsOnSide(leftEvents, true);
    this.positionEventsOnSide(rightEvents, false);
  }

  positionEventsOnSide(events, isLeft) {
    const startAngle = isLeft ? this.clockAngles['10:40'] : this.clockAngles['1:00'];
    const endAngle = this.clockAngles['6:00'];
    const angleStep = (endAngle - startAngle) / events.length;
    const leftRadiusX = this.canvas.width * 0.16;
    const rightRadiusX = this.canvas.width * 0.03;
    const radiusY = this.canvas.width * 0.03;
    const radiusOffset = isLeft ? leftRadiusX : rightRadiusX;
    const heightOffset = isLeft ? radiusY * 2 : radiusY;

    let lastY = null;

    const topY = this.centerY + this.radius * Math.sin(this.clockAngles[isLeft ? '11:59' : '12:00']);
    const bottomY = this.centerY + this.radius * Math.sin(this.clockAngles[isLeft ? '10:30' : '1:00']);
    const nineTwoY = this.centerY + this.radius * Math.sin(this.clockAngles[isLeft ? '9:20' : '2:40']);
    const twelveY = this.centerY + this.radius * Math.sin(this.clockAngles['12:00']);
    const twoY = this.centerY + this.radius * Math.sin(this.clockAngles['2:00']);
    const elevenLastY = this.centerY + this.radius * Math.sin(this.clockAngles['11:59']);
    const tenY = this.centerY + this.radius * Math.sin(this.clockAngles['10:00']);

    events.forEach((event, index) => {
      const angle = startAngle + index * angleStep;
      let x = this.centerX + (this.radius + radiusOffset) * Math.cos(angle);
      let y = this.centerY + (this.radius + heightOffset) * Math.sin(angle);

      if (lastY !== null) {
        y = Math.max(y, lastY + this.minSpacing);
      }

      const eventElement = this.createEventElement(event, x, y);
      this.canvasWrapper.appendChild(eventElement);

      let overlap = true;

      while (overlap) {
        overlap = false;
        for (let i = 0; i < this.eventElements.length; i++) {
          if (this.checkOverlap(this.eventElements[i], eventElement)) {
            y = Math.max(y + this.minSpacing, this.eventElements[i].getBoundingClientRect().bottom + this.minSpacing);
            eventElement.style.top = `${y}px`;
            overlap = true;
            break;
          }
        }
      }

      const offsetX = this.canvas.width * 0.03;
      const additionalOffset = this.canvas.width * 0.02;
      const offsetXForAngle715 = this.canvas.width * 0.05;
      let eventWidth = this.canvas.width * 0.127;

      const angle445 = this.clockAngles['4:30'];
      const angle715 = this.clockAngles['7:30'];

      if (angle >= angle445 && angle <= angle715) {
        eventWidth *= isLeft ? 1.5 : 1.3;
        x += isLeft ? -offsetXForAngle715 : 0;
      } else if (y >= topY && y <= bottomY) {
        x += isLeft ? -offsetX : offsetX;
      } else if (y >= bottomY && y <= nineTwoY) {
        x += isLeft ? 0 : -additionalOffset;
      }

      if (y >= twelveY && y <= twoY) {
        x += isLeft ? -additionalOffset : additionalOffset;
      }

      if (y >= elevenLastY && y <= tenY) {
        x += !isLeft ? additionalOffset : -additionalOffset;
      }

      eventElement.style.left = `${x}px`;
      eventElement.style.width = `${eventWidth}px`;

      if (!isLeft) {
        eventElement.style.textAlign = 'right';
      }

      const rect = eventElement.getBoundingClientRect();
      lastY = rect.bottom;

      this.eventElements.push(eventElement);
      this.eventTextPositions.set(event.id, { x, y });
      this.textDimensions.set(event.id, { width: rect.width, height: rect.height });
    });
  }

  createEventElement(event, x, y) {
    const fontSize = this.canvas.width * 0.009;

    const dateElement = document.createElement('span');
    dateElement.textContent = `${event.date}`;
    dateElement.className = 'event-date';
    dateElement.style.background = `#${event.category.colors.secondary_color}`;

    const textElement = document.createElement('span');
    textElement.textContent = `${event.text}`;

    const eventElement = document.createElement('div');
    eventElement.className = 'event';
    eventElement.style.position = 'absolute';
    eventElement.style.left = `${x}px`;
    eventElement.style.top = `${y}px`;
    eventElement.style.fontSize = `${fontSize}px`;
    eventElement.style.width = `${this.canvas.width * 0.127}px`;
    eventElement.style.zIndex = '70';

    eventElement.appendChild(dateElement);
    eventElement.appendChild(textElement);

    return eventElement;
  }

  checkOverlap(element1, element2) {
    if (!element1 || !element2) return false;

    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return !(
      rect1.bottom + this.minSpacing <= rect2.top ||
      rect1.top >= rect2.bottom + this.minSpacing ||
      rect1.right < rect2.left ||
      rect1.left > rect2.right
    );
  }
  // end Events

  // Implemented Name Text
  drawUpperText(text) {
    const svg = document.createElementNS(this.svgNS, 'svg');
    svg.setAttribute('width', this.canvas.width);
    svg.setAttribute('height', this.canvas.height);
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.zIndex = '50';

    const path = document.createElementNS(this.svgNS, 'path');
    const startAngle = this.clockAngles['11:00'];
    const endAngle = this.clockAngles['1:00'];
    let radiusDistance = this.canvas.width * 0.06;

    if (text.length > 15) {
      radiusDistance += this.canvas.width * 0.015;
    }

    const radius = this.radius + radiusDistance;
    const startX = this.centerX + radius * Math.cos(startAngle);
    const startY = this.centerY + radius * Math.sin(startAngle);
    const endX = this.centerX + radius * Math.cos(endAngle);
    const endY = this.centerY + radius * Math.sin(endAngle);

    const largeArcFlag = endAngle - startAngle <= Math.PI ? '0' : '1';

    path.setAttribute('d', `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`);
    path.setAttribute('fill', 'none');
    svg.appendChild(path);

    const svgText = document.createElementNS(this.svgNS, 'text');
    svgText.setAttribute('text-anchor', 'middle');

    const textPath = document.createElementNS(this.svgNS, 'textPath');
    textPath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#upperTextPath');
    textPath.setAttribute('startOffset', '50%');

    svgText.appendChild(textPath);

    const tspan = document.createElementNS(this.svgNS, 'tspan');
    tspan.textContent = text;
    const fontSize = this.canvas.width * 0.5;
    const colorFont = this.data.color_scheme.subject_title_color;
    tspan.setAttribute('font-size', `${fontSize}px`);
    tspan.setAttribute('line-height', `${fontSize}px`);
    tspan.setAttribute('font-family', `${this.data.font_family.name}`);
    tspan.setAttribute('fill', colorFont);

    textPath.appendChild(tspan);

    path.id = 'upperTextPath';
    svg.appendChild(svgText);

    this.canvasWrapper.appendChild(svg);

    this.adjustFontSize(tspan, path, colorFont);
  }

  adjustFontSize(tspan, path, colorFont) {
    let fontSize = this.canvas.width * 0.15;
    const maxWidth = path.getTotalLength() * 0.9;
    const originalText = tspan.textContent;
    let isSplit = false;

    const splitTextIfNeeded = () => {
      const words = originalText.split(' ');
      let lines = [''];
      let currentLine = 0;

      for (let word of words) {
        if (lines[currentLine].length + word.length + (lines[currentLine] ? 1 : 0) > 15) {
          if (currentLine === 0) {
            currentLine++;
            lines.push('');
          }
        }
        lines[currentLine] += (lines[currentLine] ? ' ' : '') + word;
        if (lines[currentLine].length > 15 && currentLine < 2) {
          currentLine++;
          lines.push('');
        }
      }

      lines = lines.filter((line) => line !== '');
      if (lines.length > 3) {
        lines[2] = lines.slice(2).join(' ');
        lines = lines.slice(0, 3);
      }

      return lines;
    };

    const applyText = (lines) => {
      tspan.textContent = lines[0];
      const tspans = [tspan];

      for (let i = 1; i < lines.length; i++) {
        const newTspan = document.createElementNS(this.svgNS, 'tspan');
        newTspan.textContent = lines[i];
        newTspan.setAttribute('x', '0');
        newTspan.setAttribute('dy', '1.1em');
        tspan.parentNode.appendChild(newTspan);
        tspans.push(newTspan);
      }

      fontSize *= lines.length === 3 ? 0.95 : lines.length === 2 ? 0.98 : 1;

      tspans.forEach((t) => {
        t.setAttribute('font-size', `${fontSize}px`);
        t.setAttribute('font-family', `${this.data.font_family.name}`);
        tspan.setAttribute('line-height', `${fontSize}px`);
        t.setAttribute('fill', colorFont);
      });

      if (lines.length > 1) {
        tspan.setAttribute('dy', `-${(lines.length - 1) * 0.55}em`);
      }

      return tspans;
    };

    const lines = splitTextIfNeeded();
    isSplit = lines.length > 1;
    let tspans = applyText(lines);

    while (tspans.some((t) => t.getComputedTextLength() > maxWidth / lines.length) && fontSize > 20) {
      fontSize--;
      tspans.forEach((t) => t.setAttribute('font-size', `${fontSize}px`));
    }

    const textPath = tspan.parentNode;
    textPath.setAttribute('startOffset', '50%');
    tspans.forEach((t) => t.setAttribute('x', '0'));
  }
  // end Name Text

  // Implemented one color draw circle
  drawInitialCircles() {
    this.drawCircleWithOneColor(this.radiusLarge / 2, this.canvas.width * 0.019, '#EAE9EB');
    this.drawCircleWithOneColor(this.radius, this.canvas.width * 0.018, '#F2F2F2');
  }
  // end one color draw circle

  // Implemented Image Position
  setImagePosition() {
    this.image.style.left = `${this.centerX - this.radius / 2}px`;
    this.image.style.top = `${this.centerY - this.radius / 2}px`;
    this.image.style.width = `${this.radius}px`;
    this.image.style.height = `${this.radius}px`;
    this.image.alt = this.data.title;
  }
  // end Image Position

  // Implemented Draw Opacity Circles With White Color
  drawOverlappingCircles() {
    const mainSizeRadiusOpacity = {
      0.06: this.canvas.width * 0.02,
      0.04: this.canvas.width * 0.04,
      0.02: this.canvas.width * 0.066,
    };
    const whiteColor = '#ffffff';
    const opacities = {
      0.02: '33',
      0.04: '66',
      0.06: '99',
    };

    for (const [opacity, size] of Object.entries(mainSizeRadiusOpacity)) {
      this.drawCircleWithOneColor(this.radius / 2, size, `${whiteColor}${opacities[opacity]}`);
    }
  }
  // end Draw Opacity Circles With White Color

  // Implemented Draw Triangle Canvas
  drawTriangle() {
    const { events, start_date, end_date, round_year, color_scheme } = this.data;
    const startYear = new Date(start_date).getFullYear();
    const endYear = new Date(end_date).getFullYear();
    const totalYears = round_year.value;
    const maxYear = startYear + totalYears;

    let startingAngle = this.clockAngles['12:00'];
    const fullCircle = 2 * Math.PI;
    const degreePerYear = fullCircle / totalYears;

    const groupedEvents = this.groupEventsByCategory(events);

    let currentYear = startYear;
    const radiusForPrimaryColor = this.radius - 2;
    const radiusForMainColor = this.radius - this.canvas.width * 0.024;

    groupedEvents.forEach((group, index) => {
      const category = group[0].category;
      const groupStartYear = Math.max(group[0].date_parts.year, startYear);
      let nextGroupStartYear;

      if (index === groupedEvents.length - 1) {
        nextGroupStartYear = endYear + 1;
      } else {
        nextGroupStartYear = Math.min(groupedEvents[index + 1][0].date_parts.year, endYear + 1);
      }

      if (currentYear < groupStartYear) {
        const gapYears = groupStartYear - currentYear;
        const gapArcSize = gapYears * degreePerYear;
        const gapEndingAngle = startingAngle + gapArcSize;

        this.drawArcSegment(startingAngle, gapEndingAngle, `#${color_scheme.colors.secondary_color}`);
        this.drawArcSegment(
          startingAngle,
          gapEndingAngle,
          `#${color_scheme.colors.primary_color}`,
          radiusForPrimaryColor
        );
        this.drawArcSegment(startingAngle, gapEndingAngle, `#${color_scheme.colors.main_color}`, radiusForMainColor);

        startingAngle = gapEndingAngle;
      }

      const categoryYears = nextGroupStartYear - Math.max(groupStartYear, currentYear);
      const arcSize = categoryYears * degreePerYear;
      const endingAngle = startingAngle + arcSize;

      this.drawArcSegment(startingAngle, endingAngle, `#${category.colors.secondary_color}`);
      this.drawArcSegment(startingAngle, endingAngle, `#${category.colors.primary_color}`, radiusForPrimaryColor);
      this.drawArcSegment(startingAngle, endingAngle, `#${category.colors.main_color}`, radiusForMainColor);

      startingAngle = endingAngle;
      currentYear = nextGroupStartYear;
    });

    if (currentYear < maxYear) {
      const remainingYears = maxYear - currentYear;
      const remainingArcSize = remainingYears * degreePerYear;
      const finalEndingAngle = startingAngle + remainingArcSize;

      this.drawArcSegment(startingAngle, finalEndingAngle, `#${color_scheme.colors.secondary_color}`);
      this.drawArcSegment(
        startingAngle,
        finalEndingAngle,
        `#${color_scheme.colors.primary_color}`,
        radiusForPrimaryColor
      );
      this.drawArcSegment(startingAngle, finalEndingAngle, `#${color_scheme.colors.main_color}`, radiusForMainColor);
    }
  }

  drawArcSegment(startAngle, endAngle, color, radius = this.radius) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.centerX, this.centerY);
    this.ctx.arc(this.centerX, this.centerY, radius, startAngle, endAngle, false);
    this.ctx.fillStyle = color;
    this.ctx.lineTo(this.centerX, this.centerY);
    this.ctx.fill();
    this.ctx.closePath();
  }
  // end Draw Triangle Canvas

  // Implemented Draw Year Date and Icons
  drawDotsYearDateIcons() {
    const { start_date, end_date, round_year, events, color_scheme } = this.data;
    const divisions = 2;
    const angleStep = (this.endAngle - this.startAngle) / round_year.value;
    const adjustedStartAngle = this.startAngle + angleStep / divisions;
    const firstDate = new Date(start_date).getFullYear();
    const lastDate = firstDate + (round_year.value - 1);

    for (let i = firstDate; i <= lastDate; i++) {
      const angle = adjustedStartAngle + (i - firstDate) * angleStep;
      const fontSizeDate = this.canvas.width * 0.006;
      const dateX = this.centerX + (this.radius - fontSizeDate * 2.2) * Math.cos(angle);
      const dateY = this.centerY + (this.radius - fontSizeDate * 2.2) * Math.sin(angle);
      const dotX = this.centerX + (this.radius + this.canvas.width * 0.0046) * Math.cos(angle);
      const dotY = this.centerY + (this.radius + this.canvas.width * 0.0046) * Math.sin(angle);
      const dotSize = this.canvas.width * 0.006;
      const dotSmallX = this.centerX + (this.radius / 2 + this.canvas.width * 0.016) * Math.cos(angle) + dotSize / 2;
      const dotSmallY = this.centerY + (this.radius / 2 + this.canvas.width * 0.016) * Math.sin(angle);
      const dotSmallSize = this.canvas.width * 0.0045;

      let { bgColor, borderColor } = this.getColorsForDate(i, events, color_scheme, end_date);

      this.drawOneDot('dot', dotX + dotSize / 2, dotY, dotSize, bgColor, borderColor);
      this.drawOneDot('dot', dotSmallX, dotSmallY, dotSmallSize, bgColor, borderColor, 1.5);
      this.writeYearDateForCircle(dateX, dateY, fontSizeDate, lastDate - firstDate, angle, i, firstDate);

      const yearEvents = this.getEventsForYear(i, events);

      if (yearEvents.length > 0) {
        yearEvents.forEach((event, index) => {
          const offsetAngle = angle + (index - (yearEvents.length - 1) / 2) * 0.02; // небольшое смещение для множественных событий
          this.drawEventIcon(event, offsetAngle);
        });
      }
    }
  }

  getColorsForDate(year, events, color_scheme, end_date) {
    const groupedEvents = this.groupEventsByCategory(events);
    const endYear = new Date(end_date).getFullYear();
    const whiteColor = '#FFFFFF';

    for (let i = 0; i < groupedEvents.length; i++) {
      const group = groupedEvents[i];
      const firstEvent = group[0];
      const lastEvent = group[group.length - 1];
      const categoryStartYear = firstEvent.date_parts.year;
      let categoryEndYear;

      if (i === groupedEvents.length - 1) {
        categoryEndYear = endYear;
      } else {
        categoryEndYear = this.getNextCategoryStartYear(lastEvent, groupedEvents) - 1;
      }

      if (year >= categoryStartYear && year <= categoryEndYear) {
        const event = this.getEventForYear(year, group);

        if (event) {
          return {
            bgColor: `#${event.category.colors.main_color}`,
            borderColor: `#${event.category.colors.secondary_color}`,
          };
        } else {
          if (year === endYear) {
            return {
              bgColor: `#${firstEvent.category.colors.main_color}`,
              borderColor: `#${firstEvent.category.colors.secondary_color}`,
            };
          }
          return {
            bgColor: whiteColor,
            borderColor: `#${firstEvent.category.colors.secondary_color}`,
          };
        }
      }
    }

    return {
      bgColor: whiteColor,
      borderColor: `#${color_scheme.colors.secondary_color}`,
    };
  }

  getNextCategoryStartYear(lastEventInCategory, groupedEvents) {
    const currentCategoryIndex = groupedEvents.findIndex((group) => group.includes(lastEventInCategory));
    if (currentCategoryIndex < groupedEvents.length - 1) {
      return groupedEvents[currentCategoryIndex + 1][0].date_parts.year;
    }

    return lastEventInCategory.date_parts.year + 1;
  }

  getEventsForYear(year, events) {
    return events.filter((event) => {
      const eventYear = event.date_parts ? event.date_parts.year : new Date(event.date).getFullYear();
      return eventYear === year;
    });
  }

  getEventForYear(year, events) {
    return events.find((event) => event.date_parts.year && event.date_parts.year === year);
  }

  drawOneDot(className, x, y, size, bgColor, borderColor, borderWidth = 2) {
    const dot = document.createElement('span');
    dot.classList.add(className);
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.background = bgColor;
    dot.style.borderColor = borderColor;
    dot.style.borderStyle = 'solid';
    dot.style.borderWidth = `${borderWidth}px`;
    dot.style.top = `${y - size / 2}px`;
    dot.style.left = `${x - size}px`;
    dot.style.position = 'absolute';
    dot.style.borderRadius = '50%';

    this.canvasWrapper.appendChild(dot);
  }

  writeYearDateForCircle(x, y, fontSize, numberOfPoints, angle, index, firstDate) {
    const el = document.createElement('span');
    el.innerHTML = index;
    el.classList.add('number');
    el.style.fontSize = `${fontSize}px`;
    el.style.top = `${y - fontSize / 2}px`;
    el.style.left = `${x - fontSize}px`;
    el.style.position = 'absolute';

    const year = index - firstDate;
    el.style.transform = `rotate(${year < numberOfPoints / 2 ? angle : angle + Math.PI}rad)`;

    this.canvasWrapper.appendChild(el);
  }

  drawEventIcon(event, angle) {
    const baseIconSize = this.canvas.width * 0.035;
    const outerRadiusAdd = this.canvas.width * 0.044;
    const innerRadiusAdd = this.canvas.width * 0.078; // Больше, чем outerRadiusAdd
    let iconSize = baseIconSize;
    let radiusAdd = this.isOuterIcon ? outerRadiusAdd : innerRadiusAdd;
    let iconX, iconY;
    let overlap = true;
    let attempts = 0;
    const maxAttempts = 20;
    const angleStep = 0.05;

    while (overlap && attempts < maxAttempts) {
      iconX = this.centerX + (this.radius - radiusAdd) * Math.cos(angle);
      iconY = this.centerY + (this.radius - radiusAdd) * Math.sin(angle);

      overlap = this.checkIconOverlap(iconX, iconY, iconSize);

      if (overlap) {
        angle += angleStep;
        if (attempts % 2 === 0) {
          this.isOuterIcon = !this.isOuterIcon;
          radiusAdd = this.isOuterIcon ? outerRadiusAdd : innerRadiusAdd;
        }
      }

      attempts++;
    }

    const iconElement = document.createElement('div');
    iconElement.classList.add('icon-circle');
    iconElement.style.width = `${iconSize}px`;
    iconElement.style.height = `${iconSize}px`;
    iconElement.style.position = 'absolute';
    iconElement.style.top = `${iconY - iconSize / 2}px`;
    iconElement.style.left = `${iconX - iconSize / 2}px`;
    iconElement.style.borderWidth = `${this.canvas.width * 0.0015}px`;
    iconElement.style.background = `#${event.category.colors.primary_color}`;

    const imgElement = document.createElement('img');
    imgElement.alt = event.icon.name;
    imgElement.src = event.icon.color;
    iconElement.appendChild(imgElement);

    this.canvasWrapper.appendChild(iconElement);
    this.iconElements.push({
      element: iconElement,
      x: iconX,
      y: iconY,
      size: iconSize,
      isOuter: this.isOuterIcon,
    });

    this.eventIconPositions.set(event.id, { x: iconX, y: iconY });

    // Переключаем флаг для следующей иконки
    this.isOuterIcon = !this.isOuterIcon;
  }

  checkIconOverlap(x, y, size) {
    for (const icon of this.iconElements) {
      const distance = Math.sqrt(Math.pow(x - icon.x, 2) + Math.pow(y - icon.y, 2));
      if (distance < (size + icon.size) / 2) {
        return true;
      }
    }
    return false;
  }
  // end Draw Year, Date and Icons

  // Implemented Number Years
  drawNumForCircle() {
    const { round_year } = this.data;
    const totalYears = round_year.value;

    const startAngle = this.clockAngles['12:00'] + Math.PI / totalYears;
    const endAngle = startAngle + 2 * Math.PI;
    const angleStep = (endAngle - startAngle) / totalYears;

    for (let i = 0; i < totalYears; i++) {
      const angle = startAngle + i * angleStep;
      const size = 0.006;
      const fontSizeYear = this.canvas.width * size;
      const fontSizeWidth = this.radius / 2 + fontSizeYear;
      const numberX = this.centerX + (fontSizeWidth - 2) * Math.cos(angle);
      const numberY = this.centerY + (fontSizeWidth - 2) * Math.sin(angle);
      const el = document.createElement('span');

      el.innerHTML = i;
      el.classList.add('number');
      el.style.fontSize = `${fontSizeYear}px`;
      el.style.top = `${numberY - fontSizeYear / 2}px`;
      el.style.left = `${numberX - fontSizeYear / 2}px`;
      el.style.transform = `rotate(${angle + this.clockAngles['6:00']}rad)`;
      el.style.fontWeight = '400';

      this.canvasWrapper.appendChild(el);
    }
  }
  // end Number Years

  // Implemented Draw Categories Text
  drawTextForCategories() {
    const { start_date, round_year, events, color_scheme } = this.data;
    const startAngle = this.clockAngles['12:00'];
    const endAngle = startAngle + 2 * Math.PI;
    const angleStep = (endAngle - startAngle) / round_year.value;

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', this.canvas.width);
    svg.setAttribute('height', this.canvas.height);
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.zIndex = '50';

    const groupedEvents = this.groupEventsByCategory(events);
    const startYear = new Date(start_date).getFullYear();

    const size = 0.01;
    const fontSize = this.canvas.width * size;
    const pathRadius = this.radius / 2 + fontSize * 2.5;

    const d = `M ${this.centerX} ${this.centerY - pathRadius} A ${pathRadius} ${pathRadius} 0 1 1 ${this.centerX} ${
      this.centerY + pathRadius
    } A ${pathRadius} ${pathRadius} 0 1 1 ${this.centerX} ${this.centerY - pathRadius}`;

    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('id', 'categoryPath');
    path.setAttribute('fill', 'none');
    svg.appendChild(path);

    let lastTextEndOffset = 0;

    groupedEvents.forEach((group) => {
      const category = group[0].category;
      const firstEvent = group[0];
      const from = firstEvent.date_parts.year;
      const startAnglePath = startAngle + (from - startYear) * angleStep;
      const startOffset = ((startAnglePath - startAngle) / (2 * Math.PI)) * 100;

      const text = document.createElementNS(svgNS, 'text');
      const textPath = document.createElementNS(svgNS, 'textPath');
      textPath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#categoryPath');
      textPath.setAttribute('startOffset', `${Math.max(startOffset, lastTextEndOffset) + 0.5}%`);
      textPath.textContent = category.name;
      textPath.style.fontSize = `${fontSize}px`;
      textPath.style.fill = `#${color_scheme.name === 'Dark' ? 'fff' : '333'}`;

      text.appendChild(textPath);
      svg.appendChild(text);

      const textLength = category.name.length * fontSize * 0.6;
      const pathLength = 2 * Math.PI * pathRadius;
      lastTextEndOffset = Math.max(startOffset, lastTextEndOffset) + (textLength / pathLength) * 100 + 2;
    });

    this.canvasWrapper.appendChild(svg);
  }
  // end Draw Categories Text

  // Implemented Draw Arrows
  drawArrowsForEvents() {
    // Группируем события по годам
    const eventsByYear = {};
    this.data.events.forEach((event) => {
      const year = event.date_parts.year;
      if (!eventsByYear[year]) {
        eventsByYear[year] = [];
      }
      eventsByYear[year].push(event);
    });

    Object.entries(eventsByYear).forEach(([year, events]) => {
      events.forEach((event, index) => {
        const textPosition = this.eventTextPositions.get(event.id);
        const iconPosition = this.eventIconPositions.get(event.id);
        const textDimensions = this.textDimensions.get(event.id);

        if (textPosition && iconPosition && textDimensions) {
          const isLeft = textPosition.x < this.centerX;

          let startX = isLeft ? textPosition.x + textDimensions.width : textPosition.x;
          let startY = textPosition.y + textDimensions.height / 2;

          // Вычисляем смещение для всех событий, даже если оно одно
          const offset = (index - (events.length - 1) / 2) * 5; // 5px смещение между стрелками

          // Применяем смещение, только если событий больше одного
          if (events.length > 1) {
            startY += offset;
          }

          const arrowStart = { x: startX, y: startY, isLeft };

          // Добавляем небольшое смещение к конечной точке стрелки
          const adjustedIconPosition = {
            x: iconPosition.x + (isLeft ? -3 : 3) * index,
            y: iconPosition.y + (events.length > 1 ? offset : 0),
          };

          this.drawArrow(arrowStart, adjustedIconPosition, event.category.colors.secondary_color);
        } else {
          console.warn(`Missing data for event ${event.id}`);
        }
      });
    });
  }

  drawArrow(textPos, iconPos, color) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';

    const path = this.calculateArrowPath(textPos, iconPos);

    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arrow.setAttribute('d', path);
    arrow.setAttribute('fill', 'none');
    arrow.setAttribute('stroke', `#${color}`);
    arrow.setAttribute('stroke-width', '0.7');
    arrow.setAttribute('marker-end', 'url(#arrowhead)');

    svg.appendChild(arrow);
    this.canvasWrapper.appendChild(svg);
    this.arrows.push(arrow);
  }

  calculateArrowPath(textPos, iconPos) {
    const padding = 5;
    let startX = textPos.isLeft ? textPos.x : textPos.x - padding;
    let startY = textPos.y;
    let { x: endX, y: endY } = iconPos;

    const needsBend =
      Math.abs(startY - endY) > 20 || (textPos.isLeft && endX < startX) || (!textPos.isLeft && endX > startX);

    if (needsBend) {
      const bendX = textPos.isLeft ? Math.max(startX, endX) : Math.min(startX, endX);
      const bendY = (startY + endY) / 2;
      return `M ${startX} ${startY} L ${bendX} ${startY} L ${bendX} ${bendY} L ${endX} ${bendY} L ${endX} ${endY}`;
    } else {
      return `M ${startX} ${startY} L ${endX} ${endY}`;
    }
  }

  needsVerticalBend(startX, startY, endX, endY) {
    const verticalDifference = Math.abs(startY - endY);

    if (verticalDifference > 50) {
      return true;
    }

    const directPath = `M ${startX} ${startY} L ${endX} ${endY}`;

    for (const element of this.eventElements) {
      if (this.pathIntersectsElement(directPath, element)) {
        return true;
      }
    }

    return false;
  }

  pathIntersectsElement(path, element) {
    const rect = element.getBoundingClientRect();
    const [x1, y1, x2, y2] = this.getPathEndpoints(path);
    return this.lineIntersectsRect(x1, y1, x2, y2, rect);
  }

  getPathEndpoints(path) {
    const matches = path.match(/M ([\d.]+) ([\d.]+) .* ([\d.]+) ([\d.]+)/);
    if (matches) {
      return matches.slice(1).map(Number);
    }
    return [0, 0, 0, 0];
  }

  lineIntersectsRect(x1, y1, x2, y2, rect) {
    return (
      this.lineIntersectsLine(x1, y1, x2, y2, rect.left, rect.top, rect.right, rect.top) ||
      this.lineIntersectsLine(x1, y1, x2, y2, rect.right, rect.top, rect.right, rect.bottom) ||
      this.lineIntersectsLine(x1, y1, x2, y2, rect.right, rect.bottom, rect.left, rect.bottom) ||
      this.lineIntersectsLine(x1, y1, x2, y2, rect.left, rect.bottom, rect.left, rect.top)
    );
  }

  lineIntersectsLine(x1, y1, x2, y2, x3, y3, x4, y4) {
    const den = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (den === 0) return false;
    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / den;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / den;
    return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
  }

  calculateBendY(startY, endY) {
    let midY = (startY + endY) / 2;

    return midY;
  }
  // end Draw Arrows

  // helpers
  drawCircleWithOneColor(radius, lineWidth, strokeStyle) {
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, radius, this.startAngle, this.endAngle);
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.stroke();
  }

  groupEventsByCategory(events) {
    const grouped = [];
    let currentCategory = null;
    let currentGroup = [];

    for (const event of events) {
      if (currentCategory === null || currentCategory.id !== event.category.id) {
        if (currentGroup.length > 0) {
          grouped.push(currentGroup);
        }

        currentCategory = event.category;
        currentGroup = [event];
      } else {
        currentGroup.push(event);
      }
    }

    if (currentGroup.length > 0) {
      grouped.push(currentGroup);
    }

    return grouped;
  }

  degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
}

const data = {
  id: '9cbfd8c1-fc12-4ca7-b824-eed9adef8df6',
  title: 'Test Title',
  photo_path: 'img/subjects/9cbfd8c1-fc12-4ca7-b824-eed9adef8df6.jpg',
  start_date: '1980-08-01',
  end_date: '2024-08-01',
  round_year: { name: 'Jahre', value: 50 },
  font_family: { name: 'Noto Sans' },
  color_scheme: {
    name: 'Neutral',
    colors: { main_color: 'DDE2E1', secondary_color: 'C0C9CE', tertiary_color: null },
    subject_title_color: '825251',
  },
  events: [
    {
      id: 1,
      date: '1980-08-01',
      date_parts: { day: '01', month: '08', year: '1980' },
      text: 'Родился',
      category: {
        id: 1,
        name: 'Kindheit & Jugend',
        colors: { main_color: 'F8ECB2', primary_color: 'E4D28E', secondary_color: 'EBCC3C' },
      },
      icon: { name: 'Baby', color: '/img/icons/memoring/icon-baby.svg' },
    },
    {
      id: 2,
      date: '1985-05-23',
      date_parts: { day: '23', month: '05', year: '1985' },
      text: 'Первый день в школе',
      category: {
        id: 1,
        name: 'Kindheit & Jugend',
        colors: { main_color: 'F8ECB2', primary_color: 'E4D28E', secondary_color: 'EBCC3C' },
      },
      icon: { name: 'School', color: '/img/icons/memoring/icon-school.svg' },
    },
    {
      id: 3,
      date: '1990-11-18',
      date_parts: { day: '18', month: '11', year: '1990' },
      text: 'Переезд в новый дом',
      category: {
        id: 2,
        name: 'Flucht',
        colors: { main_color: 'FCCB8E', primary_color: 'E6B26F', secondary_color: 'E78B0A' },
      },
      icon: { name: 'House', color: '/img/icons/memoring/icon-house.svg' },
    },
    {
      id: 4,
      date: '1993-07-04',
      date_parts: { day: '04', month: '07', year: '1993' },
      text: 'Окончил школу',
      category: {
        id: 3,
        name: 'Ausbildung',
        colors: { main_color: 'F5AEA8', primary_color: 'E29D93', secondary_color: 'E25D60' },
      },
      icon: { name: 'Graduation', color: '/img/icons/memoring/icon-graduation.svg' },
    },
    {
      id: 5,
      date: '1995-09-14',
      date_parts: { day: '14', month: '09', year: '1995' },
      text: 'Начал учёбу в университете',
      category: {
        id: 3,
        name: 'Ausbildung',
        colors: { main_color: 'F5AEA8', primary_color: 'E29D93', secondary_color: 'E25D60' },
      },
      icon: { name: 'University', color: '/img/icons/memoring/icon-university.svg' },
    },
    {
      id: 6,
      date: '2000-12-01',
      date_parts: { day: '01', month: '12', year: '2000' },
      text: 'Переезд в другой город',
      category: {
        id: 2,
        name: 'Flucht',
        colors: { main_color: 'FCCB8E', primary_color: 'E6B26F', secondary_color: 'E78B0A' },
      },
      icon: { name: 'Moving', color: '/img/icons/memoring/icon-moving.svg' },
    },
    {
      id: 7,
      date: '2001-08-12',
      date_parts: { day: '12', month: '08', year: '2001' },
      text: 'Новый этап в жизни',
      category: {
        id: 2,
        name: 'Flucht',
        colors: { main_color: 'FCCB8E', primary_color: 'E6B26F', secondary_color: 'E78B0A' },
      },
      icon: { name: 'Bell', color: '/img/icons/memoring/icon-bell.svg' },
    },
    {
      id: 8,
      date: '2003-05-15',
      date_parts: { day: '15', month: '05', year: '2003' },
      text: 'Получение первого диплома',
      category: {
        id: 3,
        name: 'Ausbildung',
        colors: { main_color: 'F5AEA8', primary_color: 'E29D93', secondary_color: 'E25D60' },
      },
      icon: { name: 'Diploma', color: '/img/icons/memoring/icon-diploma.svg' },
    },
    {
      id: 9,
      date: '2005-10-07',
      date_parts: { day: '07', month: '10', year: '2005' },
      text: 'Открытие бизнеса Открытие бизнеса Открытие бизнеса Открытие бизнеса ',
      category: {
        id: 4,
        name: 'Familiengründung',
        colors: { main_color: 'C4A5A3', primary_color: 'A88B85', secondary_color: '825251' },
      },
      icon: { name: 'Business', color: '/img/icons/memoring/icon-business.svg' },
    },
    {
      id: 10,
      date: '2006-01-17',
      date_parts: { day: '17', month: '01', year: '2006' },
      text: 'Зарегистрировал компанию Зарегистрировал компанию Зарегистрировал компанию',
      category: {
        id: 4,
        name: 'Familiengründung',
        colors: { main_color: 'C4A5A3', primary_color: 'A88B85', secondary_color: '825251' },
      },
      icon: { name: 'Register', color: '/img/icons/memoring/icon-register.svg' },
    },
    {
      id: 11,
      date: '2007-04-22',
      date_parts: { day: '22', month: '04', year: '2007' },
      text: 'Переезд в новую квартиру Переезд в новую квартиру',
      category: {
        id: 2,
        name: 'Flucht',
        colors: { main_color: 'FCCB8E', primary_color: 'E6B26F', secondary_color: 'E78B0A' },
      },
      icon: { name: 'Apartment', color: '/img/icons/memoring/icon-apartment.svg' },
    },
    {
      id: 12,
      date: '2008-08-12',
      date_parts: { day: '12', month: '08', year: '2008' },
      text: 'Начало нового проекта Начало нового проекта',
      category: {
        id: 3,
        name: 'Ausbildung',
        colors: { main_color: 'F5AEA8', primary_color: 'E29D93', secondary_color: 'E25D60' },
      },
      icon: { name: 'Project', color: '/img/icons/memoring/icon-project.svg' },
    },
    {
      id: 13,
      date: '2008-08-12',
      date_parts: { day: '12', month: '08', year: '2008' },
      text: 'Путешествие по миру Путешествие по миру Путешествие по миру Путешествие по миру',
      category: {
        id: 3,
        name: 'Ausbildung',
        colors: { main_color: 'F5AEA8', primary_color: 'E29D93', secondary_color: 'E25D60' },
      },
      icon: { name: 'Travel', color: '/img/icons/memoring/icon-travel.svg' },
    },
    {
      id: 14,
      date: '2010-09-09',
      date_parts: { day: '09', month: '09', year: '2010' },
      text: 'Рождение первого ребенка Рождение первого ребенка Рождение первого ребенка',
      category: {
        id: 5,
        name: 'Familie & Firma',
        colors: { main_color: 'C2CEBD', primary_color: 'A5B19E', secondary_color: '7B9376' },
      },
      icon: { name: 'Baby', color: '/img/icons/memoring/icon-baby.svg' },
    },
    {
      id: 15,
      date: '2012-07-05',
      date_parts: { day: '05', month: '07', year: '2012' },
      text: 'Открытие офиса',
      category: {
        id: 4,
        name: 'Familiengründung',
        colors: { main_color: 'C4A5A3', primary_color: 'A88B85', secondary_color: '825251' },
      },
      icon: { name: 'Office', color: '/img/icons/memoring/icon-office.svg' },
    },
    {
      id: 16,
      date: '2015-03-30',
      date_parts: { day: '30', month: '03', year: '2015' },
      text: 'Презентация продукта',
      category: {
        id: 4,
        name: 'Familiengründung',
        colors: { main_color: 'C4A5A3', primary_color: 'A88B85', secondary_color: '825251' },
      },
      icon: { name: 'Product', color: '/img/icons/memoring/icon-product.svg' },
    },
    {
      id: 17,
      date: '2016-06-15',
      date_parts: { day: '15', month: '06', year: '2016' },
      text: 'Путешествие с семьей',
      category: {
        id: 5,
        name: 'Familie & Firma',
        colors: { main_color: 'C2CEBD', primary_color: 'A5B19E', secondary_color: '7B9376' },
      },
      icon: { name: 'FamilyTrip', color: '/img/icons/memoring/icon-familytrip.svg' },
    },
    {
      id: 18,
      date: '2017-02-10',
      date_parts: { day: '10', month: '02', year: '2017' },
      text: 'Запуск нового стартапа',
      category: {
        id: 4,
        name: 'Familiengründung',
        colors: { main_color: 'C4A5A3', primary_color: 'A88B85', secondary_color: '825251' },
      },
      icon: { name: 'Startup', color: '/img/icons/memoring/icon-startup.svg' },
    },
    {
      id: 19,
      date: '2018-08-12',
      date_parts: { day: '12', month: '08', year: '2018' },
      text: 'Годовщина компании',
      category: {
        id: 4,
        name: 'Familiengründung',
        colors: { main_color: 'C4A5A3', primary_color: 'A88B85', secondary_color: '825251' },
      },
      icon: { name: 'Anniversary', color: '/img/icons/memoring/icon-anniversary.svg' },
    },

    {
      id: 21,
      date: '2019-04-21',
      date_parts: { day: '21', month: '04', year: '2019' },
      text: 'Открытие второго офиса',
      category: {
        id: 4,
        name: 'Familiengründung',
        colors: { main_color: 'C4A5A3', primary_color: 'A88B85', secondary_color: '825251' },
      },
      icon: { name: 'Office2', color: '/img/icons/memoring/icon-office2.svg' },
    },
    {
      id: 22,
      date: '2020-01-01',
      date_parts: { day: '01', month: '01', year: '2020' },
      text: 'Празднование Нового года',
      category: {
        id: 5,
        name: 'Familie & Firma',
        colors: { main_color: 'C2CEBD', primary_color: 'A5B19E', secondary_color: '7B9376' },
      },
      icon: { name: 'NewYear', color: '/img/icons/memoring/icon-newyear.svg' },
    },

    {
      id: 24,
      date: '2020-08-12',
      date_parts: { day: '12', month: '08', year: '2020' },
      text: 'Запуск новой маркетинговой кампании',
      category: {
        id: 5,
        name: 'Familie & Firma',
        colors: { main_color: 'C2CEBD', primary_color: 'A5B19E', secondary_color: '7B9376' },
      },
      icon: { name: 'Marketing', color: '/img/icons/memoring/icon-marketing.svg' },
    },
    {
      id: 25,
      date: '2021-11-09',
      date_parts: { day: '09', month: '11', year: '2021' },
      text: 'Новый партнер по бизнесу',
      category: {
        id: 4,
        name: 'Familiengründung',
        colors: { main_color: 'C4A5A3', primary_color: 'A88B85', secondary_color: '825251' },
      },
      icon: { name: 'Partner', color: '/img/icons/memoring/icon-partner.svg' },
    },
    {
      id: 26,
      date: '2022-06-18',
      date_parts: { day: '18', month: '06', year: '2022' },
      text: 'Организация крупного мероприятия',
      category: {
        id: 5,
        name: 'Familie & Firma',
        colors: { main_color: 'C2CEBD', primary_color: 'A5B19E', secondary_color: '7B9376' },
      },
      icon: { name: 'Event', color: '/img/icons/memoring/icon-event.svg' },
    },
    {
      id: 27,
      date: '2022-11-11',
      date_parts: { day: '11', month: '11', year: '2022' },
      text: 'Запуск нового продукта',
      category: {
        id: 4,
        name: 'Familiengründung',
        colors: { main_color: 'C4A5A3', primary_color: 'A88B85', secondary_color: '825251' },
      },
      icon: { name: 'NewProduct', color: '/img/icons/memoring/icon-newproduct.svg' },
    },
    {
      id: 28,
      date: '2023-02-23',
      date_parts: { day: '23', month: '02', year: '2023' },
      text: 'Награждение компании за успехи',
      category: {
        id: 4,
        name: 'Familiengründung',
        colors: { main_color: 'C4A5A3', primary_color: 'A88B85', secondary_color: '825251' },
      },
      icon: { name: 'Award', color: '/img/icons/memoring/icon-award.svg' },
    },

    {
      id: 30,
      date: '2024-08-01',
      date_parts: { day: '01', month: '08', year: '2024' },
      text: 'Юбилей компании',
      category: {
        id: 5,
        name: 'Familie & Firma',
        colors: { main_color: 'C2CEBD', primary_color: 'A5B19E', secondary_color: '7B9376' },
      },
      icon: { name: 'Anniversary', color: '/img/icons/memoring/icon-anniversary.svg' },
    },
  ],
};

const getData = (data) => {
  const { events } = data;
  const sortedEvents = events
    .sort((prevItem, currentItem) => new Date(prevItem.date) - new Date(currentItem.date))
    .map((event) => {
      const { day, month, year } = event.date_parts;

      return { ...event, date_parts: { day: +day, month: +month, year: +year } };
    });

  return { ...data, events: sortedEvents };
};

const newData = getData(data);

const drawer = new CanvasDrawer('canvas', '.canvas-wrapper', '.canvas-wrapper img', newData);
