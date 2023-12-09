import React, { useState } from 'react';
import Form from '../components/Form';
import FormPage from '../components/FormPage';
export default function UploadModel() {
    const handleSubmit = () => {
        console.log('form submitted');
    }
  const [modelDetails, setModelDetails] = useState({});

    return (
        <FormPage
      form={<Form
        handleSubmit={handleSubmit}
        fields={[
          {
            label: 'Model Name',
            placeholder: `MD 1`,
          },
          {
            label: 'Prize (in ethereum)',
            dataLabel: 'size',
            type: 'number'
          },
          {
            label: 'Description',
            placeholder: 'This is linear regression model'
          },
          {
            label: 'Model Files',
            isFile: true,
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