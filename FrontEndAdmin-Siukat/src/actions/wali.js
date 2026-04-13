import { wali, kabkot, kecamatan } from '../api'
import { notif, errLog } from '../global'

export function fetchAllData(token, id, atribut = ""){
    return function(dispatch){
        wali.getById(token, id, atribut).then((response) => {
            dispatch({
                type: "FETCH_WALI_FULFILLED",
                payload: response
            })

            kabkot.fetchKabkot(response.provinsi_wali).then((response) => {
                dispatch({
                    type: "FETCH_KABKOT_WALI_FULFILLED",
                    payload: response
                })
            }).catch((err) => {
                notif("Terjadi kesalahan!", errLog(err.response), "error")
                dispatch({
                    type: "FETCH_KABKOT_WALI_REJECTED",
                    payload: err
                })
            })

            kecamatan.fetchKecamatan(response.kabkot_wali).then((response) => {
                dispatch({
                    type: "FETCH_KECAMATAN_WALI_FULFILLED",
                    payload: response
                })
            }).catch((err) => {
                notif("Terjadi kesalahan!", errLog(err.response), "error")
                dispatch({
                    type: "FETCH_KECAMATAN_WALI_REJECTED",
                    payload: err
                })
            })
        }).catch((err) => {
            notif("Terjadi kesalahan!", errLog(err.response), "error")
            dispatch({
                type: "FETCH_WALI_REJECTED",
                payload: err
            })
        })
    }
}

export function updateData(token, input, id, atribut = ""){
    return {
        type: "FETCH_WALI",
        payload: wali.updateData(token, input, id).then((response) => {
            return wali.getById(token, id, atribut)
        })
    }
}