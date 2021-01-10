const dbPromised = idb.open('kabar-bola', 1, (upgradeDb) => {
	if (!upgradeDb.objectStoreNames.contains('teamFav')) {
    const teamsObjectStore = upgradeDb.createObjectStore('favTeam', {
			keyPath: 'id',
			autoIncrement: false,
		});
		teamsObjectStore.createIndex('name', 'name', { unique: false });
  }
  
});

const addFavTeam = (team) => {
	dbPromised
		.then((db) => {
			const tx = db.transaction('favTeam', 'readwrite');
			const store = tx.objectStore('favTeam');
			store.put(team);
			return tx.complete;
		}).then(() => {
			btnSave.classList.add('d-none');
			btnDelete.classList.remove('d-none');
			M.toast({ html: `${team.name} berhasil disimpan ke tim favorit.` });
		}).catch(() => {
			M.toast({ html: 'Gagal menyimpan tim' });
		});
}

const deleteFavTeam = (id) => {
	dbPromised
		.then((db) => {
			const tx = db.transaction('favTeam', 'readwrite');
			const store = tx.objectStore('favTeam');
			store.delete(id);
			return tx.complete;
		}).then(() => {
			btnSave.classList.remove('d-none');
			btnDelete.classList.add('d-none');
			M.toast({ html: `Berhasil menghapus tim dari favorit.` });
		}).catch(() => {
			M.toast({ html: 'Gagal menghapus tim' });
		});
}

const getAllFavTeam = () => {
	return new Promise((resolve) => {
		dbPromised
			.then((db) => {
				const tx = db.transaction('favTeam', 'readonly');
				const store = tx.objectStore('favTeam');
				return store.getAll();
			})
			.then((teams) => {
				resolve(teams);
			});
	});
}

const isTeamFav = (id) => {
  return new Promise((resolve, reject) => {
		dbPromised
			.then((db) => {
				const tx = db.transaction('favTeam', 'readonly');
				const store = tx.objectStore('favTeam');
				return store.get(id);
			}).then((favorite) => {
				if (favorite !== undefined) {
					resolve(true);
				} else {
					reject(false);
				}
			});
	});
}
