import index from "./index.html";
import globalStyle from "./main.scss";
import { HelloWorld } from "../components";
import { ContainerService, StoreService } from "@/services";
import { STRINGS, CONSTANTS } from "@/data";

const init = () => {
  if (window.location.href != CONSTANTS.HR_PAGE) {
    window.alert(STRINGS.WRONG_PAGE_ERROR);
    return false;
  }

  if (ContainerService.container && !ContainerService.container.closed) {
    ContainerService.container.focus();
  } else {
    const container = window.open("", "", CONSTANTS.CONTAINER_WINDOW_PARAMS);
    if (!container) {
      window.alert(STRINGS.NO_POPUP_ERROR);
      return false;
    }
    ContainerService.container = container;
    ContainerService.container.document.writeln(index);
    const styletag = ContainerService.container.document.createElement("style");
    styletag.innerHTML = "";
    styletag.appendChild(
      ContainerService.container.document.createTextNode(globalStyle)
    );
    ContainerService.container.document.head.appendChild(styletag);
  }

  if (!StoreService.get(CONSTANTS.STATE.OP_API_KEY)) {
    const op_api_key = ContainerService.container.prompt(
      STRINGS.OPENPROJECT_API_KEY_PROMPT
    );
    if (op_api_key === null || !op_api_key.length) {
      ContainerService.container.alert(STRINGS.NO_OPENPROJECT_API_KEY_ERROR);
      ContainerService.container.close();
      return false;
    }
    StoreService.set(CONSTANTS.STATE.OP_API_KEY, op_api_key);
  }
  return true;
};

const run = () => {
  const rootEl =
    ContainerService.container.document.querySelector<HTMLElement>("#root");
  if (rootEl) {
    const hw = new HelloWorld(rootEl);
  }
};

// try {
const inited = init();
inited && run();
// } catch (e) {
// In case of a bad error, we close the window and bubble the error up to the console
// ContainerService.container.close();
// throw e;
// }
