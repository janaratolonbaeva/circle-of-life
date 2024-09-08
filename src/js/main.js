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
		return new Promise(resolve => {
			if (document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', resolve);
			} else {
				resolve();
			}
		});
	}

	resourcesReady() {
		return new Promise(resolve => {
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
		const maxEventsOfPart = 14;

		let leftEvents, rightEvents;

		const leftEventsByYear = events
			.filter(event => event.date_parts.year >= midYear)
			.sort((a, b) => b.date_parts.year - a.date_parts.year);
		const rightEventsByYear = events
			.filter(event => event.date_parts.year < midYear)
			.sort((a, b) => a.date_parts.year - b.date_parts.year);

		if (
			leftEventsByYear.length > maxEventsOfPart ||
			rightEventsByYear.length > maxEventsOfPart
		) {
			const sortedEvents = events.sort(
				(a, b) => a.date_parts.year - b.date_parts.year
			);
			const midIndex = Math.ceil(sortedEvents.length / 2);

			rightEvents = sortedEvents.slice(0, midIndex);
			leftEvents = sortedEvents.slice(midIndex).reverse();
		} else {
			leftEvents = leftEventsByYear;
			rightEvents = rightEventsByYear;
		}

		this.eventElements = [];
		this.positionEventsOnSide(leftEvents, true);
		this.positionEventsOnSide(rightEvents, false);
	}

	positionEventsOnSide(events, isLeft) {
		const startAngle = isLeft
			? this.clockAngles['10:40']
			: this.clockAngles['1:00'];
		const endAngle = this.clockAngles['6:00'];
		const angleStep = (endAngle - startAngle) / events.length;
		const leftRadiusX = this.canvas.width * 0.16;
		const rightRadiusX = this.canvas.width * 0.03;
		const radiusY = this.canvas.width * 0.03;
		const radiusOffset = isLeft ? leftRadiusX : rightRadiusX;
		const heightOffset = isLeft ? radiusY * 2 : radiusY;

		let lastY = null;

		const topY =
			this.centerY +
			this.radius * Math.sin(this.clockAngles[isLeft ? '11:59' : '12:00']);
		const bottomY =
			this.centerY +
			this.radius * Math.sin(this.clockAngles[isLeft ? '11:00' : '12:30']);
		const nineTwoY =
			this.centerY +
			this.radius * Math.sin(this.clockAngles[isLeft ? '9:20' : '2:40']);
		const twelveY =
			this.centerY + this.radius * Math.sin(this.clockAngles['12:00']);
		const twoY =
			this.centerY + this.radius * Math.sin(this.clockAngles['2:30']);
		const oneY =
			this.centerY + this.radius * Math.sin(this.clockAngles['1:30']);
		const elevenLastY =
			this.centerY + this.radius * Math.sin(this.clockAngles['11:59']);
		const tenY =
			this.centerY + this.radius * Math.sin(this.clockAngles['10:00']);

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
						y = Math.max(
							y + this.minSpacing,
							this.eventElements[i].getBoundingClientRect().bottom +
								this.minSpacing
						);
						eventElement.style.top = `${y}px`;
						overlap = true;

						break;
					}
				}
			}

			const offsetX = this.canvas.width * 0.03;
			const additionalOffset = this.canvas.width * 0.02;
			const offsetXForAngle715 = this.canvas.width * 0.038;
			const offsetXForAngle445 = this.canvas.width * 0.01;
			let eventWidth = this.canvas.width * 0.127;

			const angle445 = this.clockAngles['4:30'];
			const angle715 = this.clockAngles['7:30'];

			if (angle >= angle445 && angle <= angle715) {
				eventWidth *= isLeft ? 1.33 : 1.25;
				x += isLeft ? -offsetXForAngle715 : -offsetXForAngle445;
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
			this.textDimensions.set(event.id, {
				width: rect.width,
				height: rect.height,
			});
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
		let radiusDistance = this.canvas.width * 0.068;

		if (text.length > 15) {
			radiusDistance += this.canvas.width * 0.015;
		}

		const radius = this.radius + radiusDistance;
		const startX = this.centerX + radius * Math.cos(startAngle);
		const startY = this.centerY + radius * Math.sin(startAngle);
		const endX = this.centerX + radius * Math.cos(endAngle);
		const endY = this.centerY + radius * Math.sin(endAngle);

		const largeArcFlag = endAngle - startAngle <= Math.PI ? '0' : '1';

		path.setAttribute(
			'd',
			`M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`
		);
		path.setAttribute('fill', 'none');
		svg.appendChild(path);

		const svgText = document.createElementNS(this.svgNS, 'text');
		svgText.setAttribute('text-anchor', 'middle');

		const textPath = document.createElementNS(this.svgNS, 'textPath');
		textPath.setAttributeNS(
			'http://www.w3.org/1999/xlink',
			'xlink:href',
			'#upperTextPath'
		);
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
				if (
					lines[currentLine].length +
						word.length +
						(lines[currentLine] ? 1 : 0) >
					15
				) {
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

			lines = lines.filter(line => line !== '');
			if (lines.length > 3) {
				lines[2] = lines.slice(2).join(' ');
				lines = lines.slice(0, 3);
			}

			return lines;
		};

		const applyText = lines => {
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

			tspans.forEach(t => {
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

		while (
			tspans.some(t => t.getComputedTextLength() > maxWidth / lines.length) &&
			fontSize > 20
		) {
			fontSize--;
			tspans.forEach(t => t.setAttribute('font-size', `${fontSize}px`));
		}

		const textPath = tspan.parentNode;
		textPath.setAttribute('startOffset', '50%');
		tspans.forEach(t => t.setAttribute('x', '0'));
	}
	// end Name Text

	// Implemented one color draw circle
	drawInitialCircles() {
		this.drawCircleWithOneColor(
			this.radiusLarge / 2,
			this.canvas.width * 0.019,
			'#EAE9EB'
		);
		this.drawCircleWithOneColor(
			this.radius,
			this.canvas.width * 0.018,
			'#F2F2F2'
		);
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
			this.drawCircleWithOneColor(
				this.radius / 2,
				size,
				`${whiteColor}${opacities[opacity]}`
			);
		}
	}
	// end Draw Opacity Circles With White Color

	// Implemented Draw Triangle Canvas
	drawTriangle() {
		const { events, start_date, end_date, round_year, color_scheme } =
			this.data;
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
				nextGroupStartYear = Math.min(
					groupedEvents[index + 1][0].date_parts.year,
					endYear + 1
				);
			}

			if (currentYear < groupStartYear) {
				const gapYears = groupStartYear - currentYear;
				const gapArcSize = gapYears * degreePerYear;
				const gapEndingAngle = startingAngle + gapArcSize;

				this.drawArcSegment(
					startingAngle,
					gapEndingAngle,
					`#${color_scheme.colors.secondary_color}`
				);
				this.drawArcSegment(
					startingAngle,
					gapEndingAngle,
					`#${color_scheme.colors.primary_color}`,
					radiusForPrimaryColor
				);
				this.drawArcSegment(
					startingAngle,
					gapEndingAngle,
					`#${color_scheme.colors.main_color}`,
					radiusForMainColor
				);

				startingAngle = gapEndingAngle;
			}

			const categoryYears =
				nextGroupStartYear - Math.max(groupStartYear, currentYear);
			const arcSize = categoryYears * degreePerYear;
			const endingAngle = startingAngle + arcSize;

			this.drawArcSegment(
				startingAngle,
				endingAngle,
				`#${category.colors.secondary_color}`
			);
			this.drawArcSegment(
				startingAngle,
				endingAngle,
				`#${category.colors.primary_color}`,
				radiusForPrimaryColor
			);
			this.drawArcSegment(
				startingAngle,
				endingAngle,
				`#${category.colors.main_color}`,
				radiusForMainColor
			);

			startingAngle = endingAngle;
			currentYear = nextGroupStartYear;
		});

		if (currentYear < maxYear) {
			const remainingYears = maxYear - currentYear;
			const remainingArcSize = remainingYears * degreePerYear;
			const finalEndingAngle = startingAngle + remainingArcSize;

			this.drawArcSegment(
				startingAngle,
				finalEndingAngle,
				`#${color_scheme.colors.secondary_color}`
			);
			this.drawArcSegment(
				startingAngle,
				finalEndingAngle,
				`#${color_scheme.colors.primary_color}`,
				radiusForPrimaryColor
			);
			this.drawArcSegment(
				startingAngle,
				finalEndingAngle,
				`#${color_scheme.colors.main_color}`,
				radiusForMainColor
			);
		}
	}

	drawArcSegment(startAngle, endAngle, color, radius = this.radius) {
		this.ctx.beginPath();
		this.ctx.moveTo(this.centerX, this.centerY);
		this.ctx.arc(
			this.centerX,
			this.centerY,
			radius,
			startAngle,
			endAngle,
			false
		);
		this.ctx.fillStyle = color;
		this.ctx.lineTo(this.centerX, this.centerY);
		this.ctx.fill();
		this.ctx.closePath();
	}
	// end Draw Triangle Canvas

	// Implemented Draw Year Date and Icons
	drawDotsYearDateIcons() {
		const { start_date, end_date, round_year, events, color_scheme } =
			this.data;
		const divisions = 2;
		const angleStep = (this.endAngle - this.startAngle) / round_year.value;
		const adjustedStartAngle = this.startAngle + angleStep / divisions;
		const firstDate = new Date(start_date).getFullYear();
		const lastDate = firstDate + (round_year.value - 1);

		for (let i = firstDate; i <= lastDate; i++) {
			const angle = adjustedStartAngle + (i - firstDate) * angleStep;
			const fontSizeDate = this.canvas.width * 0.006;
			const dateX =
				this.centerX + (this.radius - fontSizeDate * 2.2) * Math.cos(angle);
			const dateY =
				this.centerY + (this.radius - fontSizeDate * 2.2) * Math.sin(angle);
			const dotX =
				this.centerX +
				(this.radius + this.canvas.width * 0.0046) * Math.cos(angle);
			const dotY =
				this.centerY +
				(this.radius + this.canvas.width * 0.0046) * Math.sin(angle);
			const dotSize = this.canvas.width * 0.006;
			const dotSmallX =
				this.centerX +
				(this.radius / 2 + this.canvas.width * 0.016) * Math.cos(angle) +
				dotSize / 2;
			const dotSmallY =
				this.centerY +
				(this.radius / 2 + this.canvas.width * 0.016) * Math.sin(angle);
			const dotSmallSize = this.canvas.width * 0.0045;

			let { bgColor, borderColor } = this.getColorsForDate(
				i,
				events,
				color_scheme,
				end_date
			);

			this.drawOneDot(
				'dot',
				dotX + dotSize / 2,
				dotY,
				dotSize,
				bgColor,
				borderColor
			);
			this.drawOneDot(
				'dot',
				dotSmallX,
				dotSmallY,
				dotSmallSize,
				bgColor,
				borderColor,
				1.5
			);
			this.writeYearDateForCircle(
				dateX,
				dateY,
				fontSizeDate,
				lastDate - firstDate,
				angle,
				i,
				firstDate
			);

			const yearEvents = this.getEventsForYear(i, events);

			if (yearEvents.length > 0) {
				yearEvents.forEach((event, index) => {
					const offsetAngle =
						angle + (index - (yearEvents.length - 1) / 2) * 0.02; // небольшое смещение для множественных событий
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
				categoryEndYear =
					this.getNextCategoryStartYear(lastEvent, groupedEvents) - 1;
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
		const currentCategoryIndex = groupedEvents.findIndex(group =>
			group.includes(lastEventInCategory)
		);
		if (currentCategoryIndex < groupedEvents.length - 1) {
			return groupedEvents[currentCategoryIndex + 1][0].date_parts.year;
		}

		return lastEventInCategory.date_parts.year + 1;
	}

	getEventsForYear(year, events) {
		return events.filter(event => {
			const eventYear = event.date_parts
				? event.date_parts.year
				: new Date(event.date).getFullYear();
			return eventYear === year;
		});
	}

	getEventForYear(year, events) {
		return events.find(
			event => event.date_parts.year && event.date_parts.year === year
		);
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

	writeYearDateForCircle(
		x,
		y,
		fontSize,
		numberOfPoints,
		angle,
		index,
		firstDate
	) {
		const el = document.createElement('span');
		el.innerHTML = index;
		el.classList.add('number');
		el.style.fontSize = `${fontSize}px`;
		el.style.top = `${y - fontSize / 2}px`;
		el.style.left = `${x - fontSize}px`;
		el.style.position = 'absolute';

		const year = index - firstDate;
		el.style.transform = `rotate(${
			year < numberOfPoints / 2 ? angle : angle + Math.PI
		}rad)`;

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
			const distance = Math.sqrt(
				Math.pow(x - icon.x, 2) + Math.pow(y - icon.y, 2)
			);
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

		const d = `M ${this.centerX} ${
			this.centerY - pathRadius
		} A ${pathRadius} ${pathRadius} 0 1 1 ${this.centerX} ${
			this.centerY + pathRadius
		} A ${pathRadius} ${pathRadius} 0 1 1 ${this.centerX} ${
			this.centerY - pathRadius
		}`;

		const path = document.createElementNS(svgNS, 'path');
		path.setAttribute('d', d);
		path.setAttribute('id', 'categoryPath');
		path.setAttribute('fill', 'none');
		svg.appendChild(path);

		let lastTextEndOffset = 0;

		groupedEvents.forEach(group => {
			const category = group[0].category;
			const firstEvent = group[0];
			const from = firstEvent.date_parts.year;
			const startAnglePath = startAngle + (from - startYear) * angleStep;
			const startOffset = ((startAnglePath - startAngle) / (2 * Math.PI)) * 100;

			const text = document.createElementNS(svgNS, 'text');
			const textPath = document.createElementNS(svgNS, 'textPath');
			textPath.setAttributeNS(
				'http://www.w3.org/1999/xlink',
				'xlink:href',
				'#categoryPath'
			);
			textPath.setAttribute(
				'startOffset',
				`${Math.max(startOffset, lastTextEndOffset) + 0.5}%`
			);
			textPath.textContent = category.name;
			textPath.style.fontSize = `${fontSize}px`;
			textPath.style.fill = `#${color_scheme.name === 'Dark' ? 'fff' : '333'}`;

			text.appendChild(textPath);
			svg.appendChild(text);

			const textLength = category.name.length * fontSize * 0.6;
			const pathLength = 2 * Math.PI * pathRadius;
			lastTextEndOffset =
				Math.max(startOffset, lastTextEndOffset) +
				(textLength / pathLength) * 100 +
				2;
		});

		this.canvasWrapper.appendChild(svg);
	}
	// end Draw Categories Text

	// Implemented Draw Arrows
	drawArrowsForEvents() {
		const eventsByYear = {};

		this.data.events.forEach(event => {
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

					let startX = isLeft
						? textPosition.x + textDimensions.width
						: textPosition.x;
					let startY = textPosition.y + textDimensions.height / 2;

					const offset = (index - (events.length - 1) / 2) * 5;

					if (events.length > 1) {
						startY += offset;
					}

					const arrowStart = { x: startX, y: startY, isLeft };

					const adjustedIconPosition = {
						x: iconPosition.x + (isLeft ? -3 : 3) * index,
						y: iconPosition.y + (events.length > 1 ? offset : 0),
					};

					this.drawArrow(
						arrowStart,
						adjustedIconPosition,
						event.category.colors.secondary_color
					);
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

		const arrow = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'path'
		);
		arrow.setAttribute('d', path);
		arrow.setAttribute('fill', 'none');
		arrow.setAttribute('stroke', `#${color}`);
		arrow.setAttribute('stroke-width', '0.8');
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

		const centerX = this.centerX;
		const centerY = this.centerY;
		const photoRadius = this.photoRadius;

		const needsBend =
			Math.abs(startY - endY) > 0 ||
			(textPos.isLeft && endX < startX) ||
			(!textPos.isLeft && endX > startX);

		let path = `M ${startX} ${startY}`;

		if (needsBend) {
			const horizontalOffset = textPos.isLeft ? -10 : 10;
			const midX = startX + horizontalOffset;
			path += ` L ${midX} ${startY}`;

			if (
				this.lineIntersectsCircle(
					midX,
					startY,
					endX,
					endY,
					centerX,
					centerY,
					photoRadius
				)
			) {
				const [avoidX1, avoidY1] = this.getCircleAvoidancePoint(
					midX,
					startY,
					centerX,
					centerY,
					photoRadius,
					textPos.isLeft
				);
				const [avoidX2, avoidY2] = this.getCircleAvoidancePoint(
					endX,
					endY,
					centerX,
					centerY,
					photoRadius,
					!textPos.isLeft
				);

				path += ` L ${avoidX1} ${avoidY1} L ${avoidX2} ${avoidY2}`;
			} else {
				const bendX = textPos.isLeft
					? Math.max(startX, endX)
					: Math.min(startX, endX);
				const bendY = (startY + endY) / 2;
				path += ` L ${bendX} ${startY} L ${bendX} ${bendY}`;
			}
		}

		path += ` L ${endX} ${endY}`;
		return path;
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

	lineIntersectsCircle(x1, y1, x2, y2, cx, cy, r) {
		const dx = x2 - x1;
		const dy = y2 - y1;
		const a = dx * dx + dy * dy;
		const b = 2 * (dx * (x1 - cx) + dy * (y1 - cy));
		const c =
			cx * cx + cy * cy + x1 * x1 + y1 * y1 - 2 * (cx * x1 + cy * y1) - r * r;
		const discriminant = b * b - 4 * a * c;
		return discriminant >= 0;
	}

	getCircleAvoidancePoint(x, y, cx, cy, r, isLeft) {
		const angle = Math.atan2(y - cy, x - cx);
		const avoidanceAngle = isLeft ? angle - Math.PI / 6 : angle + Math.PI / 6;
		const avoidX = cx + (r + 10) * Math.cos(avoidanceAngle);
		const avoidY = cy + (r + 10) * Math.sin(avoidanceAngle);
		return [avoidX, avoidY];
	}

	lineIntersectsRect(x1, y1, x2, y2, rect) {
		return (
			this.lineIntersectsLine(
				x1,
				y1,
				x2,
				y2,
				rect.left,
				rect.top,
				rect.right,
				rect.top
			) ||
			this.lineIntersectsLine(
				x1,
				y1,
				x2,
				y2,
				rect.right,
				rect.top,
				rect.right,
				rect.bottom
			) ||
			this.lineIntersectsLine(
				x1,
				y1,
				x2,
				y2,
				rect.right,
				rect.bottom,
				rect.left,
				rect.bottom
			) ||
			this.lineIntersectsLine(
				x1,
				y1,
				x2,
				y2,
				rect.left,
				rect.bottom,
				rect.left,
				rect.top
			)
		);
	}

	lineIntersectsLine(x1, y1, x2, y2, x3, y3, x4, y4) {
		const den = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

		if (den === 0) return false;

		const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / den;
		const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / den;

		return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
	}
	// end Draw Arrows

	// helpers
	drawCircleWithOneColor(radius, lineWidth, strokeStyle) {
		this.ctx.beginPath();
		this.ctx.arc(
			this.centerX,
			this.centerY,
			radius,
			this.startAngle,
			this.endAngle
		);
		this.ctx.lineWidth = lineWidth;
		this.ctx.strokeStyle = strokeStyle;
		this.ctx.stroke();
	}

	groupEventsByCategory(events) {
		const grouped = [];
		let currentCategory = null;
		let currentGroup = [];

		for (const event of events) {
			if (
				currentCategory === null ||
				currentCategory.id !== event.category.id
			) {
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
	id: '9ccfc32f-2c51-42ab-a20d-ad0a2df245ed',
	title: 'Cartwright, Koelpin and Hamill',
	photo_path:
		'/home/don/development/projects/Vasterra/circleoflife/public/img/subjects/',
	start_date: '1930-01-01',
	end_date: '2016-12-31',
	round_year: { name: 'Jahre', value: 100 },
	font_family: { notoSans: '"Noto Sans", sans-serif' },
	color_scheme: {
		name: 'Neutral',
		colors: {
			main_color: 'DDE2E1',
			secondary_color: 'CED2D0',
			tertiary_color: 'C0C9CE',
		},
		subject_title_color: '825251',
	},
	events: [
		{
			id: 420,
			sort: 25,
			date: '1930-01-01',
			date_parts: { day: '01', month: '01', year: '1930' },
			text: 'Nisi culpa dolor molestiae sunt. Veniam illo vitae voluptatem aut quia laboriosam.',
			category: {
				id: 1,
				name: 'Kindheit & Jugend',
				colors: {
					id: 1,
					name: 'Yellow',
					main_color: 'F8ECB2',
					primary_color: 'E4D28E',
					secondary_color: 'EBCC3C',
				},
			},
			icon: {
				name: 'Baby',
				color:
					'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
			},
		},
		// {
		// 	id: 419,
		// 	sort: 24,
		// 	date: '1932-09-15',
		// 	date_parts: { day: '15', month: '09', year: '1932' },
		// 	text: 'Dolores quas reiciendis est praesentium ut recusandae. Reprehenderit aut molestiae quo.',
		// 	category: {
		// 		id: 1,
		// 		name: 'Kindheit & Jugend',
		// 		colors: {
		// 			id: 1,
		// 			name: 'Yellow',
		// 			main_color: 'F8ECB2',
		// 			primary_color: 'E4D28E',
		// 			secondary_color: 'EBCC3C',
		// 		},
		// 	},
		// 	icon: {
		// 		name: 'Baby',
		// 		color:
		// 			'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
		// 	},
		// },
		// {
		// 	id: 418,
		// 	sort: 23,
		// 	date: '1932-10-22',
		// 	date_parts: { day: '22', month: '10', year: '1932' },
		// 	text: 'Vero voluptas illum eos itaque. Voluptatem similique rerum voluptates sapiente eaque.',
		// 	category: {
		// 		id: 1,
		// 		name: 'Kindheit & Jugend',
		// 		colors: {
		// 			id: 1,
		// 			name: 'Yellow',
		// 			main_color: 'F8ECB2',
		// 			primary_color: 'E4D28E',
		// 			secondary_color: 'EBCC3C',
		// 		},
		// 	},
		// 	icon: {
		// 		name: 'Baby',
		// 		color:
		// 			'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
		// 	},
		// },
		// {
		// 	id: 417,
		// 	sort: 22,
		// 	date: '1934-02-17',
		// 	date_parts: { day: '17', month: '02', year: '1934' },
		// 	text: 'Reprehenderit error earum aut nobis. In eos enim eum et.',
		// 	category: {
		// 		id: 1,
		// 		name: 'Kindheit & Jugend',
		// 		colors: {
		// 			id: 1,
		// 			name: 'Yellow',
		// 			main_color: 'F8ECB2',
		// 			primary_color: 'E4D28E',
		// 			secondary_color: 'EBCC3C',
		// 		},
		// 	},
		// 	icon: {
		// 		name: 'Baby',
		// 		color:
		// 			'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
		// 	},
		// },
		// {
		// 	id: 416,
		// 	sort: 21,
		// 	date: '1936-01-03',
		// 	date_parts: { day: '03', month: '01', year: '1936' },
		// 	text: 'Magnam omnis voluptas earum sed exercitationem. Dolores ea et quis.',
		// 	category: {
		// 		id: 2,
		// 		name: 'Flucht',
		// 		colors: {
		// 			id: 2,
		// 			name: 'Orange',
		// 			main_color: 'FCCB8E',
		// 			primary_color: 'E6B26F',
		// 			secondary_color: 'E78B0A',
		// 		},
		// 	},
		// 	icon: {
		// 		name: 'Baby',
		// 		color:
		// 			'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
		// 	},
		// },
		// {
		// 	id: 415,
		// 	sort: 20,
		// 	date: '1936-05-01',
		// 	date_parts: { day: '01', month: '05', year: '1936' },
		// 	text: 'In earum expedita commodi voluptatem. Vel enim et ut consequatur voluptates reiciendis.',
		// 	category: {
		// 		id: 2,
		// 		name: 'Flucht',
		// 		colors: {
		// 			id: 2,
		// 			name: 'Orange',
		// 			main_color: 'FCCB8E',
		// 			primary_color: 'E6B26F',
		// 			secondary_color: 'E78B0A',
		// 		},
		// 	},
		// 	icon: {
		// 		name: 'Baby',
		// 		color:
		// 			'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
		// 	},
		// },
		{
			id: 414,
			sort: 19,
			date: '1936-10-05',
			date_parts: { day: '05', month: '10', year: '1936' },
			text: 'Magnam veniam eum est. Qui asperiores in eos aliquam. Quo quaerat totam velit quos omnis earum.',
			category: {
				id: 2,
				name: 'Flucht',
				colors: {
					id: 2,
					name: 'Orange',
					main_color: 'FCCB8E',
					primary_color: 'E6B26F',
					secondary_color: 'E78B0A',
				},
			},
			icon: {
				name: 'Baby',
				color:
					'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
			},
		},
		{
			id: 413,
			sort: 18,
			date: '1937-03-24',
			date_parts: { day: '24', month: '03', year: '1937' },
			text: 'Incidunt velit dolore sit nobis. Ea dolor qui repudiandae.',
			category: {
				id: 2,
				name: 'Flucht',
				colors: {
					id: 2,
					name: 'Orange',
					main_color: 'FCCB8E',
					primary_color: 'E6B26F',
					secondary_color: 'E78B0A',
				},
			},
			icon: {
				name: 'Baby',
				color:
					'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
			},
		},
		{
			id: 412,
			sort: 17,
			date: '1939-11-03',
			date_parts: { day: '03', month: '11', year: '1939' },
			text: 'Architecto officia ut unde quod error. Voluptatibus ut nemo sed non.',
			category: {
				id: 2,
				name: 'Flucht',
				colors: {
					id: 2,
					name: 'Orange',
					main_color: 'FCCB8E',
					primary_color: 'E6B26F',
					secondary_color: 'E78B0A',
				},
			},
			icon: {
				name: 'Baby',
				color:
					'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
			},
		},
		{
			id: 411,
			sort: 16,
			date: '1944-11-15',
			date_parts: { day: '15', month: '11', year: '1944' },
			text: 'Eveniet autem tenetur eos minus doloremque. Qui laboriosam omnis ipsam eum sapiente.',
			category: {
				id: 5,
				name: 'Familie & Firma',
				colors: {
					id: 5,
					name: 'Green',
					main_color: 'C2CEBD',
					primary_color: 'A5B19E',
					secondary_color: '7B9376',
				},
			},
			icon: {
				name: 'Baby',
				color:
					'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
			},
		},
		{
			id: 410,
			sort: 15,
			date: '1945-11-27',
			date_parts: { day: '27', month: '11', year: '1945' },
			text: 'Quia inventore beatae qui. Aliquam quis quasi et. Id assumenda autem ipsa illum sit recusandae.',
			category: {
				id: 6,
				name: 'Witwe',
				colors: {
					id: 6,
					name: 'Purple',
					main_color: 'B9BAC9',
					primary_color: '9A9BB1',
					secondary_color: '686C91',
				},
			},
			icon: {
				name: 'Baby',
				color:
					'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
			},
		},
		{
			id: 409,
			sort: 14,
			date: '1947-03-12',
			date_parts: { day: '12', month: '03', year: '1947' },
			text: 'Omnis nam dolorum placeat sit. Temporibus ut aut omnis doloremque aliquam.',
			category: {
				id: 6,
				name: 'Witwe',
				colors: {
					id: 6,
					name: 'Purple',
					main_color: 'B9BAC9',
					primary_color: '9A9BB1',
					secondary_color: '686C91',
				},
			},
			icon: {
				name: 'Baby',
				color:
					'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
			},
		},
		{
			id: 408,
			sort: 13,
			date: '1950-01-06',
			date_parts: { day: '06', month: '01', year: '1950' },
			text: 'Atque sint impedit nisi sapiente. Sint optio qui earum veniam quia repellendus.',
			category: {
				id: 6,
				name: 'Witwe',
				colors: {
					id: 6,
					name: 'Purple',
					main_color: 'B9BAC9',
					primary_color: '9A9BB1',
					secondary_color: '686C91',
				},
			},
			icon: {
				name: 'Baby',
				color:
					'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
			},
		},
		{
			id: 407,
			sort: 12,
			date: '1954-05-01',
			date_parts: { day: '01', month: '05', year: '1954' },
			text: 'Voluptas et est accusamus reprehenderit. Animi id illum maxime voluptas voluptatem.',
			category: {
				id: 6,
				name: 'Witwe',
				colors: {
					id: 6,
					name: 'Purple',
					main_color: 'B9BAC9',
					primary_color: '9A9BB1',
					secondary_color: '686C91',
				},
			},
			icon: {
				name: 'Baby',
				color:
					'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
			},
		},
		// {
		// 	id: 406,
		// 	sort: 11,
		// 	date: '1956-06-04',
		// 	date_parts: { day: '04', month: '06', year: '1956' },
		// 	text: 'Officiis fugit culpa amet est facilis. Corporis harum perspiciatis maiores et pariatur.',
		// 	category: {
		// 		id: 6,
		// 		name: 'Witwe',
		// 		colors: {
		// 			id: 6,
		// 			name: 'Purple',
		// 			main_color: 'B9BAC9',
		// 			primary_color: '9A9BB1',
		// 			secondary_color: '686C91',
		// 		},
		// 	},
		// 	icon: {
		// 		name: 'Baby',
		// 		color:
		// 			'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
		// 	},
		// },
		// {
		// 	id: 405,
		// 	sort: 10,
		// 	date: '1959-07-16',
		// 	date_parts: { day: '16', month: '07', year: '1959' },
		// 	text: 'Sit ex vel non perferendis sed. Voluptas ut repellendus et quibusdam. Reiciendis odit unde cum est.',
		// 	category: {
		// 		id: 6,
		// 		name: 'Witwe',
		// 		colors: {
		// 			id: 6,
		// 			name: 'Purple',
		// 			main_color: 'B9BAC9',
		// 			primary_color: '9A9BB1',
		// 			secondary_color: '686C91',
		// 		},
		// 	},
		// 	icon: {
		// 		name: 'Baby',
		// 		color:
		// 			'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
		// 	},
		// },
		// {
		// 	id: 404,
		// 	sort: 9,
		// 	date: '1965-07-24',
		// 	date_parts: { day: '24', month: '07', year: '1965' },
		// 	text: 'Quaerat minima velit eum dicta tempore. Fugit sint molestiae et neque est. Est nobis qui iure.',
		// 	category: {
		// 		id: 6,
		// 		name: 'Witwe',
		// 		colors: {
		// 			id: 6,
		// 			name: 'Purple',
		// 			main_color: 'B9BAC9',
		// 			primary_color: '9A9BB1',
		// 			secondary_color: '686C91',
		// 		},
		// 	},
		// 	icon: {
		// 		name: 'Baby',
		// 		color:
		// 			'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
		// 	},
		// },
		// {
		// 	id: 403,
		// 	sort: 8,
		// 	date: '1967-12-20',
		// 	date_parts: { day: '20', month: '12', year: '1967' },
		// 	text: 'Quia doloribus quia aut aut. Iure harum possimus non a minus qui ea quas.',
		// 	category: {
		// 		id: 6,
		// 		name: 'Witwe',
		// 		colors: {
		// 			id: 6,
		// 			name: 'Purple',
		// 			main_color: 'B9BAC9',
		// 			primary_color: '9A9BB1',
		// 			secondary_color: '686C91',
		// 		},
		// 	},
		// 	icon: {
		// 		name: 'Baby',
		// 		color:
		// 			'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
		// 	},
		// },
		// {
		// 	id: 402,
		// 	sort: 7,
		// 	date: '1968-04-30',
		// 	date_parts: { day: '30', month: '04', year: '1968' },
		// 	text: 'Unde saepe sunt odio est. Facilis deserunt et sapiente doloribus sit voluptatem est.',
		// 	category: {
		// 		id: 6,
		// 		name: 'Witwe',
		// 		colors: {
		// 			id: 6,
		// 			name: 'Purple',
		// 			main_color: 'B9BAC9',
		// 			primary_color: '9A9BB1',
		// 			secondary_color: '686C91',
		// 		},
		// 	},
		// 	icon: {
		// 		name: 'Baby',
		// 		color:
		// 			'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
		// 	},
		// },
		// {
		// 	id: 401,
		// 	sort: 6,
		// 	date: '1971-02-19',
		// 	date_parts: { day: '19', month: '02', year: '1971' },
		// 	text: 'Qui dolor molestiae velit. Dolorem debitis itaque odit est sint.',
		// 	category: {
		// 		id: 6,
		// 		name: 'Witwe',
		// 		colors: {
		// 			id: 6,
		// 			name: 'Purple',
		// 			main_color: 'B9BAC9',
		// 			primary_color: '9A9BB1',
		// 			secondary_color: '686C91',
		// 		},
		// 	},
		// 	icon: {
		// 		name: 'Baby',
		// 		color:
		// 			'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
		// 	},
		// },
		// {
		// 	id: 400,
		// 	sort: 5,
		// 	date: '1975-03-30',
		// 	date_parts: { day: '30', month: '03', year: '1975' },
		// 	text: 'Voluptatum corporis laboriosam ut incidunt quas pariatur optio. Praesentium ad iure est.',
		// 	category: {
		// 		id: 6,
		// 		name: 'Witwe',
		// 		colors: {
		// 			id: 6,
		// 			name: 'Purple',
		// 			main_color: 'B9BAC9',
		// 			primary_color: '9A9BB1',
		// 			secondary_color: '686C91',
		// 		},
		// 	},
		// 	icon: {
		// 		name: 'Baby',
		// 		color:
		// 			'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
		// 	},
		// },
		// {
		// 	id: 399,
		// 	sort: 4,
		// 	date: '1989-07-06',
		// 	date_parts: { day: '06', month: '07', year: '1989' },
		// 	text: 'Tenetur quis quo est laboriosam. Deleniti nostrum ut exercitationem quis officiis officia.',
		// 	category: {
		// 		id: 6,
		// 		name: 'Witwe',
		// 		colors: {
		// 			id: 6,
		// 			name: 'Purple',
		// 			main_color: 'B9BAC9',
		// 			primary_color: '9A9BB1',
		// 			secondary_color: '686C91',
		// 		},
		// 	},
		// 	icon: {
		// 		name: 'Baby',
		// 		color:
		// 			'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
		// 	},
		// },
		{
			id: 398,
			sort: 3,
			date: '1998-03-05',
			date_parts: { day: '05', month: '03', year: '1998' },
			text: 'Voluptates eaque quis laboriosam voluptates dolor. Mollitia dolorum rerum nesciunt rem distinctio.',
			category: {
				id: 7,
				name: 'Witwe & Gro\u00dfmutter',
				colors: {
					id: 7,
					name: 'Lavander',
					main_color: 'DBC6DA',
					primary_color: 'BB9CBB',
					secondary_color: 'A1659F',
				},
			},
			icon: {
				name: 'Baby',
				color:
					'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
			},
		},
		{
			id: 397,
			sort: 2,
			date: '2000-04-03',
			date_parts: { day: '03', month: '04', year: '2000' },
			text: 'Velit quasi rerum unde accusamus autem et. A voluptas et est et.',
			category: {
				id: 7,
				name: 'Witwe & Gro\u00dfmutter',
				colors: {
					id: 7,
					name: 'Lavander',
					main_color: 'DBC6DA',
					primary_color: 'BB9CBB',
					secondary_color: 'A1659F',
				},
			},
			icon: {
				name: 'Baby',
				color:
					'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
			},
		},
		{
			id: 396,
			sort: 1,
			date: '2010-06-08',
			date_parts: { day: '08', month: '06', year: '2010' },
			text: 'Sunt in quod sequi est. Dolorem ut expedita quidem aut.',
			category: {
				id: 7,
				name: 'Witwe & Gro\u00dfmutter',
				colors: {
					id: 7,
					name: 'Lavander',
					main_color: 'DBC6DA',
					primary_color: 'BB9CBB',
					secondary_color: 'A1659F',
				},
			},
			icon: {
				name: 'Baby',
				color:
					'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
			},
		},
		{
			id: 395,
			sort: 0,
			date: '2010-12-08',
			date_parts: { day: '08', month: '12', year: '2010' },
			text: 'Quia natus et velit voluptatem. Et et sunt quibusdam accusantium.',
			category: {
				id: 7,
				name: 'Witwe & Gro\u00dfmutter',
				colors: {
					id: 7,
					name: 'Lavander',
					main_color: 'DBC6DA',
					primary_color: 'BB9CBB',
					secondary_color: 'A1659F',
				},
			},
			icon: {
				name: 'Baby',
				color:
					'/home/don/development/projects/Vasterra/circleoflife/public/img/icons/memoring/icon-baby.svg',
			},
		},
	],
};

const getData = data => {
	const { events } = data;
	const sortedEvents = events
		.sort(
			(prevItem, currentItem) =>
				new Date(prevItem.date) - new Date(currentItem.date)
		)
		.map(event => {
			const { day, month, year } = event.date_parts;

			return {
				...event,
				date_parts: { day: +day, month: +month, year: +year },
			};
		});

	return { ...data, events: sortedEvents };
};

const newData = getData(data);

const drawer = new CanvasDrawer(
	'canvas',
	'.canvas-wrapper',
	'.canvas-wrapper img',
	newData
);
