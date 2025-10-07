

const API_BASE_URL = 'http://localhost:8080/api/peliculas';

class PeliculaService {
    async getAll() {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error(`Error al obtener películas: ${response.statusText}`);
        }
        return response.json();
    }

    async getById(id) {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`Error al obtener la película con ID ${id}: ${response.statusText}`);
        }
        return response.json();
    }

    async create(peliculaData) {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(peliculaData),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Error al crear película: ${response.statusText} - ${error.message}`);
        }
        return response.json();
    }

    async update(id, peliculaData) {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(peliculaData),
        });
        if (!response.ok) {
            throw new Error(`Error al actualizar la película con ID ${id}: ${response.statusText}`);
        }
        return response.json();
    }

    async delete(id) {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Error al eliminar la película con ID ${id}: ${response.statusText}`);
        }
    }
}
