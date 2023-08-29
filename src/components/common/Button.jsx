const Button = ({ text, className }) => {
  return (
    <div>
      <button
        type='button'
        className={`rounded-full py-4 px-6 bg-blue-gradient font-poppins font-medium text-[18px] text-primary outline-none duration-200 hover:scale-105 ${className}`}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;
