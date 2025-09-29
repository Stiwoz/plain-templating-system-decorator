type ConsoleMethod = "debug" | "log" | "warn" | "error";

export class LoggerService {
  private static PREFIX_STYLE = "font-weight:bold;color:yellow;";
  private static DEFAULT_STYLE = "font-wight:initial;color:initial;";
  private static REMOTE_LOG_URL?: string;

  private prefix: string;
  private suffix: string[];
  private stack: boolean;
  private prod = false;
  private console = console;

  constructor(prefix?: string, needsStack = false) {
    this.prefix = prefix ? `LOGGER :: [${prefix}]` : "LOGGER :: ";
    this.suffix = prefix
      ? [LoggerService.PREFIX_STYLE, LoggerService.DEFAULT_STYLE]
      : [];
    this.stack = needsStack ? true : false;
  }

  _remote(...args: any[]) {
    if (!LoggerService.REMOTE_LOG_URL || typeof fetch != "function") {
      return;
    }
    const type = args.splice(0, 1)[0];
    this._post(LoggerService.REMOTE_LOG_URL, {
      type: type,
      data: args
        .map((e) => (typeof e != "string" ? JSON.stringify(e) : e))
        .join("|"),
    });
  }

  _post(url: string, data = {}) {
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
    const stack = new Error().stack || "";
    return (
      "\n" +
      stack
        .split("\n")
        .filter(
          (row) =>
            row.indexOf("webpack") > -1 && row.indexOf("LoggerService") < 0
        )
        .map((row) => row.replace("at", ">>"))
        .join("\n")
    );
  }

  debug(...args: any[]) {
    if (this.stack) {
      args.push(this._getStack());
    }
    this.console.debug(this.prefix, ...args);
  }
  log(...args: any[]) {
    if (this.stack) {
      args.push(this._getStack());
    }
    this.console.log(this.prefix, ...args);
    this._remote("LOG", this.prefix, ...args);
  }
  warn(...args: any[]) {
    if (this.stack) {
      args.push(this._getStack());
    }
    this.console.warn(this.prefix, ...args);
    this._remote("WARN", this.prefix, ...args);
  }
  error(...args: any[]) {
    if (this.stack) {
      args.push(this._getStack());
    }
    this.console.error(this.prefix, ...args);
    this._remote("ERROR", this.prefix, ...args);
  }

  multi(mode: ConsoleMethod = "log", ...args: any[]) {
    const l = (a: any) => this.console && this.console[mode](a);
    this.console.group(this.prefix);
    args.map(l);
    this.console.groupEnd();
  }
}
