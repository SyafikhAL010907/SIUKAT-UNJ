import axios from 'axios'
import { service } from '../global'


export function flagHitung(token,id){
    return new Promise((resolve, reject) => {
        axios.get(service+'/ukt/just-compute/'+id, {
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