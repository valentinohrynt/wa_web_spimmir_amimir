// ==UserScript==
// @name        WA Web Spimmir Amimir
// @namespace   @uselessProject69
// @match       https://web.whatsapp.com/*
// @grant       none
// @version     1.1
// @author      @uselessProject69
// @description A client-side script that allows the user to send spim messages.
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @license     MIT
// ==/UserScript==

const MESSAGE_PROMPT = "Enter the message you want to send:";
const COUNT_PROMPT = "How many times do you want to send the message?";
const INTERVAL_PROMPT = "Enter the delay between each message (in milliseconds) (Do not enter a number less than 500):";

function start() {
  const message = prompt(MESSAGE_PROMPT);
  if (message === null) return;

  const count = prompt(COUNT_PROMPT);
  if (count === null) return;

  const interval = prompt(INTERVAL_PROMPT, "500");
  if (interval === null) return;

  const countNum = parseInt(count);
  const intervalNum = parseInt(interval);

  if (isNaN(countNum) || isNaN(intervalNum)) {
    alert("Please enter valid numbers.");
    return;
  }

  for (let i = 0; i < countNum; i++) {
    setTimeout(() => {
      sendMessage(message);
    }, i * intervalNum);
  }
}

async function sendMessage(message) {
  const main = document.querySelector("#main");
  main.querySelector("div._ak1r").focus();
  await document.execCommand("insertText", false, message);

  setTimeout(() => {
    const iconSend = main.querySelector('[data-testid="send"]') || main.querySelector('[data-icon="send"]');
    if (iconSend) {
      iconSend.click();
    }
  }, 100);
}

function addButtonIfNotExists(inputDiv) {
  const existingButton = inputDiv.querySelector("#spam-btn");
  if (existingButton) return;

  inputDiv.style.alignItems = "center";

  const button = document.createElement("button");
  button.id = "spam-btn";
  button.type = "button";
  button.textContent = "Spam";
  button.style.zIndex = "1000";
  button.style.fontWeight = "bold";
  button.style.padding = "5px 10px";
  button.style.backgroundColor = "#2a3942";
  button.style.color = "#8696a0";
  button.style.border = "none";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";

  button.addEventListener("click", start);

  inputDiv.appendChild(button);
}

function setupObserver() {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        const inputDiv = document.querySelector("div._ak1r");
        if (inputDiv) {
          addButtonIfNotExists(inputDiv);
          observer.disconnect();
        }
      }
    }
  });

  const mainContainer = document.querySelector("#main");
  if (mainContainer) {
    observer.observe(mainContainer, {
      childList: true,
      subtree: true,
    });
  }
}

window.addEventListener("load", () => {
  setupObserver();
});

VM.observe(document.body, () => {
  const inputDiv = document.querySelector("div._ak1r");
  if (inputDiv) {
    setupObserver();
  }
  return false;
});
