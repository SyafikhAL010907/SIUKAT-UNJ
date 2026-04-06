import axios from 'axios'
import { service, notif, errLog } from '../global'


export function flagHitung(token,id){
    return new Promise((resolve, reject) => {
        axios.get(service+'/cmahasiswa/just-compute/'+id, {
            headers: {
                "Authorization": "Bearer "+token
            }
        })
        .then((response) => {
            resolve(response.data)
        })
        .catch((err) => {
            reject(err.response)
        })
    })
}