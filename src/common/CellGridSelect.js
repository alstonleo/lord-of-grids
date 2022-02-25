import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import TextInput from "./TextInput";
import Autocomplete from "./Autocomplete";
import _ from "lodash";
const CellGridSelect = forwardRef((props, ref) => {
  const { value, autocompleteWidth = "100%", component } = props;
  const [show, setShow] = useState(false);
  const [controlledValue, setControlledValue] = useState(value);
  const cellref = useRef();
  const showAC = useCallback(() => {
    setShow(true);
  }, []);
  useImperativeHandle(ref, () => {
    return { getValue: () => controlledValue, isCancelAfterEnd: () => false };
  });
  useEffect(() => {
    setControlledValue(value);
  }, [value]);
  useEffect(() => {
    const debounce = _.debounce(showAC, 200);
    debounce();
    return () => {
      setShow(false);
      debounce.cancel();
    };
  }, [showAC]);
  return (
    <>
      <TextInput
        ref={cellref}
        inputProps={{ value: controlledValue }}
        readOnly
      />
      <Autocomplete width={autocompleteWidth} show={show}>
        {show && component}
      </Autocomplete>
    </>
  );
});

export default CellGridSelect;
