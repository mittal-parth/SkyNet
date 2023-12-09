import { SiSolidity } from "react-icons/si";
import { IoIosAddCircleOutline } from "react-icons/io";
export default function DataCard({ data, isOwned }) {
  const tempData = data;
  return (
    <div
      className={`flex-col justify-between mx-3 my-3 max-w-sm min-w-[25%] p-6  rounded-lg border-gray-200 shadow-xl dark:bg-gray-800 dark:border-gray-700 data-card`}
    >       
      <div className="">
        <div className="flex justify-between items-center">
          <h5 className="mb-2 text-2xl  font-semibold tracking-tight text-white dark:text-white font-poppins">
            {tempData.dataname}
          </h5>
          <div className="flex items-center">
            <SiSolidity color="white" />
            <div className="text-xl text-white font-semibold pb-1 pr-1">
              {tempData.price}
            </div>
          </div>
        </div>
        <p className="mb-3 font-normal text-gray-200 dark:text-gray-400 font-poppins">
          {tempData.description}
        </p>
        <div>
          <div>
            {tempData.columns.map((column) => {
              return (
                <div className="inline-flex  items-center px-2 py-1 mr-2 my-1 text-sm font-medium font-poppins text-center text-white  rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300  column-card ">
                  {column}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {!isOwned ? (
        <div
          className={` px-2 py-1  my-1 text-sm font-medium font-poppins text-center text-white ${
            !data.isActive ? "bg-green-600" : "bg-red-700"
          } rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800`}
        >
          {data.isActive ? "Unlist" : "List"}
        </div>
      ) : (
        <div className=" px-2 py-1  mt-6 text-sm font-medium font-poppins text-center text-white bg-green-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Buy
        </div>
      )}
    </div>
  );
}
