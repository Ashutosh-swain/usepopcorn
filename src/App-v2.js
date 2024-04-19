// Component categories:
// structural component : ex: App ,NavBar,Main . These 3 components in the Appliction are the example of structural components
// presentational/ stateless components: ex: Logo , NumResults , Movie , WatchedSummary , WatchedMoviesList , WatchedMovie
// stateful component: ex: Search, ListBox , MovieList , WatchedBox

import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// api key for the api
const KEY = "eb905841";
const tempQuery = "Avengers";

export default function App() {
  // here we have lifted the state up
  const [query, setQuery] = useState("");
  // here we are lifting the state up so that this state can be used by all child components which are siblings of eachother
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  // creating a piece of state for loading indicator
  const [isLoading, setIsLoading] = useState(false);

  // to display the error message we need a piece of state that we can use to display error on to the componenet / ui
  const [error, setError] = useState("");

  // creating state for selecting a movie
  const [selectedId, setSelectedId] = useState(null);

  // creating a handler function for click event of the first box
  function handleSelectMovie(id) {
    // setSelectedId(id === selectedId ? handleCloseMovie : id); // this also works perfectly
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  // creating a handler function for closing the movie that appears in 2nd box due to click of first box
  function handleCloseMovie() {
    setSelectedId(null);
  }

  // creating a function to add watched movies into the watched array
  function handleAddWatched(movie) {
    // watched is the current object and movie is the new object
    setWatched((watched) => [...watched, movie]);
  }

  // creating function to remove the watched movie from the watchedlist
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  // here we want that as soon as our application loads we want to fetch the data so for that we use below code
  // using useEffect hook for putting the sideeffects under it so that our flow of application is maintained
  // useEffect hook will make this below code run only once when the app component is mount/intial render
  // useEffect() takes two parameters 1st, function and 2nd a dependency array
  // the below code will run after the render of the page is done
  // useEffect using promise chaining technique
  // useEffect(function () {
  //   fetch(`http://www.omdbapi.com/?s=${query}&apikey=${KEY}
  // `)
  //     .then((res) => res.json())
  //     .then((data) => setMovies(data.Search));
  // }, []);

  // Error Handling is always required whenever we are doing asynchronous tasks such as data fetching from APIs , etc
  // below we will do error handling also and if u are throwing a new error then wrapp the complete code where error can araise into a try catch block
  // useEffect using asynch await method or using async function method
  useEffect(
    function () {
      // creating a Abort controller API that we will use in the cleanup function of this useEffect hook
      // AbortController is a browser API
      // thgen after creation passing the controller as second argument to the fetch function
      const controller = new AbortController();
      // creating an async function
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?s=${query}&apikey=${KEY}`,
            { signal: controller.signal }
          );

          // throwing the error if the api call doesnot provide the output or users internet connection is lost
          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();

          // handling the error when api call does not return anything
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          //console.error(err.message);
          // as we are aborting the request of fetch api so our code will treat it as an error so to resolve this error we use the below code
          if (err.name !== "AbortError") {
            setError(err.message);
            console.log(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      // on searching we are closing the current movie details so for this we are calling the close movie function
      handleCloseMovie();
      fetchMovies(); // here we are calling the async function so then it will work same as it was working in promise chaining techinque

      // adding a cleanup function using the browser API abort controller
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  // fetching data from omdb api using fetch() function for making api calls
  // the below code produces infinite renders as we are using state update in render logic which causes sideeffect that is infinite calling of apis
  // so to solve this issue we are using useEffect hook
  // fetch(`http://www.omdbapi.com/?s=interstellar&apikey=${KEY}
  // `)
  //   .then((res) => res.json())
  //   .then((data) => console.log(data.Search));

  // below to avoid the prop drilling problem we are using component composition technique
  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        {/* using Passing element as prop technique  . this method is used in some react library such as react router*/}
        {/* for passing multiple componenets in this technique we need react fragment */}
        {/* <Box element={<MovieList movies={movies} />} />
        <Box
          element={
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} />
            </>
          } 
        /> */}
        {/* below code is for using children prop technique  or u can use alternative method passing element as prop technique which is above */}
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

// loading component: when the api data will take time to fetch in meanwhile this component will be displayed and when api data is ready to display loading component will not display
function Loader() {
  return <p className="loader">Loading...</p>;
}

// creating a Error component that we can display when some error occurs
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

// here basically ListBox and WatchedBox component were having same content so what we did is  created a new resuable component called Box
// and we are using in place of both

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

// function WatchedBox() {
//   const [watched, setWatched] = useState(tempWatchedData);

//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watched={watched} />
//           <WatchedMoviesList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedMoviesList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
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
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}

// creating a component to show the selected movie
function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  // creating piece of state to store the object that we received from the API call
  const [movie, setMovie] = useState({});

  // creating a loading state to show user that there is nothing wrong with there system it will take time but loading
  const [isLoading, setIsLoading] = useState(false);

  // creating a state setter function that we will export or use outside this component
  const [userRating, setUserRating] = useState("");

  // to remove the issue of user selecting the same movie again and again we are creating a derived state
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  // creating a derived state to get the already rated movie rating so that we can display it when user selects that movie again
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  // destructing the object received according to our own needs and providing some meaningful names

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    // creating a new object that we will pass in the function
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  // creating one more Effect for Listening to a keypress(Escape key press)
  // we want to add Escap event handler to close the movies details of the selected movie so to do this we need a sideEffect so we need an useEffect
  useEffect(
    function () {
      // adding a callback function that we will use in both addeventlisteners and removeeventlisteners
      function callback(e) {
        if (e.code === "Escape") {
          onCloseMovie();
        }
      }
      document.addEventListener("keydown", callback);

      // adding a cleanup function to cleanup the eventlistener added to the document
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onCloseMovie]
  );

  // whenever this component is mounted /rendered i want to get the details about the selected movie in this comnponent from an API
  // i want that useEffect hook should execute whenever this component is mounted/rendered so i am using empty dependency array for this purpose
  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?i=${selectedId}&apikey=${KEY}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  // creating a useEffect hook ( to create a sideeffect) to change the title of the page in browser when user selects a movie
  useEffect(
    function () {
      // we are setting a condition that if no movie then return and keep the original title only
      if (!title) return;
      // changing the title of the browser page
      document.title = `Movie | ${title}`;

      // useEffect cleanup function
      // after our component is unmounted then also sideeffect is happening as the previous title of the browser page is not getting reseted
      // so to resolve this we are using Cleanup function ( it is a function which the useEffect hook returns)
      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMBD rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {/* Getting the state out side a component by adding in a function 
               ( for this we will create a state setter function and state and then pass it to the function that will export the state outside the component)
              here below we will use the technique by which we can bring the state outside the component without lifting up the state */}
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    // below here we are exporting the state
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>You rated this movie {watchedUserRating} ⭐</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
