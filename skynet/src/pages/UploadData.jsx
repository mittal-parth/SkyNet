import React, { useState } from "react";
import Form from "../components/Form";
import { useWalletClient, useSignMessage } from "wagmi";
import FormPage from "../components/FormPage";
import lighthouse from "@lighthouse-web3/sdk"

export default function UploadData() {
  const { data: walletClient, isError, isLoading } = useWalletClient();
  // const signAuthMessage = async () => {
  //   const signerAddress = walletClient;
  //   const { message } = (await lighthouse.getAuthMessage(signerAddress)).data;
  //   const signature = useSignMessage(message);
  //   return { signature, signerAddress };
  // };

  // const progressCallback = (progressData) => {
  //   let percentageDone =
  //     100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
  //   console.log(percentageDone);
  // };

  // const handleSubmit = async () => {
  //   if (!file) {
  //     console.error("No file selected.");
  //     return;
  //   }

  //   try {
  //     // This signature is used for authentication with encryption nodes
  //     // If you want to avoid signatures on every upload refer to JWT part of encryption authentication section
  //     const encryptionAuth = await signAuthMessage();
  //     if (!encryptionAuth) {
  //       console.error("Failed to sign the message.");
  //       return;
  //     }

  //     const { signature, signerAddress } = encryptionAuth;

  //     // Upload file with encryption
  //     const output = await lighthouse.uploadEncrypted(
  //       file,
  //       apiKey,
  //       signerAddress,
  //       signature,
  //       progressCallback
  //     );
  //     console.log("Encrypted File Status:", output);
  //     /* Sample Response
  //       {
  //         data: [
  //           Hash: "QmbMkjvpG4LjE5obPCcE6p79tqnfy6bzgYLBoeWx5PAcso",
  //           Name: "izanami.jpeg",
  //           Size: "174111"
  //         ]
  //       }
  //     */
  //     // If successful, log the URL for accessing the file
  //     console.log(
  //       `Decrypt at https://decrypt.mesh3.network/evm/${output.data[0].Hash}`
  //     );
  //   } catch (error) {
  //     console.error("Error uploading encrypted file:", error);
  //   }
  // };
  const [dataDetails, setDataDetails] = useState({});
  const [file, setFile] = useState();

  return (
    <FormPage
      form={
        <Form
        walletClient = {walletClient}
          handleSubmit={()=>{console.log("form submitted")}}
          fields={[
            {
              label: "Data Name",
              dataLabel: "name",
              placeholder: `Sensor`,
            },
            {
              label: "Prize (in ethereum)",
              dataLabel: "size",
              type: "number",
            },
            {
              label: "Description",
              dataLabel: "description",
              placeholder: "This is sensor data",
            },
            {
              label: "Data Files",
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
