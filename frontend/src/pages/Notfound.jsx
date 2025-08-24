import React from 'react'
import {Link} from "react-router-dom"

const Notfound = () => {
  return (
     <div className="h-screen w-screen text-center  text-error text-3xl ">
                  <h1 className='mt-42'>The page you are looking for does not exist.</h1>
                 <h1>💔</h1>
                  <h1>404 Not Found</h1>
                  <Link to="/"><button className='btn btn-error cursor-pointer mt-6'>Home</button></Link>
                </div>
  )
}

export default Notfound