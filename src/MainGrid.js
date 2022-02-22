import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { Card } from "@mui/material";
import Aggrid from "./common/Aggrid";
import CellTextEditor from "./common/CellTextEditor";
import CellGridSelect from "./common/CellGridSelect";
import TextInput from "./common/TextInput";
import GlobalContext from "./common/GlobalContext";
import {
  cellClicked,
  cellTabbed,
  focusCell,
  rowDown,
  rowUp,
  selectRow,
  stopEditing,
} from "./utils/gridUtils";
import AppContext from "./AppContext";
const AlternateNamesGridSelectComponent = ({
  rowData,
  columnDefs,
  defaultColDef,
  selectedIndex,
  onTab = () => {},
  onEnter = () => {},
}) => {
  const { shiftKey } = useContext(GlobalContext);
  const [filterText, setFilterText] = useState("");
  const [api, setApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const filterRef = useRef();
  const enterHandler = useCallback(
    (api) => {
      let selectedIndex = null;
      rowData.find((d, index) => {
        if (d.id === api.getSelectedNodes()[0].data.id) {
          selectedIndex = index;
          return true;
        }
        return false;
      });
      if (selectedIndex !== null) onEnter(selectedIndex, shiftKey);
    },
    [rowData, shiftKey, onEnter]
  );
  const gridListener = useCallback(
    (e) => {
      const key = e.key;
      if (key === "Tab") {
        e.preventDefault();
        onTab(shiftKey);
        return;
      }
      const currentRow = api?.getSelectedNodes()[0]?.rowIndex;
      if (currentRow === undefined || currentRow === null || currentRow === "")
        return;
      if (key === "Enter") {
        e.preventDefault();
        //Needs better logic
        enterHandler(api);
        return;
      }
      if (key === "ArrowUp") {
        e.preventDefault();
        rowUp(api);
      }
      if (key === "ArrowDown") {
        e.preventDefault();
        rowDown(api);
      }
    },
    [shiftKey, api, onTab, enterHandler]
  );
  useEffect(() => {
    filterRef.current.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    document.addEventListener("keyup", gridListener, false);
    return () => {
      document.removeEventListener("keyup", gridListener, false);
    };
  }, [gridListener]);
  useEffect(() => {
    if (filterText && api.getDisplayedRowCount() > 0) {
      selectRow(api, 0);
    }
  }, [filterText, api, columnApi]);
  return (
    <div
      style={{
        paddingTop: 16,
        display: "flex",
        flexDirection: "column",
        background: "white",
        width: "100%",
        height: "100%",
      }}
    >
      <div style={{ width: "50%", height: "10%", paddingLeft: 16 }}>
        <TextInput
          size="small"
          ref={filterRef}
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
      <div style={{ height: "calc(90% - 16px)" }}>
        <Aggrid
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={rowData}
          quickFilterText={filterText}
          rowSelection="single"
          onGridReady={(params) => {
            setApi(params.api);
            setColumnApi(params.columnApi);
          }}
          onRowDataChanged={(params) => {
            if (params.api.getDisplayedRowCount() > 0)
              focusCell(
                params.api,
                selectedIndex,
                params.columnApi.getAllDisplayedColumns()[0]
              );
          }}
          onCellClicked={(params) => enterHandler(params.api)}
        />
      </div>
    </div>
  );
};
const MainGrid = () => {
  const [rowData, setRowData] = useState([]);
  const [api, setApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const {
    shiftKey,
    ctrlKey,
    altKey,
    autocompleteOpen,
    currentComponent,
    setCurrentComponent,
  } = useContext(GlobalContext);
  const { gridref, enableGlobalNavigation } = useContext(AppContext);
  const columnDefs = [
    {
      headerName: "checked",
      field: "checked",
      hide: true,
    },
    {
      headerName: "Actor Name",
      field: "actor",
      editable: true,
    },
    {
      headerName: "Gender",
      field: "gender",
      editable: true,
    },
    {
      headerName: "House",
      field: "house",
    },
    {
      headerName: "Name",
      field: "name",
    },
    {
      headerName: "Alternate Names",
      field: "alternate_names",
      editable: ctrlKey ? false : true,
      cellEditor: "cellGridSelect",
      cellEditorParams: (params) => {
        return {
          value: params.value,
          autocompleteWidth: "70%",
          component: AlternateNamesGridSelectComponent,
          componentProps: {
            selectedIndex: params.data.selected_alternate_name,
            rowData: params.data.alternate_names,
            columnDefs: [
              {
                headerName: "ID",
                field: "id",
              },
              {
                headerName: "Alternate Name",
                field: "name",
              },
            ],
            defaultColDef: [],
            onTab: tabHandler,
            onEnter: enterHandler,
          },
        };
      },
      valueGetter: (params) => {
        return params.data.alternate_names?.length > 0
          ? params.data.alternate_names[params.data.selected_alternate_name]
              .name
          : "";
      },
      valueSetter: (/*params*/) => null, //params.data.alternate_names || [],
    },
  ];
  const defaultColDef = {
    suppressKeyboardEvent: () => true,
    suppressNavigable: (params) => !params.colDef.editable,
    cellEditor: "cellTextEditor",
    cellEditorParams: (params) => {
      return {
        value: params.value,
        onChange: (e) => {
          // console.log(e.target.value);
        },
      };
    },
    cellRendererFramework: (params) => {
      return params.colDef.editable ? (
        <div className="ag-editable-cell">{params.value}</div>
      ) : (
        params.value
      );
    },
  };
  const mainGridMarkers = useMemo(() => {
    return { up: "search", down: "gender", left: "gender", right: "search" };
  }, []);
  const onGridReady = (params) => {
    setApi(params.api);
    setColumnApi(params.columnApi);
  };
  const gridEditingStopped = useCallback(
    (direction) => {
      if (api) stopEditing(api);
      if (direction) setCurrentComponent(mainGridMarkers[direction]);
    },
    [api, mainGridMarkers, setCurrentComponent]
  );
  const tabHandler = useCallback(
    (shiftKey) => {
      if (!cellTabbed(api, shiftKey)) {
        gridEditingStopped(shiftKey ? "left" : "right");
      }
    },
    [api, gridEditingStopped]
  );
  const enterHandler = (rowIndex, shiftKey) => {
    api.getSelectedNodes()[0].data.selected_alternate_name = rowIndex;
    api.redrawRows({
      rowNodes: [api.getRowNode(rowIndex)],
    });
    cellTabbed(api, shiftKey);
  };
  const gridListener = useCallback(
    (e) => {
      if (!api) return;
      const key = e.key;
      if (key === "Tab" || key === "Enter") {
        e.preventDefault();
        tabHandler(shiftKey);
        return;
      }
      if (key === "ArrowDown") {
        e.preventDefault();
        if (altKey) {
          gridEditingStopped("down");
          return;
        }
        if (api.getFocusedCell().column.colDef.editable) {
          if (!rowDown(api, ctrlKey, api.getFocusedCell().column))
            gridEditingStopped("down");
          return;
        }
        if (!rowDown(api, ctrlKey, columnApi.getColumn("actor")))
          gridEditingStopped("down");
        return;
      }
      if (key === "ArrowUp") {
        e.preventDefault();
        if (altKey) {
          gridEditingStopped("up");
          return;
        }
        if (api.getFocusedCell().column.colDef.editable) {
          if (!rowUp(api, ctrlKey, api.getFocusedCell().column))
            gridEditingStopped("up");
          return;
        }
        if (!rowUp(api, ctrlKey, columnApi.getColumn("actor")))
          gridEditingStopped("up");
        return;
      }
    },
    [api, columnApi, ctrlKey, shiftKey, altKey, tabHandler, gridEditingStopped]
  );
  useEffect(() => {
    fetch(`http://hp-api.herokuapp.com/api/characters/house/gryffindor`)
      .then((response) => response.json())
      .then((data) => {
        const temp = data.slice().map((datum) => {
          return {
            ...datum,
            selected_alternate_name:
              datum.alternate_names.length > 0
                ? datum.alternate_names.length - 1
                : null,
            alternate_names: datum.alternate_names.slice().map((an, index) => {
              return { id: index, name: an };
            }),
          };
        });
        setRowData(temp);
      });
  }, []);
  useEffect(() => {
    if (currentComponent === "main_grid" && !autocompleteOpen) {
      document.addEventListener("keyup", gridListener, false);
    }
    return () => {
      document.removeEventListener("keyup", gridListener, false);
    };
  }, [gridref, currentComponent, autocompleteOpen, gridListener]);
  useEffect(() => {
    if (currentComponent === "main_grid") {
      enableGlobalNavigation(false);
    }
    return () => {
      enableGlobalNavigation(true);
    };
  }, [currentComponent, enableGlobalNavigation]);
  useEffect(() => {
    if (currentComponent !== "main_grid") gridEditingStopped();
  }, [currentComponent, gridEditingStopped]);
  return (
    <>
      <Card sx={{ height: "90vh", width: "100vw" }}>
        <Aggrid
          id="main_grid"
          ref={gridref}
          onGridReady={onGridReady}
          rowData={rowData}
          animateRows={false}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          frameworkComponents={{
            cellTextEditor: CellTextEditor,
            cellGridSelect: CellGridSelect,
          }}
          getRowStyle={(params) => {
            if (params.data.checked) {
              return { background: "#c9defc" };
            }
          }}
          onCellFocused={(params) => {
            setCurrentComponent("main_grid");
          }}
          onCellClicked={useCallback(
            (params) => {
              setCurrentComponent("main_grid");
              if (params.column.colDef.editable) {
                cellClicked(
                  params.api,
                  params.node.rowIndex,
                  params.column,
                  ctrlKey
                );
              } else {
                cellClicked(
                  params.api,
                  params.node.rowIndex,
                  params.columnApi.getColumn("actor"),
                  ctrlKey
                );
              }
            },
            [ctrlKey, setCurrentComponent]
          )}
          onSelectionChanged={(params) => {
            params.api.resetRowHeights();
          }}
        />
      </Card>
    </>
  );
};

export default MainGrid;
