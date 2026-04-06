import axios from 'axios'
import { service, notif, errLog } from '../global'

export function fetchDataFakultas(token){
    return new Promise((resolve, reject) => {
        axios.get(service+'/summary/fakultas?'+Math.random()*100,{},{
            headers:{
                "Authorization": "Bearer "+token
            }
        })
            .then((response) => {                
                resolve(response.data)
            })
            .catch((err) => {
                notif("Terjadi kesalahan!", errLog(err.response),"error")                
                reject(err.response)
            })
    })
}
export function fetchDataProdi(token){
    return new Promise((resolve, reject) => {
        axios.get(service+'/summary/prodi?'+Math.random()*100,{},{
            headers:{
                "Authorization": "Bearer "+token
            }
        })
            .then((response) => {                
                resolve(response.data)
            })
            .catch((err) => {
                notif("Terjadi kesalahan!", errLog(err.response),"error")                
                reject(err.response)
            })
    })
}