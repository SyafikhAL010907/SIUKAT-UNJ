import { notif, errLog } from '../global';
import { cmahasiswa, kabkot, kecamatan } from '../api';

export function getByLoggedIn(token){
    return {
        type: 'FETCH_CMAHASISWA',
        payload: cmahasiswa.getByLoggedIn(token)
    };
}

export function updateData(token, input){
    return {
        type: 'FETCH_CMAHASISWA',
        payload: cmahasiswa.updateData(token, input).then((response) => {
            return cmahasiswa.getByLoggedIn(token);
        })
    };
}

export function fetchAllData(token){
    return function(dispatch){
        cmahasiswa.getByLoggedIn(token).then((response) => {
            dispatch({
                type: 'FETCH_CMAHASISWA_FULFILLED',
                payload: response
            });

            kabkot.fetchKabkot(response.provinsi_cmahasiswa).then((response) => {
                dispatch({
                    type: 'FETCH_KABKOT_MHS_FULFILLED',
                    payload: response
                });
            }).catch((err) => {
                notif('Terjadi kesalahan!', errLog(err), 'error');   
                dispatch({
                    type: 'FETCH_KABKOT_MHS_REJECTED',
                    payload: err
                });
            });

            kecamatan.fetchKecamatan(response.kabkot_cmahasiswa).then((response) => {
                dispatch({
                    type: 'FETCH_KECAMATAN_MHS_FULFILLED',
                    payload: response
                });
            }).catch((err) => {
                notif('Terjadi kesalahan!', errLog(err), 'error');   
                dispatch({
                    type: 'FETCH_KECAMATAN_MHS_REJECTED',
                    payload: err
                });
            });
        }).catch((err) => {
            notif('Terjadi kesalahan!', errLog(err), 'error');
            dispatch({
                type: 'FETCH_CMAHASISWA_REJECTED',
                payload: err
            });
        });
    };
}

export function updateFlagUktTinggi(data, token){
    return {
        type: 'FETCH_CMAHASISWA',
        payload: cmahasiswa.updateFlagUktTinggi(data, token).then((response) => {
            return cmahasiswa.getByLoggedIn(token);
        })
    };
}

export function updateFlagUktRendah(token){
    return {
        type: 'FETCH_CMAHASISWA',
        payload: cmahasiswa.updateFlagUktRendah(token).then((response) => {
            return cmahasiswa.getByLoggedIn(token);
        })
    };
}

export function checkDataComplete(token){
    return {
        type: 'FETCH_VERIFIKASI',
        payload: cmahasiswa.checkDataComplete(token)
    };    
}

export function rendahSelesai(token){
    return {
        type: 'FETCH_CMAHASISWA',
        payload: cmahasiswa.rendahSelesai(token).then((response) => {
            return cmahasiswa.getByLoggedIn(token);
        })
    };
}

export function tinggiSelesai(token){
    return {
        type: 'FETCH_CMAHASISWA',
        payload: cmahasiswa.tinggiSelesai(token).then((response) => {
            return cmahasiswa.getByLoggedIn(token);
        })
    };
}

export function terimaUkt(token){
    return {
        type: 'FETCH_CMAHASISWA',
        payload: cmahasiswa.terimaUkt(token).then((response) => {
            return cmahasiswa.getByLoggedIn(token);
        })
    };
}

export function sanggahUkt(token){
    return {
        type: 'FETCH_CMAHASISWA',
        payload: cmahasiswa.sanggahUkt(token).then((response) => {
            return cmahasiswa.getByLoggedIn(token);
        })
    };
}