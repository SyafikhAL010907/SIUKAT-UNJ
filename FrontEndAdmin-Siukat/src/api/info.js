import axios from "axios";
import { service, notif, errLog } from "../global";

export function fetchInfo(kode) {
  return new Promise((resolve, reject) => {
    const url = kode ? service + "/info?kode=" + kode : service + "/info";
    axios
      .get(url)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        notif("Terjadi kesalahan!", errLog(err.response), "error");
        reject(err.response);
      });
  });
}

export function updateData(token, input) {
  return new Promise((resolve, reject) => {
    axios
      .put(service + "/info/save", input, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        notif("Berhasil!", "Jadwal telah diperbarui", "success");
        resolve(response.data);
      })
      .catch((err) => {
        notif("Terjadi kesalahan!", errLog(err.response), "error");
        reject(err.response);
      });
  });
}
