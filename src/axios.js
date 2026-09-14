import axios from "axios";

const makeRequest = axios.create({
  baseURL: "http://localhost:8800/api",
  withCredentials: true,
});

export default makeRequest;