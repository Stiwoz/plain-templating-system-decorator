import { Template } from "../classes";

const priv = new WeakMap();
export function View({ html = "", style = "" } = {}) {
  return function (Cls, context) {
    if (context.kind !== "class") {
      throw new TypeError("@View decorator only works on classes");
    }

    Object.defineProperty(Cls.prototype, "__html", {
      get() {
        const { tpl } = priv.get(this);
        return tpl.compile(this);
      },
      configurable: true,
    });

    Object.defineProperty(Cls.prototype, "__class_name", {
      get() {
        return Cls.name;
      },
      configurable: true,
    });

    return class WithView extends Cls {
      constructor(...args) {
        super(...args);
        priv.set(this, { tpl: new Template(html) });
        this.render(style);
      }
    };
  };
}
