import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import TextInput from "./TextInput";
import Autocomplete from "./Autocomplete";
const CellGridSelect = forwardRef((props, ref) => {
  const {
    value,
    autocompleteWidth = "100%",
    component,
    componentProps,
  } = props;
  const [show, setShow] = useState(true);
  const [controlledValue, setControlledValue] = useState(value);
  const cellref = useRef();
  useImperativeHandle(ref, () => {
    return { getValue: () => controlledValue, isCancelAfterEnd: () => false };
  });
  useEffect(() => {
    setControlledValue(value);
  }, [value]);
  useEffect(() => {
    return () => {
      setShow(false);
    };
  }, []);
  return (
    <>
      <TextInput
        ref={cellref}
        inputProps={{ value: controlledValue }}
        readOnly
      />
      <Autocomplete width={autocompleteWidth} show={show}>
        {component(componentProps)}
      </Autocomplete>
    </>
  );
});

export default CellGridSelect;
