import axios from 'axios'
import { service, notif, errLog } from '../global'

export function fetchKecamatan(id){
    return new Promise((resolve, reject) => {
        axios.get(service+'/kecamatan/kab_id/'+id)
            .then((response) => {
                resolve(response.data)
            })
            .catch((err) => {
                notif("Terjadi kesalahan!", errLog(err.response),"error")                
                reject(err.response)
            })
    })
}