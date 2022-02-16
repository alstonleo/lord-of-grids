import React from "react";
import ReactDom from "react-dom";
import classes from "./BackgroundOverlay.module.css";

const BackgroundOverlay = (props)=>{
   return ReactDom.createPortal((<div className={classes["background"]} />), document.getElementById("background-overlay"));
}
export default BackgroundOverlay;