// Archivo: js/PeliculaService.js

const API_BASE_URL = 'http://localhost:8080/api/peliculas';

class PeliculaService {
    
    async #handleResponse(response) {
        if (!response.ok) {
            let errorDetail = `Error: ${response.status} - ${response.statusText}`;
            try {
                const errorBody = await response.json();
                if (errorBody.message) {
                    errorDetail = errorBody.message;
                } else if (errorBody.detail) {
                    errorDetail = errorBody.detail;
                } else if (errorBody.Errors && Object.keys(errorBody.Errors).length > 0) {
                     // Concatenar errores de validación si existen
                     const validationErrors = Object.entries(errorBody.Errors)
                        .map(([field, message]) => `${field}: ${message}`)
                        .join('. ');
                    errorDetail = `Errores de Validación: ${validationErrors}`;
                }
            } catch (e) {
                // El cuerpo no es JSON, se usa el mensaje HTTP por defecto
            }
            throw new Error(errorDetail);
        }
        
        if (response.status !== 204) {
             const result = await response.json();
             return result.data || result; 
        }
        
        return null;
    }
    
    async getAll() {
        const response = await fetch(`${API_BASE_URL}/getAllPeliculas`);
        return this.#handleResponse(response);
    }

    async getById(id) {
        const response = await fetch(`${API_BASE_URL}/getPeliculaById/${id}`);
        return this.#handleResponse(response);
    }

    async create(peliculaData) {
        const response = await fetch(`${API_BASE_URL}/newPelicula`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(peliculaData),
        });
        return this.#handleResponse(response);
    }

    async update(id, peliculaData) {
        const response = await fetch(`${API_BASE_URL}/updatePelicula/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(peliculaData),
        });
        return this.#handleResponse(response);
    }

    async delete(id) {
        const response = await fetch(`${API_BASE_URL}/deletePelicula/${id}`, {
            method: 'DELETE',
        });
        return this.#handleResponse(response);
    }
}
