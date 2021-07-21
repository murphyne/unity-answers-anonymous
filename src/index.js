export function eliminateAnonymous () {
  'use strict';

  const cssStyle = `
    span.anonymous {
      -moz-text-decoration-line: underline;
      -moz-text-decoration-style: dotted;
      -moz-text-decoration-color: brown;
      -webkit-text-decoration-line: underline;
      -webkit-text-decoration-style: dotted;
      -webkit-text-decoration-color: brown;
      text-decoration-line: underline;
      text-decoration-style: dotted;
      text-decoration-color: brown;
      text-decoration-thickness: 1px;
      text-decoration-skip-ink: none;
    }
  `;

  function Config(key, defaultValue) {
    this.key = key;
    this.defaultValue = defaultValue;

    Object.defineProperty(this, "value", {
      get() {
        return GM_getValue(this.key, defaultValue);
      },
      set(value) {
        GM_setValue(this.key, value);
      },
    });
  }

  let isHighlightEnabled = new Config("isHighlightEnabled", true);

  let style = {
    styleElement: null,
    set enabled(value) {
      if (value) { this.styleElement = GM_addStyle(cssStyle); }
      else { this.styleElement?.remove(); }
    }
  };

  GM_registerMenuCommand('Toggle the highlight', function toggleHighlight () {
    isHighlightEnabled.value = !isHighlightEnabled.value;
    style.enabled = isHighlightEnabled.value;
  });

  style.enabled = isHighlightEnabled.value;

  var replacements = [
    [ /(\$\$anonymous\$\$onoBehaviour)/g, "MonoBehaviour" ],
    [ /(Get\$\$anonymous\$\$eyDown)/g, "GetKeyDown" ],
    [ /(any\$\$anonymous\$\$eyDown)/g, "anyKeyDown" ],
    [ /(ANI\$\$anonymous\$\$ATION)/g, "ANIMATION" ],
    [ /(\$\$anonymous\$\$aterial)/g, "Material" ],
    [ /(\$\$anonymous\$\$eyCode)/g, "KeyCode" ],
    [ /(WOR\$\$anonymous\$\$ING)/g, "WORKING" ],
    [ /(Wor\$\$anonymous\$\$ing)/g, "Working" ],
    [ /(wor\$\$anonymous\$\$ing)/g, "working" ],
    [ /(EXA\$\$anonymous\$\$PLE)/g, "EXAMPLE" ],
    [ /(\$\$anonymous\$\$essage)/g, "Message" ],
    [ /(\$\$anonymous\$\$anager)/g, "Manager" ],
    [ /(THAN\$\$anonymous\$\$S)/g, "THANKS" ],
    [ /(INS\$\$anonymous\$\$D)/g, "INSTEAD" ],
    [ /(Ins\$\$anonymous\$\$d)/g, "Instead" ],
    [ /(ins\$\$anonymous\$\$d)/g, "instead" ],
    [ /(\$\$anonymous\$\$cher)/g, "teacher" ],
    [ /(is\$\$anonymous\$\$ey)/g, "isKey" ],
    [ /(\$\$anonymous\$\$ouse)/g, "Mouse" ],
    [ /(\$\$anonymous\$\$athf)/g, "Mathf" ],
    [ /(HO\$\$anonymous\$\$E)/g, "HOME" ],
    [ /(\$\$anonymous\$\$ath)/g, "Math" ],
    [ /(\$\$anonymous\$\$esh)/g, "Mesh" ],
    [ /(\$\$anonymous\$\$ove)/g, "Move" ],
    [ /(\$\$anonymous\$\$ode)/g, "Mode" ],
    [ /(\$\$anonymous\$\$ost)/g, "Most" ],
    [ /(\$\$anonymous\$\$in)/g, "Min" ],
    [ /(\$\$anonymous\$\$ax)/g, "Max" ],
    [ /(\$\$anonymous\$\$m)/g, "team" ],
    [ /(\$\$anonymous\$\$ey)/g, "Key" ],
    [ /(ND\$\$anonymous\$\$)/g, "NDK" ],
    [ /(SD\$\$anonymous\$\$)/g, "SDK" ],
    [ /(AR\$\$anonymous\$\$)/g, "ARM" ],
    [ /(CO\$\$anonymous\$\$)/g, "COM" ],
    [ /(AP\$\$anonymous\$\$)/g, "APK" ],
    [ /(O\$\$anonymous\$\$G)/g, "OMG" ],
    [ /(I\$\$anonymous\$\$)/g, "IK" ],
    [ /(O\$\$anonymous\$\$)/g, "OK" ],
    [ /(\$\$anonymous\$\$y)/g, "My" ],
    [ /(\$\$anonymous\$\$)/g, "M" ],
  ];

  var nodes = traverseNodeTree(document.body).flat(Infinity);
  processNodes(nodes);

  const documentObserver = new MutationObserver(function documentCallback (mutations) {
    for (let i = 0; i < mutations.length; i++) {
      const mutation = mutations[i];
      for (let j = 0; j < mutation.addedNodes.length; j++) {
        const root = mutation.addedNodes[j];
        var nodes = traverseNodeTree(root).flat(Infinity);
        processNodes(nodes);
      }
    }
  });
  documentObserver.observe(document, {subtree: true, childList: true});

  function processNodes (nodes) {
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
      span.classList.add("anonymous");
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

}
