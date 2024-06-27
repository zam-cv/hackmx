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
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  )

  
}



