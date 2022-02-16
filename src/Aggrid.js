import React, { useCallback, useContext, useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.min.css";
import "ag-grid-community/dist/styles/ag-theme-balham.min.css";
import "./Aggrid.css";
import { Card } from "@mui/material";
import GlobalContext from "./common/GlobalContext";
import CellTextEditor from "./common/CellTextEditor";
import { selectRow } from "./utils/gridUtils";

const Aggrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rowData, setRowData] = useState([]);
  const [api, setApi] = useState(null);
  const { shiftKey, altKey, ctrlKey } = useContext(GlobalContext);
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
      valueGetter: (params) => {
        return params.data.alternate_names?.length > 0
          ? params.data.alternate_names[params.data.selected_alternate_name]
              .name
          : "";
      },
      cellRendererFramework: (params) => {
        return params.value;
      },
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
  const gridListener = useCallback(
    (e) => {
      if (!api) return;
      const currentRow = api.getSelectedNodes()[0].rowIndex;
      const key = e.key;
      if (key === "ArrowDown") {
        e.preventDefault();
        if (currentRow === rowData.length - 1) {
          return;
        }
        if (api.gridOptionsWrapper.isRowSelectionMulti() && currentRow !== -1) {
          let isChecked = api.getRowNode(currentRow).data.checked || false;
          if (ctrlKey) {
            isChecked = !isChecked;
            api.getRowNode(currentRow).data.checked = isChecked;
            api.redrawRows({ rowNodes: [api.getRowNode(currentRow)] });
          }
          api.getRowNode(currentRow).setSelected(false);
        }
        selectRow(api, currentRow + 1, api.getFocusedCell().column);
      }
      if (key === "ArrowUp") {
        e.preventDefault();
        if (currentRow === 0) {
          return;
        }
        if (api.gridOptionsWrapper.isRowSelectionMulti()) {
          let isChecked = api.getRowNode(currentRow).data.checked || false;
          if (ctrlKey) {
            isChecked = !isChecked;
            api.getRowNode(currentRow).data.checked = isChecked;
            api.redrawRows({ rowNodes: [api.getRowNode(currentRow)] });
          }
          api.getRowNode(currentRow).setSelected(false);
        }
        selectRow(api, currentRow - 1, api.getFocusedCell().column);
      }
      if (key === "Tab" || key === "Enter") {
        e.preventDefault();
        api.deselectAll();
        if (shiftKey) {
          if (api.tabToPreviousCell()) {
            selectRow(
              api,
              api.getFocusedCell().rowIndex,
              api.getFocusedCell().column
            );
          } else {
            api.stopEditing();
          }
        } else if (api.tabToNextCell()) {
          selectRow(
            api,
            api.getFocusedCell().rowIndex,
            api.getFocusedCell().column
          );
        } else {
          api.stopEditing();
        }
      }
    },
    [api, rowData, ctrlKey, shiftKey]
  );
  useEffect(() => {
    fetch(`http://hp-api.herokuapp.com/api/characters/house/gryffindor`)
      .then((response) => response.json())
      .then((data) => {
        const temp = data.slice().map((datum) => {
          return {
            ...datum,
            selected_alternate_name: 0,
            alternate_names: datum.alternate_names.slice().map((an, index) => {
              return { id: index, name: an };
            }),
          };
        });
        console.log(temp);
        setRowData(temp);
      });
  }, [searchTerm]);
  useEffect(() => {
    document.addEventListener("keyup", gridListener, false);
    return () => {
      document.removeEventListener("keyup", gridListener, false);
    };
  }, [gridListener]);
  return (
    <>
      <Card sx={{ height: "90vh", width: "100vw" }}>
        <div style={{ height: "100%", width: "100%" }}>
          <div className="ag-theme-balham">
            <AgGridReact
              reactUi={true}
              onGridReady={onGridReady}
              rowSelection="multiple"
              rowData={rowData}
              singleClickEdit={true}
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
              enableRangeSelection={false}
              columnDefs={columnDefs}
              suppressCellSelection={true}
              stopEditingWhenCellsLoseFocus={false}
              suppressHorizontalScroll={true}
              defaultColDef={defaultColDef}
              frameworkComponents={{
                cellTextEditor: CellTextEditor,
              }}
              getRowHeight={(params) => (params.node.isSelected() ? 40 : 30)}
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
          </div>
        </div>
      </Card>
    </>
  );
};

export default Aggrid;
