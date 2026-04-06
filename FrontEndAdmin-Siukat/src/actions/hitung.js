import { hitung } from '../api'

export function flagHitung(token,id){
    return {
        type: "FETCH_HITUNG",
        payload: hitung.flagHitung(token,id)
    }
}