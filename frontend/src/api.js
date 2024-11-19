import axios from "axios";

const GOOGLE_PLACES_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
const CITATION_API_URL = "http://localhost:3001/api/";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchBusinessSuggestions = async (query) => {
  if (!query) return [];

  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
    {
      params: {
        input: query,
        key: GOOGLE_PLACES_API_KEY,
        types: "establishment",
        language: "en",
      },
      headers: { Authorization: null },
    }
  );

  return response.data.predictions.map((prediction) => ({
    label: prediction.description,
    value: prediction.place_id,
  }));
};

export const fetchBusinessDetails = async (placeId) => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/place/details/json`,
    {
      params: {
        place_id: placeId,
        key: GOOGLE_PLACES_API_KEY,
        fields: "name,formatted_address,formatted_phone_number,website",
      },
    }
  );

  const result = response.data.result;
  return {
    name: result.name,
    address: result.formatted_address,
    phone: result.formatted_phone_number,
    website: result.website,
  };
};

export const loginUser = async (email, password, onSuccess) => {
  try {
    const response = await axios.post(`${CITATION_API_URL}users/login`, {
      email,
      password,
    });
    const data = response.data;

    if (onSuccess) {
      onSuccess(data.token);
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const registerUser = async (username, email, password, onSuccess) => {
  try {
    await axios.post(`${CITATION_API_URL}users/register`, {
      email,
      password,
      username,
    });

    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const response = await axios.get(`${CITATION_API_URL}users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const submitSearch = async (data) => {
  try {
    const response = await axios.post(`${CITATION_API_URL}search/tasks`, data);
    return response.data;
  } catch (error) {
    console.error("Error submitting search:", error);
    throw error;
  }
};

export const fetchUserTasks = async () => {
  const response = await axios.get(`${CITATION_API_URL}users/tasks`);
  return response.data.tasks;
};
