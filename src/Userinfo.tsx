import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { TopBar } from './Home';

// API helper to fetch user data
async function fetchUserData(user: string) {
  const response = await fetch(`http://localhost:5000/users/${user}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  return response.json();
}

// API helper to update user data
async function updateUserData(user: string, data: { nickname: string; gender: string; password: string }) {
  const response = await fetch(`http://localhost:5000/users/${user}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    mode: 'cors'
  });
  if (!response.ok) {
    throw new Error('Failed to update user data');
  }
  return response.json();
}

function UpdateUser() {
  const { user } = useParams<{ user: string }>();
  const navigate = useNavigate();

  // Fetch user data using useQuery
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['user', user], // The query key format has changed
    queryFn: () => fetchUserData(user),
  });

  const mutation = useMutation({
    mutationFn: (updatedData) => updateUserData(user, updatedData),
    onSuccess: () => navigate('/'),
    onError: (error) => alert(`Error updating user info: ${error.message}`),
  });

  const [formData, setFormData] = useState({
    nickname: data?.nickname || '',
    gender: data?.gender || '',
    password: '',
  });

  if (isLoading) return <p>Loading user data...</p>;
  if (isError) return <p>An error occurred: {error?.message}</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData); // Using mutate from mutation instance
  };

  return (
    <div className='flex w-screen h-screen items-center'>
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">User Info</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
            Nickname
          </label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700"
          disabled={mutation.isLoading}
        >
          Update Info
        </button>
      </form>
    </div>
    </div>
  );
}

export default function UserInfo() {
    return (
        <div>
        <TopBar />
        <UpdateUser />
        </div>
    )
}

