// ==UserScript==
// @name         JustLightNovels New UI
// @version      2.0.0
// @namespace    https://sharadcodes.github.io
// @author       sharadcodes
// @license      MIT
// @description  A new UI layout for JustLightNovels
// @supportURL   https://github.com/sharadcodes/UserScripts/issues
// @match        https://www.justlightnovels.com/custom/grid
// ==/UserScript==

// MIT License

// Copyright (c) 2021 Sharad Raj Singh Maurya

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

let number = 0;

const generateGrid = (entry) => {
  const article = document.createElement('article');
  article.innerHTML = `<div class='series-cover' style='background-image: url(${entry.image});'></div>
                            <div class='series-title-container'>
                            <h4><a href='${entry.href}' target='_blank'>${entry.title}</a></h4>
                          </div>`;
  document.querySelector('#main').appendChild(article);
};

const tryAndGetImageFromPage = async (url) => {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const tmp = document.createElement('html');
    tmp.innerHTML = html;
    const images = tmp.querySelectorAll('#content figure img');
    if (images.length > 0) {
      return images[0].src;
    }
    return null;
  } catch (err) {
    return err;
  }
};

const getDataForPage = async (url) => {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const tmp = document.createElement('html');
    tmp.innerHTML = html;

    const articles = tmp.querySelectorAll('#content article');
    articles.forEach((article) => {
      const { href } = article.querySelectorAll('a')[0];
      const title = article.querySelectorAll('h2')[0].innerText;
      const images = article.querySelectorAll('img');
      if (images.length === 0 || !images) {
        tryAndGetImageFromPage(href).then((pimg) => {
          if (pimg !== null) {
            generateGrid({ title, href, image: pimg });
          } else {
            generateGrid({ title, href, image: '' });
          }
        });
      } else {
        generateGrid({ title, href, image: images[0].src });
      }
    });
  } catch (err) {
    // eslint-disable-next-line no-alert
    alert(err);
  }
};
const increment = () => {
  // eslint-disable-next-line no-plusplus
  ++number;
};

const loadPage = async () => {
  if (number === 0) {
    increment();
    getDataForPage('https://www.justlightnovels.com/');
  }
  increment();
  getDataForPage(`https://www.justlightnovels.com/page/${number}/`);
};

window.onload = () => {
  document.querySelector('html').innerHTML = '<body><main id="main"/></main></body>';
  fetch('https://sharadcodes.github.io/UserScripts/www.justlightnovels.com/JLN_grid.css' + '?time=' + Date.now())
    .then(res=>res.text())
    .then(text => {
        const style = document.createElement('style');
        style.textContent = text;
        document.head.appendChild(style);
     })
  loadPage();
  loadPage();
  window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      loadPage();
      loadPage();
      loadPage();
    }
  });
};
