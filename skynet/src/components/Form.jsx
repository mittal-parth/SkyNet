import InputBox from "./InputBox";
import Button from "./Button2";
import DropZone from "./DropZone";
import {  useSignMessage } from "wagmi";
import lighthouse from "@lighthouse-web3/sdk";

// import { uploadFile } from "@/utils";
// import { LoaderContext } from "@/context/loaderContext";
// import { SnackbarContext } from "@/context/snackbarContext";

export default function Form({walletClient, handleSubmit, fields, setData, data }) {
  const fileHashes = [];

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
          const encryptionAuth = await signAuthMessage();
          if (!encryptionAuth) {
            console.error("Failed to sign the message.");
            return;
          }
          const { signature, signerAddress } = encryptionAuth;

          // Upload file with encryption
          const output = await lighthouse.uploadEncrypted(
            field.file,
            apiKey,
            signerAddress,
            signature,
            progressCallback
          );
          
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

  return (
    <div className="mb-6 font-comfortaa w-full data-card p-10 rounded-xl">
      <form onSubmit={handleSubmit}>
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
