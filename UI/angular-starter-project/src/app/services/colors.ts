import { Injectable } from '@angular/core';

declare var $: any;

@Injectable()
export class ColorsService {

  bootstrapColors: Object = {
    "light": "#f5f5f5",
    "dark": "#212121",
    "default": "#424242",
    "primary": "#303f9f",
    "secondary": "#00796b",
    "info": "#1976d2",
    "success": "#388e3c",
    "warning": "#ffa000",
    "danger": "#b71c1c",
  };

  palettes: Object = {
    "light": {
      "background-color": "#fff",
      "odd-color": "#fafafa",
      "even-color": "#f5f5f5",
      "hover-color": "#f0f0f0",
      "border-color": "#ebebeb",
      "color": "#212121",
      "highlight-color": "#ffa000",
      "alt-highlight-color": "#303f9f",
    },
    "dark": {
      "background-color": "#212121",
      "odd-color": "#262626",
      "even-color": "#2b2b2b",
      "hover-color": "#2e2e2e",
      "border-color": "#303030",
      "color": "#f5f5f5",
      "highlight-color": "#ffa000",
      "alt-highlight-color": "#303f9f",
    },
    "indigo": {
      "background-color": "#1a237e",
      "odd-color": "#1c2586",
      "even-color": "#1d288f",
      "hover-color": "#1e2993",
      "border-color": "#1f2a97",
      "color": "#f5f5f5",
      "highlight-color": "#ffa000",
      "alt-highlight-color": "#303f9f",
    },
    "blue-grey": {
      "background-color": "#263238",
      "odd-color": "#2a373e",
      "even-color": "#2e3d44",
      "hover-color": "#304047",
      "border-color": "#32424a",
      "color": "#f5f5f5",
      "highlight-color": "#ffa000",
      "alt-highlight-color": "#303f9f",
    }
  };

  getColors(): Object {
    return this.bootstrapColors;
  }

  getBootstrapColors(): Object {
    return this.bootstrapColors;
  }

  getPalettes(): Object {
    return this.palettes;
  }

  getPalette(): Object {
    let background = $('body').attr('data-background');
    return this.palettes[background];
  }

  lighten(col: string, amt: number): string {
    amt = Math.abs(amt);
    amt = amt / 100;
    return this.colorLuminance(col, amt);
  }
  darken(col: string, amt: number): string {
    amt = Math.abs(amt);
    amt = (amt / 100) * -1;
    return this.colorLuminance(col, amt);
  }

  //http://stackoverflow.com/questions/21646738/convert-hex-to-rgba
  hexToRgbA(hex: string, opacity: number): string {
    let c: any;
    const o: number = opacity || 1;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + o + ')';
    }
    return '';
  }

  //http://www.sitepoint.com/javascript-generate-lighter-darker-color/
  colorLuminance(hex: string, lum: number): string {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;
    // convert to decimal and change luminosity
    let rgb = '#',
      c: any, i: any;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ('00' + c).substr(c.length);
    }
    return rgb;
  }

}
