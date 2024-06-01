import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSeriesByLimit } from "../Services/Api/fetchApi";
import "../Styles/Series.css";
import mrbeanImage from "../Data/mrbeanImage.jpg";

const SeriesComponent = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Track current page for pagination
  const [hasMore, setHasMore] = useState(true); // Track if more series are available
  const navigate = useNavigate();
  const seriesCache = useRef({}); // Cache for series data

  useEffect(() => {
    const loadSeries = async () => {
      try {
        setLoading(true);

        // Check if data for the current page is already in the cache
        if (seriesCache.current[page]) {
          setSeries((prevSeries) => [
            ...prevSeries,
            ...seriesCache.current[page],
          ]);
          setLoading(false);
          return;
        }

        const seriesData = await fetchSeriesByLimit(8);
        if (seriesData.length > 0) {
          setSeries((prevSeries) => {
            const newSeries = [
              ...prevSeries,
              ...seriesData.filter(
                (newItem) => !prevSeries.some((item) => item.id === newItem.id)
              ),
            ];
            return newSeries;
          });
          // Update the cache
          seriesCache.current[page] = seriesData;
        } else {
          setHasMore(false); // No more series to load
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch series:", error);
        setLoading(false);
      }
    };

    loadSeries();
  }, [page]); // Fetch series when page changes

  // Function to get the release year from a given date string
  const getReleaseYear = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getFullYear()) ? date.getFullYear() : "N/A";
  };
  // Handle pagination
  const loadMoreSeries = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div>
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>
      <h1>Series</h1>
      <div className="series-container">
        {/* Map through series data and render each serie */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          series.map((serie) => (
            <div key={serie.id} className="serie">
              <h2>{serie.title}</h2>
              <p>{serie.description}</p>
              {/* Display the release year */}
              <p>Release Year: {getReleaseYear(serie["plprogram$pubDate"])}</p>
              {/* Display actors if available */}
              {serie["plprogram$credits"] && (
                <div>
                  <p>Actors:</p>
                  <ul>
                    {/* Map through actors and render each actor */}
                    {serie["plprogram$credits"]
                      .filter(
                        (credit) => credit["plprogram$creditType"] === "actor"
                      )
                      .map((actor, index) => (
                        <li key={index}>{actor["plprogram$personName"]}</li>
                      ))}
                  </ul>
                </div>
              )}
              {/* Render thumbnail image or default image */}
              <img
                src={serie["plmedia$defaultThumbnailUrl"] || mrbeanImage}
                alt={serie.title}
              />
              {/* Render default image */}
              <img src={serie["plmedia$defaultImageUrl"]} alt={serie.title} />
            </div>
          ))
        )}
      </div>
      {/* Load more button */}
      {!loading && hasMore && (
        <button onClick={loadMoreSeries} className="load-more-button">
          Load More
        </button>
      )}
    </div>
  );
};

export default SeriesComponent;
