// Script

var s = document.createElement('script');
s.id = 'controller.js';
s.src = chrome.extension.getURL('controller.bundle.js');

s.onload = () => {
  s.remove();
};

// Messages from controller.js and any window.postMessage in this context
window.addEventListener('message', event => {
  chrome.runtime.sendMessage(event.data);
});

// Messages from ldn.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log(msg);
  window.postMessage(msg);
});

(document.head || document.documentElement).appendChild(s);
console.log('<Loader> Injecting controller script...');
