console.log('<Loader> Starting controller script...');
var s = document.createElement('script');
s.src = chrome.extension.getURL('controller.bundle.js');
(document.head || document.documentElement).appendChild(s);

s.onload = function() {
  s.parentNode.removeChild(s);
};
