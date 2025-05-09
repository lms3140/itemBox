/**
 * [POST] POST 방식의 API 호출 함수
 *
 * @param url fetch를 실행하기 위한 url
 * @param data post 하기위한 데이터
 * @returns {Promise<any>} 응답 데이터
 */
export const postDataFetch = async <T>(url: string, data: T): Promise<any> => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
};

/**
 * [GET] GET 방식의 API 함수
 *
 * @param url API 호출을 위한 URL
 * @returns {Promise<any>} 응답 데이터
 */
export const getDataFetch = async (url: string): Promise<any> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
};
