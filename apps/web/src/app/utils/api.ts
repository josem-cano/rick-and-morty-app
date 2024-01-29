import axios, { AxiosInstance } from "axios";
import { getUserToken } from "./auth.tsx";

export const getApi = (): AxiosInstance => {
  return axios.create({
    baseURL: "http://localhost:5001",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getUserToken()}`,
    },
  });
};
