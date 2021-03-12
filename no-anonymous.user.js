// ==UserScript==
// @name         Eliminate $$anonymous$$
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Replace $$anonymous$$ on Unity Answers!
// @author       murphyne
// @match        https://answers.unity.com/*
// @grant        none
// ==/UserScript==

;(function eliminateAnonymous () {
  'use strict';

  var replacements = [
    [ /(WOR\$\$anonymous\$\$ING)/g, "WORKING" ],
    [ /(Wor\$\$anonymous\$\$ing)/g, "Working" ],
    [ /(wor\$\$anonymous\$\$ing)/g, "working" ],
    [ /(INS\$\$anonymous\$\$D)/g, "INSTEAD" ],
    [ /(Ins\$\$anonymous\$\$d)/g, "Instead" ],
    [ /(ins\$\$anonymous\$\$d)/g, "instead" ],
    [ /(\$\$anonymous\$\$m)/g, "team" ],
    [ /(\$\$anonymous\$\$ey)/g, "Key" ],
    [ /(ND\$\$anonymous\$\$)/g, "NDK" ],
    [ /(I\$\$anonymous\$\$)/g, "IK" ],
    [ /(\$\$anonymous\$\$)/g, "M" ],
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
          let fragment = new DocumentFragment();

          let tokens = tokenize(node.textContent);
          for (let token of tokens) {
            fragment.appendChild(createNode(token));
          }

          node.replaceWith(fragment);
        }
      }
    }
  }

  function tokenize (textContent) {
    let tokens = [{isAnonymous: false, before: textContent, after: textContent}];
    for (let replacement of replacements) {
      tokens = tokens.flatMap(function (token) {
        if (token.isAnonymous) return [token];

        let newStrings = token.after.split(replacement[0]);
        return newStrings.map(function (newString) {
          return replacement[0].test(newString)
            ? {isAnonymous: true, before: newString, after: newString.replaceAll(replacement[0], replacement[1])}
            : {isAnonymous: false, before: newString, after: newString}
        });
      });
    }
    return tokens;
  }

  function createNode (token) {
    if (token.isAnonymous) {
      let span = document.createElement("span");
      span.textContent = token.after;
      span.title = `${token.before} → ${token.after}`;
      return span;
    }
    else {
      return document.createTextNode(token.after);
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
