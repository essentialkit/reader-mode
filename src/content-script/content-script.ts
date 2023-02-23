import { Message } from "../shared";
import { Logger } from "../logger";
import { WinBox } from "../utils/winbox/winbox";
import isProbablyReaderable from "./is-readable";
import Parser from '@postlight/parser';

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
   
    let article = await Parser.parse(window.location.href, document.body.innerHTML.toString()).then(result => result);
    if (!article) {
      console.warn("Failed to parse article");
      return;
    }
    if(!article.title || !article.content || article.word_count < 100) {
      console.warn("Skipping potentially unsuitable article");
      return;
    }
    winboxOptions.html = `
    <h1>${article.title}</h1> 
    <img src="${article.lead_image_url}" /> 
    <p>${article.author}</p> 
    <p>${article.date_published}</p> 
    <i>${article.excerpt}</i>
    ${article.content}`;
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
