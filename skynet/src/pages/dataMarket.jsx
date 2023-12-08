import React from 'react';
import DataCard from '../components/DataCard';
import { IoIosAddCircleOutline } from "react-icons/io";

import {Routes, Route, useNavigate} from 'react-router-dom';
const DataMarket = ()=> {
    const navigate = useNavigate(); 
    
    const tempDataList = [
        {
          "dataname": "Sensor",
          "description": "This is a sensor data of a car",
          "price": 100,
          "columns": ["time", "speed", "rpm", "fuellong", "temp", "time", "speedlong", "rpmlong"],
          "isActive": true
        },
        {
          "dataname": "Flowers",
          "description": "This is a collection of all flowers",
          "price": 1000,
          "columns": ["colour", "size", "type"],
          "isActive": false
        },
        {
          "dataname": "Weather",
          "description": "This is weather data",
          "price": 500,
          "columns": ["temperature", "humidity", "wind_speed", "precipitation"],
          "isActive": true
        },
        {
          "dataname": "Stocks",
          "description": "Stock market data",
          "price": 800,
          "columns": ["symbol", "price", "volume", "change_percentage"],
          "isActive": false
        },
        {
          "dataname": "SocialMedia",
          "description": "Social media activity",
          "price": 300,
          "columns": ["user_id", "post_count", "followers", "likes"],
          "isActive": true
        }
      ];

    return (
        <>
        
        <div className='flex items-center'>

        <div className='font-poppins mr-2 text-4xl'>
        Data Market
      </div>
      <IoIosAddCircleOutline size={40} color='green'/>
        </div>
            <div className='flex flex-wrap mx-10 my-10'>
                {
                    tempDataList.map((data) => {
                        return (
                            <DataCard data={data} isOwned={true}/>
                        )
                    })
                }

            </div>
            <div className='mx-10 my-10'>
            {/* <ModelCard/> */}

            </div>
            <div className='flex items-center'>

        <div className='font-poppins mr-2 text-4xl'>
        My data
      </div>
      <a onClick={() => navigate('/uploaddata')}><IoIosAddCircleOutline size={40} color='green'/></a>
        </div>
        <div className='flex flex-wrap mx-10 my-10'>
                {
                    tempDataList.map((data) => {
                        return (
                            <DataCard data={data} isOwned={false}/>
                        )
                    })
                }

            </div>
            </>
    );
}

export default DataMarket;
