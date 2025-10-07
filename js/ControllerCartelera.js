document.addEventListener('DOMContentLoaded', function () {
	const container = document.getElementById('carteleraContainer');

	function renderEmpty() {
		container.innerHTML = `
			<div class="col-12 text-center p-5 text-muted">
				No hay películas disponibles.
			</div>
		`;
	}

	function renderPeliculas(peliculas) {
		if (!peliculas || peliculas.length === 0) {
			renderEmpty();
			return;
		}
		const html = peliculas.map(p => {
			const id = p.id ?? p.ID ?? p.identificador ?? '';
			const titulo = p.titulo ?? p.title ?? 'Sin título';
			const director = p.director ?? 'N/D';
			const genero = p.genero ?? 'N/D';
			const anio = p.anioEstreno ?? p.anio ?? p.year ?? 'N/D';
			const duracion = p.duracionMin ?? p.duracion ?? 'N/D';

			return `
				<div class="col-md-4 mb-4">
					<div class="card h-100 shadow-sm">
						<div class="card-body">
							<h5 class="card-title">${titulo}</h5>
							<p class="card-text mb-1"><strong>Director:</strong> ${director}</p>
							<p class="card-text mb-1"><strong>Género:</strong> ${genero}</p>
							<p class="card-text mb-1"><strong>Año:</strong> ${anio}</p>
							<p class="card-text"><strong>Duración:</strong> ${duracion} min</p>
						</div>
						<div class="card-footer text-muted small">ID: ${id}</div>
					</div>
				</div>
			`;
		}).join('');
		container.innerHTML = html;
	}

	async function loadPeliculas() {
		try {
			const data = await window.peliculaService.getAllPeliculas();
			const peliculas = Array.isArray(data) ? data : (data?.data ?? data);
			renderPeliculas(peliculas);
		} catch (err) {
			console.error('Error cargando películas - status:', err?.status, 'body:', err?.body, err);
			const status = err?.status ?? 'N/A';
			const bodyText = (typeof err?.body === 'string') ? err.body : (err?.body ? JSON.stringify(err.body) : '');
			const hint = err?.hint ? `<div class="small text-warning mt-2">${err.hint}</div>` : '';
			const extra = (status === 0) ? '<div class="small text-warning">Status 0: problema de red/CORS</div>' : '';
			container.innerHTML = `
				<div class="col-12 text-center p-4 text-danger">
					Error al cargar la cartelera.<br>
					<span class="small text-muted">Status: ${status} — ${bodyText}</span>
					${extra}
					${hint}
				</div>
			`;
		}
	}

	loadPeliculas();
});