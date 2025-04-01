import { AgGridReact } from "ag-grid-react";
import { postDataFetch } from "./utils";
import { CellValueChangedEvent } from "ag-grid-community";

/**
 * "AG Grid"에서 하나의 행을 삭제하기 위한 함수
 *
 * @example
 * const [rowData, setRowData] = useState();
 * deleteRowFunc("/api/delete",gridRef,setRowData);
 *
 *
 * @param apiUrl 삭제 API 의 URL
 * @param gridRef grid 참조값
 * @param setData rowData를 담당하는 state의 setter 함수
 * @returns void
 */
export const deleteRowFunc = async <T extends { id: string }>(
  apiUrl: string,
  gridRef: React.RefObject<AgGridReact<T> | null> | undefined,
  setData: React.Dispatch<React.SetStateAction<T[]>>
) => {
  if (!gridRef) {
    console.error("[deleteRowFunc] gridRef가 없습니다.");
    return;
  }
  try {
    const selected = gridRef.current?.api.getSelectedRows();
    if (!selected || selected.length === 0) return;
    const selectedId = selected[0].id;
    const result = await postDataFetch(apiUrl, { id: selectedId });
    console.log(result);
    setData((prev) => prev.filter((rows) => rows.id !== selectedId));
  } catch (e) {
    console.error(e);
  }
};

// cellValueChanged

export const cellValueChangeHandler = async <T extends { id: string }>(
  e: CellValueChangedEvent<T, any>,
  url: string
) => {
  const { oldValue, data } = e;
  const colField = e.column.getColDef().field;
  try {
    const result = await postDataFetch(url, data);
    console.log(result);
  } catch (error) {
    if (!colField) {
      console.warn("[cellValueChangeHandler] 에러! colField가 없다고???");
      return;
    }
    // cell 수정
    const targetData = e.data;
    const key = colField as keyof typeof targetData;
    targetData[key] = oldValue;
    e.api.getRowNode(e.data.id)?.setData(targetData);
    e.api.refreshCells({ rowNodes: [e.node], columns: [colField] });
  }
};
