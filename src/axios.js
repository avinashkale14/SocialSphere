import axios from "axios";

const makeRequest = axios.create({
  baseURL: "https://socialsphere-1b6c.onrender.com/api",
  withCredentials: true,
});

export default makeRequest;