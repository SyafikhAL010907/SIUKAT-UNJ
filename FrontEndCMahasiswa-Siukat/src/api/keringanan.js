import axios from 'axios';
import {
    service,
    cookies,
    cookieName,
    notif,
    errLog,
    dateConverter,
} from '../global';

export function updateData(token, input) {
    console.log(input);
    return new Promise((resolve, reject) => {
        axios
            .put(service + '/keringanan/edit', input, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                notif('Berhasil!', 'Data berhasil tersimpan', 'success');
                resolve(response.data);
            })
            .catch((err) => {
                notif('Terjadi kesalahan!', errLog(err.response), 'error');
                reject(err.response);
            });
    });
}

export function getData(token) {
    return new Promise((resolve, reject) => {
        axios
            .get(service + '/keringanan/get-keringanan ', {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                notif('Terjadi kesalahan!', errLog(err.response), 'error');
                reject(err.response);
            });
    });
}