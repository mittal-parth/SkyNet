import { SiSolidity } from "react-icons/si";
export default function ModelCard({ modelObject }) {
  console.log(modelObject , "modelObject")
  return (
    <div
      className={` flex-col justify-between mx-3 my-3 max-w-sm p-6 bg-white  
      rounded-lg border-gray-200 shadow-xl dark:bg-gray-800 dark:border-gray-700 data-card`}
    >
      <div className="flex justify-between items-center">
        <h5 className="mb-2 text-2xl mr-10 font-semibold text-white tracking-tight text-gray-900 dark:text-white font-poppins">
          {modelObject.title}
        </h5>
        <div className="flex items-center">
        <SiSolidity color="white" />
          
          <div className="text-xl font-semibold pb-1 pr-1 text-white">
            {modelObject.price.toString()}
          </div>
        </div>
      </div>
      <p className="mb-3 font-normal text-gray-200 dark:text-gray-400 font-poppins">
        {modelObject.descriptionAddress}
      </p>
      <div>
        {modelObject.isOwner ? (
          <div
            className={` px-2 py-1  my-1 text-sm font-medium font-poppins text-center text-white ${
              !modelObject.isForSale ? "bg-green-600" : "bg-red-700"
            } rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800`}
          >
            {modelObject.isForSale ? "Unlist" : "List"}
          </div>
        ) : (
          <div className=" px-2 py-1 buy-card my-1 text-sm font-medium font-poppins text-center text-white bg-green-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Buy
          </div>
        )}
      </div>
    </div>
  );
}
