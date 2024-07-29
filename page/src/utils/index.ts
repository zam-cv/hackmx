export function next(element: string, nextElement: string) {
  document.getElementById(element)?.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      document.getElementById(nextElement)?.focus();
    }
  })
}

export function nextWithAction(element: string, func: Function) {
  document.getElementById(element)?.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      func();
    }
  })
}

export function getQueryParam(param: string): string | null {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(param);
}

export const handleKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
  ref: React.RefObject<HTMLInputElement>
) => {
  if (e.key === "Enter") {
    e.preventDefault();
    ref.current?.focus();
  }
};

export const handleEnter = (
  e: React.KeyboardEvent<HTMLInputElement>,
  callback: () => void
) => {
  if (e.key === "Enter") {
    e.preventDefault();
    callback();
  }
};