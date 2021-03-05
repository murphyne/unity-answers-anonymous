// ==UserScript==
// @name         Eliminate $$anonymous$$
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Replace $$anonymous$$ on Unity Answers!
// @author       murphyne
// @match        https://answers.unity.com/*
// @grant        none
// ==/UserScript==

;(function eliminateAnonymous () {
  'use strict';

  var replacements = [
    [ "WOR$$anonymous$$ING", "WORKING" ],
    [ /[W|w]or\$\$anonymous\$\$ing/g, "$1orking" ],
    [ "INS$$anonymous$$D", "INSTEAD" ],
    [ /[I|i]ns\$\$anonymous\$\$d/g, "$1nstead" ],
    [ "$$anonymous$$m", "team" ],
    [ "$$anonymous$$ey", "Key" ],
    [ "ND$$anonymous$$", "NDK" ],
    [ "I$$anonymous$$", "IK" ],
    [ "$$anonymous$$", "M" ],
  ];

  var nodes = traverseNodeTree(document.body).flat(Infinity);

  var aNodes = nodes.filter(node => node.nodeName === "A");

  var textNodes = nodes.filter(node => node.nodeType === Node.TEXT_NODE);
  var filledNodes = textNodes.filter(node => node.textContent.trim() !== "");

  aNodes.forEach(function (node) {
    if (checkAnonymous(node.href)) {
      for (let replacement of replacements) {
        node.href = node.href.replaceAll(replacement[0], replacement[1]);
      }
    }
  });

  filledNodes.forEach(function (node) {
    if (checkAnonymous(node.textContent)) {
      for (let replacement of replacements) {
        node.textContent = node.textContent.replaceAll(replacement[0], replacement[1]);
      }
    }
  });

  function checkAnonymous (str) {
    return str.includes("$$anonymous$$");
  }

  function traverseNodeTree (root) {
    if (root.childNodes.length > 0) {
      var childNodes = Array.from(root.childNodes);
      var childNodesDeep = childNodes.map(traverseNodeTree);
      return [root].concat(childNodesDeep);
    }
    else {
      return [root];
    }
  }

})();
