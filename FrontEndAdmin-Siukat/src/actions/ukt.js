import { ukt } from "../api";

export function getById(token, id) {
  return {
    type: "FETCH_UKT",
    payload: ukt.getById(token, id),
  };
}
