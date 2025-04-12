// Utility wait helper using requestAnimationFrame for smooth timing.
const wait = ms => new Promise(resolve => {
    let start = performance.now();
    const check = () => {
      if (performance.now() - start >= ms) {
        resolve();
      } else {
        requestAnimationFrame(check);
      }
    };
    requestAnimationFrame(check);
  });
  
  class SplitFlap {
    /**
     * @param {HTMLElement|string} container - Container element or selector string.
     */
    constructor(container) {
      // Resolve container element.
      this.container = (typeof container === 'string')
        ? document.querySelector(container)
        : container;
      if (!this.container) throw new Error('Container not found');
  
      // Read options from data attributes.
      const data = this.container.dataset;
      
      // "values" takes precedence over "value" (semicolon-delimited if more than one).
      this.rawValues = data.values && data.values.trim().length > 0 
        ? data.values 
        : data.value || '0';
      if (this.rawValues.indexOf(';') !== -1) {
        this.values = this.rawValues.split(';').map(v => v.trim());
      } else {
        this.values = [this.rawValues.trim()];
      }
      
      // 'width' represents the maximum number of tiles per row.
      this.width = parseInt(data.width, 10) || 5;
      this.size = data.size || 'medium';
      this.theme = data.theme || 'dark';
      this.chars = data.chars || 'numeric';
      
      // Alignment and padding.
      this.align = data.align || 'left';
      this.pad = data.padding || ' ';
      
      // Define character sets.
      const CHAR_SETS = {
        numeric: [' ', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        alpha: [
          ' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
          'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
          'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
        ],
        alphanumeric: [
          ' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
          'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
          'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
          '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
        ]
      };
      this.characters = CHAR_SETS[this.chars] || CHAR_SETS.numeric;
      
      // Timing settings.
      this.speed = parseInt(data.speed, 10) || 400; // duration of each flip cycle (ms)
      this.iterationsMin = parseInt(data.iterationsMin, 10) || 5;
      this.iterationsMax = parseInt(data.iterationsMax, 10) || 8;
      this.cycleDelay = parseInt(data.cycleDelay, 10) || 2000; // delay between cycles (ms)
      this.loop = (typeof data.loop !== 'undefined' && data.loop.toLowerCase() === 'false')
        ? false
        : true;
      
      // Initialize display (build rows/tiles).
      this.init();
      // Start cycling through values.
      this.cycleValues();
    }
    
    /**
     * Wraps a text string into an array of lines without breaking words.
     * @param {string} text - The text to wrap.
     * @param {number} maxTiles - Maximum number of characters (tiles) per line.
     * @returns {Array<string>} - The wrapped lines.
     */
    wrapText(text, maxTiles) {
      const words = text.split(/\s+/);
      const lines = [];
      let currentLine = '';
      
      words.forEach(word => {
        if (currentLine === '') {
          currentLine = word;
        } else if ((currentLine.length + 1 + word.length) <= maxTiles) {
          currentLine += ' ' + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      });
      if (currentLine !== '') {
        lines.push(currentLine);
      }
      return lines;
    }
    
    /**
     * Initializes the display by generating line containers for each wrapped line.
     * Each wrapped line is rendered as a .split-flap-line containing a set of digit panels.
     */
    init() {
      this.container.innerHTML = '';
      this.lineContainers = [];
      
      // Use the first value from the values array.
      let text = this.values[0] || '';
      // Wrap the text based on the maximum number of tiles (this.width).
      const wrappedLines = this.wrapText(text, this.width);
      
      wrappedLines.forEach(line => {
        // Format the line using the alignment setting.
        const formatted = (this.align.toLowerCase() === 'left')
          ? line.padEnd(this.width, this.pad)
          : line.padStart(this.width, this.pad);
        
        const lineDiv = document.createElement('div');
        lineDiv.className = 'split-flap-line';
        
        const digitElements = [];
        for (let i = 0; i < this.width; i++) {
          const char = formatted[i] || this.pad;
          const digitEl = document.createElement('div');
          digitEl.className = 'split-flap-digit';
          
          // Create panels for the digit.
          const top = document.createElement('div');
          top.className = 'split-flap-top';
          const topSpan = document.createElement('span');
          topSpan.textContent = char;
          top.appendChild(topSpan);
          
          const bottom = document.createElement('div');
          bottom.className = 'split-flap-bottom';
          const bottomSpan = document.createElement('span');
          bottomSpan.textContent = char;
          bottom.appendChild(bottomSpan);
          
          const topBack = document.createElement('div');
          topBack.className = 'split-flap-top-back';
          const topBackSpan = document.createElement('span');
          topBackSpan.textContent = char;
          topBack.appendChild(topBackSpan);
          
          const bottomBack = document.createElement('div');
          bottomBack.className = 'split-flap-bottom-back';
          const bottomBackSpan = document.createElement('span');
          bottomBackSpan.textContent = char;
          bottomBack.appendChild(bottomBackSpan);
          
          // Append panels to digit element.
          digitEl.appendChild(top);
          digitEl.appendChild(bottom);
          digitEl.appendChild(topBack);
          digitEl.appendChild(bottomBack);
          
          lineDiv.appendChild(digitEl);
          digitElements.push({ element: digitEl });
        }
        
        this.lineContainers.push({
          container: lineDiv,
          digits: digitElements,
          text: formatted
        });
        
        this.container.appendChild(lineDiv);
      });
    }
    
    /**
     * Animates all digit panels in every line to a target value.
     * It wraps the target text and then updates the corresponding panels.
     * @param {string} value - The target text.
     */
    async animateToValue(value) {
      const wrapped = this.wrapText(value, this.width);
      const animations = [];
      
      // Animate each line. If a line is missing, default to the pad character.
      for (let lineIndex = 0; lineIndex < this.lineContainers.length; lineIndex++) {
        let lineText = wrapped[lineIndex] || '';
        const formatted = (this.align.toLowerCase() === 'left')
          ? lineText.padEnd(this.width, this.pad)
          : lineText.padStart(this.width, this.pad);
        
        const lineAnim = this.lineContainers[lineIndex].digits.map((digitObj, i) =>
          this.animateDigit(digitObj.element, formatted[i] || this.pad)
        );
        animations.push(Promise.all(lineAnim));
      }
      await Promise.all(animations);
    }
    
    /**
     * Animates a single digit element to a target character,
     * performing several random flip iterations.
     * @param {HTMLElement} el - The digit element.
     * @param {string} targetChar - The final character.
     */
    async animateDigit(el, targetChar) {
      const iterations = Math.floor(Math.random() * (this.iterationsMax - this.iterationsMin + 1)) + this.iterationsMin;
      for (let i = 0; i < iterations; i++) {
        const randomChar = this.characters[Math.floor(Math.random() * this.characters.length)];
        // Update both back panels.
        el.querySelector('.split-flap-top-back span').textContent = randomChar;
        el.querySelector('.split-flap-bottom-back span').textContent = randomChar;
        el.classList.add('flipping');
        await wait(this.speed);
        el.classList.remove('flipping');
        // Update both front panels.
        el.querySelector('.split-flap-top span').textContent = randomChar;
        el.querySelector('.split-flap-bottom span').textContent = randomChar;
        await wait(50);
      }
      // Final flip to target character.
      el.querySelector('.split-flap-top-back span').textContent = targetChar;
      el.querySelector('.split-flap-bottom-back span').textContent = targetChar;
      el.classList.add('flipping');
      await wait(this.speed);
      el.classList.remove('flipping');
      el.querySelector('.split-flap-top span').textContent = targetChar;
      el.querySelector('.split-flap-bottom span').textContent = targetChar;
    }
    
    /**
     * Continuously cycles through the provided values.
     * If loop is enabled, cycles indefinitely; otherwise, runs once through the values.
     */
    async cycleValues() {
      if (this.loop) {
        let index = 0;
        while (true) {
          await this.animateToValue(this.values[index]);
          await wait(this.cycleDelay);
          index = (index + 1) % this.values.length;
        }
      } else {
        for (let i = 0; i < this.values.length; i++) {
          await this.animateToValue(this.values[i]);
          if (i < this.values.length - 1) {
            await wait(this.cycleDelay);
          }
        }
      }
    }
  }
  
  // Global initialization: instantiate each split-flap display when DOM content is loaded.
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.split-flap-display').forEach(container => {
      new SplitFlap(container);
    });
  });
  
  // Expose the class to the global scope if necessary.
  window.SplitFlap = SplitFlap;