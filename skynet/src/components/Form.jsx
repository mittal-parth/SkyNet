import InputBox from "./InputBox";
import Button from "./Button2";
import DropZone from "./DropZone";
import {  useSignMessage } from "wagmi";
import lighthouse from "@lighthouse-web3/sdk";
import React from "react";
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
        console.log("Uploading the file")  
        lighthouse.upload(field.file, '6c36b2b6.5289ffbfc39840a681d1a5ac80878d02', false, null, ()=>{}).then(async (output) => {
          await handleSubmit(output.data.Hash);
        })
        return;// This is hacky, and is written under the assumption that there is only one file field
      } catch (err) {
        console.log(`${err}`);
      }
    }
    handleSubmit(null);
  }

  return (
    <div className="mb-6 font-comfortaa w-full data-card p-10 rounded-xl ">
      <form  onSubmit={handleSubmit}>
        {fields.map((field) => (
          <>
            {field.isFile ? (
              <DropZone label={field.label} setFiles={field.setFile} />
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
