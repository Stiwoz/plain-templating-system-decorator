import { Template } from "../classes/template";
import { Ctor } from "../types/Ctor";

const priv = new WeakMap();
export function View({ html = "", style = "" } = {}) {
  return function <T extends Ctor>(
    Cls: T,
    context: ClassDecoratorContext
  ): T | void {
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
      constructor(...args: any[]) {
        super(...args);
        priv.set(this, { tpl: new Template(html) });
        (this as any).render?.(style);
      }
    };
  };
}
