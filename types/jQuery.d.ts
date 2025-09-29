type JQueryEl = Element | Document | Window;

interface JQueryLite {
  length: number;
  [index: number]: Element;
  on(event: string, handler: (e: any) => void): this;
  off(event?: string): this;
  find(sel: string): JQueryLite;
  attr(name: string, value?: string): string | this;
  val(value?: string): string | this;
  text(value?: string): string | this;
  html(value?: string): string | this;
  css(name: string, value?: string): string | this;
}

declare function $(
  selector?: string | JQueryEl | JQueryEl[] | (() => void)
): JQueryLite;

declare const jQuery: typeof $;

declare namespace $ {
  function ajax(opts: any): any;
  function ready(fn: () => void): void;
}

declare global {
  interface Window {
    $: typeof $;
    jQuery: typeof $;
  }
}
export {};
