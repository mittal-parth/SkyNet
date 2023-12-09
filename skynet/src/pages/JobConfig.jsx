import React, { useState } from "react";
import Form from "../components/Form";
import { useWalletClient, useSignMessage,useContractWrite } from "wagmi";
import FormPage from "../components/FormPage";

import { CONTRACT_ADDRESS } from "../config";
import ABI from "../constants/skynetabi.json";
const skynetABI=ABI.abi;

export default function JobConfig() {
  const [jobDetails, setJobDetails] = useState({});
  const { data: walletClient} = useWalletClient();

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: skynetABI,
    functionName: 'createJob',
  })

  const handleSubmit = async () => {
    console.log("Create Job")
    console.log(jobDetails)
    write({
      args: [jobDetails.minScorePerComputeResource,jobDetails.computeResourceCount,jobDetails.maxRatePerMin],
      from: walletClient.account.address
    })
    console.log("Job Created")
  };

  return (
    <FormPage
      form={
        <Form
        walletClient = {walletClient}
          handleSubmit={handleSubmit}
          fields={[
            {
              label: "Data Hash",
              dataLabel: "dataHash",
              placeholder: `0x0123....b`,
            },
            {
              label: "Model Hash",
              dataLabel: "modelHash",
              placeholder: `0x0123....b`,
            },
            {
              label: "Minimum Score Per Compute Resource",
              dataLabel: "minScorePerComputeResource",
              type: "number",
            },
            {
              label: "No. of Computer Resources",
              dataLabel: "computeResourceCount",
              type: "number",
            },
            {
              label: "Maximum Rate Per Min",
              dataLabel: "maxRatePerMin",
              type: "number",
            },
          ]}
          setData={setJobDetails}
          data={jobDetails}
        />
      }
      title="Decide your Job Configuration "
      text="Provide the details asked in the form"
      imageStyle="!max-w-[30vw]"
    />
  );
}
