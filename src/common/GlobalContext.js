import { createContext, useCallback, useEffect, useState } from "react";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [shiftKey, setShiftKey] = useState(false);
  const [ctrlKey, setCtrlKey] = useState(false);
  const [altKey, setAltKey] = useState(false);
  const [escKey, setEscKey] = useState(false);
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [contextMap, setContextMap] = useState(null);
  const [enableGlobalNavigation, setEnableGlobalNavigation] = useState(true);
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
  const globalKeyUpListener = useCallback(
    (e) => {
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
      if (!contextMap) return;
      const el = document.activeElement;
      const markers = el.getAttribute("markers")
        ? JSON.parse(el.getAttribute("markers"))
        : null;
      console.log(markers);
      if (key === "Tab" || key === "Enter") {
        console.log("global tab");
        e.preventDefault();
        if (!markers) {
          contextMap["default"].current.focus();
          return;
        }
        if (sKey && markers.left) {
          contextMap[markers.left].current.focus();
          return;
        }
        if (markers.right) {
          contextMap[markers.right].current.focus();
          return;
        }
      }
      if (key === "ArrowDown") {
        e.preventDefault();
        if (!markers) {
          contextMap["default"].current.focus();
          return;
        }
        if (aKey) contextMap[markers.down].current.focus();
        return;
      }
      if (key === "ArrowUp") {
        console.log("global arrowup");
        e.preventDefault();
        if (!markers) {
          contextMap["default"].current.focus();
          return;
        }
        if (aKey) contextMap[markers.up].current.focus();
        return;
      }
    },
    [contextMap]
  );
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
        setContextMap,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
