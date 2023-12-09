export default function InputBox({ label, onChange, placeholder, type }) {
    return (
      <div className="w-full font-poppins text-white">
        <div className="mb-5">
          <label
            className="block text-gray text-sm font-semibold mb-2.5"
            for={'form-' + label}
          >
            {label}
          </label>
          {type != "textarea"
            ? <input className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white-500 focus:border-white-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              id={'form-' + label}
              type={type}
              placeholder={placeholder}
              onChange={onChange}
              {...(  { multiple: false} )}
            ></input>
            : <textarea className="bg-gray-50"
              id={'form-' + label}
              onChange={onChange}
            ></textarea>
          }
        </div>
      </div>
    );
  }
  