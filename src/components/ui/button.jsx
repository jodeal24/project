export function Button({ asChild, className = "", children, ...props }) {
  const Comp = asChild ? "span" : "button";
  return <Comp className={`px-3 py-2 rounded-lg border text-sm ${className}`} {...props}>{children}</Comp>;
}
export default Button;
