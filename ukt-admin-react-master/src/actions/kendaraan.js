import { kendaraan } from '../api'

export function getById(token, id){
    return {
        type: "FETCH_KENDARAAN",
        payload: kendaraan.getById(token, id)
    }
}

export function updateData(token, input, id){
    return {
        type: "FETCH_KENDARAAN",
        payload: kendaraan.updateData(token, input, id).then((response) => {
            return kendaraan.getById(token, id)
        })
    }
}