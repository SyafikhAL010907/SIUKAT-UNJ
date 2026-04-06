import axios from "axios"
import { service, notif, errLog } from "../global"

export function getById(token, id){
    return new Promise((resolve, reject) => {
        axios.get(service + "/ukt/cmahasiswa/"+id, {
            headers: {
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
