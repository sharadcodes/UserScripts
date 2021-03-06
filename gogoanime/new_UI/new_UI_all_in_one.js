// ==UserScript==
// @name         Gogoanime New UI
// @version      1.0.0
// @namespace    https://sharadcodes.github.io
// @author       sharadcodes
// @license      MIT
// @description  A new UI layout for Gogoanime
// @supportURL   https://github.com/sharadcodes/UserScripts/issues
// @include      /^https?:\/\/(w+.?\.)?gogoanime\.io\//
// @include      /^https?:\/\/(w+.?\.)?gogoanime\.vc\//
// @include      /^https?:\/\/(w+.?\.)?gogoanime\.tv\//
// @include      /^https?:\/\/(w+.?\.)?gogoanime\.in\//
// @include      /^https?:\/\/(w+.?\.)?gogoanime\.se\//
// @include      /^https?:\/\/(w+.?\.)?gogoanime\.sh\//
// @include      /^https?:\/\/(w+.?\.)?gogoanimes\.co\//
// @include      /^https?:\/\/(w+.?\.)?gogoanimes\.tv\//
// @include      /^https?:\/\/(w+.?\.)?gogoanime\.video\//
// @include      /^https?:\/\/(w+.?\.)?gogoanime\.so\//
// @include      /^https?:\/\/(w+.?\.)?gogoanime\.wiki\//
// @include      /^https?:\/\/(w+.?\.)?animego\.to\//
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @grant        GM_addStyle
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

(function() {
  GM_addStyle(`
      #wrapper,#wrapper_inside {
          margin: 0!important;
          width: 100%!important;
      }
      .items {
        display: grid!important;
        grid-template-columns: repeat(auto-fill, minmax(130px, 1fr))!important;
        gap: 1rem!important;
      }

      .items li,
      .items .img {
        width: 100%!important;
      }

      ul.items li p.name {
          line-height: 16px!important;
          height: auto!important;
          overflow: auto!important;
      }

      .content_left {
        width: 100%!important;
      }

      .content_right {
        display: none!important;
        visibility: hidden!important;
      }

      .dub_tag {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        right: 0;
        background: rgba(0,0,0,0.8);
        border-radius: 0 0 0 10px;
        padding: 5px 5px 2px 8px;
      }
    `);
  
  if(window.location.href.toLowerCase().includes('new-season')) {
    loadAllNewSeasons()
      .then((data) => {
        console.log(data)
        document.querySelector('.items').innerHTML = data;
        tagDubbed()
      })
  }
  
  function loadAllNewSeasons() {
    return new Promise((resolve, reject) => {
      let anchors = [];
      let a_seasons = []
      let counter = 1;

      document.querySelector('.items').innerHTML = '';
      document.querySelectorAll('#wrapper_bg > section > section.content_left > div > div.anime_name.new_series > div > div > ul li a').forEach(a=>{
        anchors.push({
          index: a.innerText,
          href: a.href
        })
      })
      anchors = _.orderBy(anchors, ['index'],['asc']);
      
      anchors.forEach(anchor=> {
        console.log(anchor.href)
        fetch(anchor.href)
          .then(r => r.text())
          .then(html => {
            const new_html = document.createElement('html');
            new_html.innerHTML = html;
            new_html.querySelectorAll('.items li').forEach(li => {
              a_seasons.push({
                title: li.innerText.toLowerCase(),
                html: li.outerHTML
              })
            });
            console.log(counter)
            counter += 1;
            if(counter === anchors.length){
              a_seasons = _.orderBy(a_seasons, ['title'],['asc']);
              let tmp_html = ''
              a_seasons.forEach(s=>{
                tmp_html += s.html
              })
              resolve(tmp_html)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    })
  }
  
  function tagDubbed() {
    document.querySelectorAll('.items li').forEach(e=>{
    const title = e.innerText;
    if(title.toLowerCase().includes('dub')){
      const dubTag = document.createElement('div')
      dubTag.className = 'dub_tag'
      dubTag.innerHTML = '<h4>DUB</h4>'
      e.appendChild(dubTag)
    }
    })
  }
})();
