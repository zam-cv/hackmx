import React, { useState } from 'react';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [teamName, setTeamName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 bg-cover" style={{ minHeight: '100vh' }}>
        <img src="https://conecta.tec.mx/sites/default/files/inline-images/plaza-borregos-tec-cem_0.jpg" alt="Register" className="w-full h-full object-cover" />
      </div>
      <div className="w-1/2 p-8 flex flex-col justify-between" style={{ minHeight: '100vh' }}>
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-3xl font-semibold text-blue-600 mb-2">Register</h2>
          <p className="text-center text-gray-700 font-bold mb-4">Create your account to start participating in the HackMx event.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="flex mb-4">
            <div className="w-1/2 pr-2">
              <label htmlFor="first-name" className="block text-gray-700">First Name</label>
              <input
                type="text"
                id="first-name"
                className="mt-2 p-2 w-full border rounded-md bg-gray-200 placeholder-black"
                placeholder="Andres Manuel"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="w-1/2 pl-2">
              <label htmlFor="last-name" className="block text-gray-700">Last Name</label>
              <input
                type="text"
                id="last-name"
                className="mt-2 p-2 w-full border rounded-md bg-gray-200 placeholder-black"
                placeholder="Lopez Obrador"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email address</label>
            <input
              type="email"
              id="email"
              className="mt-2 p-2 w-full border rounded-md bg-gray-200 placeholder-black"
              placeholder="amlo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="mt-2 p-2 w-full border rounded-md bg-gray-200 placeholder-black"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirm-password" className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              className="mt-2 p-2 w-full border rounded-md bg-gray-200 placeholder-black"
              placeholder="Enter your password again"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="team-name" className="block text-gray-700">Team Name</label>
            <input
              type="text"
              id="team-name"
              className="mt-2 p-2 w-full border rounded-md bg-gray-200 placeholder-black"
              placeholder="Enter the name of your team"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone-number" className="block text-gray-700">Phone Number</label>
            <input
              type="tel"
              id="phone-number"
              className="mt-2 p-2 w-full border rounded-md bg-gray-200 placeholder-black"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-blue-600"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <span className="ml-2 text-gray-700">I accept the Terms of Use & Privacy Policy</span>
            </label>
          </div>
          <div className="mt-6">
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 shadow-2xl">
              Register now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
