import React from 'react';
import DataCard from '../components/DataCard';
import ModelCard from '../components/ModelCard';
import { IoIosAddCircleOutline } from "react-icons/io";
import {Routes, Route, useNavigate} from 'react-router-dom';


const ModelMarket = ()=> {
  const navigate = useNavigate(); 

  const tempDataList = [
        {
          "modelname": "Linear Regression",
          "description": "This is a sensor data of a car",
          "price": 100,
          "isActive": true
        },
        {
          "modelname": "Flowers",
          "description": "This is a collection of all flowers",
          "price": 1000,
          "isActive": false
        },
        {
          "modelname": "Weather",
          "description": "This is weather data",
          "price": 500,
          "isActive": true
        },
        {
          "modelname": "Stocks",
          "description": "Stock market data",
          "price": 800,
          "isActive": false
        },
        {
          "modelname": "SocialMedia",
          "description": "Social media activity",
          "price": 300,
          "isActive": true
        }
      ];

    return (
        <>
        
        <div className='flex items-center'>

        <div className='font-poppins mr-2 text-4xl'>
        Models Market
      </div>
      <IoIosAddCircleOutline size={40} color='green'/>
        </div>
            <div className='flex flex-wrap mx-10 my-10'>
                {
                    tempDataList.map((data) => {
                        return (
                            <ModelCard data={data} isOwned={true}/>
                        )
                    })
                }

            </div>
            <div className='mx-10 my-10'>
            {/* <ModelCard/> */}

            </div>
            <div className='flex items-center'>

        <div className='font-poppins mr-2 text-4xl'>
        My models
      </div>
      <a onClick={() => navigate('/uploadmodel')}><IoIosAddCircleOutline size={40} color='green'/></a>
        </div>
        <div className='flex flex-wrap mx-10 my-10'>
                {
                    tempDataList.map((data) => {
                        return (
                            <ModelCard data={data} isOwned={false}/>
                        )
                    })
                }

            </div>
            </>
    );
}

export default ModelMarket;
