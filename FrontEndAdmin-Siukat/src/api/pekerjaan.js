import axios from 'axios'
import { service, notif, errLog } from '../global'

export function fetchPekerjaan(id){
    return new Promise((resolve, reject) => {
        axios.get(service+'/pekerjaan/all')
            .then((response) => {
                resolve(response.data)
            })
            .catch((err) => {
                notif("Terjadi kesalahan!", errLog(err.response),"error")                
                reject(err.response)
            })
    })
}