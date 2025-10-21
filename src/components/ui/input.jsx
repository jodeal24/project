export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 rounded-xl border border-black/10 bg-white/80 shadow-sm outline-none focus:ring-2 focus:ring-sky-300 ${className}`}
      {...props}
    />
  );
}
export default Input;
