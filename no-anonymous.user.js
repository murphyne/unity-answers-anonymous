// ==UserScript==
// @name         Eliminate $$anonymous$$
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Replace $$anonymous$$ on Unity Answers!
// @author       murphyne
// @match        https://answers.unity.com/*
// @grant        none
// ==/UserScript==

;(function eliminateAnonymous () {
  'use strict';

  var stringToRemove = "$$anonymous$$";
  var stringToInsert = "M";

  var nodes = traverseNodeTree(document.body).flat(Infinity);

  var aNodes = nodes.filter(node => node.nodeName === "A");

  var textNodes = nodes.filter(node => node.nodeType === Node.TEXT_NODE);
  var filledNodes = textNodes.filter(node => node.textContent.trim() !== "");

  aNodes.forEach(function (node) {
    node.href = node.href.replaceAll(stringToRemove, stringToInsert);
  });

  filledNodes.forEach(function (node) {
    node.textContent = node.textContent.replaceAll(stringToRemove, stringToInsert);
  });

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
