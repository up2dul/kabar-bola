const BASE_URL = 'https://api.football-data.org/v2';
const API_KEY = '8a5207e244474b68b8cd2cc14c10836c';

const fetchAPI = (url) => {
  return fetch(url, {
    headers: {
      'X-Auth-Token': API_KEY,
    },
  })
    .then((response) => {
      if (response.status !== 200) {
        console.log('Error :', response.status);
        return Promise.reject(new Error(response.statusText));
      } else {
        return Promise.resolve(response);
      }
    })
    .then((response) => response.json())
    .catch((err) => console.log('err :', err));
}

// beranda.html
const renderLeagues = (dataJSON) => {
  // menghilangkan preloader
  document.querySelector('.preloader').classList.add('d-none');

  const leagueId = [2002, 2003, 2014, 2015, 2019, 2021];
  let leaguesHTML = '';
  dataJSON.competitions.forEach((data) => {
    if (leagueId.includes(data.id)) {
      leaguesHTML += `
        <div class="col s12 m6 l4 center">
          <a href="./league.html?id=${data.id}">
            <div class="card hoverable waves-effect waves-light">
              <div class="card-image">
                <img src="img/${data.id}.svg" alt="${data.name} logo">
              </div>
              <div class="card-content grey-text text-darken-3">
                <hr>
                <h6 class="truncate text-bold">${data.name}</h6>
                <p><img src="${data.area.ensignUrl}" alt="${data.area.name}" style="width: 20px;"> ${data.area.name}</p>
              </div>
            </div>
          </a>
        </div>`;
    }
  });
  document.getElementById('leaguesResult').innerHTML = leaguesHTML;
}

const getLeagues = () => {
  fetchAPI(`${BASE_URL}/competitions?plan=TIER_ONE`).then((data) => {
    renderLeagues(data);
  });
}

// league.html
const renderLeague = (dataJSON) => {
  // menghilangkan preloader
  document.querySelector('.preloader').classList.add('d-none');

  document.querySelector('.body-content h5.with-header').innerHTML = dataJSON.name;
  document.querySelector('.body-content .card-detail').innerHTML = `
    <div class="row">
      <div class="col s8 offset-s2 m5 l4">
        <div class="card-image">
          <img src="img/${dataJSON.id}.svg" alt="${dataJSON.name} logo" class="responsive-img">
        </div>
      </div>
      <div class="col s12 m7 l8">
        <ul class="collection league-collection">
          <li class="collection-item">${dataJSON.area.name}</li>
          <li class="collection-item">Mulai : ${moment(dataJSON.currentSeason.startDate).format('D MMMM YYYY')}</li>
          <li class="collection-item">Berakhir : ${moment(dataJSON.currentSeason.endDate).format('D MMMM YYYY')}</li>
          <li class="collection-item">Pekan ke-${dataJSON.currentSeason.currentMatchday}</li>
          <li class="collection-item">
            ${dataJSON.currentSeason.winner ? 'Juara : ' + dataJSON.currentSeason.winner : 'Musim belum berakhir'}
          </li>
        </ul>
      </div>
    </div>`;
}

const renderStandings = (dataJSON) => {
  let standingHTML = '';
  const teams = dataJSON.standings[0].table;
  teams.forEach((team) => {
    let logoUrl = team.team.crestUrl;
    if (!logoUrl) {
      logoUrl = 'img/404.svg';
    } else {
      logoUrl = logoUrl.replace(/^http:\/\//i, 'https://');
    }
    standingHTML += `
      <tr>
        <td>${team.position}</td>
        <td>
          <a href="./team.html?id=${team.team.id}">
            <img src="${logoUrl}" alt="${team.team.name}" style="height: 25px;">
          </a>
        </td>
        <td>
          <a href="./team.html?id=${team.team.id}" class="text-sapphire team-link">
            ${team.team.name.replace(' FC', '')}
          </a>
        </td>
        <td>${team.playedGames}</td>
        <td>${team.won}</td>
        <td>${team.draw}</td>
        <td>${team.lost}</td>
        <td>${team.goalsFor}</td>
        <td>${team.goalsAgainst}</td>
        <td class="text-bold">${team.points}</td>
      </tr>`;
  });
  document.querySelector('#klasemen table tbody').innerHTML = standingHTML;
}

const renderScorers = (dataJSON) => {
  let scorersHTML = '';
  const scorers = dataJSON.scorers;
  if (scorers.length > 0) {
    let no = 1;
    scorers.forEach((scorer) => {
      scorersHTML += `
      <tr>
        <td>${no}</td>
        <td class="left">${scorer.player.name}</td>
        <td>${scorer.team.name.replace(' FC', '')}</td>
        <td class="text-bold">${scorer.numberOfGoals}</td>
      </tr>`;
      no += 1;
    });
    document.querySelector('#topskor table tbody').innerHTML = scorersHTML;
  } else {
    document.querySelector('#topskor').innerHTML = '<h5 class="text-sapphire center-align">Belum ada data</h5>';
  }
}

const getLeagueById = () => {
  return new Promise((resolve) => {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    fetchAPI(`${BASE_URL}/competitions/${idParam}`).then((data) => {
      renderLeague(data);
      resolve(data);
    });
  });
}

const getLeagueStandings = () => {
  return new Promise((resolve) => {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    fetchAPI(`${BASE_URL}/competitions/${idParam}/standings`).then((data) => {
      renderStandings(data);
      resolve(data);
    });
  });
}

const getLeagueScorers = () => {
  return new Promise((resolve) => {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    fetchAPI(`${BASE_URL}/competitions/${idParam}/scorers`).then((data) => {
      renderScorers(data);
      resolve(data);
    });
  });
}

// team.html
const renderPlayer = (dataJSON) => {
  // jika terdapat masalah pada array squad, maka .squad-list akan dikosongkan
  if (!dataJSON) document.querySelector('.body-content .squad-list').innerHTML = '';
  
  dataJSON.forEach(data => {
    if (data.role === 'PLAYER') {
      const playerAge = moment().diff(data.dateOfBirth, 'years');
      document.getElementById(data.position).innerHTML += `
        <li>
          <div class="collapsible-header">${data.name}</div>
          <div class="collapsible-body">
            <ul class="collection league-collection">
              <li class="collection-item">
                Tanggal lahir : ${moment(data.dateOfBirth).format('D MMMM YYYY')} (${playerAge} tahun)
              </li>
              <li class="collection-item">Tempat lahir : ${data.countryOfBirth}</li>
              <li class="collection-item">Negara kebangsaan : ${data.nationality}</li>
              <li class="collection-item">Nomor punggung : ${data.shirtNumber || 'tidak diketahui'}</li>
            </ul>
          </div>
        </li>`;
    }
  });
}

const renderTeam = (dataJSON) => {
  // menghilangkan preloader
  document.querySelector('.preloader').classList.add('d-none');
  
  let logoUrl = dataJSON.crestUrl;
  if (!logoUrl) {
    logoUrl = 'img/404.svg';
  } else {
    logoUrl = logoUrl.replace(/^http:\/\//i, 'https://');
  }
  clubUrl = dataJSON.website.replace(/^http:\/\//i, 'https://');
  let clubManager;
  dataJSON.squad.forEach((data) => {
    if (data.role === 'COACH') {
      clubManager = data.name;
    }
  });
  document.querySelector('.body-content h5.with-header').innerHTML = dataJSON.name;
  document.querySelector('.body-content .card-detail').innerHTML = `
    <div class="row">
      <div class="col s8 offset-s2 m5 l4">
        <div class="card-image">
          <img src="${logoUrl}" alt="${dataJSON.name}" class="responsive-img" style="height: 300px;">
        </div>
      </div>
      <div class="col s12 m7 l8">
        <ul class="collection league-collection">
          <li class="collection-item"><a href="${clubUrl}">${clubUrl}</a></li>
          <li class="collection-item">Manajer : ${clubManager}</li>
          <li class="collection-item">Berdiri pada tahun ${dataJSON.founded}</li>
          <li class="collection-item">Stadion : ${dataJSON.venue}</li>
          <li class="collection-item">Alamat : ${dataJSON.address}</li>
          <li class="collection-item">No. telepon : ${dataJSON.phone}</li>
        </ul>
      </div>
    </div>`;
  renderPlayer(dataJSON.squad);
}

const getTeamById = () => {
  return new Promise((resolve) => {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    fetchAPI(`${BASE_URL}/teams/${idParam}`).then((data) => {
      renderTeam(data);
      resolve(data);
    });
  });
}

// favorit.html
const renderSavedTeams = (dataJSON) => {
  // menghilangkan preloader
  document.querySelector('.preloader').classList.add('d-none');

  let teamsHTML = '';
  if (dataJSON.length > 0) {
    dataJSON.forEach((data) => {
      let logoUrl = data.crestUrl;
      if (!logoUrl) {
        logoUrl = 'img/404.svg';
      } else {
        logoUrl = logoUrl.replace(/^http:\/\//i, 'https://');
      }
      teamsHTML += `
        <div class="col s6 l4">
          <a href="./team.html?id=${data.id}">
            <div class="card hoverable waves-effect waves-light">
              <div class="card-image">
                <div class="valign-wrapper">
                  <img src="${logoUrl}" alt="${data.name}" class="responsive-img">
                </div>
              </div>
              <div class="card-content grey-text text-darken-3">
                <hr>
                <h6 class="truncate text-bold">${data.shortName}</h6>
                <p>${data.area.name}</p>
              </div>
            </div>
          </a>
        </div>`;
    });
  } else {
    teamsHTML = `<h5 class="text-sapphire center-align">Belum ada tim favorit</h5>`;
  }
  document.getElementById('savedResult').innerHTML = teamsHTML;
}

const getSavedTeam = () => {
  const getAll = getAllFavTeam()
  getAll.then((teams) => {
    renderSavedTeams(teams);
  });
}
