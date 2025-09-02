import { useState, useEffect } from 'react';

// Login Component
function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.token, data.user);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Make sure backend is running on port 5000');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            placeholder="Enter your password"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Test credentials: admin@test.com / password123
        </p>
      </div>
    </div>
  );
}

// Register Component
function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onRegister(data.token, data.user);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Make sure backend is running on port 5000');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name:
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email:
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Phone:
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            placeholder="Enter your phone"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password:
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            placeholder="Enter your password (min 6 chars)"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || formData.password.length < 6}
          className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </div>
    </div>
  );
}

// Updated UserList Component
function UserList({ token, onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            // Token is invalid, logout user
            onLogout();
            return;
          }
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    } else {
      setError('No authentication token found');
      setLoading(false);
    }
  }, [token, onLogout]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg">Loading users...</div>
    </div>
  );

  if (error) return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      <h3 className="font-bold">Error:</h3>
      <p>{error}</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User List</h1>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map(user => (
          <div key={user._id} className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Phone:</span> {user.phone}
            </p>
            {user.createdAt && (
              <p className="text-sm text-gray-500 mt-2">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>
      
      {users.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No users found. Register some users to see them here.
        </div>
      )}
    </div>
  );
}

// Main App Component
export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [view, setView] = useState('login');

  const handleLogin = (token, userData) => {
    setToken(token);
    setUser(userData);
  };

  const handleRegister = (token, userData) => {
    setToken(token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setView('login');
  };

  // If user is logged in, show UserList
  if (token && user) {
    return <UserList token={token} onLogout={handleLogout} />;
  }

  // If not logged in, show login/register forms
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Navigation */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">MERN Auth App</h1>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setView('login')}
              className={`px-6 py-2 rounded font-medium ${
                view === 'login'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setView('register')}
              className={`px-6 py-2 rounded font-medium ${
                view === 'register'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Content */}
        {view === 'login' ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Register onRegister={handleRegister} />
        )}

        {/* Instructions */}
        <div className="max-w-2xl mx-auto mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-bold text-blue-800 mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside text-blue-700 space-y-1">
            <li>Make sure your backend is running on port 5000</li>
            <li>Register a new account or use test credentials</li>
            <li>After login, you'll see the user list</li>
            <li>The JWT token will be stored in localStorage</li>
          </ol>
        </div>
      </div>
    </div>
  );
}