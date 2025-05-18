import { CellValueChangedEvent } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Dispatch, SetStateAction } from "react";
import { toastError, TOASTMESSAGE, toastSuccess } from "../utils/toastUtils";
import { getDataFetch, postAuthFetch } from "./fetch";

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
    const result = await postAuthFetch(apiUrl, { id: selectedId });
    console.log(result);
    setData((prev) => prev.filter((rows) => rows.id !== selectedId));
    toastSuccess(TOASTMESSAGE.SUCCESS_DELETE);
  } catch (e) {
    console.error(e);
    toastError(TOASTMESSAGE.ERROR_DELETE);
  }
};

/**
 * "AG grid"에서 셀 하나의 수정을 위한 함수
 *
 * @example
 * <AgGridReact
 *  onCellValueChanged={(e)=>{cellValueChangeHandler(e,api_URL)}}
 * />
 *
 * @param e onCellValueChanged 이벤트 객체
 * @param url AG grid 수정 API URL
 */

export const cellValueChangeHandler = async <T extends { id: string }>(
  e: CellValueChangedEvent<T, any>,
  url: string
) => {
  const { oldValue, data } = e;
  const colField = e.column.getColDef().field;
  try {
    await postAuthFetch(url, data);
  } catch (error) {
    toastError(TOASTMESSAGE.ERROR_UPDATE);
    console.log(error);
    if (!colField) {
      console.warn("[cellValueChangeHandler] colField 없음");
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
/**
 *
 * @param url 그리드 데이터를 불러오는 URL
 * @param setRowData setState의 set 함수
 */
export const loadGridData = async <T>(
  url: string,
  setRowData: Dispatch<SetStateAction<T[]>>
) => {
  const res = (await getDataFetch(url)) as T[];
  setRowData((prev) => [...prev, ...res]);
};
