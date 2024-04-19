// here we are creating a custom hook for storing the watchedmovies list in the browsers local storage
import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  // step 2: reading the data from the local storage when the application mounts
  //const [watched, setWatched] = useState([]);
  // instead of passing a value in state we will pass a callback function that we will use to read the data that we have stored in the browsers local storage
  const [value, setValue] = useState(function () {
    // this callback function should be a pure function means withoout any argument
    // reading the data from the local storage
    // this function will only run once and during the initial render/ mount
    const storedValue = localStorage.getItem(key); // using this function to get the data from the local storage of the browser
    // if the storedvalue have some value then return stored value or else return intialState
    return storedValue ? JSON.parse(storedValue) : initialState; // we have passed the value as a string so we need to parse it back to original form
  });

  // method 2:storing data in local storage inside a Effect
  useEffect(
    function () {
      //storing the watchedlist data into the browsers local storage  (using localStorage function which is presnt in all broswers)
      //localStorage.setItem("namecof the key", "actual data"); actual value is always a string so convert it before storing
      localStorage.setItem(key, JSON.stringify(value)); // use this default function of browser to store data in local storage
      // to check whether it is stored in devtools in browser go to application and in storage and the local storage then you will find your data stored
    },
    [value, key]
  );
  // returning the piece of state and its setter function
  return [value, setValue];
}
