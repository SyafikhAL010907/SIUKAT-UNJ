import { notif, errLog } from '../global';
import { bio_cmahasiswa, bio_kabkot, bio_kecamatan } from '../api';

export function getByLoggedIn(token) {
    return {
        type: 'FETCH_BIO_CMAHASISWA',
        payload: bio_cmahasiswa.getByLoggedIn(token),
    };
}

export function updateData(token, input) {
    return {
        type: 'FETCH_BIO_CMAHASISWA',
        payload: bio_cmahasiswa.updateData(token, input).then((response) => {
            return bio_cmahasiswa.getByLoggedIn(token);
        }),
    };
}

export function fetchAllData(token) {
    return function (dispatch) {
        bio_cmahasiswa
            .getByLoggedIn(token)
            .then((response) => {
                dispatch({
                    type: 'FETCH_BIO_CMAHASISWA_FULFILLED',
                    payload: response,
                });

                bio_kabkot
                    .fetchBioKabkot(response.kode_provinsi)
                    .then((response) => {
                        dispatch({
                            type: 'FETCH_BIO_KABKOT_MHS_FULFILLED',
                            payload: response,
                        });
                    })
                    .catch((err) => {
                        notif('Terjadi kesalahan!', errLog(err), 'error');
                        dispatch({
                            type: 'FETCH_BIO_KABKOT_MHS_REJECTED',
                            payload: err,
                        });
                    });

                bio_kecamatan
                    .fetchBioKecamatan(response.kode_kabkot)
                    .then((response) => {
                        dispatch({
                            type: 'FETCH_BIO_KECAMATAN_MHS_FULFILLED',
                            payload: response,
                        });
                    })
                    .catch((err) => {
                        notif('Terjadi kesalahan!', errLog(err), 'error');
                        dispatch({
                            type: 'FETCH_BIO_KECAMATAN_MHS_REJECTED',
                            payload: err,
                        });
                    });
            })
            .catch((err) => {
                notif('Terjadi kesalahan!', errLog(err), 'error');
                dispatch({
                    type: 'FETCH_BIO_CMAHASISWA_REJECTED',
                    payload: err,
                });
            });
    };
}

export function checkDataComplete(token) {
    return {
        type: 'FETCH_BIO_VERIFIKASI',
        payload: bio_cmahasiswa.checkDataComplete(token),
    };
}

export function selesaiIsi(token) {
    return {
        type: 'FETCH_BIO_CMAHASISWA',
        payload: bio_cmahasiswa.selesai(token).then((response) => {
            return bio_cmahasiswa.getByLoggedIn(token);
        }),
    };
}
