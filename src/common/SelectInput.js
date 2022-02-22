import React from "react";
import { Autocomplete, createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import TextInput from "./TextInput";

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
    blurOnSelect = false,
    size = "medium",
    name,
    value,
    onChange = () => {},
    onInputChange = () => {},
    onFocus = () => {},
    getOptionLabel,
    isOptionEqualToValue,
    readOnly = false,
    open,
    markers,
  } = props;
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
        getOptionLabel={getOptionLabel}
        defaultValue={value}
        isOptionEqualToValue={isOptionEqualToValue}
        readOnly={readOnly}
        open={open}
        onChange={(event, newValue) => {
          onChange(event, newValue);
        }}
        onInputChange={(event, value, reason) => {
          onInputChange(event, value, reason);
        }}
        onFocus={onFocus}
        renderInput={(params) => {
          return (
            <TextInput
              {...params}
              label={label}
              size={size}
              ref={ref}
              name={name}
              inputProps={{ ...params.inputProps, markers }}
            />
          );
        }}
      />
    </ThemeProvider>
  );
});

export default SelectInput;
