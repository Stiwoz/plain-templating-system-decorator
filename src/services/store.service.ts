import { LoggerService } from "./logger.service";

export const STATE: unique symbol = Symbol.for(
  "state"
) as unknown as typeof STATE;

type StateBag = Record<string, unknown>;

declare global {
  interface Window {
    [STATE]?: StateBag;
  }
}

const logger = new LoggerService("STORE");

export class StoreService {
  private static bag(): StateBag {
    if (!window[STATE]) window[STATE] = {};
    return window[STATE]!;
  }

  static get<T = unknown>(what: string): T | undefined {
    return this.bag()[what] as T | undefined;
  }

  static set<T>(what: string, value: T): void {
    logger.debug("Setting", what, "to", value);
    this.bag()[what] = value;
  }
}
