export function Card({ className = "", ...p }) { return <div className={`rounded-2xl border ${className}`} {...p} />; }
export function CardContent({ className = "", ...p }) { return <div className={`p-4 ${className}`} {...p} />; }
export default Card;
