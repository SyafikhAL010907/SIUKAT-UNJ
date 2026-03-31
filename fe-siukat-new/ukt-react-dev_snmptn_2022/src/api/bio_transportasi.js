import axios from 'axios';
import { service, notif, errLog } from '../global';

export function fetchBioTransportasi() {
    return new Promise((resolve, reject) => {
        axios
            .get(service + '/transportasi/bio/all')
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                notif('Terjadi kesalahan!', errLog(err.response), 'error');
                reject(err.response);
            });
    });
}
