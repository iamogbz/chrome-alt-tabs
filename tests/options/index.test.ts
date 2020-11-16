import "options";
import * as optionsHTML from "options/index.html";
import * as chromeUtils from "utils/chrome";

const changeTabUrlSpy = jest.spyOn(chromeUtils, "changeTabUrl");
jest.spyOn(chromeUtils, "getAllCommands").mockResolvedValue([
  { shortcut: "ctrl+1", name: "Command1", description: "mock command 1" },
  { shortcut: "ctrl+2", name: "Command2", description: "mock command 2" },
  { shortcut: "ctrl+3", name: "Command3", description: "mock command 3" },
]);

describe("options", () => {
  beforeAll(() => {
    document.open("text/html");
    document.write(optionsHTML);
    document.close();
  });

  it("renders all commands", async () => {
    document.dispatchEvent(new Event("DOMContentLoaded"));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(document.getElementById("commands").innerHTML).toMatchSnapshot();
  });

  it("changes tab url", async () => {
    document.getElementById("change-btn").click();
    expect(changeTabUrlSpy).toHaveBeenCalledWith(
      "chrome://extensions/configureCommands"
    );
  });
});
