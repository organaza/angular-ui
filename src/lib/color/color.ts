export class Color {
  red = 0;
  green = 0;
  blue = 0;
  alpha = 1;
  hue: number;
  saturation: number;
  brightness: number;
  lightness: number;
  gradientType: number;

  static getColorFromCSS(pixelValue: string) {
    if (!pixelValue) {
      return;
    }
    const c = new Color(pixelValue);
    return c.getHex8();
  }
  static getAlphaFromCSS(pixelValue: string) {
    if (!pixelValue) {
      return;
    }
    const c = new Color(pixelValue);
    return c.alpha;
  }

  constructor(color: string, opts?: any) {
    if (color) {
      if (color.toLowerCase().startsWith('rgba')) {
        this.parseRGBA(color);
      } else if (color.toLowerCase().startsWith('rgb')) {
        this.parseRGB(color);
      } else if (color.startsWith('#')) {
        this.parseHex(color);
      }
    }
    if (opts) {
      if (opts.gradientType) {
        this.gradientType = opts.gradientType;
      }
    }
  }
  parseRGBA(color: string) {
    const aRGBA = color.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+.*\d*)\s*\)$/i);
    if (aRGBA) {
      this.red = parseInt(aRGBA[1], 10);
      this.green = parseInt(aRGBA[2], 10);
      this.blue = parseInt(aRGBA[3], 10);
      this.alpha = parseInt(aRGBA[4], 10);
    }
  }
  parseRGB(color: string) {
    const aRGB = color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if (aRGB) {
      this.red = parseInt(aRGB[1], 10);
      this.green = parseInt(aRGB[2], 10);
      this.blue = parseInt(aRGB[3], 10);
      this.alpha = 1;
    }
  }
  parseHex(color: string) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    color = color.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    if (result) {
      this.red = parseInt(result[1], 16);
      this.green = parseInt(result[2], 16);
      this.blue = parseInt(result[3], 16);
      this.alpha = 1;
    }
  }
  rgbToHsv() {
    const r = this.bound01(this.red, 255);
    const g = this.bound01(this.green, 255);
    const b = this.bound01(this.blue, 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number;
    let s: number;
    const v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
      h = 0; // achromatic
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    this.hue = h;
    this.saturation = s;
    this.brightness = v;
  }
  rgbToHsl() {
    const r = this.bound01(this.red, 255);
    const g = this.bound01(this.green, 255);
    const b = this.bound01(this.blue, 255);

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = (max + min) / 2;
    let s = (max + min) / 2;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      if (l > 0.5) {
        s = d / (2 - max - min);
      } else {
        s = d / (max + min);
      }
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    this.hue = h;
    this.saturation = s;
    this.lightness = l;
  }

  hslToRgb() {
    const h = this.hue;
    const s = this.saturation;
    const l = this.lightness;

    let r, g, b = 0;

    const hue2rgb = function(p: number, q: number, t: number) {
      if (t < 0) {
        t += 1;
      }
      if (t > 1) {
        t -= 1;
      }
      if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
      }
      if (t < 1 / 2) {
        return q;
      }
      if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
      }
      return p;
    };

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    this.red = r * 255;
    this.green = g * 255;
    this.blue = b * 255;
  }
  getHex() {
    // tslint:disable-next-line:no-bitwise
    const hex = this.blue | (this.green << 8) | (this.red << 16);
    return '#' + (0x1000000 + hex).toString(16).slice(1);
  }
  getRGB() {
    return (this.alpha !== 1) ?
      `rgba(${this.red},${this.green},${this.blue},${this.alpha})` :
      `rgb(${this.red},${this.green},${this.blue})`;
  }
  getPercentageRgb() {
    const _roundA = Math.round(100 * this.alpha) / 100;
    const r = Math.round(this.bound01(this.red, 255) * 100);
    const g = Math.round(this.bound01(this.green, 255) * 100);
    const b = Math.round(this.bound01(this.blue, 255) * 100);
    return (this.alpha === 1) ? `rgb(${r}%, ${g}%, ${b}%)` : `rgb(${r}%, ${g}%, ${b}%, ${_roundA})`;
  }
  getHex8() {
    let hex = this.red;
    // tslint:disable-next-line:no-bitwise
    hex = (hex << 8) + this.green;
    // tslint:disable-next-line:no-bitwise
    hex = (hex << 8) + this.blue;
    return hex;
  }
  getHsv() {
    // return `hsv(${this.hue * 36},${this.saturation},${this.brightness},${this.alpha})`;
    this.rgbToHsv();
    const h = Math.round(this.hue * 360);
    const s = Math.round(this.saturation * 100);
    const v = Math.round(this.brightness * 100);
    const _roundA = Math.round(100 * this.alpha) / 100;
    return (this.alpha === 1) ?
      'hsv(' + h + ', ' + s + '%, ' + v + '%)' :
      'hsva(' + h + ', ' + s + '%, ' + v + '%, ' + _roundA + ')';
  }
  getHsl() {
    this.rgbToHsl();
    const h = Math.round(this.hue * 360);
    const s = Math.round(this.saturation * 100);
    const l = Math.round(this.lightness * 100);
    const _roundA = Math.round(100 * this.alpha) / 100;
    return (this.alpha === 1) ?
      'hsl(' + h + ', ' + s + '%, ' + l + '%)' :
      'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + _roundA + ')';
  }
  getBrightness() {
    // http://www.w3.org/TR/AERT#color-contrast
    return (this.red * 299 + this.green * 587 + this.blue * 114) / 1000;
  }
  getLuminance() {
    // http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
    const RsRGB = this.red / 255;
    const GsRGB = this.green / 255;
    const BsRGB = this.blue / 255;
    let R: number;
    let G: number;
    let B: number;

    if (RsRGB <= 0.03928) { R = RsRGB / 12.92; } else { R = Math.pow(((RsRGB + 0.055) / 1.055), 2.4); }
    if (GsRGB <= 0.03928) { G = GsRGB / 12.92; } else { G = Math.pow(((GsRGB + 0.055) / 1.055), 2.4); }
    if (BsRGB <= 0.03928) { B = BsRGB / 12.92; } else { B = Math.pow(((BsRGB + 0.055) / 1.055), 2.4); }
    return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
  }
  isOnePointZero(n: any) {
    return typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1;
  }
  isPercentage(n: any) {
    return typeof n === 'string' && n.indexOf('%') !== -1;
  }
  // Take input from [0, n] and return it as [0, 1]
  bound01(n: any, max: number) {
    if (this.isOnePointZero(n)) { n = '100%'; }

    const processPercent = this.isPercentage(n);
    n = Math.min(max, Math.max(0, parseFloat(n)));

    // Automatically convert percentage into number
    if (processPercent) {
      n = n * max / 100;
    }

    // Handle floating point rounding errors
    if ((Math.abs(n - max) < 0.000001)) {
      return 1;
    }

    // Convert into [0, 1] range if it isn't already
    return (n % max) / parseFloat(max.toString());
  }
  toFilter(secondColor: string) {
    const hex8String = '#' + this.rgbaToArgbHex();
    let secondHex8String = hex8String;
    const gradientType = this.gradientType ? 'GradientType = 1, ' : '';

    if (secondColor) {
      const s = new Color(secondColor);
      secondHex8String = '#' + s.rgbaToArgbHex();
    }

    return `progid:DXImageTransform.Microsoft.gradient(${gradientType}startColorstr=${hex8String},endColorstr=${secondHex8String})`;
  }
  // Converts an RGBA color to an ARGB Hex8 string
  // Rarely used, but required for 'toFilter()'
  rgbaToArgbHex() {
    const hex = [
      this.pad2(this.convertDecimalToHex(this.alpha)),
      this.pad2(Math.round(this.red).toString(16)),
      this.pad2(Math.round(this.green).toString(16)),
      this.pad2(Math.round(this.blue).toString(16))
    ];
    return hex.join('');
  }
  // Converts a decimal to a hex value
  convertDecimalToHex(d: number) {
    return Math.round(parseFloat(d.toString()) * 255).toString(16);
  }
  // Force a hex value to have 2 characters
  pad2(c: string) {
    return c.length === 1 ? '0' + c : '' + c;
  }
  clone() {
    return new Color(this.getRGB());
  }
  blend(color: Color) {
    const rgb = this.clone();
    rgb.red = (rgb.red * (1 - this.alpha)) + (color.red * this.alpha);
    rgb.green = (rgb.green * (1 - this.alpha)) + (color.green * this.alpha);
    rgb.blue = (rgb.blue * (1 - this.alpha)) + (color.blue * this.alpha);
    rgb.alpha = (rgb.alpha * (1 - this.alpha)) + (color.alpha * this.alpha);
    return rgb;
  }
  schemeFromDegrees(degrees: any) {
    const newColors: Color[] = [];
    for (let i = 0; i < degrees.length; i++) {
      const col = this.clone();
      col.hue = (this.hue + degrees[i]) % 360;
      newColors.push(col);
    }
    return newColors;
  }
  complementaryScheme() {
    return this.schemeFromDegrees([0, 180]);
  }
  splitComplementaryScheme() {
    return this.schemeFromDegrees([0, 150, 320]);
  }
  splitComplementaryCWScheme() {
    return this.schemeFromDegrees([0, 150, 300]);
  }
  splitComplementaryCCWScheme() {
    return this.schemeFromDegrees([0, 60, 210]);
  }
  triadicScheme() {
    return this.schemeFromDegrees([0, 120, 240]);
  }
  clashScheme() {
    return this.schemeFromDegrees([0, 90, 270]);
  }
  tetradicScheme() {
    return this.schemeFromDegrees([0, 90, 180, 270]);
  }
  fourToneCWScheme() {
    return this.schemeFromDegrees([0, 60, 180, 240]);
  }
  fourToneCCWScheme() {
    return this.schemeFromDegrees([0, 120, 180, 300]);
  }
  fiveToneAScheme() {
    return this.schemeFromDegrees([0, 115, 155, 205, 245]);
  }
  fiveToneBScheme() {
    return this.schemeFromDegrees([0, 40, 90, 130, 245]);
  }
  fiveToneCScheme() {
    return this.schemeFromDegrees([0, 50, 90, 205, 320]);
  }
  fiveToneDScheme() {
    return this.schemeFromDegrees([0, 40, 155, 270, 310]);
  }
  fiveToneEScheme() {
    return this.schemeFromDegrees([0, 115, 230, 270, 320]);
  }
  sixToneCWScheme() {
    return this.schemeFromDegrees([0, 30, 120, 150, 240, 270]);
  }
  sixToneCCWScheme() {
    return this.schemeFromDegrees([0, 90, 120, 210, 240, 330]);
  }
  neutralScheme() {
    return this.schemeFromDegrees([0, 15, 30, 45, 60, 75]);
  }
  analogousScheme() {
    return this.schemeFromDegrees([0, 30, 60, 90, 120, 150]);
  }
}
