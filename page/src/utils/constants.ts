import {
  MoveDirection,
  OutMode,
} from "@tsparticles/engine";

const SERVER_PROTOCOL = import.meta.env.PUBLIC_SERVER_PROTOCOL || "http";
const SERVER_PORT = import.meta.env.PUBLIC_SERVER_PORT || "8080";
const SERVER_HOSTNAME = import.meta.env.PUBLIC_SERVER_HOST || "localhost";
let SERVER_HOST = `${SERVER_HOSTNAME}:${SERVER_PORT}`;

// if the domain in which it is connecting is different from the one that is being given
// replace with the current domain
// SERVER_HOST =
//   window.location.hostname === SERVER_HOSTNAME
//     ? SERVER_HOST
//     : window.location.hostname + ":" + SERVER_PORT;

export const API_ROUTE = import.meta.env.PUBLIC_API_ROUTE || "api";
export const API_URL = `${SERVER_PROTOCOL}://${SERVER_HOST}/${API_ROUTE}`;
export const SERVER = `${SERVER_PROTOCOL}://${SERVER_HOST}`;

export const PARTICLE_OPTIONS = {
  background: {
    color: {
      value: "#040822",
    },
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
    },
    modes: {
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    move: {
      direction: MoveDirection.none,
      enable: true,
      outModes: {
        default: OutMode.out,
      },
      random: false,
      speed: 6,
      straight: false,
    },
    number: {
      density: {
        enable: true,
      },
      value: 200,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 5 },
    },
  },
  detectRetina: true,
}