(function () {
  addCustomStyle(
    "#wrapper,#wrapper_inside{margin:0!important !important;width:100%!important}.items{display:grid!important;grid-template-columns:repeat(auto-fill, minmax(130px, 1fr))!important;gap:1rem!important}.items .img,.items li{width:100%!important}ul.items li p.name{line-height:16px!important;height:auto!important;overflow:auto!important}.content_left{width:100%!important}.content_right{display:none!important;visibility:hidden!important}.dub_tag{display:flex;justify-content:center;align-items:center;position:absolute;top:0;right:0;background:rgba(0,0,0,0.8);border-radius:0 0 0 10px;padding:5px 5px 2px 8px}"
  );

  if (window.location.href.toLowerCase().includes("new-season")) {
    loadAllNewSeasons().then(function (data) {
      document.querySelector(".items").innerHTML = data;
      tagDubbed();
    });
  }

  function loadAllNewSeasons() {
    return new Promise(function (resolve, reject) {
      var anchors = [];
      var a_seasons = [];
      var counter = 1;

      document.querySelector(".items").innerHTML = "";
      document
        .querySelectorAll(
          "#wrapper_bg > section > section.content_left > div > div.anime_name.new_series > div > div > ul li a"
        )
        .forEach(function (a) {
          anchors.push({
            index: a.innerText,
            href: a.href,
          });
        });

      anchors.forEach(function (anchor) {
        fetch(anchor.href)
          .then(function (r) {
            return r.text();
          })
          .then(function (html) {
            var new_html = document.createElement("html");
            new_html.innerHTML = html;
            new_html.querySelectorAll(".items li").forEach(function (li) {
              a_seasons.push({
                title: li.innerText.toLowerCase(),
                html: li.outerHTML,
              });
            });
            counter += 1;

            if (counter === anchors.length) {
              a_seasons.sort(function (a, b) {
                return a.title > b.title ? 1 : b.title > a.title ? -1 : 0;
              });
              var tmp_html = "";
              a_seasons.forEach(function (s) {
                tmp_html += s.html;
              });
              resolve(tmp_html);
            }
          })
          .catch(function (err) {
            reject(err);
          });
      });
    });
  }

  function tagDubbed() {
    document.querySelectorAll(".items li").forEach(function (e) {
      var title = e.innerText;

      if (title.toLowerCase().includes("dub")) {
        var dubTag = document.createElement("div");
        dubTag.className = "dub_tag";
        dubTag.innerHTML = "<h4>DUB</h4>";
        e.appendChild(dubTag);
      }
    });
  }

  function addCustomStyle(cstyle) {
    var style = document.createElement("style");
    style.textContent = cstyle;
    document.documentElement.appendChild(style);
  }
})();
