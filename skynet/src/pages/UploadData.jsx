import React, { useState } from "react";
import Form from "../components/Form";
import { useWalletClient, useSignMessage,useContractWrite } from "wagmi";
import FormPage from "../components/FormPage";
import { CONTRACT_ADDRESS} from "../config";
import ABI from "../constants/skynetabi.json";
const skynetABI=ABI.abi;
export default function UploadData() {

  const [dataDetails, setDataDetails] = useState({});
  const [file, setFile] = useState();
  const { data: walletClient} = useWalletClient();
  const [dataHash, setdataHash] = useState(null);


  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: skynetABI,
    functionName: 'createData',
  })

 
  const handleSubmit = async (fileHash) => {
    console.log("Upload Data")
    console.log(dataDetails)
    console.log(fileHash)
    // write({
    //   args: [dataDetails.title,fileHash,dataDetails.description,true,dataDetails.price],
    //   from: walletClient.account.address
    // })
    setdataHash(fileHash)
    console.log("Data uploaded")
  };


  return (
    <FormPage
    hash={dataHash}
      form={
        <Form
        walletClient = {walletClient}
          handleSubmit={handleSubmit}
          fields={[
            {
              label: "Data Name",
              dataLabel: "title",
              placeholder: `Sensor`,
            },
            {
              label: "Price (in ethereum)",
              dataLabel: "price",
              type: "number",
            },
            {
              label: "Description",
              dataLabel: "description",
              placeholder: "This is sensor data",
            },
            {
              label: "Data Files",
              dataLabel: "fileHash",
              isFile: true,
              setFile: setFile,
              file : file,
            },
          ]}
          setData={setDataDetails}
          data={dataDetails}
        />
      }
      title="Upload your data"
      text="Provide the details asked in the form"
      //   image={farmer}
      imageStyle="!max-w-[30vw]"
    />
  );
}
