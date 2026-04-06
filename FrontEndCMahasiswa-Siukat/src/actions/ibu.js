import { notif, errLog } from '../global';
import { ibu, kabkot, kecamatan } from '../api';

export function getByLoggedIn(token){
    return {
        type: 'FETCH_IBU',
        payload: ibu.getByLoggedIn(token)
    };
}

export function updateData(token, input){
    return {
        type: 'FETCH_IBU',
        payload: ibu.updateData(token, input).then((response) => {
            return ibu.getByLoggedIn(token);
        })
    };
}

export function fetchAllData(token){
    return function(dispatch){
        ibu.getByLoggedIn(token).then((response) => {
            dispatch({
                type: 'FETCH_IBU_FULFILLED',
                payload: response
            });

            kabkot.fetchKabkot(response.provinsi_ibu).then((response) => {
                dispatch({
                    type: 'FETCH_KABKOT_IBU_FULFILLED',
                    payload: response
                });
            }).catch((err) => {
                notif('Terjadi kesalahan!', errLog(err), 'error');
                dispatch({
                    type: 'FETCH_KABKOT_IBU_REJECTED',
                    payload: err
                });
            });

            kecamatan.fetchKecamatan(response.kabkot_ibu).then((response) => {
                dispatch({
                    type: 'FETCH_KECAMATAN_IBU_FULFILLED',
                    payload: response
                });
            }).catch((err) => {
                notif('Terjadi kesalahan!', errLog(err), 'error');
                dispatch({
                    type: 'FETCH_KECAMATAN_IBU_REJECTED',
                    payload: err
                });
            });
        }).catch((err) => {
            notif('Terjadi kesalahan!', errLog(err), 'error');
            dispatch({
                type: 'FETCH_IBU_REJECTED',
                payload: err
            });
        });
    };
}