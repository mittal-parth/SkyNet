import React from 'react';
import Banner from '../components/Banner';
import NavBar from '../components/NavBar';
export default function Landing() {
    return (
        <>
        <div >
        <NavBar />
        <div className='w-[75%]'>

        <Banner
          name={(
              <>
              Discover, buy, and sell <br />Data and Models
            </>
          )}
          childStyles="md:text-4xl sm:text-2xl xs:text-xl text-left"
          parentStyle="justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
          />

          </div>
          </div>
          
        </>
    );
}