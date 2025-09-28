import React, { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [SearchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // displaying the error in the browser
  const [movieList, setMovieList] = useState([]); // This is will display the movie list from the API as a json
  const [isLoading, setIsLoading] = useState(false);

  // function that'll fetch my API
  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        const body = await response.text();
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      if (data.response === false) {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]); // if movieList isn't there or not working, then return an empty array
        return;
      }

      setMovieList(data.results || []); // else, return the movie results from the API
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error Fetching movies. Please try again later");
    } finally {
      setIsLoading(false); // No matter what you'll have to stop the loading
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>

          <Search SearchTerm={SearchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-[20px]">All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
        <h1 className="text-white">{SearchTerm}</h1>
      </div>
    </main>
  );
};

export default App;
