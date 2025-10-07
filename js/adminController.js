document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('peliculaForm');
	const tituloInput = document.getElementById('titulo');
	const directorInput = document.getElementById('director');
	const generoInput = document.getElementById('genero');
	const anioInput = document.getElementById('anioEstreno');
	const duracionInput = document.getElementById('duracionMin');
	const tableBody = document.getElementById('peliculasTableBody');
	const formTitle = document.getElementById('formTitle');

	let editingId = null;

	function resetForm() {
		form.reset();
		editingId = null;
		formTitle.textContent = 'Crear Película';
	}

	function renderTable(peliculas) {
		if (!peliculas || peliculas.length === 0) {
			tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No hay películas.</td></tr>`;
			return;
		}
		tableBody.innerHTML = peliculas.map(p => {
			const id = p.id ?? p.ID ?? '';
			const titulo = p.titulo ?? 'Sin título';
			const director = p.director ?? '';
			const anio = p.anioEstreno ?? p.anio ?? '';
			return `
				<tr>
					<td>${id}</td>
					<td>${titulo}</td>
					<td>${director}</td>
					<td>${anio}</td>
					<td>
						<button class="btn btn-sm btn-outline-primary btn-edit" data-id="${id}">Editar</button>
						<button class="btn btn-sm btn-outline-danger btn-delete" data-id="${id}">Eliminar</button>
					</td>
				</tr>
			`;
		}).join('');
		attachTableEvents();
	}

	function attachTableEvents() {
		tableBody.querySelectorAll('.btn-edit').forEach(btn => {
			btn.addEventListener('click', async (e) => {
				const id = e.currentTarget.dataset.id;
				try {
					const res = await window.peliculaService.getPeliculaById(id);
					const pelicula = (res?.data ?? res);
					if (!pelicula) throw new Error('Película no encontrada');
					tituloInput.value = pelicula.titulo ?? '';
					directorInput.value = pelicula.director ?? '';
					generoInput.value = pelicula.genero ?? '';
					anioInput.value = pelicula.anioEstreno ?? pelicula.anio ?? '';
					duracionInput.value = pelicula.duracionMin ?? pelicula.duracion ?? '';
					editingId = pelicula.id ?? pelicula.ID ?? id;
					formTitle.textContent = 'Editar Película';
				} catch (err) {
					console.error(err);
					alert('No se pudo obtener la película.');
				}
			});
		});

		tableBody.querySelectorAll('.btn-delete').forEach(btn => {
			btn.addEventListener('click', (e) => {
				const id = e.currentTarget.dataset.id;
				const doDelete = async () => {
					try {
						if (window.Swal) {
							const confirm = await Swal.fire({
								title: '¿Eliminar?',
								text: 'Esta acción no se puede deshacer',
								icon: 'warning',
								showCancelButton: true,
								confirmButtonText: 'Eliminar',
								confirmButtonColor: '#d33'
							});
							if (!confirm.isConfirmed) return;
						} else {
							if (!confirm('Seguro que desea eliminar?')) return;
						}
						await window.peliculaService.deletePelicula(id);
						await loadPeliculas();
					} catch (err) {
						console.error(err);
						alert('Error eliminando la película.');
					}
				};
				doDelete();
			});
		});
	}

	async function loadPeliculas() {
		tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Cargando datos...</td></tr>`;
		try {
			const res = await window.peliculaService.getAllPeliculas();
			const peliculas = Array.isArray(res) ? res : (res?.data ?? res);
			renderTable(peliculas);
		} catch (err) {
			console.error('Error cargando películas - status:', err?.status, 'body:', err?.body, err);
			const detail = (typeof err?.body === 'string') ? err.body : (err?.body ? JSON.stringify(err.body) : '');
			tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error al cargar datos. ${detail ? 'Detalle: ' + detail : ''}</td></tr>`;
		}
	}

	form.addEventListener('submit', async function (e) {
		e.preventDefault();
		const payload = {
			titulo: tituloInput.value.trim(),
			director: directorInput.value.trim(),
			genero: generoInput.value.trim(),
			anioEstreno: anioInput.value ? Number(anioInput.value) : null,
			duracionMin: duracionInput.value ? Number(duracionInput.value) : null
		};
		try {
			if (editingId) {
				await window.peliculaService.updatePelicula(editingId, payload);
			} else {
				await window.peliculaService.createPelicula(payload);
			}
			resetForm();
			await loadPeliculas();
			if (window.Swal) {
				Swal.fire({ icon: 'success', title: 'Guardado', timer: 1200, showConfirmButton: false });
			}
		} catch (err) {
			console.error('Error guardar - status:', err?.status, 'body:', err?.body, err);
			const body = err?.body ?? err;
			let msg = 'Error al guardar';
			if (body && body.Errors) msg = JSON.stringify(body.Errors);
			else if (body && body.message) msg = body.message;
			else if (typeof body === 'string') msg = body;
			if (window.Swal) {
				Swal.fire({ icon: 'error', title: 'Error', text: msg });
			} else {
				alert(msg);
			}
		}
	});

	loadPeliculas();
});