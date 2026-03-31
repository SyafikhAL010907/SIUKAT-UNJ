import axios from 'axios';
import { service, notif, errLog } from '../global';

export function getByLoggedIn(token){
    return new Promise((resolve, reject) => {
        axios.get(service + '/ukt', {
            headers: {
                'Authorization': 'Bearer '+token
            }
        })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                notif('Terjadi kesalahan!', errLog(err.response),'error');            
                resolve(err);
            });
    });
}
