import React from "react";
import { FormControlLabel, Checkbox as CheckboxMUI } from "@mui/material";
const Checkbox = (props) => {
  const {
    checked,
    name,
    sx,
    label = "",
    disableRipple = true,
    indeterminate,
    onChange,
  } = props;
  return (
    <FormControlLabel
      control={
        <CheckboxMUI
          sx={sx}
          disableRipple={disableRipple}
          checked={checked}
          name={name}
          indeterminate={indeterminate}
          onClick={onChange}
        />
      }
      label={label}
    />
  );
};

export default Checkbox;
