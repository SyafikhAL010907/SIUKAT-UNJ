import { wali, kabkot, kecamatan } from '../api';
import { notif, errLog } from '../global';

export function getByLoggedIn(token){
    return {
        type: 'FETCH_WALI',
        payload: wali.getByLoggedIn(token)
    };
}

export function fetchAllData(token){
    return function(dispatch){
        wali.getByLoggedIn(token).then((response) => {
            dispatch({
                type: 'FETCH_WALI_FULFILLED',
                payload: response
            });

            kabkot.fetchKabkot(response.provinsi_wali).then((response) => {
                dispatch({
                    type: 'FETCH_KABKOT_WALI_FULFILLED',
                    payload: response
                });
            }).catch((err) => {
                notif('Terjadi kesalahan!', errLog(err), 'error');
                dispatch({
                    type: 'FETCH_KABKOT_WALI_REJECTED',
                    payload: err
                });
            });

            kecamatan.fetchKecamatan(response.kabkot_wali).then((response) => {
                dispatch({
                    type: 'FETCH_KECAMATAN_WALI_FULFILLED',
                    payload: response
                });
            }).catch((err) => {
                notif('Terjadi kesalahan!', errLog(err), 'error');
                dispatch({
                    type: 'FETCH_KECAMATAN_WALI_REJECTED',
                    payload: err
                });
            });
        }).catch((err) => {
            notif('Terjadi kesalahan!', errLog(err), 'error');
            dispatch({
                type: 'FETCH_WALI_REJECTED',
                payload: err
            });
        });
    };
}

export function updateData(token, input){
    return {
        type: 'FETCH_WALI',
        payload: wali.updateData(token, input).then((response) => {
            return wali.getByLoggedIn(token);
        })
    };
}