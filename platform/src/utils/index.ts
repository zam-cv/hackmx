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

export function formatDateWithMicroseconds(date: string) {
  let d = new Date(date);
  let localDate = d.getFullYear() + '-' +
    ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
    ('0' + d.getDate()).slice(-2) + 'T' +
    ('0' + d.getHours()).slice(-2) + ':' +
    ('0' + d.getMinutes()).slice(-2) + ':' +
    ('0' + d.getSeconds()).slice(-2);

  localDate += '.921943';

  return localDate;
}