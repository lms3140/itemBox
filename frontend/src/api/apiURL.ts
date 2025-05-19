// const BASE_URL = "https://prupruapiapp.store";
const BASE_URL = "http://127.0.0.1:5000";

export const detailAPIObject = {
  add: `${BASE_URL}/api/detail/grid-row/add`,
  update: `${BASE_URL}/api/detail/grid-row/update`,
  delete: `${BASE_URL}/api/detail/grid-row/delete`,
  get: (id: string) => `${BASE_URL}/api/detail/grid-rows/${id}`,
  getInfo: (id: string) => `${BASE_URL}/api/detail/${id}`,
};

export const homeAPIObject = {
  add: `${BASE_URL}/api/main/grid-row/add`,
  delete: `${BASE_URL}/api/main/grid-row/delete`,
  update: `${BASE_URL}/api/main/grid-data/update`,
  get: `${BASE_URL}/api/main/grid-rows`,
};

export const authAPIObject = {
  login: `${BASE_URL}/login`,
};
