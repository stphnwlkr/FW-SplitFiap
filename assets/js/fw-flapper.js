const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

class SplitFlap {
  constructor(container) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.container) throw new Error('Container not found');

    const data = this.container.dataset;
    const rawValue = data.values && data.values.trim().length > 0 ? data.values : data.value || '0';
    this.values = rawValue.includes(';') ? rawValue.split(';').map(v => v.trim()) : [rawValue.trim()];

    this.width = parseInt(data.width, 10) || 5;
    this.size = data.size || 'medium';
    this.theme = data.theme || 'dark';
    this.chars = data.chars || 'numeric';
    this.align = data.align || 'left';
    this.pad = data.padding || ' ';

    const CHAR_SETS = {
      numeric: ' 0123456789'.split(''),
      alpha: ' ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      alphanumeric: ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')
    };
    this.characters = CHAR_SETS[this.chars] || CHAR_SETS.numeric;

    this.speed = parseInt(data.speed, 10) || 400;
    this.iterationsMin = parseInt(data.iterationsMin, 10) || 5;
    this.iterationsMax = parseInt(data.iterationsMax, 10) || 8;
    this.cycleDelay = parseInt(data.cycleDelay, 10) || 2000;
    this.loop = (data.loop || 'true').toLowerCase() !== 'false';

    // Apply custom font if set
    this.font = data.font;
    if (this.font) {
      this.container.style.setProperty('--split-flap-font', this.font);
    }

    this.currentIndex = 0;

    this.initDisplay();

    (async () => {
      await this.setValue(this.values[this.currentIndex]);
      if (this.values.length > 1) {
        this.scheduleNextCycle();
      }
    })();
  }

  wrapText(text, maxWidth) {
    const words = text.split(/\s+/);
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + ' ' + word).trim().length <= maxWidth) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  initDisplay() {
    this.container.innerHTML = '';
    this.lineContainers = [];
    this.digits = [];

    const wrapped = this.wrapText(this.values[0], this.width);

    for (const line of wrapped) {
      const row = document.createElement('div');
      row.className = 'split-flap-line';
      const digitRow = [];

      for (let i = 0; i < this.width; i++) {
        const digitEl = document.createElement('div');
        digitEl.className = 'split-flap-digit';

        const top = document.createElement('div');
        top.className = 'split-flap-top';
        top.appendChild(document.createElement('span'));

        const bottom = document.createElement('div');
        bottom.className = 'split-flap-bottom';
        bottom.appendChild(document.createElement('span'));

        const topBack = document.createElement('div');
        topBack.className = 'split-flap-top-back';
        topBack.appendChild(document.createElement('span'));

        const bottomBack = document.createElement('div');
        bottomBack.className = 'split-flap-bottom-back';
        bottomBack.appendChild(document.createElement('span'));

        digitEl.appendChild(top);
        digitEl.appendChild(bottom);
        digitEl.appendChild(topBack);
        digitEl.appendChild(bottomBack);

        row.appendChild(digitEl);
        digitRow.push({ element: digitEl });
      }

      this.container.appendChild(row);
      this.lineContainers.push({ row, digits: digitRow });
      this.digits.push(digitRow);
    }
  }

  async setValue(value) {
    const lines = this.wrapText(value, this.width);
    const allFlips = [];

    for (let rowIndex = 0; rowIndex < lines.length; rowIndex++) {
      const formatted = this.align === 'left'
        ? lines[rowIndex].padEnd(this.width, this.pad)
        : lines[rowIndex].padStart(this.width, this.pad);

      const row = this.digits[rowIndex] || [];
      for (let i = 0; i < this.width; i++) {
        const targetChar = formatted[i] || this.pad;
        if (row[i]) {
          allFlips.push(this.animateDigit(row[i].element, targetChar));
        }
      }
    }

    await Promise.all(allFlips);
  }

  async animateDigit(el, targetChar) {
    const iterations = Math.floor(Math.random() * (this.iterationsMax - this.iterationsMin + 1)) + this.iterationsMin;
    for (let i = 0; i < iterations; i++) {
      const randChar = this.characters[Math.floor(Math.random() * this.characters.length)];
      el.querySelector('.split-flap-top-back span').textContent = randChar;
      el.querySelector('.split-flap-bottom-back span').textContent = randChar;
      el.classList.add('flipping');
      await wait(this.speed);
      el.classList.remove('flipping');
      el.querySelector('.split-flap-top span').textContent = randChar;
      el.querySelector('.split-flap-bottom span').textContent = randChar;
      await wait(5);
    }
    el.querySelector('.split-flap-top-back span').textContent = targetChar;
    el.querySelector('.split-flap-bottom-back span').textContent = targetChar;
    el.classList.add('flipping');
    await wait(this.speed);
    el.classList.remove('flipping');
    el.querySelector('.split-flap-top span').textContent = targetChar;
    el.querySelector('.split-flap-bottom span').textContent = targetChar;
  }

  async scheduleNextCycle() {
    while (true) {
      await wait(this.cycleDelay);

      this.currentIndex++;
      if (this.currentIndex >= this.values.length) {
        if (!this.loop) break;
        this.currentIndex = 0;
      }

      await this.setValue(this.values[this.currentIndex]);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".split-flap-display").forEach(container => {
    new SplitFlap(container);
  });
});

window.SplitFlap = SplitFlap;