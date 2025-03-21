/**
 *  form 데이터를 Object 데이터로 변환시키는 함수.
 *  FormElement 를 파라미터로 받아야함!!
 *
 * @template T 변환될 객체의 타입
 * @param {HTMLFormElement} form - 변환할 'HTMLFormElement'
 * @returns {T} form 데이터에서 변환된 객체
 */
export function formDataToObj<T>(form: HTMLFormElement): T {
  const formData = new FormData(form);
  return Object.fromEntries(formData) as T;
}
