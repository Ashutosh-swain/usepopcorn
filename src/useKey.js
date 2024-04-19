// creating a custom hook for keypress events
// here user will specify which key should be used to perform the sideffect

import { useEffect } from "react";

export function useKey(key, action) {
  // here action is a callback function
  // creating one more Effect for Listening to a keypress(Escape key press)
  // we want to add Escap event handler to close the movies details of the selected movie so to do this we need a sideEffect so we need an useEffect
  useEffect(
    function () {
      // adding a callback function that we will use in both addeventlisteners and removeeventlisteners
      function callback(e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          action();
        }
      }
      document.addEventListener("keydown", callback);

      // adding a cleanup function to cleanup the eventlistener added to the document
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [action, key]
  );
}
