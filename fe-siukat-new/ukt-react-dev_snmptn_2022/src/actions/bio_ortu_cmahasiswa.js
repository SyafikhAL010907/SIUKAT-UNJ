import { notif, errLog } from '../global';
import { bio_ortu_cmahasiswa, bio_kabkot, bio_kecamatan } from '../api';

export function getByLoggedIn(token) {
    return {
        type: 'FETCH_BIO_ORTU_CMAHASISWA',
        payload: bio_ortu_cmahasiswa.getByLoggedIn(token),
    };
}

export function updateData(token, input) {
    return {
        type: 'FETCH_BIO_ORTU_CMAHASISWA',
        payload: bio_ortu_cmahasiswa.updateData(token, input).then((response) => {
            return bio_ortu_cmahasiswa.getByLoggedIn(token);
        }),
    };
}

export function fetchAllData(token) {
    return function (dispatch) {
        bio_ortu_cmahasiswa
            .getByLoggedIn(token)
            .then((response) => {
                dispatch({
                    type: 'FETCH_BIO_ORTU_CMAHASISWA_FULFILLED',
                    payload: response,
                });

                bio_kabkot
                    .fetchBioKabkot(response.kode_provinsi)
                    .then((response) => {
                        dispatch({
                            type: 'FETCH_BIO_KABKOT_ORANGTUA_FULFILLED',
                            payload: response,
                        });
                    })
                    .catch((err) => {
                        notif('Terjadi kesalahan!', errLog(err), 'error');
                        dispatch({
                            type: 'FETCH_BIO_KABKOT_ORANGTUA_REJECTED',
                            payload: err,
                        });
                    });

                bio_kecamatan
                    .fetchBioKecamatan(response.kode_kabkot)
                    .then((response) => {
                        dispatch({
                            type: 'FETCH_BIO_KECAMATAN_ORANGTUA_FULFILLED',
                            payload: response,
                        });
                    })
                    .catch((err) => {
                        notif('Terjadi kesalahan!', errLog(err), 'error');
                        dispatch({
                            type: 'FETCH_BIO_KECAMATAN_ORANGTUA_REJECTED',
                            payload: err,
                        });
                    });
            })
            .catch((err) => {
                notif('Terjadi kesalahan!', errLog(err), 'error');
                dispatch({
                    type: 'FETCH_BIO_ORTU_CMAHASISWA_REJECTED',
                    payload: err,
                });
            });
    };
}
