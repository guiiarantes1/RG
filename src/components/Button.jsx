import React from "react";
import PropTypes from "prop-types";
import "../styles/Button.css";

const Button = ({
  text,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
  iconName = null,
  iconPosition = "left",
  ...props
}) => {

const renderIcon = () => {
  if (!iconName) return null;

  const iconStyle = text ? { marginRight: "10px" } : {};

  return <i className={`bi bi-${iconName}`} id="icon-button" style={iconStyle}></i>;
};

  const renderContent = () => {
    if (!iconName) return text;

    return iconPosition === "left" ? (
      <span className="d-flex align-items-center">
        {renderIcon()}
        <span>{text}</span>
      </span>
    ) : (
      <span className="d-flex align-items-center">
        <span>{text}</span>
        {renderIcon()}
      </span>
    );
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`custom-btn custom-btn-${variant} ${className}`}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(["primary", "secondary", "light", "warning"]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  iconName: PropTypes.string,
  iconPosition: PropTypes.oneOf(["left", "right"]),
};

export default Button;
