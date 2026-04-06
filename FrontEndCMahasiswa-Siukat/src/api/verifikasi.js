import axios from 'axios';
import { service, notif, errLog } from '../global';

export function fetchVerifikasi(token){
    return new Promise((resolve, reject) => {
        axios.get(service + '/verifikasi', {
            headers: {
                'Authorization': 'Bearer '+token
            }
        })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                notif('Terjadi kesalahan!', errLog(err.response),'error');            
                reject(err.response);
            });
    });
}
