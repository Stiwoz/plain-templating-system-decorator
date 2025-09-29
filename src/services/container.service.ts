export const CONTAINER_ID: unique symbol = Symbol.for(
  "sub-window"
) as unknown as typeof CONTAINER_ID;

declare global {
  interface Window {
    [CONTAINER_ID]?: Window;
  }
}

export class ContainerService {
  /**
   * @type Window & typeof globalThis
   */
  static set container(object: Window) {
    window[CONTAINER_ID] = object;
  }

  static get container(): Window {
    if (!window[CONTAINER_ID]) {
      throw new Error("Cannot get container before setting it");
    }
    return window[CONTAINER_ID]!;
  }

  static get parentLocation(): Location {
    return window.location;
  }

  static alert(content?: string): void {
    ContainerService.container.alert(content);
  }

  static prompt(content?: string, _default?: string): string | null {
    return ContainerService.container.prompt(content, _default);
  }

  static parentPageSelector(selector: string) {
    return window.$(selector);
  }

  static fetch(url: string, args?: RequestInit): Promise<Response> {
    return ContainerService.container.fetch(url, args);
  }
}
