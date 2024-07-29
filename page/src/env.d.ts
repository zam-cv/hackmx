/// <reference types="astro/client" />

interface ImportMetaEnv {
  PUBLIC_SERVER_PROTOCOL: string;
  PUBLIC_SERVER_HOST: string;
  PUBLIC_SERVER_PORT: number;
  PUBLIC_API_ROUTE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}