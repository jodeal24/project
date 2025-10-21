export function Input({ className = "", ...props }) {
  return <input className={`w-full px-3 py-2 rounded-lg border outline-none ${className}`} {...props} />;
}
export default Input;
