import axios from 'axios';
import { service, notif, errLog } from '../global';
import FileDownload from 'react-file-download';

export function unduhBuktiSelesai(token) {
    return new Promise((resolve, reject) => {
        axios.get(service + '/pdf/bukti-selesai', {
            headers: {
                'Authorization': 'Bearer ' + token
            },
            responseType: 'arraybuffer'
        })
            .then((response) => {
                FileDownload(response.data, 'Bukti-Selesai.pdf');
                resolve(response.data);
            })
            .catch((err) => {
                notif('Terjadi kesalahan!', errLog(err.response), 'error');
                reject(err.response);
            });
    });
}

export function unduhSuratKebenaran(token) {
    return new Promise((resolve, reject) => {
        axios.get(service + '/pdf/surat-validasi', {
            headers: {
                'Authorization': 'Bearer ' + token
            },
            responseType: 'arraybuffer'
        })
            .then((response) => {
                FileDownload(response.data, 'Surat-Pernyataan-Kebenaran-Data.pdf');
                resolve(response.data);
            })
            .catch((err) => {
                notif('Terjadi kesalahan!', errLog(err.response), 'error');
                reject(err.response);
            });
    });
}

export function unduhSlipPembayaran(token) {
    return new Promise((resolve, reject) => {
        axios.get(service + '/pdf/slip-pembayaran', {
            headers: {
                'Authorization': 'Bearer ' + token
            },
            responseType: 'arraybuffer'
        })
            .then((response) => {
                FileDownload(response.data, 'Slip-Pembayaran.pdf');
                resolve(response.data);
            })
            .catch((err) => {
                notif('Terjadi kesalahan!', errLog(err.response), 'error');
                reject(err.response);
            });
    });
}

export function unduhSuratPernyataanUKTAtas(token) {
    return new Promise((resolve, reject) => {
        axios.get(service + '/pdf/surat-pernyataan-ukt-atas', {
            headers: {
                'Authorization': 'Bearer ' + token
            },
            responseType: 'arraybuffer'
        })
            .then((response) => {
                FileDownload(response.data, 'Surat-Pernyataan-UKT-Atas.pdf');
                resolve(response.data);
            })
            .catch((err) => {
                notif('Terjadi kesalahan!', errLog(err.response), 'error');
                reject(err.response);
            });
    });
}

export function unduhWali() {
    return new Promise((resolve, reject) => {
        axios.get(service + '/pdf/wali', {
            responseType: 'arraybuffer'
        })
            .then((response) => {
                FileDownload(response.data, 'Surat-Pernyataan-Komitmen-Wali.pdf');
                resolve(response.data);
            })
            .catch((err) => {
                notif('Terjadi kesalahan!', errLog(err.response), 'error');
                reject(err.response);
            });
    });
}

export function unduhKontrak() {
    return new Promise((resolve, reject) => {
        axios.get(service + '/pdf/kontrak', {
            responseType: 'arraybuffer'
        })
            .then((response) => {
                FileDownload(response.data, 'Surat-Perjanjian-Kontrak.pdf');
                resolve(response.data);
            })
            .catch((err) => {
                notif('Terjadi kesalahan!', errLog(err.response), 'error');
                reject(err.response);
            });
    });
}

export function unduhRegistrasi(param) {
    return new Promise((resolve, reject) => {
        axios.get(service + '/pdf/pengumuman-' + param, {
            responseType: 'arraybuffer'
        })
            .then((response) => {
                const year = new Date().getFullYear();
                FileDownload(response.data, 'Pengumuman-Registrasi-' + param.toUpperCase() + '-' + year + '.pdf');
                resolve(response.data);
            })
            .catch((err) => {
                notif('Terjadi kesalahan!', errLog(err.response), 'error');
                reject(err.response);
            });
    });
}