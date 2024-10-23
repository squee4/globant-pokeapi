import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Main = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/user', { withCredentials: true })
      .then(response => {
        setUser(response.data);
      })
      .catch(() => {
        window.location.href = '/';
      });
  }, []);

  const handleLogout = () => {
    axios.get('http://localhost:3000/logout', { withCredentials: true })
      .then(() => {
        window.location.href = '/';
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Main Page</h1>
      <p>Welcome, {user.username}!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Main;