import React, { useState, useEffect } from "react";
import { createTheme } from "@mui/material/styles";
import { TextField } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import NumberFormat from "react-number-format";
export const NumberFormatter = React.forwardRef((props, ref) => {
  const { onChange, value, ...filteredProps } = props;
  return (
    <NumberFormat
      {...filteredProps}
      getInputRef={ref}
      onValueChange={(values, sourceInfo) => {
        onChange(sourceInfo.event, values);
      }}
    />
  );
});
const theme = createTheme({
  size: {
    small: {
      height: 27,
    },
    medium: {
      height: 34,
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: ({ ownerState, theme }) => {
          return {
            border: "none",
            height: theme.size[ownerState.size].height,
            justifyContent: "center",
            alignItems: "center",
            background: ownerState.InputProps.readOnly
              ? "#e0e0e0"
              : "transparent",
          };
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "black",
          top: -7.5,
          "&.Mui-focused": {
            color: "black",
          },
        },
        shrink: {
          top: 0,
          background: "white",
          padding: "0 1px",
          fontWeight: "bold",
          lineHeight: "1em",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          // ":read-only": {
          //   background: "#e0e0e0",
          //   "&.Mui-focused": {
          //     background: "#e0e0e0",
          //   },
          // },
          height: "100%",
          border: "none",
          "&.Mui-focused": {
            background: "#fdeba4",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "1px solid black",
          },
        },
        notchedOutline: {
          border: "1px solid black",
        },
      },
    },
  },
});
const TextInput = React.forwardRef((props, ref) => {
  const {
    value = "",
    autoComplete = "off",
    size = "medium",
    fullWidth = true,
    disabled = false,
    id,
    name,
    label,
    placeholder,
    sx = {},
    inputProps = {},
    InputProps = {},
    InputLabelProps = {},
    onFocus = () => {},
    onBlur = () => {},
    onChange = () => {},
    onClick = () => {},
  } = props;
  const [controlledValue, setControlledValue] = useState(value);
  useEffect(() => {
    setControlledValue(value);
  }, [value]);
  return (
    <ThemeProvider theme={theme}>
      <TextField
        fullWidth={fullWidth}
        disabled={disabled}
        inputRef={ref}
        id={id}
        name={name}
        label={label}
        variant={"outlined"}
        size={size}
        inputProps={{ ...inputProps }}
        InputProps={{ ...InputProps }}
        InputLabelProps={{ ...InputLabelProps }}
        autoComplete={autoComplete}
        value={controlledValue}
        placeholder={placeholder}
        type={"text"}
        sx={sx}
        onFocus={(event) => {
          event.target.select();
          onFocus(event);
        }}
        onChange={onChange}
        onBlur={onBlur}
        onClick={onClick}
      />
    </ThemeProvider>
  );
});

export default TextInput;
