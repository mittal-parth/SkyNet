import React, { useState } from 'react';
import Form from '../components/Form';
import FormPage from '../components/FormPage';
export default function UploadData() {
    const handleSubmit = () => {
        console.log('form submitted');
    }
  const [dataDetails, setDataDetails] = useState({});

    return (
        <FormPage
      form={<Form
        handleSubmit={handleSubmit}
        fields={[
          {
            label: 'Data Name',
            placeholder: `Sensor`,
          },
          {
            label: 'Prize (in ethereum)',
            dataLabel: 'size',
            type: 'number'
          },
          {
            label: 'Description',
            placeholder: 'This is sensor data'
          },
          {
            label: 'Data Files',
            isFile: true,
            isMultiple: true,
          }
        ]}
        setData={setDataDetails}
        data={dataDetails}
      />}
      title="Upload your data"
      text="Provide the details asked in the form"
    //   image={farmer}
      imageStyle="!max-w-[30vw]"
    />
  );
}