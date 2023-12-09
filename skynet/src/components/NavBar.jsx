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

const NavBar = () => {
  const [toggle, setToggle] = useState(false)
  return (
    <nav className='w-full flex py-6 justify-between items-center navbar'>
      <img src={logo} alt="hoobank" className='w-[124px] h-[32px]' />
      <ul className='list-none sm:flex hidden justify-end items-center flxe-1'>
        {
          navLinks.map((el, index)=>{
            return(
              <li key={el.id} className={`font-poppins font-normal cursor-pointer text-[16px] ${index === navLinks.length-1 ? 'mr-0':'mr-10'} text-white`}>
                <a href={`#${el.id}`}>
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

export default NavBar