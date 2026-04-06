import React from 'react'
import defaultPhoto from '../../../dist/images/profile.png'
import { connect } from 'react-redux'
import { Row, Col, Table, Button, Form, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Alert, FormText } from 'reactstrap'
import { Field, reduxForm, reset, formValueSelector } from 'redux-form'
import { cmahasiswa, provinsi, kabkot, kecamatan } from '../../../../actions'
import { InputBs, InputDayPicker, InputFileBs, money } from '../../../components'
import { cookies, cookieName, rupiah, storage, } from '../../../../global'

let FormMahasiswa = (props) => {
    const { handleSubmit, handleToggleMahasiswa, toggleMahasiswa,
            pristine, submitting, dispatch,
            ref_provinsi, ref_kabkot, ref_kecamatan,
            penghasilan_cmahasiswa } = props
    const handleProvinsi = (e) => {
        dispatch(kabkot.fetchForCmahasiswa(e.target.value))
        dispatch(kecamatan.fetchForCmahasiswa({type: "FETCH_KECAMATAN_MHS_FULFILLED", payload: []}))
    }
    const handleKabkot = (e) => {
        dispatch(kecamatan.fetchForCmahasiswa(e.target.value))
    }
    return (
        <Form onSubmit={handleSubmit} id="form-mahasiswa" className="form-horizontal">        
            <Modal isOpen={toggleMahasiswa} toggle={handleToggleMahasiswa} size="lg"
            className={'modal-success'}>
                <ModalHeader toggle={handleToggleMahasiswa}>Form Mahasiswa</ModalHeader>
                <ModalBody>
                    <FormGroup row>
                        <Label for="nama_cmahasiswa" md={3}>Nama Lengkap</Label>
                        <Col md={9}>
                            <Field name="nama_cmahasiswa" component={InputBs} type="text" placeholder="Nama Lengkap" />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="gender_cmahasiswa" md={3}>Jenis Kelamin</Label>                                            
                        <Col md={3}>
                            <Label check>
                                <Field name="gender_cmahasiswa" component={InputBs} type="radio" value="laki-laki" />{' '}
                                Laki-Laki
                            </Label>
                        </Col>
                        <Col md={3}>
                            <Label check>
                                <Field name="gender_cmahasiswa" component={InputBs} type="radio" value="perempuan" />{' '}
                                Perempuan
                            </Label>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label md={3} xs={12}>Tempat & <br/>Tanggal Lahir</Label>
                        <Col md={5}>
                            <Field name="tempat_lahir_cmahasiswa" component={InputBs} type="text" placeholder="Tempat Lahir" />{' '}     
                        </Col>
                        <Col md={4} xs={12}>
                            <Field name="tanggal_lahir_cmahasiswa" component={InputDayPicker} startYear={1990} placeholder="Tanggal Lahir"/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="alamat_cmahasiswa" md={3}>Alamat Lengkap</Label>
                        <Col md={9}>
                            <Field name="alamat_cmahasiswa" component={InputBs} type="textarea" rows="3" placeholder="Alamat Lengkap" />{' '}
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="provinsi_cmahasiswa" md={3}>Provinsi</Label>
                        <Col md={9}>
                            <Field name="provinsi_cmahasiswa" component={InputBs} type="select" 
                                onChange={handleProvinsi}>{' '}
                                <option value="">-- Pilih Provinsi --</option>
                                { Array.isArray(ref_provinsi) ? ref_provinsi.map((data, key) => 
                                    <option value={data.provinsi_id} key={key}>{data.provinsi_nama}</option>
                                ) : "" }
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="kabkot_cmahasiswa" md={3}>Kab/Kota</Label>
                        <Col md={9}>
                            <Field name="kabkot_cmahasiswa" component={InputBs} type="select" 
                                onChange={handleKabkot}>{' '}        
                                <option value="">-- Pilih Kabupaten/Kota --</option>
                                { Array.isArray(ref_kabkot) ? ref_kabkot.map((data, key) => 
                                    <option value={data.kab_id} key={key}>{data.kab_nama}</option>
                                ) : "" }
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="kecamatan_cmahasiswa" sm={3}>Kecamatan</Label>
                        <Col sm={9}>
                            <Field name="kecamatan_cmahasiswa" component={InputBs} type="select" >{' '}        
                                <option value="">-- Pilih Kecamatan --</option>
                                { Array.isArray(ref_kecamatan) ? ref_kecamatan.map((data, key) => 
                                    <option value={data.kecam_id} key={key}>{data.kecam_nama}</option>
                                ) : "" }
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="telepon_cmahasiswa" md={3}>Nomor Telepon</Label>
                        <Col md={9}>
                            <Field name="telepon_cmahasiswa" component={InputBs} type="text" placeholder="Nomor Telepon" pattern="[0-9]{0,13}" title="Hanya isi dengan angka 0-9. Maksimal 13 digit."/>                    
                            <FormText color="muted">
                                Hanya isi dengan angka. Maksimal 13 digit.
                            </FormText>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="goldar_cmahasiswa" md={3}>Golongan Darah</Label>
                        <Col md={9}>
                            <Field name="goldar_cmahasiswa" component={InputBs} type="select" >{' '}        
                                <option value="">-- Pilih Golongan Darah --</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="AB">AB</option>
                                <option value="O">O</option>
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="sosmed_cmahasiswa" md={3}>Sosial Media</Label>
                        <Col md={9}>
                            <Field name="sosmed_cmahasiswa" component={InputBs} type="text" placeholder="Facebook/Twitter/Instagram" />
                            <FormText color="muted">
                                Facebook/Twitter/Instagram
                            </FormText>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="penghasilan_cmahasiswa" md={3}>Penghasilan</Label>
                        <Col md={5} xs={12}>
                            <Field type="number" component={InputBs} pattern="[0-9]*" title="Hanya isi dengan angka (0-9)" name="penghasilan_cmahasiswa" id="penghasilan_mahasiswa" placeholder="Penghasilan Sendiri" 
                                    validate={[ money ]}
                                    />
                            <FormText color="muted">
                                <ul className="list-reset">
                                    <li>Penghasilan <b>per bulan</b>;</li>
                                    <li>Hanya isi dengan angka (0-9).</li>
                                    <li>Tidak perlu menuliskan titik (.) dan koma (,).</li>
                                </ul>
                            </FormText>
                        </Col>
                        <Col md={4} xs={12}>
                            <Alert color="success">{ rupiah(penghasilan_cmahasiswa) }</Alert>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="file_foto_cmahasiswa" md={3}>
                            Foto
                        </Label>
                        <Col md={5} xs={12}>
                            <Field component={InputFileBs} type="file" className="form-control" name="file_foto_cmahasiswa" id="file_foto_cmahasiswa" />
                        </Col>
                        <Col md={4} xs={12}>
                            { props.initialValues.foto_cmahasiswa && (
                                <div>
                                    <FormText color="muted">Foto Anda saat ini:</FormText>
                                    <img src={storage+"/"+props.initialValues.no_peserta+"/"+props.initialValues.foto_cmahasiswa} className="img-thumbnail img-responsive" alt="foto-cmahasiswa"/>
                                </div>
                            )}
                        </Col>
                    </FormGroup>
                </ModalBody>
                <ModalFooter className="text-right">
                    <Button color="success" type="submit" form="form-mahasiswa" disabled={pristine || submitting}><i className="fa fa-save"></i> Simpan</Button>{' '}
                    <Button color="warning" onClick={handleToggleMahasiswa}>Batal</Button>
                </ModalFooter>
            </Modal>
        </Form>
    )
}

class Pribadi extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            modalToggle: false
        }
        this.modalToggle = this.modalToggle.bind(this)
        this.submitMahasiswa = this.submitMahasiswa.bind(this)
    }
    componentWillMount(){
        this.props.dispatch(provinsi.fetchProvinsi())
        this.props.dispatch(cmahasiswa.fetchAllData(cookies.get(cookieName), this.props.noPeserta))
    }
    modalToggle = () => {
        this.setState({
            modalToggle: !this.state.modalToggle
        })
    }
    submitMahasiswa = (values) => {
        this.setState({
            modalToggle: !this.state.modalToggle
        })
        var formData = new FormData()
        for(var key in values){
            if(key === "file_foto_cmahasiswa"){
                formData.append(key, values[key][0])
                document.getElementById('file_foto_cmahasiswa').value = null;        
            }else{
                formData.append(key, values[key])
            }
        }
        this.props.dispatch(cmahasiswa.updateData(cookies.get(cookieName), formData, this.props.noPeserta))
        this.props.dispatch(reset('DataMahasiswa'))        
    }

    render(){
        return (
            <div>
                <Row>
                    <Col md={3}>
                        { this.props.cmahasiswa.foto_cmahasiswa && (
                            <img src={storage+"/"+this.props.cmahasiswa.no_peserta+"/"+this.props.cmahasiswa.foto_cmahasiswa} className="img-thumbnail img-responsive" alt="foto-cmahasiswa"/>
                        )}
                        { !this.props.cmahasiswa.foto_cmahasiswa && (
                            <img src={defaultPhoto} className="img-thumbnail img-responsive" alt="tidak-ada-foto"/>                            
                        )}
                    </Col>
                    <Col md={9}>
                        <Table responsive striped bordered>
                            <tbody>
                                <tr>
                                    <td width="30%">Nama</td>
                                    <td width="5%">:</td>
                                    <td>{this.props.cmahasiswa.nama_cmahasiswa}</td>
                                </tr>
                                <tr>
                                    <td>Jenis Kelamin</td>
                                    <td>:</td>
                                    <td>{this.props.cmahasiswa.gender_cmahasiswa}</td>
                                </tr>
                                <tr>
                                    <td>Tempat, Tanggal Lahir</td>
                                    <td>:</td>
                                    <td>{this.props.cmahasiswa.tempat_lahir_cmahasiswa+", "+this.props.cmahasiswa.tanggal_lahir_cmahasiswa}</td>
                                </tr>
                                <tr>
                                    <td>Alamat</td>
                                    <td>:</td>
                                    <td>
                                    {this.props.cmahasiswa.provinsi != null && (
                                        this.props.cmahasiswa.alamat_cmahasiswa+", "+this.props.cmahasiswa.kecamatan.kecam_nama+", "+this.props.cmahasiswa.kabkot.kab_nama+", "+this.props.cmahasiswa.provinsi.provinsi_nama
                                    )}
                                    </td> 
                                </tr>
                                <tr>
                                    <td>Nomor Telepon</td>
                                    <td>:</td>
                                    <td>{ this.props.cmahasiswa.telepon_cmahasiswa }</td>
                                </tr>
                                <tr>
                                    <td>Golongan Darah</td>
                                    <td>:</td>
                                    <td>{ this.props.cmahasiswa.goldar_cmahasiswa }</td>
                                </tr>
                                <tr>
                                    <td>Penghasilan Sendiri</td>
                                    <td>:</td>
                                    <td>{ rupiah(this.props.cmahasiswa.penghasilan_cmahasiswa) } <b>/ bulan</b></td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Row>
                    <Col md={9}>
                    </Col>
                    <Col md={3} className="text-right">
                        { this.props.editable && (
                            <Button color="warning" size="sm" onClick={this.modalToggle}><i className="fa fa-pencil"></i> Perbarui</Button>
                        )}
                    </Col>
                </Row>

                <FormMahasiswa
                    onSubmit={this.submitMahasiswa}
                    initialValues={this.props.cmahasiswa}
                    toggleMahasiswa={this.state.modalToggle}
                    handleToggleMahasiswa={this.modalToggle}
                    /> 
            </div>
        )
    }
}

FormMahasiswa = reduxForm({
    form: 'DataMahasiswa',
    enableReinitialize: true,
})(FormMahasiswa)

const selector = formValueSelector('DataMahasiswa')

FormMahasiswa = connect((store) => {
    let penghasilan_cmahasiswa = selector(store, 'penghasilan_cmahasiswa')
    return {
        penghasilan_cmahasiswa,

        ref_provinsi: store.provinsi.provinsi,
        ref_kabkot: store.kabkot.kabkot_cmahasiswa,
        ref_kecamatan: store.kecamatan.kecamatan_cmahasiswa,
    }
}, {
    kabkot, kecamatan
})(FormMahasiswa)

export default connect(
    (store) => ({
        cmahasiswa: store.cmahasiswa.singleCmahasiswa,
    })
)(Pribadi)