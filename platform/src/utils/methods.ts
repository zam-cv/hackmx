import * as path from '@tauri-apps/api/path';
import { download } from '@tauri-apps/plugin-upload';
import { getConfig } from "./auth";
import { API_URL, SERVER } from "./constants";
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

export async function upload<T>(path: string, file: File, metadata?: Object, withConfig = true) {
  const formData = new FormData();
  formData.append("file", file);
  if (metadata) {
    const jsonBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    formData.append("json", jsonBlob);
  };

  const config = withConfig ? getConfig() : undefined;

  if (config) {
    config.headers["Content-Type"] = "multipart/form-data";
  }

  return axios
    .post(`${API_URL}${path}`, formData, config)
    .then(({ data }: { data: T }) => data);
}

export async function downloadServer(p: string, withConfig = true) {
  try {
    console.log('Downloading with tauri:', `${SERVER}/${p}`);
    let name = p.split('/').pop() || 'file.zip';
    console.log(await path.desktopDir())

    await download(
      `${SERVER}/${p}`,
      await path.desktopDir() + "/" + name,
      ({ progress, total }) =>
        console.log(`Downloaded ${progress} of ${total} bytes`),
      {
        // @ts-ignore
        'Authorization': 'Bearer ' + localStorage.getItem("token"),
      }
    );
  } catch (error) {
    console.error(error);

    try {
      const response = await axios.get(`${SERVER}/${path}`, {
        responseType: "blob",
        ...withConfig ? getConfig() : undefined,
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', p.split('/').pop() || 'download');
      document.body.appendChild(link);
      link.click();
  
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
    }
  }
}