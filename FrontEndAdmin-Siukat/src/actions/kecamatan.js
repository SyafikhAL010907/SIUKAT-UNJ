import { kecamatan } from "../api";

export function fetchForCmahasiswa(id) {
  return {
    type: "FETCH_KECAMATAN_MHS",
    payload: kecamatan.fetchKecamatan(id),
  };
}

export function fetchForAyah(id) {
  return {
    type: "FETCH_KECAMATAN_AYAH",
    payload: kecamatan.fetchKecamatan(id),
  };
}

export function fetchForIbu(id) {
  return {
    type: "FETCH_KECAMATAN_IBU",
    payload: kecamatan.fetchKecamatan(id),
  };
}

export function fetchForWali(id) {
  return {
    type: "FETCH_KECAMATAN_WALI",
    payload: kecamatan.fetchKecamatan(id),
  };
}
