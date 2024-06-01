import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import MoviesComponent from "./Components/LoadMovies";
import SeriesComponent from "./Components/LoadSeries";
import MoviesByGenre from "./Components/MoviesByGenre";
import FrontPage from "./Components/FrontPage";
import MovieById from "./Components/MovieById";
import Wishlist from "./Components/WishList";
import "./Styles/App.css";

const App = () => {
  return (
    <Router>
      <div className="App">
        <header className="header">
          <h1>Mr. Bean Flex</h1>
        </header>
        <Navigation />
        <Routes>
          <Route exact path="/" element={<FrontPage />} />
          <Route path="/Movies" element={<MoviesComponent />} />
          <Route path="/MovieById/:id" element={<MovieById />} />
          <Route path="/Series" element={<SeriesComponent />} />
          <Route path="/movies/:genre" element={<MoviesByGenre />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </div>
    </Router>
  );
};

const Navigation = () => {
  const location = useLocation();

  return (
    <div className="navigation">
      {location.pathname !== "/" && (
        <Link className="link" to="/">
          Home
        </Link>
      )}
      {location.pathname !== "/Movies" && (
        <Link className="link" to="/Movies">
          Movies
        </Link>
      )}
      {location.pathname !== "/Series" && (
        <Link className="link" to="/Series">
          Series
        </Link>
      )}
      {location.pathname !== "/wishlist" && (
        <Link className="link" to="/wishlist">
          Wishlist
        </Link>
      )}
    </div>
  );
};

export default App;
