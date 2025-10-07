document.addEventListener('DOMContentLoaded', () => {
    const service = new PeliculaService();
    const form = document.getElementById('peliculaForm');
    const tableBody = document.getElementById('peliculasTableBody');
    const formTitle = document.getElementById('formTitle');
    let currentEditId = null;

    form.addEventListener('submit', handleFormSubmit);

    function showAlert(icon, title, text) {
        Swal.fire({
            icon: icon,
            title: title,
            text: text,
            confirmButtonColor: '#0d6efd'
        });
    }

    async function loadPeliculas() {
        try {
            const peliculas = await service.getAll();
            renderTable(peliculas);
        } catch (error) {
            console.error(error);
            showAlert('error', 'Error de Conexión', `No se pudo conectar a la API. (${error.message})`);
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error al cargar datos: ${error.message}</td></tr>`;
        }
    }

    function renderTable(peliculas) {
        tableBody.innerHTML = '';
        if (!peliculas || peliculas.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No hay películas registradas.</td></tr>`;
            return;
        }

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
                showAlert('success', 'Actualización Exitosa', 'Película actualizada con éxito.');
            } else {
                await service.create(data);
                showAlert('success', 'Creación Exitosa', 'Película creada con éxito.');
            }
            
            form.reset();
            formTitle.textContent = 'Crear Película';
            currentEditId = null;
            loadPeliculas();
        } catch (error) {
            console.error(error);
            showAlert('error', 'Error de Operación', error.message);
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
            showAlert('info', 'Modo Edición', `Editando película con ID ${id}`);
        } catch (error) {
            showAlert('error', 'Error al Cargar', error.message);
        }
    }

    async function handleDelete(event) {
        const id = event.target.dataset.id;
        
        const result = await Swal.fire({
            title: `¿Eliminar ID ${id}?`,
            text: "No podrás revertir esto.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await service.delete(id);
                showAlert('success', 'Eliminado', 'Película eliminada con éxito.');
                loadPeliculas();
            } catch (error) {
                console.error(error);
                showAlert('error', 'Error al Eliminar', error.message);
            }
        }
    }

    loadPeliculas();
});
