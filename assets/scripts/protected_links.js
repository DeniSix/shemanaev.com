---
layout: nil
---

function protectedDataReady() {
  'use strict';

  var linksNodes = document.querySelectorAll('a[data-protected]')
  var links = Array.prototype.slice.call(linksNodes)

  links.forEach(function (link) {
    var data = link
      .getAttribute('data-protected')
      .split('{{ site.protected_links_sep }}')
      .reverse()
      .join('')

    link.innerHTML = data
    link.href += data
  })
}

document.addEventListener('DOMContentLoaded', protectedDataReady, false)
