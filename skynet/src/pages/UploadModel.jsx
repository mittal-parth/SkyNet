import React, { useState } from "react";
import Form from "../components/Form";
import FormPage from "../components/FormPage";
import { useWalletClient, useSignMessage,useContractWrite } from "wagmi";
import { useLocation } from "react-router-dom";
import { CONTRACT_ADDRESS} from "../config";
import ABI from "../constants/skynetabi.json";
const skynetABI=ABI.abi;

export default function UploadModel() {
  const location = useLocation();
  console.log(location.state)
  const hashList = location.state?? [];
  const [modelDetails, setModelDetails] = useState({});
  const [file, setFile] = useState();
  const [modelHash, setModelHash] = useState(null);
  const { data: walletClient} = useWalletClient();

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: skynetABI,
    functionName: 'createModel',
  })
  const handleSubmit = async (modelHash) => {
    if(modelHash==null){
      alert("Please upload a file")
      return
    }
    write({
      args: [modelDetails.title,modelHash,modelDetails.description,true,modelDetails.price],
      from: walletClient.account.address
    })
    setModelHash(modelHash)
  };


  return (
    <FormPage
      hash= {modelHash}
      form={
        <Form
          handleSubmit={handleSubmit}
          fields={[
            {
              label: "Model Name",
              dataLabel: "title",
              placeholder: `Linear Regression`,
            },
            {
              label: "Price (in ethereum)",
              dataLabel: "price",
              type: "number",
            },
            {
              label: "Description",
              dataLabel: "descriptionAddress",
              placeholder: "This is Linear Regression model",
            },
            {
              dataLabel: "fileHash",
              label: "Model Files",
              isFile: true,
              setFile: setFile,
              file: file,
            },
          ]}
          setData={setModelDetails}
          data={modelDetails}
          />
        }
        hashList={hashList}
        navigationPage={"/jobConfig"}
      title="Upload your model"
      text="Provide the details asked in the form"
      imageStyle="!max-w-[30vw]"
    />
  );
}
