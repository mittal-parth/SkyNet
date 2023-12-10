// import Lottie from "react-lottie-player";
import { GrFormNextLink } from "react-icons/gr";
import React from "react";
import { cloudUpload } from "../assets";
import { Routes, Route, useNavigate } from "react-router-dom";

export default function FormPage({
  hash,
  image,
  title,
  text,
  form,
  imageStyle,
  navigationPage,
  hashList,
}) {
  const navigate = useNavigate();
  const navigateToNext = () => {
    hashList.push(hash);
    navigate(navigationPage, { state: hashList });
  };
  return (
    <div className="flex items-start md:justify-around md:mt-12">
      <div className="flex flex-col items-center mb-6 md:mb-0">
        <h1 className="mb-0 text-white font-poppins text-6xl text-gradient">
          {title}
        </h1>
        <div className={`md:flex shrink hidden mb-4 ${imageStyle}`}></div>
        <img src={cloudUpload} className=" w-80 h-80 my-5" />
        <a onClick={() => navigateToNext("/uploadmodel")}>
          <p className="text-lg font-poppins text-white text-gray/70 max-w-[340px]">
            {!hash ? text : "Secured by Lighthouse"}
          </p>
        </a>
        {hash ? (
          <>
            <div className="mt-5 text-white font-semibold data-card-2 rounded-lg p-2">
              {hash}
            </div>
            <a onClick={navigateToNext}>
              <div className="flex items-center mt-5 text-white  font-semibold data-card-3 rounded-lg p-2 px-3">
                <div className="mr-2">Next</div>
                <GrFormNextLink color={"white"} size={20} />
              </div>
            </a>
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="flex w-full max-w-[400px] mx-auto md:mx-0">{form}</div>
    </div>
  );
}
