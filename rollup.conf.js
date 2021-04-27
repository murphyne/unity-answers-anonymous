let bannerText = `
// ==UserScript==
// @name         Eliminate $$anonymous$$
// @version      0.3.2
// @description  Replace $$anonymous$$ on Unity Answers!
// @author       murphyne
// @namespace    https://github.com/murphyne
// @match        https://answers.unity.com/*
// @grant        GM_addStyle
// ==/UserScript==
`;

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/no-anonymous.user.js',
    format: 'esm',
    banner: bannerText.trimStart(),
  },
};
