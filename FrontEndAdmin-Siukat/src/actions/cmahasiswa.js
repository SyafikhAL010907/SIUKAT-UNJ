import { notif, errLog } from '../global'
import { cmahasiswa, kabkot, kecamatan } from '../api'

export function fetchCmahasiswa(token, pageKeyword){
    return {
        type: "FETCH_CMAHASISWA",
        payload: cmahasiswa.fetchCmahasiswa(token, pageKeyword)
    }
}
export function fetchKlarifikasi(token, pageKeyword){
    return {
        type: "FETCH_CMAHASISWA",
        payload: cmahasiswa.fetchKlarifikasi(token, pageKeyword)
    }
}
export function fetchAllData(token, id){
    return function(dispatch){
        cmahasiswa.getById(token, id).then((response) => {
            dispatch({
                type: "FETCH_SINGLE_CMAHASISWA_FULFILLED",
                payload: response
            })

            kabkot.fetchKabkot(response.provinsi_cmahasiswa).then((response) => {
                dispatch({
                    type: "FETCH_KABKOT_MHS_FULFILLED",
                    payload: response
                })
            }).catch((err) => {
                notif("Terjadi kesalahan!", errLog(err.response), "error")   
                dispatch({
                    type: "FETCH_KABKOT_MHS_REJECTED",
                    payload: err
                })
            })

            kecamatan.fetchKecamatan(response.kabkot_cmahasiswa).then((response) => {
                dispatch({
                    type: "FETCH_KECAMATAN_MHS_FULFILLED",
                    payload: response
                })
            }).catch((err) => {
                notif("Terjadi kesalahan!", errLog(err.response), "error")   
                dispatch({
                    type: "FETCH_KECAMATAN_MHS_REJECTED",
                    payload: err
                })
            })
        }).catch((err) => {
            notif("Terjadi kesalahan!", errLog(err.response), "error")
            dispatch({
                type: "FETCH_SINGLE_CMAHASISWA_REJECTED",
                payload: err
            })
        })
    }
}
export function getById(token, id){
    return {
        type: "FETCH_SINGLE_CMAHASISWA",
        payload: cmahasiswa.getById(token, id)
    }
}
export function updateData(token, input, id){
    return {
        type: "FETCH_SINGLE_CMAHASISWA",
        payload: cmahasiswa.updateData(token, input, id).then((response) => {
            return cmahasiswa.getById(token, id)
        })
    }
}
export function flagCount(token){
    return {
        type: "FETCH_FLAG_COUNT",
        payload: cmahasiswa.flagCount(token)
    }
}
export function flagBatalKlarifikasi(token, id){
    return {
        type: "FETCH_SINGLE_CMAHASISWA",
        payload: cmahasiswa.flagBatalKlarifikasi(token, id).then((response) => {
            return cmahasiswa.getById(token, id)
        })
    }
}
export function flagSelesaiKlarifikasi(token, id){
    return {
        type: "FETCH_SINGLE_CMAHASISWA",
        payload: cmahasiswa.flagSelesaiKlarifikasi(token, id).then((response) => {
            return cmahasiswa.getById(token, id)
        })
    }
}
