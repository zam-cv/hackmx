import { getConfig } from "./auth";
import { API_URL } from "./constants";
import axios from "axios";

export async function post<T, B>(path: string, body: B, withConfig = true) {
  return axios
    .post(`${API_URL}${path}`, body, withConfig ? getConfig() : undefined)
    .then(({ data }: { data: T }) => data);
}

export async function get<T>(path: string, withConfig = true) {
  return axios
    .get(`${API_URL}${path}`, withConfig ? getConfig() : undefined)
    .then(({ data }: { data: T }) => data);
}

export async function del<T>(path: string, withConfig = true) {
  return axios
    .delete(`${API_URL}${path}`, withConfig ? getConfig() : undefined)
    .then(({ data }: { data: T }) => data);
}