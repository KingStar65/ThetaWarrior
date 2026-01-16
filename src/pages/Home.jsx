import React from 'react'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import Dashboard from '../components/Dashboard'


const Home = () => {
    
  const [count, setCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
    <div className='min-h-[calc(100vh-65px)] bg-gray-50'>
    <div className="flex justify-center items-center h-24">
    <h1 className="text-emerald-500 text-4xl font-bold">Θ Theta Warrior</h1>
    </div>
    <Dashboard/>
    </div>
    </>
  )
}

export default Home