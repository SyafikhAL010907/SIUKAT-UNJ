import axios from 'axios';
import {
    service,
    cookies,
    cookieName,
    notif,
    errLog,
    dateConverter,
} from '../global';

export function getByLoggedIn(token) {
    return new Promise((resolve, reject) => {
        axios
            .get(service + '/biodata/cmahasiswa/getUser', {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            })
            .then((response) => {
                response.data.tanggal_lahir_cmahasiswa = dateConverter(
                    response.data.tanggal_lahir_cmahasiswa
                );
                resolve(response.data);
            })
            .catch((err) => {
                cookies.remove(cookieName, { path: '/' });
                notif('Terjadi kesalahan!', errLog(err.response), 'error');
                reject(err.response);
            });
    });
}

export function updateData(token, input) {
    console.log(input);
    return new Promise((resolve, reject) => {
        axios
            .put(service + '/biodata/cmahasiswa/edit', input, {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            })
            .then((response) => {
                console.log(response);
                notif('Berhasil!', 'Data berhasil tersimpan', 'success');
                resolve(response.data);
            })
            .catch((err) => {
                console.log(err.response);
                notif('Terjadi kesalahan!', errLog(err.response), 'error');
                reject(err.response);
            });
    });
}

export function checkDataComplete(token) {
    return new Promise((resolve, reject) => {
        axios
            .get(service + '/biodata/cmahasiswa/verifikasi', {
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

export function selesai(token) {
    return new Promise((resolve, reject) => {
        axios
            .put(
                service + '/biodata/cmahasiswa/selesai',
                {},
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                }
            )
            .then((response) => {
                notif('Berhasil!', response.data, 'success');
                resolve(response.data);
            })
            .catch((err) => {
                notif('Terjadi kesalahan!', errLog(err.response), 'error');
                reject(err.response);
            });
    });
}
