import React from "react";

export function Title({
  as: Component = "h2",
  small,
  large,
  className = "",
  children,
  color,
  ...props
}) {
  const baseStyles = "font-poly font-bold tracking-tight";
  const normalStyles = "text-3xl sm:text-4xl";
  const smallStyles = "text-lg sm:text-xl";
  const largeStyles = "text-5xl sm:text-6xl";

  const styles = large ? largeStyles : small ? smallStyles : normalStyles;

  return (
    <Component className={`${baseStyles} ${styles} ${className}`} {...props}>
      {children}
    </Component>
  );
}