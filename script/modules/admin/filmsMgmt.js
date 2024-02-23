import { dragStart } from "./dnd.js";

export async function addNewFilm() {
    const newFilmParams = document.getElementById('new_film_params');

    const params = new FormData(newFilmParams)
    const response = await fetch('https://shfe-diplom.neto-server.ru/film', {
        method: 'POST',
        body: params 
    })
    
    const answer = await response.json();
    const data = answer.result;
    const films = data.films;

    const filmCards = document.querySelectorAll('.film_card');
    filmCards.forEach(film => film.remove());

    let filmsCollection = '';

    for (let film of films) {
        let filmName = film.film_name;
        let filmId = film.id;
        let filmPoster = film.film_poster;
        let filmDuration = film.film_duration;

        filmsCollection += `<div class="film_card" id="${filmId}">
                                <img class="poster" src="${filmPoster}">    
                                <div class="film_info">
                                    <h4 class="film_name">${filmName}</h4>
                                    <div class="card_control">
                                        <p><span>${filmDuration}</span> минут</p>
                                        <button class="remove film" id="${filmId}"></button>
                                    </div>
                                </div>
                            </div>
                            `;
    }
    
    const availableFilms = document.querySelector('.films_collection');
    availableFilms.innerHTML = filmsCollection;

    dragStart();
    deleteFilm();
}

export function deleteFilm() {
    const deleteFilm = document.querySelectorAll('button.remove.film');
    deleteFilm.forEach(btn => {
        btn.addEventListener('click', () => {
            fetch(`https://shfe-diplom.neto-server.ru/film/${+btn.id}`, {
                method: 'DELETE',
                })
                .then( response => response.json())
                .then( data => console.log( data ));

            btn.closest('div.film_card').remove();
        });
    })
};