const InputField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
  required = false
}) => (
  <label className="flex flex-col gap-2">
    <span className="text-sm font-medium text-main">{label}</span>
    <input
      className="input-shell rounded-2xl px-4 py-3"
      max={max}
      min={min}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      step={step}
      type={type}
      value={value}
    />
  </label>
);

export default InputField;
