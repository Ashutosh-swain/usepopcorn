import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import StarRating from "./StarRating";

function Test() {
  const [movieRating, setMovieRating] = useState(0);
  // we want user the power to setMovieRating
  return (
    <div>
      {/* below we are getting props from the component into the external component using the below onSetRating */}
      <StarRating color="blue" maxRating={10} onSetRating={setMovieRating} />
      <p>This movie was rated {movieRating} stars</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating
      maxRating={5}
      message={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
    />
    <StarRating size={26} color={"red"} /> */}
    {/* we are allowing user / consumer to set the default rating */}
    {/* <StarRating size={36} color="red" className="test" defaultRating={3} />
    <Test />  */}
  </React.StrictMode>
);
