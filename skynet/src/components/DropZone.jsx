import React from 'react';

import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faFile } from '@fortawesome/free-solid-svg-icons';

import Info from "./Info";


export default function DropZone({ label, setFiles }) {
    const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
        multiple: false,
    });
    setFiles(acceptedFiles);
    const files = acceptedFiles.map(file => {
        return (<li key={file.path}>
            <Info text={`${file.path} - ${file.size} bytes`} icon={faFile} style="text-gray" />
        </li>)
    });

    return (
        <div className="mb-6 w-full " id="dropzone">
            <label
                className="block text-gray text-sm font-semibold font-poppins text-white mb-2.5"
            >
                {label}
            </label>
            <div {...getRootProps({ className: "dropzone w-full bg-gray/10 flex justify-center items-center py-12 rounded-xl border-darkGray border-[1px] cursor-pointer mb-4" })}>
                <input {...getInputProps()} />
                <FontAwesomeIcon
                    icon={faCloudArrowUp}
                    className={`w-[20px] h-[20px] text-white`}
                />
            </div>
            <ul className='text-white'>{files}</ul>
        </div>
    ); 
}
