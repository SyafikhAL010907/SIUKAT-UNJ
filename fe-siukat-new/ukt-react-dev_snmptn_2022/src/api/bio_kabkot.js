import axios from 'axios';
import { service, notif, errLog } from '../global';

export function fetchBioKabkot(id) {
    return new Promise((resolve, reject) => {
        axios
            .get(service + '/kabkot/bio/provinsi_id/' + id)
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                notif('Terjadi kesalahan!', errLog(err.response), 'error');
                reject(err.response);
            });
    });
}
