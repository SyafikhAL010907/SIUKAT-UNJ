import { rekapitulasi } from '../api'

export function fetchDataFakultas(token, tahun, jalur) {
    return {
        type: "FETCH_REKAP_FAKULTAS",
        payload: rekapitulasi.fetchDataFakultas(token, tahun, jalur)
    }
}

export function fetchDataProdi(token, tahun, jalur) {
    return {
        type: "FETCH_REKAP_PRODI",
        payload: rekapitulasi.fetchDataProdi(token, tahun, jalur)
    }
}