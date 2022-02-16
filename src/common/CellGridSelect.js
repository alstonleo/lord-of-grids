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
  const cellRef = useRef();
  useImperativeHandle(ref, () => {
    return { getValue: () => controlledValue, isCancelAfterEnd: () => false };
  });
  useEffect(() => {
    return () => {
      setShow(false);
    };
  }, []);
  useEffect(() => {
    setControlledValue(value);
  }, [value]);
  return (
    <>
      <TextInput ref={cellRef} value={controlledValue} readOnly />
      <Autocomplete width={autocompleteWidth} show={show}>
        {component(componentProps)}
      </Autocomplete>
    </>
  );
});

export default CellGridSelect;
