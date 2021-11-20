// ==UserScript==
// @name                JLN Grid Generator
// @author              sharadcodes
// @namespace           https://sharadcodes.github.io
// @match               https://www.justlightnovels.com/custom/grid
// @version             1.0
// @description         Generates grid view for the page. You need to add the the css file to Stylus extension as well.
// @compatible          chrome
// @compatible          firefox
// @compatible          edge
// @supportURL          https://github.com/sharadcodes/UserScripts/issues
// @grant               none
// @license             MIT
// ==/UserScript==

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
