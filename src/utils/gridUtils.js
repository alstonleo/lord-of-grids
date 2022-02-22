export const selectRow = (api, rowIndex) => {
  api.ensureIndexVisible(rowIndex, "middle");
  api.getDisplayedRowAtIndex(rowIndex)?.setSelected(true);
};
export const focusCell = (api, rowIndex, column) => {
  // api.clearFocusedCell();
  if (!api.getRowNode(rowIndex).selected) {
    selectRow(api, rowIndex);
  }
  if (column?.colDef?.editable) {
    console.log(
      api.getFocusedCell()?.rowIndex,
      api.getFocusedCell()?.column?.colId,
      rowIndex,
      column?.colId
    );
    if (
      api.getFocusedCell()?.rowIndex !== rowIndex ||
      api.getFocusedCell()?.column?.colId !== column?.colId
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
      api.clearFocusedCell();
      api.stopEditing();
      return false;
    }
  } else if (api.tabToNextCell()) {
    focusCell(api, api.getFocusedCell().rowIndex, api.getFocusedCell().column);
  } else {
    api.clearFocusedCell();
    api.stopEditing();
    return false;
  }
  return true;
};
export const cellClicked = (api, rowIndex, column, ctrlKey = false) => {
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
      api.getRowNode(rowIndex).setSelected(true);
      return;
    }
  }
  if (column) focusCell(api, rowIndex, column);
};
/*
  column: optional parameter. mandatory if grid has editable cells
*/
export const rowUp = (api, ctrlKey = false, column = null) => {
  const currentRow = api.getSelectedNodes()[0].rowIndex;
  if (api.gridOptionsWrapper.isRowSelectionMulti()) {
    let isChecked = api.getRowNode(currentRow).data.checked || false;
    if (ctrlKey) {
      isChecked = !isChecked;
      api.getRowNode(currentRow).data.checked = isChecked;
      api.redrawRows({ rowNodes: [api.getRowNode(currentRow)] });
    }
    api.getRowNode(currentRow).setSelected(false);
  }
  console.log(currentRow);
  if (currentRow === 0) {
    api.clearFocusedCell();
    api.stopEditing();
    return false;
  }
  if (column) {
    focusCell(api, currentRow - 1, column);
    return true;
  }
  selectRow(api, currentRow - 1);
  return true;
};
export const rowDown = (api, ctrlKey = false, column = null) => {
  const currentRow = api.getSelectedNodes()[0].rowIndex;
  if (api.gridOptionsWrapper.isRowSelectionMulti() && currentRow !== -1) {
    let isChecked = api.getRowNode(currentRow).data.checked || false;
    if (ctrlKey) {
      isChecked = !isChecked;
      api.getRowNode(currentRow).data.checked = isChecked;
      api.redrawRows({ rowNodes: [api.getRowNode(currentRow)] });
    }
    api.getRowNode(currentRow).setSelected(false);
  }
  if (currentRow === api.getDisplayedRowCount() - 1) {
    api.clearFocusedCell();
    api.stopEditing();
    return false;
  }
  if (column) {
    focusCell(api, currentRow + 1, column);
    return true;
  }
  selectRow(api, currentRow + 1);
  return true;
};
