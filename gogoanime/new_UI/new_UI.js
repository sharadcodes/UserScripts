(function() {
  addCustomStyle(`
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
              a_seasons.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
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
  
  function addCustomStyle(cstyle) {
    var style = document.createElement('style');
    style.textContent = cstyle;
    document.documentElement.appendChild(style);
  };
})();
