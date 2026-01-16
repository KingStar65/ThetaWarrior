import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    const verifySession = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setUser(null);
        return;
      }

      try {
        const response = await fetch('http://localhost:3070/api/auth/me', {
          credentials: 'include'
        });

        if (!response.ok) {
          localStorage.removeItem('user');
          setUser(null);
        } else {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error('Session verification failed:', err);
      }
    };

    verifySession();
    window.addEventListener('userLogin', checkUser);

    return () => {
      window.removeEventListener('userLogin', checkUser);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3070/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('user');
      setUser(null);
      navigate('/');
    }
  };

  return (
    <>
    <nav className="bg-green-400 shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand - Left Side */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity duration-200">
              <span className="text-3xl mr-1">Θ</span>
              <h1 className="text-xl font-bold text-gray-800">
                Theta Warrior
              </h1>
            </Link>
          </div>
          <div className='mr-auto ml-14'>
            <Link to="/manage-portfolio" className='text-lg font-semibold text-gray-600 cursor-pointer hover:text-blue-800 hover:underline'>Manage Portfolio</Link>
          </div>
          {/* Login/Register or Logout - Right Side */}
          <div className="hidden w-full md:block md:w-auto">
            <ul className="text-lg font-bold flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {user ? (
                <li className="flex items-center gap-3">
                  <span className="text-gray-700">
                    Hello, <span className="font-semibold">{user.username}</span>
                  </span>
                  <span className="text-gray-400">|</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent cursor-pointer"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Login</Link>
                  </li>
                  <li>
                    <Link to="/register" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
    </>
  )
}

export default Navbar
