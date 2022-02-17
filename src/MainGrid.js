import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { Card } from "@mui/material";
import Aggrid from "./common/Aggrid";
import CellTextEditor from "./common/CellTextEditor";
import CellGridSelect from "./common/CellGridSelect";
import TextInput from "./common/TextInput";
import GlobalContext from "./common/GlobalContext";
import { cellTabbed, rowDown, rowUp, selectRow } from "./utils/gridUtils";
const AlternateNamesGridSelectComponent = ({
  rowData,
  columnDefs,
  defaultColDef,
  selectedIndex,
  onTab = () => {},
  onEnter = () => {},
  onEscape = () => {},
}) => {
  const { shiftKey } = useContext(GlobalContext);
  const [filterText, setFilterText] = useState("");
  const [api, setApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const filterRef = useRef();
  const gridListener = useCallback(
    (e) => {
      const key = e.key;
      if (key === "Tab") {
        e.preventDefault();
        onTab(shiftKey);
        return;
      }
      const currentRow = api.getSelectedNodes()[0]?.rowIndex;
      if (currentRow === undefined || currentRow === null || currentRow === "")
        return;
      if (key === "Enter") {
        e.preventDefault();
        onEnter(currentRow, shiftKey);
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
    [shiftKey, api, onTab, onEnter]
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
    if (filterText && api.getDisplayedRowCount() > 0)
      selectRow(api, 0, columnApi.getAllDisplayedColumns()[0]);
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
              selectRow(
                params.api,
                selectedIndex,
                params.columnApi.getAllDisplayedColumns()[0]
              );
          }}
        />
      </div>
    </div>
  );
};
const MainGrid = () => {
  const [rowData, setRowData] = useState([]);
  const [api, setApi] = useState(null);
  const { shiftKey, ctrlKey, autocompleteOpen } = useContext(GlobalContext);
  const gridRef = useRef();
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
      editable: true,
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
      valueSetter: (params) => params.data.alternate_names || [],
    },
  ];
  const defaultColDef = {
    suppressKeyboardEvent: () => true,
    cellEditor: "cellTextEditor",
    cellEditorParams: (params) => {
      return {
        value: params.value,
        onChange: (e) => console.log(e.target.value),
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
  const onGridReady = (params) => {
    setApi(params.api);
  };
  const tabHandler = (shiftKey) => {
    cellTabbed(api, shiftKey);
  };
  const enterHandler = (rowIndex, shiftKey) => {
    api.getSelectedNodes()[0].data.selected_alternate_name = rowIndex;
    cellTabbed(api, shiftKey);
  };
  const gridListener = useCallback(
    (e) => {
      const key = e.key;
      if (key === "Tab" || key === "Enter") {
        e.preventDefault();
        cellTabbed(api, shiftKey);
        return;
      }
      if (key === "ArrowDown") {
        e.preventDefault();
        rowDown(api, ctrlKey);
        return;
      }
      if (key === "ArrowUp") {
        e.preventDefault();
        rowUp(api, ctrlKey);
        return;
      }
    },
    [api, ctrlKey, shiftKey]
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
    if (!autocompleteOpen && gridRef.current.isFocused())
      document.addEventListener("keyup", gridListener, false);
    return () => {
      document.removeEventListener("keyup", gridListener, false);
    };
  }, [gridListener, autocompleteOpen]);
  useEffect(() => {
    api?.redrawRows();
  }, [rowData, api]);
  return (
    <>
      <Card sx={{ height: "90vh", width: "100vw" }}>
        <Aggrid
          ref={gridRef}
          onGridReady={onGridReady}
          rowData={rowData}
          animateRows={false}
          onRowDataChanged={(params) => {
            params.api.setFocusedCell(
              0,
              params.columnApi.getAllDisplayedColumns()[0].colId
            );
            if (params.api.getFocusedCell().column.colDef.editable) {
              params.api.startEditingCell({
                rowIndex: 0,
                colKey: params.columnApi.getAllDisplayedColumns()[0].colId,
              });
            }
            params.api.getRowNode(0)?.setSelected(true);
          }}
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
          onCellClicked={(params) => {
            const currentRow = params.api.getFocusedCell().rowIndex;
            if (params.api.gridOptionsWrapper.isRowSelectionMulti()) {
              let isChecked =
                params.api.getRowNode(currentRow).data.checked || false;
              if (ctrlKey) {
                isChecked = !isChecked;
                params.api.getRowNode(currentRow).data.checked = isChecked;
                params.api.redrawRows({
                  rowNodes: [params.api.getRowNode(currentRow)],
                });
                if (api.getSelectedNodes().length > 1) {
                  params.api.getRowNode(currentRow).setSelected(false);
                  return;
                }
              }
            }
            params.api.getRowNode(currentRow).setSelected(true);
          }}
          onSelectionChanged={(params) => {
            params.api.resetRowHeights();
          }}
        />
      </Card>
    </>
  );
};

export default MainGrid;
