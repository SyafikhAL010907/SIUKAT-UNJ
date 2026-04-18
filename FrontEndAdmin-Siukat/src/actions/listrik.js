import { listrik } from "../api";

export function getById(token, id, atribut = "") {
  return {
    type: "FETCH_LISTRIK",
    payload: listrik.getById(token, id, atribut),
  };
}

export function updateData(token, input, id) {
  return {
    type: "FETCH_LISTRIK",
    payload: listrik.updateData(token, input, id).then((response) => {
      return listrik.getById(token, id);
    }),
  };
}
