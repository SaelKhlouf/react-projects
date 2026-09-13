import { useState, useEffect } from 'react'
import './App.css'
import StarRating from './StarRating';

const apiKey = "get it from my email omdb";

const average = (arr) => {
  const numbers = arr.filter((value) => !Number.isNaN(value));
  return numbers.reduce((acc, cur) => acc + cur, 0) / numbers.length;
}
  


function App() {
  const [query, setQuery] = useState("test");
  const [movies, setMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  useEffect(() => {

    if(!query.length) {
      setMovies([]);
      setError('');
      return;
    }

    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Something went wrong with the fetch request");
        }

        if (data.Response === "False") {
          throw new Error("Movie not found");
        }

        setIsLoading(false);
        setMovies(data.Search);

      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    // Debouncing the fetchMovies function to avoid making too many requests while typing
    const timer = setTimeout(() => {
      fetchMovies();
    }, 1000);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      <NavBar 
        movies={movies} 
        query={query} 
        setQuery={setQuery} />

      <main className="main">

        <LeftBox 
          movies={movies}
          isLoading={isLoading}
          error={error}
          setSelectedMovieId={setSelectedMovieId}
        />

        <RightBox
          movies={movies}
          selectedMovieId={selectedMovieId}
          setSelectedMovieId={setSelectedMovieId}
          watchedMovies={watchedMovies}
          setWatchedMovies={setWatchedMovies}
        />
      </main>
    </>
  );
}

export default App

function NavBar({movies, query, setQuery}) {
  return (
      <nav className="nav-bar">
        <div className="logo">
          <span role="img">🍿</span>
          <h1>usePopcorn</h1>
        </div>

        <input
          className="search"
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        
        <p className="num-results">
          Found <strong>{movies.length}</strong> results
        </p>
      </nav>
  );
}

function LeftBox({movies, isLoading, error, setSelectedMovieId}) {

  if (error)
  {
    return <Box>
      <ErrorMessage msg={error}></ErrorMessage>
    </Box>
  }

  if (isLoading)
  {
    return <Box>
      <Loader></Loader>
    </Box>
  }

  return (
      <Box>
         <ul className="list list-movies">
          {movies?.map((movie) => (
            <li key={movie.imdbID} onClick={() => setSelectedMovieId(movie.imdbID)}>
              <img src={movie.Poster} alt={`${movie.Title} poster`} />
              <h3>{movie.Title}</h3>
              <div>
                <p>
                  <span>🗓</span>
                  <span>{movie.Year}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Box>
  );
}

function Loader() {
  return (
    <p className="loader">Loading...</p>
  );
}

function ErrorMessage({msg}) {
  return (
    <p className="error">⛔{msg}</p>
  );
}

function SelectedMovie({
  selectedMovieId, 
  setSelectedMovieId, 
  watchedMovies, 
  setWatchedMovies}) {

  const[fetchedMovieDetails, setFetchedMovieDetails] = useState({});
  const[isLoading, setIsLoading] = useState(false);

  const [rating, setRating] = useState(0);

  useEffect(() => {

    const fetchMovieDetail = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${selectedMovieId}`);
        const data = await response.json();

        setFetchedMovieDetails(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    
    fetchMovieDetail();
    

  }, [selectedMovieId]);

  if (isLoading)
  {
    return (<Loader>Loading...</Loader>);
  }

  const userRating = watchedMovies.find(w => w.imdbID == fetchedMovieDetails.imdbID)?.userRating;

  return (
  <div className="details">
    <header>
      <button className='btn-back' onClick={() => setSelectedMovieId(null)}>
        &larr;
      </button>
      <img src={fetchedMovieDetails.Poster}></img>
      <div className="details-overview">
        <h2>{fetchedMovieDetails.Title}</h2>
        <p>{fetchedMovieDetails.Released} &bull; {fetchedMovieDetails.Runtime}</p>
        <p>{fetchedMovieDetails.Genre}</p>
        <p>
          <span>⭐</span> 
          {fetchedMovieDetails.imdbRating}
        </p>
      </div>
    </header>

    <section>
      <div className='rating'>
        
        <StarRating 
          maxRating={10} 
          size={24}
          rating={userRating ?? rating}
          setRating={setRating}>
        </StarRating>

        <button className='btn-add' onClick={() => {
          if (!watchedMovies.find(w => w.imdbID == fetchedMovieDetails.imdbID))
          {
            const newWatchedMovie = {
              imdbID: fetchedMovieDetails.imdbID,
              Title: fetchedMovieDetails.Title,
              Poster: fetchedMovieDetails.Poster,
              imdbRating: Number(fetchedMovieDetails.imdbRating),
              runtime: Number.parseInt(fetchedMovieDetails.Runtime),
              userRating: Number(rating)
            };
            setWatchedMovies([...watchedMovies, newWatchedMovie]);
          }

          setSelectedMovieId(null);
        }}>
          + Add to watched list
        </button>
      </div>
      <p><em>{fetchedMovieDetails.Plot}</em></p>
      <p>Starring {fetchedMovieDetails.Actors}</p>
      <p>Directed by {fetchedMovieDetails.Director}</p>
    </section>
  </div>
  );
}

function RightBox({
  watchedMovies, 
  setWatchedMovies,
  movies, 
  selectedMovieId ,
  setSelectedMovieId}) {

  if (selectedMovieId) {
    return <Box>
      <SelectedMovie 
        selectedMovieId={selectedMovieId} 
        movies={movies} 
        setSelectedMovieId={setSelectedMovieId}
        watchedMovies={watchedMovies}
        setWatchedMovies={setWatchedMovies}>
      </SelectedMovie>
    </Box>
  }

  const avgImdbRating = watchedMovies.length == 0 ? 0 : average(watchedMovies.map((movie) => movie.imdbRating));
  const avgUserRating = watchedMovies.length == 0 ? 0 : average(watchedMovies.map((movie) => movie.userRating));
  const avgRuntime = watchedMovies.length == 0 ? 0 : average(watchedMovies.map((movie) => movie.runtime));


  return (
    <Box>
      <div className="summary">
        <h2>Movies you watched</h2>
        <div>
          <p>
            <span>#️⃣</span>
            <span>{watchedMovies.length} movies</span>
          </p>
          <p>
            <span>⭐️</span>
            <span>{watchedMovies.length == 0 ? 0 : avgImdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{watchedMovies.length == 0 ? 0 : avgUserRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{watchedMovies.length == 0 ? 0 : avgRuntime} min</span>
          </p>
        </div>
      </div>

      <ul className="list">
        {watchedMovies.map((movie) => (
          <li key={movie.imdbID}>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
              <p>
                <span>⭐️</span>
                <span>{movie.imdbRating}</span>
              </p>
              <p>
                <span>🌟</span>
                <span>{movie.userRating}</span>
              </p>
              <p>
                <span>⏳</span>
                <span>{movie.runtime}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Box>
  );
}

function Box({children}) {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}