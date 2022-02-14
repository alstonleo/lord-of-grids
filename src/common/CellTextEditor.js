import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import TextInput from "./TextInput";

const CellTextEditor = forwardRef((props, ref) => {
  const { value, InputProps, inputProps, onChange = () => {} } = props;
  const [controlledValue, setControlledValue] = useState(value);
  const cellref = useRef();
  const changeHandler = (e) => {
    setControlledValue(e.target.value);
    onChange(e);
  };
  useImperativeHandle(ref, () => {
    return {
      getValue: () => controlledValue,
      isCancelAfterEnd: () => false,
    };
  });
  useEffect(() => {
    cellref.current.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    setControlledValue(value);
  }, [value]);
  return (
    <TextInput
      ref={cellref}
      value={controlledValue}
      onChange={changeHandler}
      InputProps={{ ...InputProps, style: { background: "white" } }}
      inputProps={{ ...inputProps }}
    />
  );
});

export default CellTextEditor;
