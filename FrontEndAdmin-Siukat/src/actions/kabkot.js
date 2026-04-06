import { kabkot } from '../api'

export function fetchForCmahasiswa(id){
    return {
        type: "FETCH_KABKOT_MHS",
        payload: kabkot.fetchKabkot(id)
    }
}

export function fetchForAyah(id){
    return {
        type: "FETCH_KABKOT_AYAH",
        payload: kabkot.fetchKabkot(id)
    }
}

export function fetchForIbu(id){
    return {
        type: "FETCH_KABKOT_IBU",
        payload: kabkot.fetchKabkot(id)
    }
}

export function fetchForWali(id){
    return {
        type: "FETCH_KABKOT_WALI",
        payload: kabkot.fetchKabkot(id)
    }
}