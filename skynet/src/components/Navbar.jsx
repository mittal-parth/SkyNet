// import React,{useState} from 'react'
// import {navLinks} from '../constants'
// import { SiMoleculer } from "react-icons/si";
// const NavBar = () => {
//   const [toggle, setToggle] = useState(false)
//   return (
//     <nav className='w-full flex py-6 justify-between items-center navbar '>
//       <div className='flex items-center'>

//       <SiMoleculer  color='white' size={32}/>
//       <div className='ml-3 text-xl text-white font-poppins font-bold'>
//         SKYNET
//       </div>
//       </div>
//       <ul className='mr-10 list-none sm:flex hidden justify-end items-center flxe-1'>
//         {
//           navLinks.map((el, index)=>{
//             return(
//               <li key={el.id} className={`font-normal cursor-pointer text-[20px] ${index === navLinks.length-1 ? 'mr-0':'mr-10'} text-gray-500`}>
//                 <a className='text-white ' >
//                   {el.title}
//                 </a>
//               </li>
//             )
//           })
//         }
//       </ul>

//     </nav>
//   )
// }

// export default NavBar

import React,{useState} from 'react'
import {close, logo, menu} from '../assets'
import {navLinks} from '../constants'
import {Routes, Route, useNavigate} from 'react-router-dom';

const Navbar = () => {
  const [toggle, setToggle] = useState(false)
  const navigate = useNavigate(); 

  return (
    <nav className='w-full flex py-6 justify-between items-center navbar'>
      <div></div>
      <ul className='list-none sm:flex hidden justify-end items-center flxe-1'>
        {
          navLinks.map((el, index)=>{
            return(
              <li key={el.id} className={`font-poppins font-normal cursor-pointer text-[16px] ${index === navLinks.length-1 ? 'mr-0':'mr-10'} text-white`}>
                <a onClick={() => navigate('/data')} className='text-white'>
                  {el.title}
                </a>
              </li>
            )
          })
        }
      </ul>
    </nav>
  )
}

export default Navbar