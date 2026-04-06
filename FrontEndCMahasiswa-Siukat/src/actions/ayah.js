import { notif, errLog } from '../global';
import { ayah, kabkot, kecamatan } from '../api';

export function getByLoggedIn(token){
    return {
        type: 'FETCH_AYAH',
        payload: ayah.getByLoggedIn(token)
    };
}

export function fetchAllData(token){
    return function(dispatch){
        ayah.getByLoggedIn(token).then((response) => {
            dispatch({
                type: 'FETCH_AYAH_FULFILLED',
                payload: response
            });

            kabkot.fetchKabkot(response.provinsi_ayah).then((response) => {
                dispatch({
                    type: 'FETCH_KABKOT_AYAH_FULFILLED',
                    payload: response
                });
            }).catch((err) => {
                notif('Terjadi kesalahan!', errLog(err), 'error');
                dispatch({
                    type: 'FETCH_KABKOT_AYAH_REJECTED',
                    payload: err
                });
            });

            kecamatan.fetchKecamatan(response.kabkot_ayah).then((response) => {
                dispatch({
                    type: 'FETCH_KECAMATAN_AYAH_FULFILLED',
                    payload: response
                });
            }).catch((err) => {
                notif('Terjadi kesalahan!', errLog(err), 'error');
                dispatch({
                    type: 'FETCH_KECAMATAN_AYAH_REJECTED',
                    payload: err
                });
            });
        }).catch((err) => {
            notif('Terjadi kesalahan!', errLog(err), 'error');
            dispatch({
                type: 'FETCH_AYAH_REJECTED',
                payload: err
            });
        });
    };
}

export function updateData(token, input){
    return {
        type: 'FETCH_AYAH',
        payload: ayah.updateData(token, input).then((response) => {
            return ayah.getByLoggedIn(token);
        })
    };
}