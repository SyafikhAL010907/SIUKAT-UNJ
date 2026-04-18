import { rumah } from "../api";

export function getById(token, id, atribut = "") {
  return {
    type: "FETCH_RUMAH",
    payload: rumah.getById(token, id, atribut),
  };
}

export function updateData(token, input, id) {
  return {
    type: "FETCH_RUMAH",
    payload: rumah.updateData(token, input, id).then((response) => {
      return rumah.getById(token, id);
    }),
  };
}
