import React from "react";

function ListOfMovies({ movies }) {
    return (
        <ul className='movies'>
            {movies.map((movie) => (
                <li className='movie' key={movie.id}>
                    <h3>{movie.title}</h3>
                    <p>{movie.year}</p>
                    <img src={movie.image} alt={movie.title} />
                </li>
            ))}
        </ul>
    );
}

function NoMoviesResult({ hasSearched }) {
    if (!hasSearched) {
        return <p>Escribe una o más palabras para hacer una búsqueda.</p>;
    } else {
        return <p>No se han encontrado películas para esta búsqueda.</p>;
    }
}

export function Movies({ movies, hasSearched }) {
    const hasMovies = movies?.length > 0;

    return hasMovies ? (
        <ListOfMovies movies={movies} />
    ) : (
        <NoMoviesResult hasSearched={hasSearched} />
    );
}
