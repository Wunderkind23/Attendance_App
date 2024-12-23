export default function Input({ label, id, ...props }) {
    return (
      <div className=" mb-4">
        <label htmlFor={id} className="text-lg block pb-2">
          {label}
        </label>
        <input
          id={id}
          className="w-[100%] border text-12 py-3 pl-6 text-lightgray bg-inputBg rounded-md outline-none"
          {...props}
          required
        />
      </div>
    );
  }
  