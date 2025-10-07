	const API_BASE = 'http:localhost:8080/api/peliculas';


	async function getAllPeliculas() {
		const res = await fetch(`${API_BASE}/getAllPeliculas`,{
			method: 'GET',
			headers: { 'Content-Type': 'application/json'}
		}
		);
		
	}

	async function getPeliculaById(id) {
		const res = await fetch(`${API_BASE}/getPeliculaById/${encodeURIComponent(id)}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});
	}

	async function createPelicula(pelicula) {
		const res = await fetch(`${API_BASE}/newPelicula`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(pelicula)
		});
		return handleResponse(res);
	}

	async function updatePelicula(id, pelicula) {
		const res = await fetch(`${API_BASE}/updatePelicula/${encodeURIComponent(id)}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(pelicula)
		});
		return handleResponse(res);
	}

	async function deletePelicula(id) {
		const res = await fetch(`${API_BASE}/deletePelicula/${encodeURIComponent(id)}`, {
			method: 'DELETE'
		});
		return handleResponse(res);
	}

	global.peliculaService = {
		getAllPeliculas,
		getPeliculaById,
		createPelicula,
		updatePelicula,
		deletePelicula
	};