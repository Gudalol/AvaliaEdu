// eslint-disable-next-line no-unused-vars
import React from "react";

// eslint-disable-next-line react/prop-types
const PermissionButton = ({ userRole, allowedRoles, onClick, children }) => {
  // eslint-disable-next-line react/prop-types
  if (!allowedRoles.includes(userRole)) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      style={{
        border: "none",
        background: "none",
        padding: 0,
        margin: 0,
        cursor: "pointer"
      }}
    >
      {children}
    </button>
  );
};

export default PermissionButton;