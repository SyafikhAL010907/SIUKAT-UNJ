import axios from 'axios'
import { service, notif, errLog } from '../global'

export function fetchChartData(token){
    return new Promise((resolve, reject) => {
        axios.get(service+'/dashboard/data',{},{
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

export function fetchChartMeta(token){
    return new Promise((resolve,reject)=>{
        axios.get(service+"/dashboard/meta",{},{
            headers:{
                "Authorization":"Bearer "+token
            }
        }).then((response)=>{
            resolve(response.data)
        }).catch((error)=>{
            notif("Terjadi kesalahan",errLog(error.response),"error");
            reject(error.response);
        })
    })
}