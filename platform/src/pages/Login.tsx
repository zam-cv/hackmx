import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { handleKeyDown, handleEnter } from "../utils";

export default function Login() {
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const { signin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    signin(email, password, navigate);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleLogin();
  }

  return (
    <div className="flex items-center justify-center h-screen font-poppins">
      <div className="p-8 bg-white rounded-lg max-w-sm w-full">
        <h2 className="text-5xl font-bold mb-1 text-center font-sulphur text-hack-blue">HackMx</h2>
        <h3 className="text-sm font-semibold mb-10 text-center text-hack-grey">Login into your account</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left px-0">Email address</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, passwordRef)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left px-0">Password</label>
            <input
              ref={passwordRef}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => handleEnter(e, handleLogin)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
            />
          </div>
          <div className="text-xs text-right underline mb-6">
            <a href="#" className="font-medium text-hack-blue hover:text-blue-900">Forgot password?</a>
          </div>
          <div className="mb-4 shadow-2xl">
            <button type="submit" className="w-full px-4 py-2 text-sm font-medium text-white bg-hack-blue rounded-md hover:bg-blue-900 focus:outline-none focus:bg-blue-900 shadow-2xl">
              Login now
            </button>
          </div>

          <hr className="my-6" />
          <div className="text-sm text-center">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Signup now</a>
          </div>
        </form>
      </div>
    </div>
  );
}
