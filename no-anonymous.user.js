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

  for (let node of nodes) {
    if (node.nodeName === "A") {
      if (checkAnonymous(node.href)) {
        node.href = replaceAnonymous(node.href);
      }
    }

    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.trim() !== "") {
        if (checkAnonymous(node.textContent)) {
          node.textContent = replaceAnonymous(node.textContent);
        }
      }
    }
  }

  function checkAnonymous (str) {
    return str.includes("$$anonymous$$");
  }

  function replaceAnonymous (str) {
    for (let replacement of replacements) {
      str = str.replaceAll(replacement[0], replacement[1]);
    }
    return str;
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
