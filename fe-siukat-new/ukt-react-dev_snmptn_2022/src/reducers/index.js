import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { loadingAll } from 'redux-global-loader';

import ayah from './ayah';
import captcha from './captcha';
import cmahasiswa from './cmahasiswa';
import ibu from './ibu';
import info from './info';
import kabkot from './kabkot';
import kecamatan from './kecamatan';
import kendaraan from './kendaraan';
import listrik from './listrik';
import provinsi from './provinsi';
import pendukung from './pendukung';
import pekerjaan from './pekerjaan';
import rumah from './rumah';
import ukt from './ukt';
import user from './user';
import wali from './wali';
import verifikasi from './verifikasi';
import bio_provinsi from './bio_provinsi';
import bio_kabkot from './bio_kabkot';
import bio_kecamatan from './bio_kecamatan';
import bio_agama from './bio_agama';
import bio_tinggal from './bio_tinggal';
import bio_transportasi from './bio_transportasi';
import bio_pendidikan from './bio_pendidikan';
import bio_pekerjaan from './bio_pekerjaan';
import bio_penghasilan from './bio_penghasilan';
import bio_jurusan from './bio_jurusan';
import bio_ref_sekolah from './bio_ref_sekolah';
import bio_cmahasiswa from './bio_cmahasiswa';
import bio_sekolah_cmahasiswa from './bio_sekolah_cmahasiswa';
import bio_ortu_cmahasiswa from './bio_ortu_cmahasiswa';
import keringanan from './keringanan';

export default combineReducers({
    ayah,
    captcha,
    cmahasiswa,
    ibu,
    info,
    kabkot,
    kecamatan,
    kendaraan,
    listrik,
    provinsi,
    pendukung,
    pekerjaan,
    rumah,
    ukt,
    user,
    wali,
    verifikasi,
    bio_provinsi,
    bio_kabkot,
    bio_kecamatan,
    bio_agama,
    bio_tinggal,
    bio_transportasi,
    bio_pendidikan,
    bio_pekerjaan,
    bio_penghasilan,
    bio_jurusan,
    bio_ref_sekolah,
    bio_cmahasiswa,
    bio_sekolah_cmahasiswa,
    bio_ortu_cmahasiswa,
    keringanan,
    form: formReducer,

    loadingAll,
});
