import React, { useState, useEffect } from "react";
import { createTheme, FormControl, TextField } from "@mui/material";
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
    mini: {
      MuiOutlinedInput: {
        height: "26px",
      },
      MuiInputLabel: {
        fontSize: "12px",
        top: "-10px",
        shrink: {
          fontSize: "13px",
        },
      },
    },
    small: {
      MuiOutlinedInput: {
        height: "34px",
      },
      MuiInputLabel: {
        fontSize: "12px",
        shrink: {
          fontSize: "13px",
        },
      },
    },
    medium: {
      MuiOutlinedInput: {
        height: "40px",
      },
      MuiInputLabel: {
        fontSize: "13px",
        top: "-5px",
        shrink: {
          fontSize: "15px",
        },
      },
    },
    large: {
      MuiOutlinedInput: {
        height: "50px",
      },
      MuiInputLabel: {
        fontSize: "13px",
        shrink: {
          fontSize: "15px",
        },
      },
    },
  },
  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          display: "flex",
          justifyContent: "center",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ ownerState, theme }) => {
          console.log(ownerState);
          return {
            border: "1px solid black",
            background: ownerState.readOnly ? "#e0e0e0" : "white",
            height: theme.size[ownerState.size].MuiOutlinedInput.height,
            "&.Mui-focused": {
              background: "#fdeba4",
            },
          };
        },
        notchedOutline: {
          border: "none",
        },
        input: ({ ownerState, theme }) => ({
          fontSize: theme.size[ownerState.size].MuiInputLabel.fontSize,
          "::placeholder": {
            fontSize: theme.size[ownerState.size].MuiInputLabel.fontSize,
          },
        }),
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ ownerState, theme }) => {
          return {
            color: "black",
            padding: "2px 5px",
            fontSize: theme.size[ownerState.size].MuiInputLabel.fontSize,
            top: theme.size[ownerState.size].MuiInputLabel.top,
            lineHeight: "1em",
            fontWeight: "600",
            // marginLeft: ownerState.adornedStart ? "25px" : 0,
          };
        },
        shrink: ({ ownerState, theme }) => ({
          top: 0,
          fontSize: theme.size[ownerState.size].MuiInputLabel.shrink.fontSize,
          borderTopLeftRadius: "4px",
          borderTopRightRadius: "4px",
          background: "white",
          "&.Mui-focused": {
            color: "black",
            background: "#fdeba4",
          },
        }),
      },
    },
  },
});
const TextInput = React.forwardRef((props, ref) => {
  const {
    id,
    name,
    label,
    variant = "outlined",
    size = "small", //mini,small, medium, large
    inputProps,
    InputProps,
    InputLabelProps,
    placeholder = "",
    onFocus = () => {},
    onChange = () => {},
    onBlur = () => {},
    onKeyDown = () => {},
    onClick = () => {},
    autoComplete = "off",
    value = "",
    style,
    fullWidth = true,
    error = false,
    disabled = false,
    type,
    sx,
  } = props;
  const [controlledValue, setControlledValue] = useState("");
  useEffect(() => {
    setControlledValue(value);
  }, [value]);
  return (
    <ThemeProvider theme={theme}>
      <FormControl sx={{ width: "100%" }}>
        <TextField
          fullWidth={fullWidth}
          disabled={disabled}
          error={error}
          inputRef={ref}
          id={id}
          name={name}
          label={label}
          variant={variant}
          size={size}
          inputProps={inputProps}
          InputProps={InputProps}
          InputLabelProps={InputLabelProps}
          onFocus={(event) => {
            onFocus(event);
            event.target.select();
          }}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          onClick={onClick}
          style={style}
          autoComplete={autoComplete}
          value={controlledValue}
          placeholder={placeholder}
          type={type}
          sx={sx}
        />
      </FormControl>
    </ThemeProvider>
  );
});

export default TextInput;
