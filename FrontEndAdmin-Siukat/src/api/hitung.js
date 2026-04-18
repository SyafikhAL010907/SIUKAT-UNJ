import axios from "axios";
import { service } from "../global";

export function flagHitung(token, id, atribut = "") {
  return new Promise((resolve, reject) => {
    axios
      .get(service + "/ukt/compute/" + id + "?atribut=" + atribut, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err.response);
      });
  });
}
