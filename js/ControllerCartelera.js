document.addEventListener('DOMContentLoaded', () => {
    const service = new PeliculaService();
    const carteleraContainer = document.getElementById('carteleraContainer');

    async function loadCartelera() {
        try {
            const peliculas = await service.getAll();
            carteleraContainer.innerHTML = ''; 

            if (peliculas.length === 0) {
                carteleraContainer.innerHTML = '<p class="text-center text-muted">No hay películas en cartelera.</p>';
                return;
            }

            peliculas.forEach(pelicula => {
                const card = createPeliculaCard(pelicula);
                carteleraContainer.appendChild(card);
            });
        } catch (error) {
            console.error(error);
            carteleraContainer.innerHTML = `<div class="alert alert-danger" role="alert">Error al cargar la cartelera. Por favor, verifica la API. (${error.message})</div>`;
        }
    }

    function createPeliculaCard(pelicula) {
        const div = document.createElement('div');
        div.className = 'col-md-4 mb-4';
        div.innerHTML = `
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title text-primary">${pelicula.titulo} (${pelicula.anioEstreno})</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${pelicula.director}</h6>
                    <p class="card-text">
                        <strong>Género:</strong> ${pelicula.genero}<br>
                        <strong>Duración:</strong> ${pelicula.duracionMinutos} minutos
                    </p>
                    <a href="#" class="btn btn-sm btn-outline-primary">Ver detalles</a>
                </div>
                <div class="card-footer text-muted">
                    ID: ${pelicula.idPelicula} | Creada: ${new Date(pelicula.fechaCreacion).toLocaleDateString()}
                </div>
            </div>
        `;
        return div;
    }

    loadCartelera();
});
