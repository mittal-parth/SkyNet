import { SiSolidity } from "react-icons/si";
export default function ModelCard() {
  const tempData = {
    "modelname" : "Linear Regression",
    "description" : "This is a linear regression model",
    "price" : 100,
    "isActive" : false  
  }
    return (
      

<div className={`max-w-sm p-6 bg-white border-l-4 ${tempData.isActive ? 'border-green-700' :'border-gray-400' } rounded-lg border-gray-200 shadow-xl dark:bg-gray-800 dark:border-gray-700`}>
    <div className="flex justify-between items-center">

        <h5 className="mb-2 text-2xl  font-semibold tracking-tight text-gray-900 dark:text-white font-poppins">{tempData.modelname}</h5>
        <div className='flex items-center'>
          <SiSolidity />
          <div className='text-xl font-semibold pb-1 pr-1'>
          {tempData.price}
          </div>
        </div>
    </div>
    <p className="mb-3 font-normal text-gray-500 dark:text-gray-400 font-poppins">{tempData.description}</p>
    <div>
   
    
    </div>
</div>

    );
  }