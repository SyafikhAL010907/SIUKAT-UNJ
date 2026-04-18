import { pekerjaan } from "../api";

export function fetchPekerjaan(id) {
  return {
    type: "FETCH_PEKERJAAN",
    payload: pekerjaan.fetchPekerjaan(id),
  };
}
