import React, { useContext } from "react";
import { createTheme } from "@mui/material/styles";
import { TextField } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import NumberFormat from "react-number-format";
import GlobalContext from "./GlobalContext";

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
      labelTop: -5,
    },
    medium: {
      height: 34,
      labelTop: -10,
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
            background: ownerState.InputProps.readOnly ? "#e0e0e0" : "white",
          };
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ ownerState, theme }) => {
          return {
            color: "black",
            top: theme.size[ownerState.size].labelTop,
            "&.Mui-focused": {
              color: "black",
            },
            fontSize: 14,
          };
        },
        shrink: {
          top: 0,
          background: "white",
          padding: "0 1px",
          fontWeight: "bold",
          lineHeight: "1em",
          fontSize: 17,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
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
        input: {
          "::placeholder": {
            fontSize: 11.5,
          },
        },
      },
    },
  },
});
const TextInput = React.forwardRef((props, ref) => {
  const {
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
  const { setCurrentFocus } = useContext(GlobalContext);
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
        placeholder={placeholder}
        type={"text"}
        sx={sx}
        onFocus={(event) => {
          event.target.select();
          // setCurrentFocus(ref);
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
