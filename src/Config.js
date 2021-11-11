export {
  Config,
}

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
