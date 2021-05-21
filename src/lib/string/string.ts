export class Strings {
  static parseBoolean(str: string | number | boolean): boolean {
    if (str === true) {
      return true;
    }
    if (str === false) {
      return false;
    }
    if (str === 1) {
      return true;
    }
    if (str === 0) {
      return false;
    }
    if (str === 'true') {
      return true;
    }
    if (!str) {
      return false;
    }
    switch ((str as string).length) {
      case 1: {
        const ch0 = (str as string).charAt(0);
        if (
          ch0 === 'y' ||
          ch0 === 'Y' ||
          ch0 === 't' ||
          ch0 === 'T' ||
          ch0 === '1'
        ) {
          return true;
        }
        if (
          ch0 === 'n' ||
          ch0 === 'N' ||
          ch0 === 'f' ||
          ch0 === 'F' ||
          ch0 === '0'
        ) {
          return false;
        }
        break;
      }
      case 2: {
        const ch0 = (str as string).charAt(0);
        const ch1 = (str as string).charAt(1);
        if ((ch0 === 'o' || ch0 === 'O') && (ch1 === 'n' || ch1 === 'N')) {
          return true;
        }
        if ((ch0 === 'n' || ch0 === 'N') && (ch1 === 'o' || ch1 === 'O')) {
          return false;
        }
        break;
      }
      case 3: {
        const ch0 = (str as string).charAt(0);
        const ch1 = (str as string).charAt(1);
        const ch2 = (str as string).charAt(2);
        if (
          (ch0 === 'y' || ch0 === 'Y') &&
          (ch1 === 'e' || ch1 === 'E') &&
          (ch2 === 's' || ch2 === 'S')
        ) {
          return true;
        }
        if (
          (ch0 === 'o' || ch0 === 'O') &&
          (ch1 === 'f' || ch1 === 'F') &&
          (ch2 === 'f' || ch2 === 'F')
        ) {
          return false;
        }
        break;
      }
      case 4: {
        const ch0 = (str as string).charAt(0);
        const ch1 = (str as string).charAt(1);
        const ch2 = (str as string).charAt(2);
        const ch3 = (str as string).charAt(3);
        if (
          (ch0 === 't' || ch0 === 'T') &&
          (ch1 === 'r' || ch1 === 'R') &&
          (ch2 === 'u' || ch2 === 'U') &&
          (ch3 === 'e' || ch3 === 'E')
        ) {
          return true;
        }
        break;
      }
      case 5: {
        const ch0 = (str as string).charAt(0);
        const ch1 = (str as string).charAt(1);
        const ch2 = (str as string).charAt(2);
        const ch3 = (str as string).charAt(3);
        const ch4 = (str as string).charAt(4);
        if (
          (ch0 === 'f' || ch0 === 'F') &&
          (ch1 === 'a' || ch1 === 'A') &&
          (ch2 === 'l' || ch2 === 'L') &&
          (ch3 === 's' || ch3 === 'S') &&
          (ch4 === 'e' || ch4 === 'E')
        ) {
          return false;
        }
        break;
      }
      default:
        break;
    }

    return false;
  }
}
