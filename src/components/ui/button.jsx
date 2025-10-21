export function Button({ asChild, className = "", children, ...props }) {
  const Comp = asChild ? "span" : "button";
  return (
    <Comp
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-2xl border border-black/10 bg-white/70 hover:bg-white shadow-sm text-sm transition ${className}`}
      {...props}
    >
      {children}
    </Comp>
  );
}
export default Button;
