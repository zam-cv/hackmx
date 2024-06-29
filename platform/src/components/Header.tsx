import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

export default function Header() {
  const { signout } = useAuth();

  return (
    <div className="grid grid-cols-[auto_1fr_auto] p-5 pt-6 shadow-md">
      <h2 className="font-bold text-lg">HackMx</h2>
      <div className="flex items-center px-7">
        <Link to="/" className="cursor-pointer">
          Home
        </Link>
      </div>
      <div>
        <button onClick={signout}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
