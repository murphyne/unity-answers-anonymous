import virtual from '@rollup/plugin-virtual';
import pkg from './package.json';

let bannerText = `
// ==UserScript==
// @name         Eliminate $$anonymous$$
// @version      ${pkg.version}
// @description  Replace $$anonymous$$ on Unity Answers!
// @license      MIT
// @author       murphyne
// @namespace    https://github.com/murphyne
// @match        https://*.unity.com/*
// @icon         https://www.google.com/s2/favicons?domain=answers.unity.com
// @updateUrl    https://github.com/murphyne/unity-answers-anonymous/releases/latest/download/no-anonymous.meta.js
// @downloadUrl  https://github.com/murphyne/unity-answers-anonymous/releases/latest/download/no-anonymous.user.js
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==
`;

export default [
  {
    input: 'src/main.js',
    output: {
      file: 'dist/no-anonymous.user.js',
      format: 'esm',
      banner: bannerText.trimStart(),
    },
  },
  {
    input: 'entry',
    plugins: [
      virtual({ entry: '' }),
    ],
    output: {
      file: 'dist/no-anonymous.meta.js',
      banner: bannerText.trim(),
    },
  },
];
