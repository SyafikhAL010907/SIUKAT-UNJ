import axios from 'axios';
import { service, notif, errLog } from '../global';

export function fetchInfo(kode) {
    const query = kode ? '?kode=' + kode : '';
    return new Promise((resolve, reject) => {
        axios.get(service + '/info' + query)
            .then((response) => {
                resolve(response?.data);
            })
            .catch((err) => {
                notif('Terjadi kesalahan!', errLog(err?.response), 'error');
                reject(err.response);
            });
    });
}