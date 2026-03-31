import axios from 'axios';
import { service } from '../global';

export function fetchBioProvinsi() {
    return new Promise((resolve, reject) => {
        axios.get(service + '/provinsi/bio/all').then((response) => {
            resolve(response.data);
        });
    // .catch((err) => {
    //     notif("Terjadi kesalahan!", errLog(err.response),"error")
    //     reject(err.response)
    // })
    });
}
