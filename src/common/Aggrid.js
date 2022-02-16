import React from "react";
import { AgGridReact } from "ag-grid-react";
// import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.min.css";
import "ag-grid-community/dist/styles/ag-theme-balham.min.css";
import "./Aggrid.css";
const Aggrid = (props) => {
  const {
    rowData,
    columnDefs,
    defaultColDef,
    frameworkComponents,
    quickFilterText,
    rowSelection = "multiple",
    singleClickEdit = true,
    enableRangeSelection = false,
    suppressCellSelection = true,
    stopEditingWhenCellsLoseFocus = false,
    suppressHorizontalScroll = true,
    animateRows = true,
    onGridReady = () => {},
    onRowDataChanged = () => {},
    getRowStyle = () => {},
    onCellClicked = () => {},
    onSelectionChanged = () => {},
  } = props;
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div className="ag-theme-balham">
        <AgGridReact
          reactUi={true}
          rowSelection={rowSelection}
          rowData={rowData}
          singleClickEdit={singleClickEdit}
          enableRangeSelection={enableRangeSelection}
          columnDefs={columnDefs}
          suppressCellSelection={suppressCellSelection}
          stopEditingWhenCellsLoseFocus={stopEditingWhenCellsLoseFocus}
          suppressHorizontalScroll={suppressHorizontalScroll}
          defaultColDef={defaultColDef}
          frameworkComponents={frameworkComponents}
          quickFilterText={quickFilterText}
          animateRows={animateRows}
          onGridReady={onGridReady}
          onRowDataChanged={(params) => {
            params.api.sizeColumnsToFit();
            onRowDataChanged(params);
          }}
          getRowStyle={getRowStyle}
          onCellClicked={onCellClicked}
          getRowHeight={(params) => (params.node.isSelected() ? 40 : 30)}
          onSelectionChanged={(params) => {
            params.api.resetRowHeights();
            onSelectionChanged(params);
          }}
        />
      </div>
    </div>
  );
};

export default Aggrid;
