/* 
INSTALAR:
npm i just-debounce-it -E
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

    useEffect(() => {
        /* BANDERA: si es la primera vez que el usaurio entra a la web, el input no mostrará
         * el mensaje de error rojo; si escribe algo y borra la búsqueda del input, aparecerá el mensaje.
         */
        if (isFirstInput.current) {
            isFirstInput.current = search === "";
            return;
        }
        if (search === "") {
            setError("No se puede buscar una película vacía");
            return;
        } else if (search.match(/^\d+$/)) {
            setError("No se puede buscar una película con un número");
            return;
        } else if (search.length < 3) {
            setError("La búsqueda debe tener al menos tres caracteres");
            return;
        } else {
            setError(null);
        }
    }, [search]);
    return { search, updateSearch, error };
}

function App() {
    const [sort, setSort] = useState(false);
    const { search, updateSearch, error } = useSearch();
    const { movies, loading, getMovies } = useMovies({ search, sort });

    console.log("En cada render ejecuto esto:");
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
            <header>
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
                    <input
                        type='checkbox'
                        onChange={handleSort}
                        checked={sort}
                    />
                    <button type='submit'>Buscar</button>
                </form>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </header>
            <main>
                {loading ? <p>Cargando...</p> : <Movies movies={movies} />}
            </main>
        </div>
    );
}

export default App;
