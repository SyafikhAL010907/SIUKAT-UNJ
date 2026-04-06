import { provinsi } from '../api'

export function fetchProvinsi(){
    return {
        type: "FETCH_PROVINSI",
        payload: provinsi.fetchProvinsi()
    }
}