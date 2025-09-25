import { LoggerService } from ".";

const state = Symbol.for("state");
const logger = new LoggerService("STORE");
export class StoreService {
  static get(what) {
    if (!window[state]) {
      window[state] = {};
    }
    return window[state][what] || undefined;
  }

  static set(what, toWhat) {
    if (!window[state]) {
      window[state] = {};
    }
    logger.debug("Setting", what, "to", toWhat);
    window[state][what] = toWhat;
  }
}
