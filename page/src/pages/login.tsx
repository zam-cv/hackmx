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
        <div className="flex flex-col max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left px-0">Email address</label>
            <div className="relative flex items-center">
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                className="bg-hack-color-input block w-full px-3 py-2 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <div className="bg-hack-blue flex items-center justify-center w-10 h-10 rounded-md">
                  <img src="../../public/icons/mail.png" alt="Email Icon" className="h-6 w-5" style={{ filter: 'invert(100%)' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left px-0">Password</label>
            <div className="relative flex items-center">
              <input
                ref={passwordRef}
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => handleEnter(e, handleLogin)}
                className="bg-hack-color-input block w-full px-3 py-2 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <div className="bg-hack-blue flex items-center justify-center w-10 h-10 rounded-md">
                  <img src="../../public/icons/lock.png" alt="Password Icon" className="h-6 w-6" style={{ filter: 'invert(100%)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-right underline mb-6">
          <a href="#" className="font-medium text-hack-blue hover:text-blue-900">Forgot password?</a>
        </div>
        <div className="mb-4 shadow-2xl">
          <button type="submit" className="w-full px-4 py-2 text-sm font-medium text-white bg-hack-blue rounded-md hover:bg-blue-900 focus:outline-none focus:bg-blue-900 shadow-2xl">
            Login now
          </button>
        </div>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-400" />
          <p className="px-4 text-sm text-gray-400">OR</p>
          <hr className="flex-grow border-gray-400" />
        </div>

        <div className="text-sm text-center">
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Signup now</a>
        </div>
      </form>
    </div>
  </div>
  );
}
