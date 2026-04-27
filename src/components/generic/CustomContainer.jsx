import React from "react";
import PropTypes from "prop-types";

export function CustomContainer({
  as: Component = "div",
  className = "",
  children,
  ...props
}) {
  return (
    <Component
      className={`mx-auto w-full max-w-7xl px-4 md:p-6 lg:px-8 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

CustomContainer.propTypes = {
  as: PropTypes.elementType,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

CustomContainer.defaultProps = {
  as: "div",
  className: "",
};