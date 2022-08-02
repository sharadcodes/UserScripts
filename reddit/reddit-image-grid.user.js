// MIT License

// Copyright (c) 2022 Sharad Raj Singh Maurya

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


// ==UserScript==
// @name        Reddit Image Grid
// @namespace   https://sharadcodes.github.io
// @author      sharadcodes
// @description Shows the images in grid format
// @match       https://old.reddit.com/r*
// @supportURL  https://github.com/sharadcodes/UserScripts/issues
// @version     1.0
// @license     MIT
// @run-at      document-idle
// @grant       GM_registerMenuCommand
// ==/UserScript==

let images = [];
let next_page_url = "";
const modal_div = document.createElement("div");
modal_div.innerHTML = `
      <!-- The Modal -->
      <div id="myModal" class="modal">
        <div id="modal-images"></div>  
        <button id="load">Load more</button>
      </div>
        `;
const modal = modal_div.querySelector(".modal");
const image_grid = modal.querySelector("#modal-images");
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        document.body.classList.remove("modal-open");
    }
};
const load_btn = modal.querySelector("#load");
load_btn.addEventListener("click", async () => {
    console.log("Loading next page", next_page_url);
    await getImages();
});

GM_registerMenuCommand("Show Grid", async () => {
    document.body.appendChild(modal);
    document.body.classList.toggle("modal-open");
    modal.style.display = "block";
    next_page_url = document.location.href;
    window.scrollTo(0, 0);
    reset();
    await getImages();
});

async function getImages() {
    try {
        if (!next_page_url) {
            throw "No next page";
        }
        load_btn.innerHTML = "Loading...";
        const res = await fetch(next_page_url);
        const html_txt = await res.text();
        const doc = document.createElement("html");
        doc.innerHTML = html_txt;
        next_page_url = doc.querySelector(
            "#siteTable > div.nav-buttons .next-button a:last-child"
        )?.href;
        //
        console.log(next_page_url);
        //
        const posts = doc.querySelectorAll(
            'div.content[role="main"] div#siteTable .thing:not(.promotedlink)'
        );
        posts.forEach((post) => {
            const url = post.querySelector("a.thumbnail").href;
            if (url.includes("/gallery/")) {
                console.log("<RIG> Gallery found");
                const html = document.createElement("html");
                html.innerHTML = post
                    .querySelector(".expando")
                    .getAttribute("data-cachedhtml");
                html.querySelectorAll("a.gallery-item-thumbnail-link").forEach(
                    (i) => {
                        let currentSrc = i?.href;
                        images.push(currentSrc);
                        addImage(currentSrc);
                    }
                );
            } else {
                addImage(url);
            }
        });
        load_btn.innerHTML = "Next Page";
    } catch (err) {
        console.log(err);
        load_btn.innerHTML = err;
    }
}

function addImage(url) {
    images.push(url);
    const img = document.createElement("img");
    img.src = url;
    img.style.width = "160px";
    image_grid.append(img);
}

function reset() {
    next_page_url = document.location.href;
    modal.querySelector("#modal-images").innerHTML = null;
}
