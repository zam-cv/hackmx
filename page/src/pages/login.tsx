import {useState} from 'react';
//import {Navigate, useNavigate} from 'react-router-dom';

export default function Login(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  //const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent <HTMLFormElement>){

    e.preventDefault();
    console.log('username:', username);
    console.log('password:', password);
    //navigate('/dashboard');
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center font-sulphur">HackMx</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-4">
            <button type="submit" className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
              Login now
            </button>
          </div>
          <div className="text-sm text-center">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Forgot password?</a>
          </div>
          <hr className="my-6"/>
          <div className="text-sm text-center">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Signup now</a>
          </div>
        </form>
      </div>
    </div>
  );

  
}



