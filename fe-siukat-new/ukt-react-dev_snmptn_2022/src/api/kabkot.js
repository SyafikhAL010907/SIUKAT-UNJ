import axios from 'axios';
import { service, notif, errLog } from '../global';

export function fetchKabkot(id) {
    // Sanitize ID (remove leading colon if present)
    const cleanId = typeof id === 'string' && id.startsWith(':') ? id.slice(1) : id;
    
    return new Promise((resolve, reject) => {
        if (!cleanId || cleanId === 'undefined') {
            resolve([]);
            return;
        }
        axios.get(service + '/kabkot/provinsi_id/' + cleanId)
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                notif('Terjadi kesalahan!', errLog(err.response), 'error');
                reject(err.response);
            });
    });
}