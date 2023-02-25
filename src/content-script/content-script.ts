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
  // Matches subdomains e.g. en.wikipedia.org or hosts with different ports e.g. github.com:443.
  excludedHosts = ["github.com", "wikipedia.org"];
  async render() {
    const isExcludedHost = this.excludedHosts.find(d => window.location.hostname.indexOf(d) >= 0);
    if(isExcludedHost) {
      console.log("Skipping excluded host");
      return;
    }
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
   
    let article = await Parser.parse(window.location.href, {
        html: (document.body.cloneNode(true) as HTMLBodyElement).innerHTML
      }).then(result => result);

    if (!article) {
      console.warn("Failed to parse article");
      return;
    }
    if(!article.title || !article.content || article.word_count < 100 || (!article.author && !article.published_date)) {
      console.warn("Skipping potentially unsuitable article");
      return;
    }
    console.log("Rendering article", article);
    winboxOptions.html = `
    <div class="container">
      <h1>${article.title}</h1> 
      <img src="${article.lead_image_url}" /> 
      <p>
        <span class="author">${article.author}</span>
        <span class="published_date">${article.date_published}</span>
      </p>
      <div class="content">${article.content}</div>
    </div>`
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
