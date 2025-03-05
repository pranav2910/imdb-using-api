import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchMovies = async () => {
    if (!query) return;
    setLoading(true);
    const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=ddd9f36d`);
    const data = await res.json();
    setLoading(false);
    if (data.Search) {
      setMovies(data.Search);
    } else {
      alert("No movies found!");
    }
  };

  const addToCart = (movie) => {
    if (!cart.some((item) => item.imdbID === movie.imdbID)) {
      setCart([...cart, movie]);
    }
  };

  const removeFromCart = (imdbID) => {
    setCart(cart.filter((movie) => movie.imdbID !== imdbID));
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">IMDB </div>
        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={searchMovies} className="search-button" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
          🛒 {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
        </div>
      </header>

      {/* Movies List */}
      <div className="movies-grid">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="movie-card">
            <img src={movie.Poster} alt={movie.Title} className="movie-poster" />
            <div className="movie-info">
              <h3>{movie.Title}</h3>
              <p>{movie.Year}</p>
            </div>
            <button
              className="add-to-cart"
              onClick={() => addToCart(movie)}
              disabled={cart.some((item) => item.imdbID === movie.imdbID)}
            >
              {cart.some((item) => item.imdbID === movie.imdbID) ? "Added" : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="cart-modal" onClick={(e) => e.target.classList.contains("cart-modal") && setIsCartOpen(false)}>
          <div className="cart-content">
            <h2>Cart</h2>
            <button className="close-cart" onClick={() => setIsCartOpen(false)}>Close</button>
            <ul>
              {cart.map((movie) => (
                <li key={movie.imdbID} className="cart-item">
                  <img src={movie.Poster} alt={movie.Title} />
                  <div>
                    <h3>{movie.Title}</h3>
                    <p>{movie.Year}</p>
                    <button className="remove-from-cart" onClick={() => removeFromCart(movie.imdbID)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
