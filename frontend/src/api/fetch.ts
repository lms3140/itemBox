import { useAuthStore } from "../store/zustandStore";
import { toastError } from "../utils/toastUtils";
import { detailAPIObject } from "./apiURL";

/**
 * [POST] POST 방식의 API 호출 함수
 *
 * @param url fetch를 실행하기 위한 url
 * @param data post 하기위한 데이터
 * @returns {Promise<any>} res.json()
 */
export const postDataFetch = async <T>(url: string, data: T): Promise<any> => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorMsg = await res.json();
    throw new Error(errorMsg.error);
  }
  return res.json();
};

/**
 * [POST] POST 방식의 토큰 인증이 포함된 API 호출 함수
 *
 * @param url fetch를 실행하기 위한 url
 * @param data post 하기위한 데이터
 * @returns {Promise<any>} res.json()
 */
export const postAuthFetch = async <T>(url: string, data: T) => {
  const token = useAuthStore.getState().tokenObj?.access_token;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    if (res.status === 401) {
      toastError("세션이 만료되었습니다!");
      useAuthStore.getState().removeToken();
      window.location.href = "/login";
    }
    const errorMsg = await res.json();
    throw new Error(errorMsg.error);
  }
  return res.json();
};

/**
 * [GET] GET 방식의 API 함수
 *
 *
 * @param url API 호출을 위한 URL
 * @returns {Promise<any>} 응답 데이터
 */
export const getDataFetch = async (url: string): Promise<any> => {
  const token = useAuthStore.getState().tokenObj?.access_token;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    if (res.status === 401 || res.status === 422) {
      toastError("세션이 만료되었습니다");
      useAuthStore.getState().removeToken();
      window.location.href = "/login";
      return;
    }
    throw new Error(res.statusText);
  }
  return res.json();
};

// 상품 상세정보를 가져오는 fetch 함수
export const fetchDetailInfo = async (paramId: string | undefined) => {
  if (!paramId) throw new Error("paramId 이 없습니다.");
  const res = await getDataFetch(detailAPIObject.getInfo(paramId));
  return res;
};
