import InputBox from "./InputBox";
import Button from "./Button2";
import DropZone from "./DropZone";
import {  useSignMessage } from "wagmi";
import lighthouse from "@lighthouse-web3/sdk";
import React from "react";
import env from "react-dotenv";
// import { uploadFile } from "@/utils";
// import { LoaderContext } from "@/context/loaderContext";
// import { SnackbarContext } from "@/context/snackbarContext";
import { useState } from "react";
export default function Form({walletClient, handleSubmit, fields, setData, data }) {
  const fileHashes = [];
  const [dataFile, setDataFile] = useState(null);
  const progressCallback = (progressData) => {
    let percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
    console.log(percentageDone);
  };

  const signAuthMessage = async () => {
    const signerAddress = walletClient;
    const { message } = (
      await lighthouse.getAuthMessage(signerAddress.account.address)
    ).data;
    // const signature = await getSignature(message);
    const signature =  useSignMessage(message);
    return { signature, signerAddress };
  };


  async function submit() {
    for (let field of fields) {
      if (!field.isFile) {
        continue;
      }
      try {
          // const encryptionAuth = await signAuthMessage();
          // if (!encryptionAuth) {
            // console.error("Failed to sign the message.");
            // return;
          // }
          // const { signature, signerAddress } = encryptionAuth;

          // Upload file with encryption
          console.log(fields)
          console.log(field.file)
          console.log("env", process.env.REACT_APP_LH_API_KEY);
          console.log(field.file.path)
          const output =await lighthouse.upload(field.file, '6c36b2b6.5289ffbfc39840a681d1a5ac80878d02', false, null, ()=>{})
          
          console.log("Encrypted File Status:", output);
          
      } catch (err) {
        // const hashOfFiles = await uploadFile(Object.values(field.file));

        // let fileNames = field.file.map((f) => f.path);

        // const data = {}
        // data[field.dataLabel] = []

        // hashOfFiles.forEach((hash, index) => {
        //     const f = {}
        //     f.name = fileNames[index]?.split(".")[0] || "greentrust"
        //     f.hash = hash[0].hash
        //     data[field.dataLabel] = [...data[field.dataLabel], f]
        // });

        // field.setFile(JSON.stringify(data));
        // fileHashes.push(JSON.stringify(data))

        console.log(`form debug 1: ${err}`);
      }
    }

    try {
      // await handleSubmit(...fileHashes);
      console.log("form submitted 1 ");
    } catch (err) {
      console.log(`form debug: ${err}`);
    }
    // setLoading(false);
  }
  const onFileChange = (event) => {
    console.log("event", event.target.files[0])
    const setFile = fields.setFile
    setDataFile(event.target.files[0]);
  }

  return (
    <div className="mb-6 font-comfortaa w-full data-card p-10 rounded-xl">
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <>
            {field.isFile ? (
              <input type="file" onChange={onFileChange}/>
              // <DropZone label={field.label} setFiles={field.setFile} />
            ) : (
              <InputBox
                label={field.label}
                onChange={(e) =>
                  setData({ ...data, [field.dataLabel]: e.target.value })
                }
                placeholder={field.placeholder}
                type={field.type ?? "text"}
              />
            )}
          </>
        ))}
        <Button text="Submit" onClick={submit} />
      </form>
    </div>
  );
}
