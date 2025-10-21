export function Dialog({ open, children }) { return open ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">{children}</div> : null; }
export function DialogTrigger({ children, ...props }) { return <span {...props}>{children}</span>; }
export function DialogContent({ className = "", ...p }) { return <div className={`max-w-2xl w-full rounded-2xl bg-white p-4 shadow-xl ${className}`} {...p} />; }
export function DialogHeader(p){ return <div className="mb-2" {...p} />; }
export function DialogTitle(p){ return <h3 className="text-lg font-semibold" {...p} />; }
export default Dialog;
