import axios from 'axios';
import { service } from '../global';

export function fetchProvinsi() {
    return new Promise((resolve, reject) => {
        axios.get(service + '/provinsi/all')
            .then((response) => {
                resolve(response.data);
            });
        // .catch((err) => {
        //     notif("Terjadi kesalahan!", errLog(err.response),"error")                
        //     reject(err.response)
        // })
    });
}