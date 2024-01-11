
const FormInput = ({ register, error, type, name, id, placeholder }) => {
    return (
      <div className="mb-3">
  
        <input
          type={type}
          name={name}
          id={id}
          placeholder={placeholder}
          {...register}
          className="w-full mt-2 py-2 px-2 h-10 bg-gray-50 text-gray-500 dark:bg-slate-800 dark:text-slate-200 rounded outline-none border border-gray-200 dark:border-gray-800 focus:border-indigo-600 dark:focus:border-indigo-600 focus:ring-0"
        />
        {error && <p className="mt-2 text-xs text-red-600 dark:text-red-500">{error}</p>}
      </div>
    );
  }
  
  export default FormInput;