import axios from 'axios';
import { service, notif, errLog, dateConverter } from '../global';

export function getByLoggedIn(token){
    return new Promise((resolve, reject) => {
        axios.get(service+'/ayah/get-ayah', {
            headers: {
                'Authorization': 'Bearer '+token
            }
        })
            .then((response) => {
                response.data.tanggal_lahir_ayah = dateConverter(response.data.tanggal_lahir_ayah);            
                resolve(response.data);
            })
            .catch((err) => {
                notif('Terjadi kesalahan!', errLog(err.response),'error');
                reject(err.response);
            });
    });
}

export function updateData(token, input){
    return new Promise((resolve, reject) => {
        axios.put(service+'/ayah/edit', input, {
            headers: {
                'Authorization': 'Bearer '+token,
                'Content-Type': 'multipart/form-data',
            }
        })
            .then((response) => {
                notif('Berhasil!', 'Data berhasil tersimpan', 'success');
                resolve(response.data);
            })
            .catch((err) => {
                notif('Terjadi kesalahan!', errLog(err.response),'error');
                reject(err.response);
            });
    });
}