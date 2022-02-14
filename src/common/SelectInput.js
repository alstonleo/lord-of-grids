import { Autocomplete, createTheme } from "@mui/material";
import React, { useEffect } from "react";
import TextInput from "./TextInput";
import { ThemeProvider } from "@mui/system";
import { useState } from "react";

const theme = createTheme({
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        popper: {
          border: "1px solid black",
          borderRadius: 4,
        },
        input: {
          paddingTop: "0 !important",
          paddingBottom: "0 !important",
          marginTop: -3,
        },
      },
    },
  },
});

const SelectInput = React.forwardRef((props, ref) => {
  const {
    id,
    options = [],
    sx,
    label,
    freeSolo = false,
    autoHighlight = true,
    disableClearable = true,
    blurOnSelect = true,
    onChange = () => {},
    size = "medium",
    name,
    value = null,
    onInputChange = () => {},
  } = props;
  const [controlledValue, setControlledValue] = useState(value);
  useEffect(() => {
    setControlledValue(value);
  }, [value]);
  return (
    <ThemeProvider theme={theme}>
      <Autocomplete
        id={id}
        options={options}
        fullWidth
        sx={sx}
        freeSolo={freeSolo}
        autoHighlight={autoHighlight}
        disableClearable={disableClearable}
        blurOnSelect={blurOnSelect}
        onChange={(event, newValue) => {
          setControlledValue(newValue);
          onChange(event, newValue);
        }}
        onInputChange={(event, value, reason) => {
          onInputChange(event, value, reason);
        }}
        value={controlledValue}
        renderInput={(params) => {
          return (
            <TextInput
              {...params}
              label={label}
              size={size}
              ref={ref}
              name={name}
            />
          );
        }}
      />
    </ThemeProvider>
  );
});

export default SelectInput;
