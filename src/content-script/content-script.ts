import { Message } from "../shared";
import { Logger } from "../logger";
import { WinBox } from "../utils/winbox/winbox";
import { isProbablyReaderable, Readability } from "@mozilla/readability";

const L = new Logger("content-script");
const onMessage = (
  msg: Message,
  _: chrome.runtime.MessageSender,
  callback: () => void
) => {
  L.debug("received message: ", msg.type);
  callback();
};

chrome.runtime.onMessage.addListener(onMessage);

class Reader {
  async render() {
    const winboxOptions = {
      icon: chrome.runtime.getURL("assets/logo-24x24.png"),
      width: "100%",
      height: "100%",
      autosize: true,
      shadowel: "reader-mode-view",
      class: ["no-full", "no-max"],
      max: true,
      index: await this.getMaxZIndex(),
      html: `<h1>Hello winbox</h1>`,
    };

    if (!isProbablyReaderable(document)) {
      console.log("Skipping page that is probably not readable");
      return;
    }
    let reader = new Readability(window.document.cloneNode(true) as Document);
    let article = reader.parse();
    if (!article) {
      console.warn("Failed to parse article");
      return;
    }
    winboxOptions.html = `<h1>${article.title}</h1> <p>${article.byline}</p> ${article.content}`;
    new WinBox(chrome.i18n.getMessage("appName"), winboxOptions);
  }

  getMaxZIndex() {
    return new Promise((resolve: (arg0: number) => void) => {
      const z = Math.max(
        ...Array.from(document.querySelectorAll("body *"), (el) =>
          parseFloat(window.getComputedStyle(el).zIndex)
        ).filter((zIndex) => !Number.isNaN(zIndex)),
        0
      );
      resolve(z);
    });
  }
}

new Reader().render();
