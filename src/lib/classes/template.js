export class Template {
  constructor(html = "") {
    this.re = /<%([^%>]+)?%>/g;
    this.reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;
    this.code = "with (this) { let r=[];\n";
    this.cursor = 0;
    this.match = undefined;

    while ((this.match = this.re.exec(html))) {
      this.add(html.slice(this.cursor, this.match.index)).apply(this, [
        this.match[1],
        true,
      ]);
      this.cursor = this.match.index + this.match[0].length;
    }
    this.add(html.substring(this.cursor, html.length));
    this.code += 'return r.join(""); }';
  }

  compile(scope) {
    return new Function(this.code.replace(/[\r\t\n]/g, "")).apply(scope);
  }

  add(line = "", js) {
    if (js) {
      if (line.match(this.reExp)) {
        this.code += line + "\n";
      } else {
        this.code += "r.push(" + line + ");\n";
      }
    } else if (line.length) {
      this.code += 'r.push("' + line.replace(/"/g, '\\"') + '");\n';
    }
    return this.add;
  }
}
