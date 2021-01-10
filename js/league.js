document.addEventListener('DOMContentLoaded', () => {
  moment.locale('id');

  getLeagueById();
  getLeagueStandings();
  getLeagueScorers();

  const tabs = document.querySelectorAll('.tabs');
  M.Tabs.init(tabs);
});
