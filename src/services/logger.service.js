export class LoggerService {
  constructor(prefix = null, needsStack = false) {
    this.PREFIX_STYLE = "font-weight:bold;color:yellow;";
    this.DEFAULT_STYLE = "font-wight:initial;color:initial;";
    this.REMOTE_LOG_URL = false; //REMOTE_LOG_URL;

    this.prefix = prefix ? `LOGGER :: [${prefix}]` : "LOGGER :: ";
    this.suffix = prefix
      ? [LoggerService.PREFIX_STYLE, LoggerService.DEFAULT_STYLE]
      : [];
    this.stack = needsStack ? true : false;
    this.prod = false; // ENV == "production";
    this.console = console;
  }

  _remote(...args) {
    if (LoggerService.REMOTE_LOG_URL && typeof fetch == "function") {
      const type = args.splice(0, 1)[0];
      this._post(LoggerService.REMOTE_LOG_URL, {
        type: type,
        data: args
          .map((e) => (typeof e != "string" ? JSON.stringify(e) : e))
          .join("|"),
      });
    }
  }

  _post(url, data = {}) {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((r) => r.json())
      .catch(() => {});
  }

  _getStack() {
    if (!this.stack) return "";
    return (
      "\n" +
      new Error().stack
        .split("\n")
        .filter(
          (row) =>
            row.indexOf("webpack") > -1 && row.indexOf("LoggerService") < 0
        )
        .map((row) => row.replace("at", ">>"))
        .join("\n")
    );
  }

  debug(...args) {
    if (this.stack) {
      args.push(this._getStack());
    }
    this.console.debug(this.prefix, ...args);
  }
  log(...args) {
    if (this.stack) {
      args.push(this._getStack());
    }
    this.console.log(this.prefix, ...args);
    this._remote("LOG", this.prefix, ...args);
  }
  warn(...args) {
    if (this.stack) {
      args.push(this._getStack());
    }
    this.console.warn(this.prefix, ...args);
    this._remote("WARN", this.prefix, ...args);
  }
  error(...args) {
    if (this.stack) {
      args.push(this._getStack());
    }
    this.console.error(this.prefix, ...args);
    this._remote("ERROR", this.prefix, ...args);
  }

  multi(mode = "log", ...args) {
    const l = (a) => this.console && this.console[mode](a);
    this.console.group(this.prefix);
    args.map(l);
    this.console.groupEnd();
  }
}
