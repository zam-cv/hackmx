import React, { useState } from 'react';

export default function ForgetPassword() {
  const [email, setEmail] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  const mailIcon = '/mail.svg';
  const profileCircle = '/profile-circle.svg';
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
      <div className="flex flex-col items-center mb-6">
        <img src={profileCircle} alt="User Icon" className="w-32 h-32 mb-6" />
        <p className="text-center text-gray-700 font-bold">Enter your email, and we’ll send you a link to reset your password.</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex items-center border border-gray-300 rounded mb-4">
          <input 
            type="email" 
            placeholder="example@email.com" 
            className="flex-grow p-2 border-none focus:outline-none" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <button type="submit" className="bg-blue-900 p-2 text-white rounded-r">
            <img src={mailIcon} alt="Email Icon" className="w-5 h-5" />
          </button>
        </div>
        <button type="submit" className="bg-blue-900 text-white py-2 rounded mb-4 shadow-xl hover:shadow-2xl">
          Reset Password
        </button>
      </form>
      <a href="Login.tsx" className="text-blue-900 text-center block font-bold">← Back to Log in</a>
    </div>
  );
}
