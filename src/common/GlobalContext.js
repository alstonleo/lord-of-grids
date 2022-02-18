import { createContext, useCallback, useEffect, useState } from "react";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [shiftKey, setShiftKey] = useState(false);
  const [ctrlKey, setCtrlKey] = useState(false);
  const [altKey, setAltKey] = useState(false);
  const [escKey, setEscKey] = useState(false);
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [currentFocus, setCurrentFocus] = useState(null);
  const globalKeyDownListener = useCallback((e) => {
    const key = e.key;
    const sKey = e.shiftKey;
    const aKey = e.altKey;
    const cKey = e.ctrlKey;
    if (key === "Tab") e.preventDefault();
    if (key === "ArrowDown") e.preventDefault();
    if (key === "ArrowUp") e.preventDefault();
    if (key === "Escape") {
      e.preventDefault();
      setEscKey(true);
    }
    setShiftKey(sKey);
    setAltKey(aKey);
    setCtrlKey(cKey);
  }, []);
  const globalKeyUpListener = useCallback((e) => {
    const sKey = e.shiftKey;
    const aKey = e.altKey;
    const cKey = e.ctrlKey;
    if (e.key === "Escape") {
      e.preventDefault();
      setEscKey(false);
    }
    setShiftKey(sKey);
    setAltKey(aKey);
    setCtrlKey(cKey);
  }, []);
  useEffect(() => {
    document.addEventListener("keydown", globalKeyDownListener, false);
    document.addEventListener("keyup", globalKeyUpListener, false);
    return () => {
      document.removeEventListener("keydown", globalKeyDownListener, false);
      document.removeEventListener("keyup", globalKeyUpListener, false);
    };
  }, [globalKeyDownListener, globalKeyUpListener]);
  useEffect(() => {
    console.log(currentFocus);
  }, [currentFocus]);
  return (
    <GlobalContext.Provider
      value={{
        shiftKey,
        altKey,
        ctrlKey,
        escKey,
        autocompleteOpen,
        setAutocompleteOpen,
        currentFocus,
        setCurrentFocus,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
