// import Lottie from "react-lottie-player";
import React from "react";
import { cloudUpload} from "../assets";
export default function FormPage({ image, title, text, form, imageStyle }) {
  return (
    <div className="flex items-start md:justify-around md:mt-12">
      <div className="flex flex-col items-center mb-6 md:mb-0">
        <h1 className="mb-0 text-white font-poppins text-6xl text-gradient">{title}</h1>
        <div className={`md:flex shrink hidden mb-4 ${imageStyle}`}>
            </div>
        <img src = {cloudUpload} className=" w-96 h-96"/>
        <p className="text-lg font-poppins text-white text-gray/70 max-w-[340px]">{text}</p>
      </div>
      <div className="flex w-full max-w-[400px] mx-auto md:mx-0">{form}</div>


    </div>
  );
}
