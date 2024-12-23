import React from 'react'
import { Link } from 'react-router-dom'

const Branches = () => {

    

  return (
    <div className='flex items-center justify-center w-full h-screen bg-gray-800' >
        <div className='flex gap-4 text-white'>
            <button className='py-1 px-2 border rounded-md'><Link to='/main'>Login at HQ</Link></button>
            <button className='py-1 px-2 border rounded-md'><Link to='/branch'>Login at Branch</Link></button>
        </div>
    </div>
  )
}

export default Branches
