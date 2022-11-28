import React from "react";

const PopUpPanel = (props) => {
  const { children } = props;
  return <div className={`fadeInUp cursor-default z-50`}>{children}</div>;
};

export default PopUpPanel;
