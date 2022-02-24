import React, { forwardRef, useImperativeHandle, useState } from "react";
import { AgGridReact } from "ag-grid-react";
// import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.min.css";
import "ag-grid-community/dist/styles/ag-theme-balham.min.css";
import "./Aggrid.css";
import { focusCell } from "../utils/gridUtils";
const Aggrid = forwardRef((props, ref) => {
  const {
    id,
    rowData,
    columnDefs,
    defaultColDef,
    frameworkComponents,
    quickFilterText,
    rowSelection = "single",
    singleClickEdit = true,
    enableRangeSelection = false,
    stopEditingWhenCellsLoseFocus = false,
    suppressHorizontalScroll = true,
    suppressCellSelection = true,
    suppressRowClickSelection = false,
    animateRows = true,
    onGridReady = () => {},
    onRowDataChanged = () => {},
    onSelectionChanged = () => {},
    getRowStyle = () => {},
    onCellClicked = () => {},
    onCellFocused = () => {},
  } = props;
  const [api, setApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const gridReady = (params) => {
    setApi(params.api);
    setColumnApi(params.columnApi);
    onGridReady(params);
  };
  useImperativeHandle(ref, () => {
    return {
      isFocused: () => {
        return !!api?.getFocusedCell();
      },
      focus: () => {
        if (api.getDisplayedRowCount() > 0) {
          if (api.getFocusedCell()) {
            setTimeout(
              () =>
                focusCell(
                  api,
                  api.getFocusedCell().rowIndex,
                  api.getFocusedCell().column.colDef.editable
                    ? api.getFocusedCell().column
                    : columnApi.getAllDisplayedColumns()[0]
                ),
              10
            );
            return;
          }
          setTimeout(
            () => focusCell(api, 0, columnApi.getAllDisplayedColumns()[0]),
            10
          );
        }
      },
      blur: () => {
        api?.deselectAll();
        api?.clearFocusedCell();
      },
    };
  });
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div className="ag-theme-balham">
        <AgGridReact
          reactUi={true}
          id={id}
          ref={ref}
          rowSelection={rowSelection}
          rowData={rowData}
          singleClickEdit={singleClickEdit}
          enableRangeSelection={enableRangeSelection}
          columnDefs={columnDefs}
          stopEditingWhenCellsLoseFocus={stopEditingWhenCellsLoseFocus}
          suppressHorizontalScroll={suppressHorizontalScroll}
          suppressCellSelection={suppressCellSelection}
          suppressRowClickSelection={suppressRowClickSelection}
          defaultColDef={defaultColDef}
          frameworkComponents={frameworkComponents}
          quickFilterText={quickFilterText}
          animateRows={animateRows}
          onGridReady={(params) => gridReady(params)}
          onRowDataChanged={(params) => {
            params.api.sizeColumnsToFit();
            onRowDataChanged(params);
          }}
          onSelectionChanged={(params) => {
            params.api.resetRowHeights();
            onSelectionChanged(params);
          }}
          getRowStyle={getRowStyle}
          onCellClicked={onCellClicked}
          onCellFocused={(params) => {
            if (params.rowIndex !== null && params.column !== null)
              onCellFocused(params);
          }}
          onColumnMoved={(params) => console.log(params)}
          getRowHeight={(params) => (params.node.isSelected() ? 40 : 30)}
        />
      </div>
    </div>
  );
});

export default Aggrid;
