import { notif, errLog, getToken } from '../global';
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
    const activeToken = token || getToken();
    console.log('DEBUG ACTION: updateFlagUktTinggi - Active Token:', activeToken);
    return {
        type: 'FETCH_CMAHASISWA',
        payload: cmahasiswa.updateFlagUktTinggi(data, activeToken).then((response) => {
            return cmahasiswa.getByLoggedIn(activeToken);
        })
    };
}

export function updateFlagUktRendah(token){
    const activeToken = token || getToken();
    console.log('DEBUG ACTION: updateFlagUktRendah - Active Token:', activeToken);
    return {
        type: 'FETCH_CMAHASISWA',
        payload: cmahasiswa.updateFlagUktRendah(activeToken).then((response) => {
            return cmahasiswa.getByLoggedIn(activeToken);
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