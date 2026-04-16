import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Row, Col, Table, Button, Form, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Alert, FormText } from 'reactstrap'
import { Field, reduxForm, reset, formValueSelector } from 'redux-form'
import { ibu, provinsi, pekerjaan, kabkot, kecamatan } from '../../../../actions'
import { InputBs, InputDayPicker, InputFileBs, money } from '../../../components'
import { cookies, cookieName, rupiah, storage, service, dateConverter } from '../../../../global'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

let FormIbu = (props) => {
    const { handleSubmit, handleToggleIbu, toggleIbu,
            pristine, submitting, dispatch,
            ref_pekerjaan, ref_provinsi_ibu, ref_kabkot_ibu, ref_kecamatan_ibu,
            status_ibu, penghasilan_ibu, sampingan_ibu, } = props

    const handleProvinsi = (e) => {
        const val = e.target.value;
        if (val) {
            dispatch(kabkot.fetchForIbu(val))
            dispatch(kecamatan.fetchForIbu({type: "FETCH_KECAMATAN_FULFILLED", payload: []}))
        }
    }
    
    const handleKabkot = (e) => {
        const val = e.target.value;
        if (val) {
            dispatch(kecamatan.fetchForIbu(val))
        }
    }

    return (
        <Modal isOpen={toggleIbu} toggle={handleToggleIbu} size="lg" centered className="border-none">
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-emerald-600 p-6 flex justify-between items-center text-white">
                    <h3 className="text-xl font-bold">Perbarui Data Ibu</h3>
                    <button onClick={handleToggleIbu} className="hover:rotate-90 transition-transform text-2xl">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto">
                    <FormGroup row>
                        <Label for="nama_ibu" md={3}>Nama Lengkap</Label>
                        <Col md={9}>
                            <Field name="nama_ibu" component={InputBs} type="text" placeholder="Nama Lengkap"/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="status_ibu" md={3}></Label>                                            
                        <Col md={4}>
                            <Label check>
                                <Field name="status_ibu" component={InputBs} type="radio" value="hidup" />{' '}
                                Hidup
                            </Label>
                        </Col>
                        <Col md={5}>
                            <Label check>
                                <Field name="status_ibu" component={InputBs} type="radio" value="wafat" />{' '}
                                Wafat / Tidak Diketahui
                            </Label>
                        </Col>
                    </FormGroup>

                    { status_ibu === "hidup" && (
                        <div className="animate-in fade-in duration-300">
                            <FormGroup row>
                                <Label for="nik_ibu" md={3}>NIK</Label>
                                <Col md={9}>
                                    <Field name="nik_ibu" component={InputBs} type="text" placeholder="NIK Ibu"/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="file_scan_ktp_ibu" md={3}>KTP Ibu</Label>
                                <Col md={5}>
                                    <Field component={InputFileBs} type="file" className="form-control" name="file_scan_ktp_ibu" id="file_scan_ktp_ibu" />
                                </Col>
                                { props.initialValues && props.initialValues.scan_ktp_ibu && (
                                    <Col md={4}>
                                        <a href={storage+"/"+props.initialValues.scan_ktp_ibu} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-block px-4 py-2 rounded-lg text-sm"><i className="fa fa-file mr-2"></i> Lihat KTP</a>
                                    </Col>
                                )}
                            </FormGroup>
                            <FormGroup row>
                                <Label md={3} xs={12}>Tempat & <br/>Tanggal Lahir</Label>
                                <Col md={5}>
                                    <Field name="tempat_lahir_ibu" component={InputBs} type="text" placeholder="Tempat Lahir"/>{' '}     
                                </Col>
                                <Col md={4} xs={12}>
                                    <Field name="tanggal_lahir_ibu" component={InputDayPicker} startYear={1950} placeholder="Tanggal Lahir"/>
                                </Col>
                            </FormGroup>                       
                            <FormGroup row>
                                <Label for="alamat_ibu" md={3}>Alamat Lengkap</Label>
                                <Col md={9}>
                                    <Field name="alamat_ibu" component={InputBs} type="textarea" rows="3" placeholder="Alamat Lengkap"/>{' '}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="provinsi_ibu" md={3}>Provinsi</Label>
                                <Col md={9}>
                                    <Field name="provinsi_ibu" component={InputBs} type="select" onChange={handleProvinsi}>
                                        <option value="">-- Pilih Provinsi --</option>
                                        { Array.isArray(ref_provinsi_ibu) && ref_provinsi_ibu.map((data, key) => 
                                            <option value={data.provinsi_id} key={key}>{data.provinsi_nama}</option>
                                        )}
                                    </Field>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="kabkot_ibu" md={3}>Kab/Kota</Label>
                                <Col md={9}>
                                    <Field name="kabkot_ibu" component={InputBs} type="select" onChange={handleKabkot}>
                                        <option value="">-- Pilih Kabupaten/Kota --</option>
                                        { Array.isArray(ref_kabkot_ibu) && ref_kabkot_ibu.map((data, key) => 
                                            <option value={data.kab_id} key={key}>{data.kab_nama}</option>
                                        )}
                                    </Field>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="kecamatan_ibu" sm={3}>Kecamatan</Label>
                                <Col sm={9}>
                                    <Field name="kecamatan_ibu" component={InputBs} type="select">
                                        <option value="">-- Pilih Kecamatan --</option>
                                        { Array.isArray(ref_kecamatan_ibu) && ref_kecamatan_ibu.map((data, key) => 
                                            <option value={data.kecam_id} key={key}>{data.kecam_nama}</option>
                                        )}
                                    </Field>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="pekerjaan_ibu" md={3}>Pekerjaan</Label>
                                <Col md={9}>
                                    <Field type="select" component={InputBs} name="pekerjaan_ibu" id="pekerjaan_ibu">   
                                        <option value="">-- Pilih Pekerjaan --</option>
                                        { Array.isArray(ref_pekerjaan) && ref_pekerjaan.map((data, key) => 
                                            <option value={data.kode} key={key}>{data.nama}</option>
                                        )}
                                    </Field>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="penghasilan_ibu" md={3}>Penghasilan</Label>
                                <Col md={5} xs={12}>
                                    <Field type="number" component={InputBs} name="penghasilan_ibu" id="penghasilan_ibu" placeholder="Penghasilan Ibu" validate={[ money ]}/>
                                    <FormText color="muted">Penghasilan <b>per bulan</b> (Angka saja).</FormText>
                                </Col>
                                <Col md={4} xs={12}>
                                    <Alert color="success" className="py-2 text-sm">{ rupiah(penghasilan_ibu || 0) }</Alert>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="sampingan_ibu" md={3}>Sampingan</Label>
                                <Col md={5} xs={12}>
                                    <Field type="number" component={InputBs} name="sampingan_ibu" id="sampingan_ibu" placeholder="Penghasilan Sampingan"/>
                                </Col>
                                <Col md={4} xs={12}>
                                    <Alert color="success" className="py-2 text-sm">{ rupiah(sampingan_ibu || 0) }</Alert>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="file_scan_slip_ibu" md={3}>Bukti Penghasilan</Label>
                                <Col md={5}>
                                    <Field component={InputFileBs} type="file" name="file_scan_slip_ibu" id="file_scan_slip_ibu" />
                                </Col>
                                { props.initialValues && props.initialValues.scan_slip_ibu && (
                                    <Col md={4}>
                                        <a href={storage+"/"+props.initialValues.scan_slip_ibu} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-block px-4 py-2 rounded-lg text-sm"><i className="fa fa-file mr-2"></i> Lihat Slip Gaji</a>
                                    </Col>
                                )}
                            </FormGroup>
                            <FormGroup row>
                                <Label for="telepon_ibu" md={3}>Nomor Telepon</Label>
                                <Col md={9}>
                                    <Field name="telepon_ibu" component={InputBs} type="text" placeholder="Nomor Telepon"/>                     
                                </Col>
                            </FormGroup>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={handleToggleIbu} className="px-6 py-2.5 font-bold text-gray-500 hover:text-gray-700">Batal</button>
                        <button type="submit" disabled={pristine || submitting} className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg disabled:opacity-50">
                            {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}

class Ibu extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            modalToggle: false
        }
    }

    UNSAFE_componentWillMount(){
        this.fetchInitialData();
    }

    fetchInitialData = () => {
        const token = cookies.get(cookieName);
        this.props.dispatch(pekerjaan.fetchPekerjaan(token))
        this.props.dispatch(provinsi.fetchProvinsi())
        this.props.dispatch(ibu.fetchAllData(token, this.props.noPeserta, this.props.atribut))
        
        if (this.props.ibu) {
            if (this.props.ibu.provinsi_ibu) this.props.dispatch(kabkot.fetchForIbu(this.props.ibu.provinsi_ibu));
            if (this.props.ibu.kabkot_ibu) this.props.dispatch(kecamatan.fetchForIbu(this.props.ibu.kabkot_ibu));
        }
    }

    modalToggle = () => {
        if (!this.state.modalToggle && this.props.ibu) {
            if (this.props.ibu.provinsi_ibu) this.props.dispatch(kabkot.fetchForIbu(this.props.ibu.provinsi_ibu));
            if (this.props.ibu.kabkot_ibu) this.props.dispatch(kecamatan.fetchForIbu(this.props.ibu.kabkot_ibu));
        }
        this.setState({ modalToggle: !this.state.modalToggle })
    }

    submitIbu = (values) => {
        const token = cookies.get(cookieName);
        var formData = new FormData()
        
        for(var key in values){
            // 1. Handle Files
            if(key.startsWith("file_scan") && values[key] && values[key][0] instanceof File){
                formData.append(key, values[key][0])   
                if(document.getElementById(key)) document.getElementById(key).value = null;     
            } 
            // 2. Handle Data Fields (Menyesuaikan dengan Model Golang)
            else if (!key.startsWith("file_scan") && !key.startsWith("scan_")) {
                let val = values[key];
                
                if (val instanceof Date || moment.isMoment(val)) {
                    val = moment(val).format("YYYY-MM-DD");
                }
                // Konversi eksplisit ke Integer untuk field yang di Go bertipe 'int'
                else if (key === 'pekerjaan_ibu' || key === 'penghasilan_ibu' || key === 'sampingan_ibu') {
                    // Cek jika val adalah object (sering terjadi pada dropdown library tertentu)
                    if (val && typeof val === 'object') {
                        val = val.kode || val.id || 0;
                    }
                    // Pastikan dikirim sebagai string angka murni (Integer di Backend)
                    // Jika kosong kirim "0" agar backend tidak error saat parsing int
                    val = (val === null || val === undefined || val === "") ? "0" : parseInt(val).toString();
                } else {
                    // Field String lainnya
                    val = (val === null || val === undefined) ? "" : val.toString();
                }
                
                formData.append(key, val);
            }
        }

        // Pastikan atribut ditambahkan agar query update di backend tepat sasaran
        if (!formData.has('atribut')) {
            formData.append('atribut', this.props.atribut || 'original');
        }

        return this.props.dispatch(ibu.updateData(token, formData, this.props.noPeserta)).then((res) => {
            this.setState({ modalToggle: false });
            this.props.dispatch(ibu.fetchAllData(token, this.props.noPeserta, this.props.atribut));
            this.props.dispatch(reset('DataIbuSeleksi'));
            return res;
        }).catch(err => {
            console.error("Update failed", err);
        });
    }

    render(){
        const { ibu: dataIbu, location, editable } = this.props;
        const data = dataIbu || {}
        const isModeSanggah = editable;

        return (
            <div className="space-y-4">
                {isModeSanggah && (
                    <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center text-orange-700 animate-pulse">
                        <i className="fa fa-info-circle mr-3 text-xl"></i>
                        <span className="text-sm font-bold uppercase">Mode Sanggah Aktif: Anda dapat mengubah data ibu sekarang.</span>
                    </div>
                )}

                <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                    <div>
                        <h4 className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-2">
                            <i className="fa fa-female text-pink-500"></i> Data Ibu
                        </h4>
                        <p className="text-gray-500 text-sm">Informasi orang tua kandung / ibu.</p>
                    </div>
                    { isModeSanggah && (
                        <button onClick={this.modalToggle} className="bg-amber-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-amber-700 transition-all shadow-md">
                            <i className="fa fa-pencil mr-2"></i> Perbarui Data
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-pink-50 flex items-center gap-2 font-bold">
                        <i className="fa fa-female text-pink-500"></i>
                        <span className="uppercase text-gray-700 tracking-wider text-sm">Informasi Ibu</span>
                    </div>
                    <table className="w-full text-sm">
                        <tbody className="divide-y divide-gray-100">
                            <tr>
                                <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 w-1/3 text-xs uppercase">Nama Lengkap</td>
                                <td className="p-4 font-medium text-gray-800">{data.nama_ibu || '-'}</td>
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Status</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${data.status_ibu === 'hidup' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {data.status_ibu || 'Belum diisi'}
                                    </span>
                                </td>
                            </tr>
                            { data.status_ibu === "hidup" && (<>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">NIK</td>
                                    <td className="p-4 font-mono text-gray-700">{data.nik_ibu || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">KTP</td>
                                    <td className="p-4">
                                        { data.scan_ktp_ibu ? (
                                            <a href={storage+"/"+data.scan_ktp_ibu} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold text-sm">
                                                <i className="fa fa-download"></i> Lihat KTP
                                            </a>
                                        ) : <span className="text-gray-400 italic text-xs">Belum diunggah</span>}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Tempat, Tgl Lahir</td>
                                    <td className="p-4 text-gray-700">
                                        { (data.tempat_lahir_ibu || data.tanggal_lahir_ibu) ? (
                                            <>
                                                {data.tempat_lahir_ibu || '-'}, {dateConverter(data.tanggal_lahir_ibu)}
                                            </>
                                        ) : '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Alamat</td>
                                    <td className="p-4 text-gray-700">
                                        { data.provinsi 
                                            ? `${data.alamat_ibu}, ${data.kecamatan?.kecam_nama || ''}, ${data.kabkot?.kab_nama || ''}, ${data.provinsi?.provinsi_nama || ''}`
                                            : (data.alamat_ibu || '-')
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Pekerjaan</td>
                                    <td className="p-4 text-gray-700">{data.pekerjaan?.nama || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Penghasilan</td>
                                    <td className="p-4 font-bold text-emerald-700">{rupiah(data.penghasilan_ibu || 0)} <span className="text-gray-400 font-normal text-xs">/ bulan</span></td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Penghasilan Sampingan</td>
                                    <td className="p-4 font-bold text-emerald-700">{rupiah(data.sampingan_ibu || 0)} <span className="text-gray-400 font-normal text-xs">/ bulan</span></td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Bukti Penghasilan</td>
                                    <td className="p-4">
                                        { data.scan_slip_ibu ? (
                                            <a href={storage+"/"+data.scan_slip_ibu} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold text-sm">
                                                <i className="fa fa-download"></i> Lihat Slip Gaji
                                            </a>
                                        ) : <span className="text-gray-400 italic text-xs">Belum diunggah</span>}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Nomor Telepon</td>
                                    <td className="p-4 font-mono text-gray-700">{data.telepon_ibu || '-'}</td>
                                </tr>
                            </>)}
                        </tbody>
                    </table>
                </div>

                <FormIbu
                    onSubmit={this.submitIbu}
                    initialValues={this.props.ibu}
                    toggleIbu={this.state.modalToggle}
                    handleToggleIbu={this.modalToggle}
                />
            </div>
        )
    }
}

FormIbu = reduxForm({
    form: 'DataIbuSeleksi',
    enableReinitialize: true,
})(FormIbu)

const selector = formValueSelector('DataIbuSeleksi')

FormIbu = connect((store) => {
    let { status_ibu, penghasilan_ibu, sampingan_ibu } = selector(store, 'status_ibu', 'penghasilan_ibu', 'sampingan_ibu')
    return {
        status_ibu,
        penghasilan_ibu,
        sampingan_ibu,
        ref_provinsi_ibu: store.provinsi.provinsi,
        ref_kabkot_ibu: store.kabkot.kabkot_ibu,
        ref_kecamatan_ibu: store.kecamatan.kecamatan_ibu,
        ref_pekerjaan: store.pekerjaan.pekerjaan,
    }
}, { kabkot, kecamatan })(FormIbu)

export default withRouter(connect(
    (store) => ({
        ibu: store.ibu.ibu,
    })
)(Ibu))