import React from "react";

const Triangle = (props) => {
  return (
    <div
      style={{
        content: "" /* triangle */,
        position: "absolute",
        bottom: "-15px" /* value = - border-top-width - border-bottom-width */,
        left:
          props.client === props.msg.from
            ? `85%`
            : "8%" /* controls horizontal position */,
        borderWidth:
          "15px 15px 0" /* vary these values to change the angle of the vertex */,
        borderStyle: "solid",
        borderColor: `${props.msg.colour} transparent`,
      }}
    />
  );
};
export default Triangle;
