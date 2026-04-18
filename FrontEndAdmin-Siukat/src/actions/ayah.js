import { notif, errLog } from "../global";
import { ayah, kabkot, kecamatan } from "../api";

export function fetchAllData(token, id, atribut = "") {
  return function (dispatch) {
    ayah
      .getById(token, id, atribut)
      .then((response) => {
        dispatch({
          type: "FETCH_AYAH_FULFILLED",
          payload: response,
        });

        kabkot
          .fetchKabkot(response.provinsi_ayah)
          .then((response) => {
            dispatch({
              type: "FETCH_KABKOT_AYAH_FULFILLED",
              payload: response,
            });
          })
          .catch((err) => {
            notif("Terjadi kesalahan!", errLog(err.response), "error");
            dispatch({
              type: "FETCH_KABKOT_AYAH_REJECTED",
              payload: err,
            });
          });

        kecamatan
          .fetchKecamatan(response.kabkot_ayah)
          .then((response) => {
            dispatch({
              type: "FETCH_KECAMATAN_AYAH_FULFILLED",
              payload: response,
            });
          })
          .catch((err) => {
            notif("Terjadi kesalahan!", errLog(err.response), "error");
            dispatch({
              type: "FETCH_KECAMATAN_AYAH_REJECTED",
              payload: err,
            });
          });
      })
      .catch((err) => {
        console.log(err);
        notif("Ayah Rejected!", errLog(err.response), "error");
        dispatch({
          type: "FETCH_AYAH_REJECTED",
          payload: err,
        });
      });
  };
}

export function updateData(token, input, id) {
  return {
    type: "FETCH_AYAH",
    payload: ayah.updateData(token, input, id).then((response) => {
      return ayah.getById(token, id);
    }),
  };
}
