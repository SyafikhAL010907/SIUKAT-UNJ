import { info } from "../api";

export function fetchInfo(kode) {
  return {
    type: "FETCH_INFO",
    payload: info.fetchInfo(kode),
  };
}
export function updateData(token, input) {
  return {
    type: "FETCH_INFO",
    payload: info.updateData(token, input).then((response) => {
      return info.fetchInfo(input.kode);
    }),
  };
}
