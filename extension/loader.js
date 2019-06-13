// Script

var s = document.createElement('script');
s.id = 'controller.js';
s.src = chrome.extension.getURL('controller.bundle.js');

s.onload = () => {
  s.remove();
};

// Messages from controller.js and any window.postMessage in this context
window.addEventListener('message', event => {
  // Check if the message was sent from this script
  if (event.data.ignoreLoader) return;
  event.data.ignoreLoader = true;
  chrome.runtime.sendMessage(event.data);
});

// Messages from ldn.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.ignoreLoader) return;
  msg.ignoreLoader = true;
  window.postMessage(msg);
});

(document.head || document.documentElement).appendChild(s);
console.log('<Loader> Injecting controller script...');
