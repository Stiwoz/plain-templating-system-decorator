export class Template {
  private re = /<%([^%>]+)?%>/g;
  private reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;
  private code = "with (this) { let r=[];\n";
  private cursor = 0;
  private match: RegExpExecArray | null;

  constructor(html = "") {
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

  compile(scope: this): Function {
    return new Function(this.code.replace(/[\r\t\n]/g, "")).apply(scope);
  }

  add(line = "", js = false): Template["add"] {
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
