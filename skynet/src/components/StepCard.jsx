import { quotes } from "../assets";

const StepCard = ({ content, name, title, img }) => (
  <div className="flex-col  justify-between px-10 pt-12 rounded-[20px]  max-w-[370px] md:mr-10 sm:mr-5 mr-0 my-5 feedback-card">
    <div className="flex mb-2 font-poppins justify-center font-semibold ss:text-[72px] text-[52px] text-white ss:leading-[100px] leading-[75px]">
    <span className="text-4xl text-gradient-2">{title}</span>
    </div>
    <div className="flex justify-center">
      <img src={img} alt="star" className="w-[25%] h-[25%] object-contain align-center" />

    </div>
    <div className="flex justify-center">
    <p className="font-poppins text-center font-normal text-[18px] leading-[32.4px] text-white my-10">
      {content}
    </p>

    </div>

    
  </div>
);


export default StepCard;