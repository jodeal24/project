export function Label({ className = "", ...props }) {
  return (
    <label
      className={`text-sm font-medium text-zinc-800 leading-none ${className}`}
      {...props}
    />
  );
}

export default Label;
