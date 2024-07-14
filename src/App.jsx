/* 
INSTALAR:
npm i just-debounce-it -E
npm i gh-pages --save-dev
*/

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useMovies } from "./hooks/useMovies";
import { Movies } from "./components/Movies";
import debounce from "just-debounce-it";
import "./App.css";

function useSearch() {
    const [search, updateSearch] = useState("");
    const [error, setError] = useState(null);
    const isFirstInput = useRef(true);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        /* BANDERA: si es la primera vez que el usaurio entra a la web, el input no mostrará
         * el mensaje de error rojo; si escribe algo y borra la búsqueda del input, aparecerá el mensaje.
         */
        if (isFirstInput.current) {
            isFirstInput.current = search === "";
            return;
        }
        if (search === "") {
            setError(
                "No se puede buscar una película sin al menos una palabra."
            );
            return;
        } else if (search.match(/^\d+$/)) {
            setError("No se puede buscar una película con un número.");
            return;
        } else if (search.length < 3) {
            setError("La búsqueda debe tener al menos tres caracteres.");
            return;
        } else {
            setError(null);
        }
    }, [search]);

    const handleSearch = (newSearch) => {
        updateSearch(newSearch);
        if (newSearch.trim() !== "") {
            setHasSearched(true);
        }
    };
    return { search, updateSearch: handleSearch, error, hasSearched };
}

function App() {
    const [sort, setSort] = useState(false);
    const { search, updateSearch, error, hasSearched } = useSearch();
    const { movies, loading, getMovies } = useMovies({ search, sort });

    const debouncedGetMovies = useCallback(
        debounce((search) => {
            console.log("Search", search);
            getMovies({ search });
        }, 300),
        [getMovies]
    );

    const handleSubmit = (event) => {
        event.preventDefault();
        getMovies({ search });
    };

    const handleChange = (event) => {
        const newSearch = event.target.value;
        updateSearch(newSearch);
        debouncedGetMovies(newSearch);
    };

    const handleSort = () => {
        setSort(!sort);
    };
    return (
        <div className='page'>
            <header className='searcher'>
                <h1>Buscador de películas</h1>
                <form className='form' onSubmit={handleSubmit}>
                    <input
                        style={{
                            border: "1px solid transparent",
                            borderColor: error ? "red" : "transparent",
                        }}
                        onChange={handleChange}
                        value={search}
                        name='query'
                        type='text'
                        placeholder='Avengers, Star Wars, Matrix...'
                        size={22}
                    />
                    <button type='submit'>Buscar</button>
                    <div className='sorter'>
                        <input
                            type='checkbox'
                            onChange={handleSort}
                            checked={sort}
                        />
                        <span>Ordenar por título</span>
                    </div>
                </form>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </header>
            <main>
                {loading ? (
                    <p>Cargando...</p>
                ) : (
                    <Movies movies={movies} hasSearched={hasSearched} />
                )}
            </main>
        </div>
    );
}

export default App;
