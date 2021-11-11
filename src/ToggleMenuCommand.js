import {
  Config,
} from './Config.js';

export {
  ToggleMenuCommand,
};

function ToggleMenuCommand (key, onEnable, onDisable) {
  this.isEnabled = new Config(key, true);

  Object.defineProperty(this, "toggle", {
    enumerable: false,
    value: function () {
      isEnabled.value = !isEnabled.value;
      if (isEnabled.value)
        onEnable();
      else
        onDisable();
    }
  }
}

let toggleMenuCommand = new ToggleMenuCommand("isHighlightEnabled",
  () => {
    this.styleElement = GM_addStyle(cssStyle);
  },
  () => {
    this.styleElement?.remove();
  },
);

GM_registerMenuCommand('Toggle the highlight', function toggleHighlight () {
  toggleMenuCommand.toggle();
});
