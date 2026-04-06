import { rekapitulasi } from '../api'

export function fetchDataFakultas(token){      
    return {
        type: "FETCH_REKAP_FAKULTAS",
        payload: rekapitulasi.fetchDataFakultas(token)
    }
}
export function fetchDataProdi(token){      
    return {
        type: "FETCH_REKAP_PRODI",
        payload: rekapitulasi.fetchDataProdi(token)
    }
}