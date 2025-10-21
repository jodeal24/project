export function Dialog({ open, children, onOpenChange }) {
  return open ? <div>{children}</div> : null;
}
export function DialogTrigger({ asChild, children, ...props }) {
  return <span {...props}>{children}</span>;
}
export function DialogContent({ className = "", ...p }) {
  return <div className={`rounded-2xl border bg-white ${className}`} {...p} />;
}
export function DialogHeader(p){ return <div {...p} />; }
export function DialogTitle(p){ return <h3 {...p} />; }
export default Dialog;
