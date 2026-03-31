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
            .get(service + '/ortu/cmahasiswa/getUser', {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            })
            .then((response) => {
                response.data.tanggal_lahir_ayah = dateConverter(
                    response.data.tanggal_lahir_ayah
                );
                response.data.tanggal_lahir_ibu = dateConverter(
                    response.data.tanggal_lahir_ibu
                );
                response.data.tanggal_lahir_wali = dateConverter(
                    response.data.tanggal_lahir_wali
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
    return new Promise((resolve, reject) => {
        axios
            .put(service + '/ortu/cmahasiswa/edit', input, {
                headers: {
                    Authorization: 'Bearer ' + token,
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
