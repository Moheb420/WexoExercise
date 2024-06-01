import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../Styles/WishList.css";
import mrbeanImage from "../Data/mrbeanImage.jpg"; // Import the default image

const Wishlist = () => {
  // State to store wishlist items
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Fetch wishlist items from local storage when component mounts
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);

  // Function to remove an item from the wishlist
  const handleRemoveFromWishlist = (id) => {
    const newWishlist = wishlist.filter((item) => item.id !== id); // Filter out the item with the provided id
    setWishlist(newWishlist); // Update the wishlist state
    localStorage.setItem("wishlist", JSON.stringify(newWishlist)); // Update local storage with the new wishlist
  };

  return (
    <div className="wishlist-container">
      <h1 className="wishlist-title">My Wishlist</h1>
      <ul className="wishlist-list">
        {/* Map through wishlist items and render each item */}
        {wishlist.map((movie) => (
          <li key={movie.id} className="wishlist-item">
            {/* Link to the movie details page */}
            <Link to={`/MovieById/${movie.id.split("/").pop()}`}>
              {/* Display movie thumbnail */}
              <img
                src={movie["plmedia$defaultThumbnailUrl"] || mrbeanImage}
                alt={movie.title}
                className="wishlist-image"
              />
            </Link>
            <div className="wishlist-details">
              <h2>{movie.title}</h2>
              <button
                onClick={() => handleRemoveFromWishlist(movie.id)}
                className="wishlist-button remove"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Wishlist;
