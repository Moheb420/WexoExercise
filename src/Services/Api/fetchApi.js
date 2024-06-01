export const fetchEntryCountByGenre = async (genre) => {
  try {
    const response = await fetch(
      `https://feed.entertainment.tv.theplatform.eu/f/jGxigC/bb-all-pas?form=json&byTags=genre:${genre}&byProgramType=movie`
    );
    const data = await response.json();
    if (data && data.entryCount) {
      return data.entryCount;
    } else {
      throw new Error("Invalid data format");
    }
  } catch (error) {
    console.error(`Error fetching entry count for ${genre}:`, error);
    return 0;
  }
};

export const fetchMovieById = async (id) => {
  try {
    const response = await fetch(
      `https://feed.entertainment.tv.theplatform.eu/f/jGxigC/bb-all-pas/${id}?form=json`
    );
    const data = await response.json();
    if (data) {
      return data;
    } else {
      throw new Error("Invalid data format");
    }
  } catch (error) {
    console.error(`Error fetching movie with ID ${id}:`, error);
    throw error;
  }
};

export const fetchMovies = async (page) => {
  try {
    const limit = 10; // Number of movies per page
    const offset = (page - 1) * limit;

    const response = await fetch(
      `https://feed.entertainment.tv.theplatform.eu/f/jGxigC/bb-all-pas?form=json&lang=da&byProgramType=movie&range=${offset}-${
        offset + limit
      }`
    );

    const data = await response.json();
    if (data && data.entries) {
      return data.entries;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const BASE_URL =
  "https://feed.entertainment.tv.theplatform.eu/f/jGxigC/bb-all-pas?form=json&byProgramType=movie";

export const fetchMoviesByGenre = async (genre) => {
  try {
    const response = await fetch(`${BASE_URL}&lang=da&byTags=genre:${genre}`);
    const data = await response.json();
    return data.entries || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export const fetchMoviesByGenreAndLimit = async (genre, limit = 3) => {
  try {
    const response = await fetch(
      `${BASE_URL}&byTags=genre:${genre}&range=1-${limit}`
    );
    const data = await response.json();
    return data.entries || [];
  } catch (error) {
    console.error(`Error fetching movies for ${genre}:`, error);
    return [];
  }
};

export const fetchSeries = async () => {
  try {
    const response = await fetch(
      "https://feed.entertainment.tv.theplatform.eu/f/jGxigC/bb-all-pas?form=json&lang=da&byProgramType=series"
    );
    const data = await response.json();
    return data.entries || [];
  } catch (error) {
    console.error("Error fetching series data:", error);
    return [];
  }
};
const BASE_URL_SERIES =
  "https://feed.entertainment.tv.theplatform.eu/f/jGxigC/bb-all-pas?form=json&byProgramType=series";

export const fetchSeriesByLimit = async (limit = 3) => {
  try {
    const response = await fetch(`${BASE_URL_SERIES}&range=1-${limit}`);
    const data = await response.json();
    return data.entries || [];
  } catch (error) {
    console.error("Error fetching series data:", error);
    return [];
  }
};
