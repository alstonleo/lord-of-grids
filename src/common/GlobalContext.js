import { createContext, useCallback, useEffect, useState } from "react";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [shiftKey, setShiftKey] = useState(false);
  const [ctrlKey, setCtrlKey] = useState(false);
  const [altKey, setAltKey] = useState(false);
  const [escKey, setEscKey] = useState(false);
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [enableGlobalNavigation, setEnableGlobalNavigation] = useState(true);
  const [currentComponent, setCurrentComponent] = useState("");
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
    const key = e.key;
    const sKey = e.shiftKey;
    const aKey = e.altKey;
    const cKey = e.ctrlKey;
    if (key === "Escape") {
      e.preventDefault();
      setEscKey(false);
    }
    setShiftKey(sKey);
    setAltKey(aKey);
    setCtrlKey(cKey);
    const el = document.activeElement;
    const markers = el.getAttribute("markers")
      ? JSON.parse(el.getAttribute("markers"))
      : null;
    if (key === "Tab" || key === "Enter") {
      e.preventDefault();
      if (!markers) {
        setCurrentComponent("default");
        return;
      }
      if (sKey) {
        if (markers.left) setCurrentComponent(markers.left);
        return;
      }
      if (markers.right) {
        setCurrentComponent(markers.right);
        return;
      }
    }
    if (key === "ArrowDown") {
      e.preventDefault();
      if (!markers) {
        setCurrentComponent("default");
        return;
      }
      if (aKey) {
        if (markers.down) setCurrentComponent(markers.down);
        return;
      }
      return;
    }
    if (key === "ArrowUp") {
      console.log("global arrowup");
      e.preventDefault();
      if (!markers) {
        setCurrentComponent("default");
        return;
      }
      if (aKey) {
        if (markers.up) setCurrentComponent(markers.up);
        return;
      }
      return;
    }
  }, []);
  useEffect(() => {
    document.addEventListener("keydown", globalKeyDownListener, false);
    if (enableGlobalNavigation) {
      document.addEventListener("keyup", globalKeyUpListener, false);
    } else {
      document.removeEventListener("keyup", globalKeyUpListener, false);
    }
    return () => {
      document.removeEventListener("keydown", globalKeyDownListener, false);
      document.removeEventListener("keyup", globalKeyUpListener, false);
    };
  }, [enableGlobalNavigation, globalKeyDownListener, globalKeyUpListener]);
  return (
    <GlobalContext.Provider
      value={{
        shiftKey,
        altKey,
        ctrlKey,
        escKey,
        autocompleteOpen,
        setAutocompleteOpen,
        enableGlobalNavigation,
        setEnableGlobalNavigation,
        currentComponent,
        setCurrentComponent,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
