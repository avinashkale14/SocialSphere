import axios from "axios";

const makeRequest = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export default makeRequest;