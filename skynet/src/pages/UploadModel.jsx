import React, { useState } from 'react';
import Form from '../components/Form';
import FormPage from '../components/FormPage';
export default function UploadModel() {
    const handleSubmit = () => {
        console.log('form submitted');
    }
  const [modelDetails, setModelDetails] = useState({});
  const [file, setFile] = useState();

    return (
        <FormPage
      form={<Form
        handleSubmit={handleSubmit}
        fields={[
          {
            label: 'Model Name',
            dataLabel: "name",
            placeholder: `MD 1`,
          },
          {
            label: 'Price (in ethereum)',
            dataLabel: 'size',
            type: 'number'
          },
          {
            label: 'Description',
            dataLabel: "name",

            placeholder: 'This is linear regression model'
          },
          {
              dataLabel: "name",
              label: 'Model Files',
            isFile: true,
            setFile : setFile,
            file : file
          }
        ]}
        setData={setModelDetails}
        data={modelDetails}
      />}
      title="Upload your model"
      text="Provide the details asked in the form"
      imageStyle="!max-w-[30vw]"
    />
  );
}