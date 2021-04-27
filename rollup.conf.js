let bannerText = `
// ==UserScript==
// @name         Eliminate $$anonymous$$
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  Replace $$anonymous$$ on Unity Answers!
// @author       murphyne
// @match        https://answers.unity.com/*
// @grant        GM_addStyle
// ==/UserScript==
`;

export default {
  input: 'no-anonymous.user.js',
  output: {
    file: 'dist/no-anonymous.user.js',
    format: 'esm',
    banner: bannerText.trimStart(),
  },
};
