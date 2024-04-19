// here we are creating a custom Hook:
import { useEffect, useState } from "react";

const KEY = "eb905841";

export function useMovies(query) {
  //(query, callback)
  // here we are lifting the state up so that this state can be used by all child components which are siblings of eachother
  const [movies, setMovies] = useState([]);

  // creating a piece of state for loading indicator
  const [isLoading, setIsLoading] = useState(false);

  // to display the error message we need a piece of state that we can use to display error on to the componenet / ui
  const [error, setError] = useState("");
  // Error Handling is always required whenever we are doing asynchronous tasks such as data fetching from APIs , etc
  // below we will do error handling also and if u are throwing a new error then wrapp the complete code where error can araise into a try catch block
  // useEffect using asynch await method or using async function method
  useEffect(
    function () {
      // doing optional chanining
      // on searching we are closing the current movie details so for this we are calling the close movie function
      //handleCloseMovie();
      //callback?.(); // if callback exists then only call the callback function
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

      fetchMovies(); // here we are calling the async function so then it will work same as it was working in promise chaining techinque

      // adding a cleanup function using the browser API abort controller
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  //   returning the state that will be used to keep our application functional
  return { movies, isLoading, error };
}
