document.addEventListener('DOMContentLoaded', () => {
  const collapsible = document.querySelectorAll('.collapsible');
  M.Collapsible.init(collapsible);

  const tooltip = document.querySelectorAll('.tooltipped');
  M.Tooltip.init(tooltip);

  const urlParams = new URLSearchParams(window.location.search);
  const idTeam = parseInt(urlParams.get('id'));
  const getTeam = getTeamById();
  const btnSave = document.getElementById('btnSave');
  const btnDelete = document.getElementById('btnDelete');

  isTeamFav(idTeam)
    .then((msg) => {
      btnSave.classList.add('d-none');
      btnDelete.classList.remove('d-none');
    })
    .catch((msg) => {
      btnSave.classList.remove('d-none');
      btnDelete.classList.add('d-none');
    });

  btnSave.addEventListener('click', () => {
    getTeam.then((team) => {
      addFavTeam(team);
    });
  });
  btnDelete.addEventListener('click', () => {
    deleteFavTeam(idTeam);
  });
});
