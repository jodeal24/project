import React, { createContext, useContext } from "react";
const Ctx = createContext(null);

export function Select({ value, onValueChange, children }) {
  const items = [];
  React.Children.forEach(children, (child) => {
    if (child && child.type && child.type.__isSelectItem) items.push(child.props);
    if (child && child.props && child.props.children) {
      React.Children.forEach(child.props.children, (g) => {
        if (g && g.type && g.type.__isSelectItem) items.push(g.props);
      });
    }
  });
  return <Ctx.Provider value={{ value, onValueChange, items }}>{children}</Ctx.Provider>;
}

export function SelectTrigger({ className = "", children }) {
  const { value, onValueChange, items } = useContext(Ctx);
  return (
    <select
      className={`px-3 py-2 rounded-xl border border-black/10 bg-white/80 shadow-sm ${className}`}
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
    >
      {items.map((it, i) => (
        <option key={i} value={it.value ?? it.children}>
          {it.children}
        </option>
      ))}
    </select>
  );
}
export function SelectContent({ children }) { return <>{children}</>; }
export function SelectValue() { return null; }
export function SelectItem({ children, value }) { return null; }
SelectItem.__isSelectItem = true;
