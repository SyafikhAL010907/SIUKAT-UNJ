import axios from 'axios';
import { service, notif, errLog } from '../global';

export function fetchInfo() {
    return new Promise((resolve, reject) => {
        axios.get(service + '/info')
            .then((response) => {
                resolve(response?.data);
            })
            .catch((err) => {
                notif('Terjadi kesalahan!', errLog(err?.response), 'error');
                reject(err.response);
            });
    });
}