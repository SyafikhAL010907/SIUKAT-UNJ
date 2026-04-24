import axios from 'axios';
import { service, notif, errLog } from '../global';
import FileDownload from 'react-file-download';

export function unduhBuktiSelesai(token) {
    const url = service + '/pdf/bukti-selesai?token=' + token + '&t=' + Date.now();
    window.open(url, '_blank');
    return Promise.resolve();
}

export function unduhSuratKebenaran(token) {
    const url = service + '/pdf/surat-validasi?token=' + token + '&t=' + Date.now();
    window.open(url, '_blank');
    return Promise.resolve();
}

export function unduhSlipPembayaran(token) {
    const url = service + '/pdf/slip-pembayaran?token=' + token + '&t=' + Date.now();
    window.open(url, '_blank');
    return Promise.resolve();
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

export function unduhWali(token) {
    const url = service + '/pdf/wali?token=' + token + '&t=' + Date.now();
    window.open(url, '_blank');
    return Promise.resolve();
}

export function unduhKontrak(token) {
    const url = service + '/pdf/kontrak?token=' + token + '&t=' + Date.now();
    window.open(url, '_blank');
    return Promise.resolve();
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