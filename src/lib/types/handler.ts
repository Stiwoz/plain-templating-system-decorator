export type Handler = {
  selector: string;
  event: Event["type"];
  function: EventListenerOrEventListenerObject;
};
