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
            .get(service + '/users/getUser', {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            })
            .then((response) => {
                console.log('DEBUG API: getByLoggedIn Response:', response.data);
                if (response.data && typeof response.data === 'object') {
                    // Check if it's a student or admin (student has no_peserta)
                    const data = response.data;
                    
                    // Safe conversion of date
                    if (data.tanggal_lahir_cmahasiswa) {
                        data.tanggal_lahir_cmahasiswa = dateConverter(
                            data.tanggal_lahir_cmahasiswa
                        );
                    }
                    resolve(data);
                } else {
                    const errorMsg = 'Format data dari server tidak sesuai atau kosong';
                    notif('Terjadi kesalahan!', errorMsg, 'error');
                    console.error('ERROR API: Invalid response structure:', response.data);
                    reject(errorMsg);
                }
            })
            .catch((err) => {
                console.error('ERROR API: getByLoggedIn Catch:', err);
                // Pass the whole error object to errLog
                const errorMessage = errLog(err);
                
                // Only remove cookies if it's an Auth error (401)
                if (err.response?.status === 401) {
                    cookies.remove(cookieName, { path: '/' });
                }
                
                notif('Terjadi kesalahan!', errorMessage, 'error');
                reject(err);
            });
    });
}

export function updateData(token, input) {
    console.log(input);
    return new Promise((resolve, reject) => {
        axios
            .put(service + '/cmahasiswa/edit', input, {
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

export function updateFlagUktTinggi(data, token) {
    console.log('DEBUG API: updateFlagUktTinggi - Token:', token);
    return new Promise((resolve, reject) => {
        axios
            .put(service + '/cmahasiswa/ukt-tinggi', data, {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            })
            .then((response) => {
                notif(
                    'Berhasil!',
                    'Anda telah memilih Bersedia UKT Kelompok Atas',
                    'success'
                );
                resolve(response);
            })
            .catch((err) => {
                notif('Terjadi kesalahan!', errLog(err.response), 'error');
                reject(err.response);
            });
    });
}

export function updateFlagUktRendah(token) {
    console.log('DEBUG API: updateFlagUktRendah - Token:', token);
    return new Promise((resolve, reject) => {
        axios
            .put(
                service + '/cmahasiswa/ukt-tinggi-tidak',
                {},
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                }
            )
            .then((response) => {
                notif(
                    'Berhasil!',
                    'Anda telah memilih Tidak Bersedia UKT Kelompok Atas',
                    'success'
                );
                resolve(response);
            })
            .catch((err) => {
                notif('Terjadi kesalahan!', errLog(err.response), 'error');
                reject(err.response);
            });
    });
}

export function checkDataComplete(token) {
    return new Promise((resolve, reject) => {
        axios
            .get(service + '/cmahasiswa/verifikasi', {
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

export function rendahSelesai(token) {
    return new Promise((resolve, reject) => {
        axios
            .put(
                service + '/ukt/rendah-selesai',
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

export function tinggiSelesai(token) {
    return new Promise((resolve, reject) => {
        axios
            .put(
                service + '/ukt/tinggi-selesai',
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

export function terimaUkt(token) {
    return new Promise((resolve, reject) => {
        axios
            .put(
                service + '/cmahasiswa/flag-terima',
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

export function sanggahUkt(token) {
    return new Promise((resolve, reject) => {
        axios
            .put(
                service + '/cmahasiswa/flag-klarifikasi',
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
