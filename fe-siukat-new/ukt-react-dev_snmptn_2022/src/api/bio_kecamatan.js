import axios from 'axios';
import { service, notif, errLog } from '../global';

export function fetchBioKecamatan(id) {
    return new Promise((resolve, reject) => {
        axios
            .get(service + '/kecamatan/bio/kab_id/' + id)
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                notif('Terjadi kesalahan!', errLog(err.response), 'error');
                reject(err.response);
            });
    });
}
