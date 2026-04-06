import { notif, errLog } from '../global'
import { ibu, kabkot, kecamatan } from '../api'

export function updateData(token, input, id){
    return {
        type: "FETCH_IBU",
        payload: ibu.updateData(token, input, id).then((response) => {
            return ibu.getById(token, id)
        })
    }
}

export function fetchAllData(token, id){
    return function(dispatch){
        ibu.getById(token, id).then((response) => {
            dispatch({
                type: "FETCH_IBU_FULFILLED",
                payload: response
            })

            kabkot.fetchKabkot(response.provinsi_ibu).then((response) => {
                dispatch({
                    type: "FETCH_KABKOT_IBU_FULFILLED",
                    payload: response
                })
            }).catch((err) => {
                notif("Terjadi kesalahan!", errLog(err.response), "error")
                dispatch({
                    type: "FETCH_KABKOT_IBU_REJECTED",
                    payload: err
                })
            })

            kecamatan.fetchKecamatan(response.kabkot_ibu).then((response) => {
                dispatch({
                    type: "FETCH_KECAMATAN_IBU_FULFILLED",
                    payload: response
                })
            }).catch((err) => {
                notif("Terjadi kesalahan!", errLog(err.response), "error")
                dispatch({
                    type: "FETCH_KECAMATAN_IBU_REJECTED",
                    payload: err
                })
            })
        }).catch((err) => {
            notif("Terjadi kesalahan!", errLog(err.response), "error")
            dispatch({
                type: "FETCH_IBU_REJECTED",
                payload: err
            })
        })
    }
}