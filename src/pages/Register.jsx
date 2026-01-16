import React, { useState } from 'react'

const Register = () => {
  const [formData, setFormData] = useState({
          email: '',
          username: '',
          password: '',
          confirmPassword: ''
  }); 
  const [error, setError] = useState('');
  const [regSuccessText, setregSuccessText] = useState('');
  const handleChange = (e) => {
    const {name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError('');
    setregSuccessText('');
    if(!formData.email || !formData.password || !formData.confirmPassword || !formData.username) {
      setError('All fields are required');
      return;
    }
    if(formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 10) {
      setError('Password must be at least 10 characters long');
      return;
    } 
    try {
        const { email, password, username } = formData;
        const res = await fetch('http://localhost:3070/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({email, password, username})
        });
        const data = await res.json();
        console.error(data);

        if(data.isError) {
          setError(data.error);

        }
        else {
          setregSuccessText(data.message);
        }
    }
    catch(error) {
      console.log(error);
      console.log("400");
      return;
    }
    
  };

  return (
    <div className='min-h-[calc(100vh-65px)] flex flex-col justify-center items-center bg-gray-50'>
        <div className='w-full max-w-xl'>
            <div className='mb-4'>
            <h1 className='text-3xl text-center'>Create Your account</h1>
            </div>
            <div className='bg-blue-200 rounded-2xl p-6 shadow-sm'>
                <div className="space-y-5">
                {error && ( 
              <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'>
                <strong className='font-bold'>Error: </strong>
                <span className='block sm:inline'>{error}</span>
              </div>
            )}
            {regSuccessText && (
              <div className='bg-red-100 border border-green-400 text-green-700 px-4 py-3 rounded relative'>
                <strong className='font-bold'>Success: </strong>
                <span className='block sm:inline'>{regSuccessText}</span>
              </div>
            )}
                <form onSubmit={handleSubmit}>
                  <div className='mb-4'>
                     <label htmlFor="email" class="block text-sm font-medium text-slate-700 mb-2">Email address</label>
                     <input
                        id="email" type="email" name="email" value = {formData.email} onChange={handleChange}
                        className='block w-full rounded-md border border-slate-400 bg-white px-3 py-2 text-sm text-black focus:outline-indigo-500 sm:text-sm/6'  
                     />
                     </div>
                     <div className='mb-4'>
                     <label htmlFor="username" class="block text-sm font-medium text-slate-700 mb-2">Username</label>
                     <input
                        id="username" type="text" name="username" value = {formData.username} onChange={handleChange}
                        className='block w-full rounded-md border border-slate-400 bg-white px-3 py-2 text-sm text-black focus:outline-indigo-500 sm:text-sm/6'  
                     />
                     </div>
                     <div className='mb-4'>
                     <label htmlFor="password" class="block text-sm font-medium text-slate-700 mb-2">Password</label>
                     <input
                        id="password" type="password" name="password" value = {formData.password} onChange={handleChange}
                        className='block w-full rounded-md border border-slate-400 bg-white px-3 py-2 text-sm text-black focus:outline-indigo-500 sm:text-sm/6'  
                     />
                     </div>
                     <div className='mb-4'>
                     <label htmlFor="confirmPassword" class="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                     <input
                        id="confirmPassword" type="password" name="confirmPassword" value = {formData.confirmPassword} onChange={handleChange}
                        className='block w-full rounded-md border border-slate-400 bg-white px-3 py-2 text-sm text-black focus:outline-indigo-500 sm:text-sm/6'  
                     />
                     </div>
                <div className=' mt-6 flex justify-center'>
                 <button type="submit" className='px-14 py-3 bg-gradient-to-r from-green-200 to-emerald-400 hover:bg-emerald-600 text-gray-600 font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg cursor-pointer'>
                    Submit
                  </button>
                </div>
                </form>
                </div>
            </div>
        </div>
    </div>
  )
};

export default Register