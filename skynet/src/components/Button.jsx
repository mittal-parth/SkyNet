import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Button({ text, icon, styles, onClick = () => {} }) {
  return (
    <a>
      <div
        onClick={onClick}
        class={`flex flex-row hover:scale-105 bg-gray-500 font-poppins  text-white text-2xl px-10 py-1 items-center rounded-xl shadow-2xl justify-center cursor-pointer ${styles ?? ''} w-fit`}
      >
        {icon && <FontAwesomeIcon
          icon={icon}
          style={{ color: 'red' }}
          className="mr-2 w-5 h-5"
        />}
        <p>{text}</p>
      </div>
    </a>
  );
}
