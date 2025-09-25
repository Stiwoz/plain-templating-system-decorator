import index from "./index.html";
import globalStyle from "./main.scss";
import { HelloWorld } from "@/components";
import { CONSTANTS } from "@/data";

const init = () => {
  document.innerHTML = "";
  document.writeln(index);

  const styletag = document.createElement("style");
  styletag.innerHTML = "";
  styletag.appendChild(document.createTextNode(globalStyle));
  document.head.appendChild(styletag);

  return true;
};

const run = () => {
  const hello = new HelloWorld(
    document.querySelector(CONSTANTS.ROOT_ELEMENT_SELECTOR)
  );
};

const inited = init();
inited && run();
