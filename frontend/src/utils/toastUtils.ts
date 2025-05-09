import { Bounce, toast, ToastOptions } from "react-toastify";

const toastOption: ToastOptions<unknown> | undefined = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
  transition: Bounce,
};

// 토스트 에러 처리
export const toastInfo = (msg: string) => {
  toast.info(msg, toastOption);
};
export const toastError = (msg: string) => {
  toast.error(msg, toastOption);
};
export const toastSuccess = (msg: string) => {
  toast.success(msg, toastOption);
};
export const toastWraning = (msg: string) => {
  toast.warning(msg, toastOption);
};

/**
 * toast 메세지 모음입니다. 일반적인 CRUD 상황에서 쓰입니다.
 */
export const TOASTMESSAGE = {
  SUCCESS_ADD: "등록을 성공했습니다",
  SUCCESS_DELETE: "성공적으로 삭제했습니다.",
  SUCCESS_UPDATE: "성공적으로 수정했습니다.",
  SUCCESS_GET: "성공적으로 불러왔습니다.",
  ERROR_ADD: "등록중 오류가 발생했습니다.",
  ERROR_DELETE: "삭제중 오류가 발생했습니다.",
  ERROR_UPDATE: "수정중 오류가 발생했습니다.",
  ERROR_GET: "불러오는는중 오류가 발생했습니다.",
};
