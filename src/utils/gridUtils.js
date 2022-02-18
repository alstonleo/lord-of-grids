export const selectRow = (api, rowIndex) => {
  api.ensureIndexVisible(rowIndex, "middle");
  api.getDisplayedRowAtIndex(rowIndex)?.setSelected(true);
};
export const focusCell = (api, rowIndex, column) => {
  api.clearFocusedCell();
  if (!api.getRowNode(rowIndex).selected) {
    selectRow(api, rowIndex);
  }
  if (column?.colDef?.editable) {
    if (
      api.getFocusedCell()?.rowIndex !== rowIndex &&
      api.getFocusedCell()?.colKey !== column.colId
    )
      api.setFocusedCell(rowIndex, column.colId);
    api.startEditingCell({
      rowIndex,
      colKey: column.colId,
    });
  }
};
export const cellTabbed = (api, shiftKey) => {
  api.deselectAll();
  if (shiftKey) {
    if (api.tabToPreviousCell()) {
      focusCell(
        api,
        api.getFocusedCell().rowIndex,
        api.getFocusedCell().column
      );
    } else {
      api.stopEditing();
    }
  } else if (api.tabToNextCell()) {
    focusCell(api, api.getFocusedCell().rowIndex, api.getFocusedCell().column);
  } else {
    api.stopEditing();
  }
};
export const cellClicked = (api, rowIndex, column, ctrlKey = false) => {
  if (column.colDef.editable) focusCell(api, rowIndex, column);
  if (api.gridOptionsWrapper.isRowSelectionMulti()) {
    let isChecked = api.getRowNode(rowIndex).data.checked || false;
    if (ctrlKey) {
      isChecked = !isChecked;
      api.getRowNode(rowIndex).data.checked = isChecked;
      api.redrawRows({
        rowNodes: [api.getRowNode(rowIndex)],
      });
      if (api.getSelectedNodes().length > 1) {
        api.getRowNode(rowIndex).setSelected(false);
        return;
      }
    }
  }
  api.getRowNode(rowIndex).setSelected(true);
};
/*
  column: optional parameter. mandatory if grid has editable cells
*/
export const rowUp = (api, ctrlKey = false, column = null) => {
  const currentRow = api.getSelectedNodes()[0].rowIndex;
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
  if (column) {
    focusCell(api, currentRow - 1, column);
    return;
  }
  selectRow(api, currentRow - 1);
};
export const rowDown = (api, ctrlKey = false, column = null) => {
  const currentRow = api.getSelectedNodes()[0].rowIndex;
  if (currentRow === api.getDisplayedRowCount() - 1) {
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
  if (column) {
    focusCell(api, currentRow + 1, column);
    return;
  }
  selectRow(api, currentRow + 1);
};
