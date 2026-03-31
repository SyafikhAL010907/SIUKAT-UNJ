import { notif, errLog } from '../global';
import { bio_sekolah_cmahasiswa } from '../api';

export function getByLoggedIn(token) {
    return {
        type: 'FETCH_BIO_SEKOLAH_CMAHASISWA',
        payload: bio_sekolah_cmahasiswa.getByLoggedIn(token),
    };
}

export function updateData(token, input) {
    return {
        type: 'FETCH_BIO_SEKOLAH_CMAHASISWA',
        payload: bio_sekolah_cmahasiswa
            .updateData(token, input)
            .then((response) => {
                return bio_sekolah_cmahasiswa.getByLoggedIn(token);
            }),
    };
}

export function fetchAllData(token) {
    return function (dispatch) {
        bio_sekolah_cmahasiswa
            .getByLoggedIn(token)
            .then((response) => {
                dispatch({
                    type: 'FETCH_BIO_SEKOLAH_CMAHASISWA_FULFILLED',
                    payload: response,
                });
            })
            .catch((err) => {
                notif('Terjadi kesalahan!', errLog(err), 'error');
                dispatch({
                    type: 'FETCH_BIO_SEKOLAH_CMAHASISWA_REJECTED',
                    payload: err,
                });
            });
    };
}
