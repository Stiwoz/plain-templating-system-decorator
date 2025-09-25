import template from "./hello-world.tpl.html";
import styles from "./hello-world.scss";
import { Component, View } from "@/lib";
import { STRINGS } from "@/data";
import { ApiService, LoggerService } from "@/services";

@View({ html: template, style: styles })
export class HelloWorld extends Component {
  loaders = {
    button: false,
  };
  handlers = [
    {
      selector: "#button",
      event: "click",
      function: this.handleClick.bind(this),
    },
  ];
  text = STRINGS.HELLO_WORLD.TEXT;
  list = [1, 2, 3];
  options = [];
  api = new ApiService();
  logger = new LoggerService("HelloWorld");

  constructor(element) {
    super(element);

    this.api.fetchChoices().then((result) => {
      this.logger.debug("Retrieved choices:", result);
      this.options = result;
      this.render();
    });
  }

  render() {
    super.render(...arguments);
    this.initValues();
  }

  initValues() {
    // Do something with inputs and stuff
  }

  handleClick(event) {
    event.preventDefault();
    this.loaders.button = true;
    this.render();
    this.logger.log("Click event:", event);
    alert("click");
  }
}
