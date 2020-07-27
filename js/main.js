document.addEventListener('DOMContentLoaded', () => {
  const sidenav = document.querySelectorAll('.sidenav');
  M.Sidenav.init(sidenav);
  loadNav();

  function loadNav() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status !== 200) return;

        // Muat daftar tautan menu
        document.querySelectorAll('.topnav, .sidenav').forEach((elm) => {
          elm.innerHTML = xhr.responseText;
        });

        // Daftarkan event listener untuk setiap tautan menu
        document
          .querySelectorAll('.sidenav .link-nav, .topnav .link-nav')
          .forEach((elm) => {
            elm.addEventListener('click', (event) => {
              // Tutup sidenav
              const sidenav = document.querySelector('.sidenav');
              M.Sidenav.getInstance(sidenav).close();

              // Muat konten halaman yang dipanggil
              page = event.target.getAttribute('href').substr(1);
              loadPage(page);
            });
          });
      }
    };
    xhr.open('GET', 'nav.html', true);
    xhr.send();
  }

  let page = window.location.hash.substr(1);
  if (page === '') page = 'beranda';
  loadPage(page);

  function loadPage(page) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        const content = document.querySelector('.body-content');
        if (this.status === 200) {
          content.innerHTML = xhr.responseText;
          if (page === 'beranda') {
            getLeagues();
          } else if (page === 'favorit') {
            getSavedTeam();
          }
        } else if (this.status === 404) {
          content.innerHTML = '<p>Halaman tidak ditemukan.</p>';
        } else {
          content.innerHTML = '<p>Ups.. halaman tidak dapat diakses.</p>';
        }
      }
    };
    xhr.open('GET', `pages/${page}.html`, true);
    xhr.send();
  }
});
