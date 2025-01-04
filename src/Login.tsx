import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!username || !password) {
      setError('Please fill in both fields.');
      return;
    }

    // API request to check user credentials
    try {
      const response = await fetch('http://localhost:5000/check_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success) {
        // Clear error and redirect to user home page
        setError('');
        navigate(`/${username}/home`);
        
      } else {
        setError('Invalid username or password.');
      }
    } catch (error) {
      setError('An error occurred while logging in.');
    }
  };

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <div className='flex flex-col h-2/5 w-2/5 gap-y-4 bg-gray-400 items-center justify-center p-3 rounded-lg bg-opacity-75'>
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className='flex flex-col gap-y-4 text-bold'>
        <div className="form-group">
          <label >Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
    </div>
  );
};

export default Login;
