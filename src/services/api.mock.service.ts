import { LoggerService } from "./logger.service";

export class ApiService {
  private delay = 1500;
  private logger = new LoggerService("MOCK API");

  async fetchChoices(): Promise<{ value: string; label: string }[]> {
    this.logger.log("Fetching Choices...");
    return new Promise((resolve, _) => {
      setTimeout(() => {
        resolve([
          {
            value: "value_1",
            label: "Choice 1",
          },
          {
            value: "value_2",
            label: "Choice 2",
          },
          {
            value: "value_3",
            label: "Choice 3",
          },
          {
            value: "value_4",
            label: "Choice 4",
          },
          {
            value: "value_5",
            label: "Choice 5",
          },
        ]);
      }, this.delay);
    });
  }
}
