export class UtilsService {
  static formatDecimals(number) {
    let n = parseFloat(number);
    if (n < 1) {
      n = n.toPrecision(2).replace(".", ",");
    } else {
      n = n.toPrecision(n.toFixed(0).length + 2).replace(".", ",");
    }

    const expl = n.split(",");
    const chars = expl[expl.length - 1].toString().length;
    if (chars > 0 && chars < 2) {
      // add last char as 0 so that we have 2 decimals
      n = n + "0";
    } else if (chars > 2) {
      // if decimals chars are more than 2, the last one should be 0 and can be removed
      n = n.substring(0, n.length - 1);
    }

    return n;
  }
}
