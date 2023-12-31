import React from 'react'
import styles from '../style'
import {discount, robot} from '../assets'
import {GetStarted} from './index'
const Hero = () => {
  return (
      <div className={` items-start w-full flex-col xl:px-0 sm:px-16 px-6`}>

        <div className="flex justify-center items-center w-full">
          <div className="flex justify-center font-poppins font-semibold ss:text-[72px] text-[52px] text-white ss:leading-[100px] leading-[75px]">
            <span className="text-gradient">SKYNET</span> {" "} 
          </div>
        </div>
        <div className='flex justify-center'>
        <p className={`${styles.paragraph} max-w-[470px] text-center text-3xl`}>
          Decentralised Machine Learning platform powered by
          <span className="text-gradient"> ZK</span>
          
        </p>

        </div>
      </div>


      // {/* <div className={`flex-1 flex ${styles.flexCenter} md:mr-0  my-10 relative`}>
      //   <img src={robot} className="w-[100%] h-[100%] relative z-[5]" alt="" srcset="" />
      //   <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient"/>
      //   <div className="absolute z-[1] w-[80%] h-[80%] rounded-full bottom-40 white__gradient"/>
      //   <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient"/>
      // </div> */}

      
  )
}

export default Hero