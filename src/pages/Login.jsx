import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {Eye, EyeOff} from 'lucide-react'

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
     const {name, value} = e.target;
     setFormData(prev => ({
      ...prev,
      [name]: value     }))
  }

  const handleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword(prev => !prev);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3070/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.isError) {
        setError(data.error);
      } else {
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('userLogin'));
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }

  };
  
  
  return (
    <div className='min-h-[calc(100vh-65px)] bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
        <div className='flex justify-center items-center mb-6'>
          <h2 className="ml-2 text-3xl font-bold text-gray-900">
            Login
          </h2>
        </div>
        <p className='text-center text-sm text-gray-600'>
          Sign in to your account to track your investments
        </p>
        <form onSubmit={handleSubmit}>
      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          <div className='space-y-4'>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                Email Address
              </label>
              <div>
                  <input
                  id="email" name="email" type="email" autoComplete='email' onChange={handleInput} value={formData.email}
                  className='block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                  placeholder='Enter your email'>

                  </input>
              </div>
              </div>
              <div>
                <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                  Password
                </label>
                <div className='mb-4 relative block'>
                  <input
                    id='password' name ='password' type={showPassword ? 'text': 'password'} onChange = {handleInput} value={formData.password} placeholder='Enter Your Password'
                    className='w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                  />
                  <button className='absolute right-1 top-1.5 cursor-pointer' onClick={handleShowPassword}>
                  {showPassword ? <EyeOff color="#9e9e9e" strokeWidth={1.5} /> : <Eye color="#9e9e9e" strokeWidth={1.5} />}
                  </button>
                </div>
              </div>
          </div>
          {error && (
            <div className='mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm'>
              {error}
            </div>
          )}
          <div className=' mt-4 flex justify-center'>
          <button
            type='submit'
            disabled={loading}
            className={`px-4 py-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
            {loading ? 'Logging in...' : 'Submit'}
          </button>
        </div>
        </div>
      </div>
      </form>

    </div>
  )
}

export default Login