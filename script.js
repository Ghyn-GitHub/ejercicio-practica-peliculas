import { storedFilms } from "./js/storedFilms.js";
import {
  createIcons,
  Pencil,
  Trash2,
} from "https://cdn.jsdelivr.net/npm/lucide@latest/dist/esm/lucide.js";

// Función para pintar la lista
function printFilmsList(filmsData) {
  const filmsList = document.getElementById("films-list");
  filmsList.innerHTML = "";

  filmsData.forEach(film => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="cell-title" data-label="Title:">${film.title}</td>
            <td class="cell-year" data-label="Year:">${film.year}</td>
            <td class="cell-plot" data-label="Plot:">${film.plot}</td>
            <td class="cell-genre" data-label="Genre:">${film.genre}</td>
            <td class="cell-poster" data-label="Poster:"><img src="${film.poster}"/></td>
            <td class="cell-edits" data-label="cell-edits">
                <button type="button" class="edit-btn" aria-label="Edit film"><i data-lucide="pencil"></i></button>
                <button type="button" class="delete-btn" aria-label="Delete film"><i data-lucide="trash-2"></i></button>
            </td>
        `;

    // Lógica del botón editar
    const editBtn = row.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => {
      row.innerHTML = `
            <td colspan="6" class="edit-form-cell">
                <form class="edit-form">
                    <label>Title: <input type="text" name="title" value="${film.title}" required></label>
                    <label>Year: <input type="text" name="year" value="${film.year}" required></label>
                    <label>Plot: <input type="text" name="plot" value="${film.plot}" required></label>
                    <label>Genre: <input type="text" name="genre" value="${film.genre}" required></label>
                    <label>Poster: <input type="text" name="poster" value="${film.poster}" required></label>
                    <button type="submit" class="save-btn">Save</button>
                </form>
            </td>
            `;

      const editForm = row.querySelector(".edit-form");

      editForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // Actualiza datos de la película
        film.title = editForm.elements.title.value.trim();
        film.year = editForm.elements.year.value.trim();
        film.plot = editForm.elements.plot.value.trim();
        film.genre = editForm.elements.genre.value.trim();
        film.poster = editForm.elements.poster.value.trim();

        // Actualiza la edición
        printFilmsList(filmsData);
      });
    });

    // Lógica del botón borrar
    const deleteBtn = row.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", () => {
        const filmIndex = storedFilms.indexOf(film);

        if (filmIndex !== -1) {
            storedFilms.splice(filmIndex, 1);
        }
        filterFilms();
    });

    filmsList.appendChild(row);

    createIcons({
      icons: {
        Pencil,
        Trash2,
      },
    });
  });
}

// Envío del formulario
const form = document.getElementById("films-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = event.target.elements.title.value.trim();
  const year = Number(event.target.elements.year.value.trim());
  const plot = event.target.elements.plot.value.trim();
  const genre = event.target.elements.genre.value.trim();
  const poster = event.target.elements.poster.value.trim();

  if (title && year && plot && genre && poster) {
    const newFilm = { title, year, plot, genre, poster };
    storedFilms.push(newFilm);
    printFilmsList(storedFilms); // Actualizar la lista de películas
    event.target.reset();
  }
});

// Función para filtrar películas
function filterFilms() {
  const genreFilter = document.getElementById("genre-filter").value;

  const liveFilter = document.getElementById("live-filter").value.toLowerCase();

  const filteredFilms = storedFilms.filter(
    (film) =>
      (genreFilter === "all" || film.genre.toLowerCase() === genreFilter) &&
      film.title.toLowerCase().includes(liveFilter),
  );

  printFilmsList(filteredFilms);
}

// Inicializar la lista y configurar los filtros
document.addEventListener("DOMContentLoaded", () => {
  printFilmsList(storedFilms);

  document
    .getElementById("genre-filter")
    .addEventListener("change", filterFilms);

  document.getElementById("live-filter").addEventListener("input", filterFilms);
});
