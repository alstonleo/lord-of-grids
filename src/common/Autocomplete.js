import React, { useContext, useEffect, useState } from "react";
import ReactDom from "react-dom";
import { Card, Slide } from "@mui/material";
// import images from "../assets/images";
import classes from "./Autocomplete.module.css";
import BackgroundOverlay from "./BackgroundOverlay";
import GlobalContext from "./GlobalContext";

const Autocomplete = (props) => {
  const { setAutocompleteOpen } = useContext(GlobalContext);
  const {
    show,
    width = "100%",
    height = "55%",
    showCloseIcon = true,
    closeAutoComplete = () => {},
  } = props;
  const [margin, setMargin] = useState("0");
  // const { autocompleteExitIcon } = images;
  useEffect(() => {
    const widthVal = width.split("%")[0];
    setMargin(`0 ${(100 - widthVal) / 2}%`);
  }, [width]);
  useEffect(() => {
    setAutocompleteOpen(show);
    return () => {
      setAutocompleteOpen(false);
    };
  }, [show, setAutocompleteOpen]);
  return ReactDom.createPortal(
    <Slide direction="up" in={show} timeout={100} mountOnEnter unmountOnExit>
      <Card
        sx={{
          boxSizing: "border-box",
          borderRadius: "16px 16px 0px 0px",
          border: 1,
          bgcolor: "white",
          bottom: 0,
          position: "fixed",
          height: { height },
          width: { width },
          margin: { margin },
          zIndex: "999",
        }}
      >
        {show && <BackgroundOverlay />}
        <div className={classes["autocomplete"]}>{props.children}</div>
      </Card>
    </Slide>,
    document.getElementById("autocomplete-overlay")
  );
};

export default Autocomplete;
