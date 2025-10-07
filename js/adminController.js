document.addEventListener('DOMContentLoaded', () => {
    const service = new PeliculaService();
    const form = document.getElementById('peliculaForm');
    const tableBody = document.getElementById('peliculasTableBody');
    const formTitle = document.getElementById('formTitle');
    let currentEditId = null;

    form.addEventListener('submit', handleFormSubmit);


    async function loadPeliculas() {
        try {
            const peliculas = await service.getAll();
            renderTable(peliculas);
        } catch (error) {
            console.error(error);
        }
    }

    function renderTable(peliculas) {
        tableBody.innerHTML = '';
        peliculas.forEach(pelicula => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = pelicula.idPelicula;
            row.insertCell().textContent = pelicula.titulo;
            row.insertCell().textContent = pelicula.director;
            row.insertCell().textContent = pelicula.anioEstreno;
            
            const actionsCell = row.insertCell();
            actionsCell.innerHTML = `
                <button class="btn btn-sm btn-info me-2 edit-btn" data-id="${pelicula.idPelicula}">Editar</button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${pelicula.idPelicula}">Eliminar</button>
            `;
        });
        
        document.querySelectorAll('.edit-btn').forEach(button => button.addEventListener('click', handleEdit));
        document.querySelectorAll('.delete-btn').forEach(button => button.addEventListener('click', handleDelete));
    }

    async function handleFormSubmit(event) {
        event.preventDefault();
        
        const data = {
            titulo: document.getElementById('titulo').value,
            director: document.getElementById('director').value,
            genero: document.getElementById('genero').value,
            anioEstreno: parseInt(document.getElementById('anioEstreno').value),
            duracionMin: parseInt(document.getElementById('duracionMin').value),
        };

        try {
            if (currentEditId) {
                await service.update(currentEditId, data);
                alert('Película actualizada con éxito.');
            } else {
                await service.create(data);
                alert('Película creada con éxito.');
            }
            form.reset();
            formTitle.textContent = 'Crear Nueva Película';
            currentEditId = null;
            loadPeliculas();
        } catch (error) {
            alert(`Error en la operación: ${error.message}`);
            console.error(error);
        }
    }
    
    async function handleEdit(event) {
        const id = event.target.dataset.id;
        try {
            const pelicula = await service.getById(id);
            document.getElementById('titulo').value = pelicula.titulo;
            document.getElementById('director').value = pelicula.director;
            document.getElementById('genero').value = pelicula.genero;
            document.getElementById('anioEstreno').value = pelicula.anioEstreno;
            document.getElementById('duracionMin').value = pelicula.duracionMin;
            
            formTitle.textContent = `Editar Película (ID: ${id})`;
            currentEditId = id;
        } catch (error) {
            alert(`Error al cargar datos para edición: ${error.message}`);
        }
    }

    async function handleDelete(event) {
        const id = event.target.dataset.id;
        if (confirm(`¿Estás seguro de eliminar la película con ID ${id}?`)) {
            try {
                await service.delete(id);
                alert('Película eliminada con éxito.');
                loadPeliculas();
            } catch (error) {
                alert(`Error al eliminar: ${error.message}`);
                console.error(error);
            }
        }
    }

    loadPeliculas();
});
