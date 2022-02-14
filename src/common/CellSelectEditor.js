import { Autocomplete } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useRef } from "react";
import TextInput from "./TextInput";
const CellSelectEditor = (props) => {
  const {
    options,
    label,
    size,
    name,
    getOptionLabel = (option) => option.label,
  } = props;
  const cellRef = useRef();
  useEffect(() => {
    cellRef.current.focus();
  }, []);
  return (
    <Autocomplete
      options={options}
      getOptionLabel={getOptionLabel}
      renderInput={(params) => (
        <TextInput
          {...params}
          label={label}
          size={size}
          ref={cellRef}
          name={name}
        />
      )}
    />
  );
};
export default CellSelectEditor;
