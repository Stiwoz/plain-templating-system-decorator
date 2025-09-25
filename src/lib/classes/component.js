const prev = Symbol("prev");
const styletag = Symbol("styletag");
export class Component {
  /**
   * @param {HTMLElement} element
   */
  constructor(element) {
    this.element = element;
    this[prev] = undefined;
    this[styletag] = undefined;
  }

  /**
   * Renders the component, including its css, attaching all the event handlers
   * @param {string?} style
   * @returns void
   */
  render(style) {
    const newHtml = this.__html;
    if (style && style.length) {
      if (!this.styletag) {
        this.styletag = document.createElement("style");
        this.styletag.setAttribute("component", this.__class_name);
      }
      this.styletag.innerHTML = "";
      this.styletag.appendChild(document.createTextNode(style));
      document.head.appendChild(this.styletag);
    }
    if (!this.element || newHtml == this[prev]) return;
    this.#unbindHandlers();
    this[prev] = newHtml;
    this.element.innerHTML = newHtml;
    this.#bindHandlers();
  }

  #unbindHandlers() {
    if (!this.handlers) return;
    (this.handlers || []).forEach((handler) => {
      const elements = document.querySelectorAll(handler.selector);
      elements.forEach((element) => {
        element.removeEventListener(handler.event, handler.function);
      });
    });
  }

  #bindHandlers() {
    if (!this.handlers) return;
    (this.handlers || []).forEach((handler) => {
      const elements = document.querySelectorAll(handler.selector);
      elements.forEach((element) => {
        element.addEventListener(handler.event, handler.function);
      });
    });
  }
}
