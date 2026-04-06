import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Table, Button, Form, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Alert, FormText } from 'reactstrap'
import { Field, reduxForm, reset, formValueSelector } from 'redux-form'
import { rumah, } from '../../../../actions'
import { InputBs, InputFileBs, money } from '../../../components'
import { cookies, cookieName, rupiah, storage, } from '../../../../global'
import { connect } from 'react-redux'

let FormRumah = (props) => {
    const { handleSubmit, handleToggleRumah, toggleRumah,
        pristine, submitting,
        status_kepemilikan, biaya_kontrak, biaya_pbb } = props
    return (
        <Form onSubmit={handleSubmit} id="form-rumah" className="form-horizontal">        
            <Modal isOpen={toggleRumah} toggle={handleToggleRumah} size="lg"
            className={'modal-success'}>
                <ModalHeader toggle={handleToggleRumah}>Form Rumah</ModalHeader>
                <ModalBody>
                    <FormGroup row>
                        <Label for="status_kepemilikan" md={3} xs={12}>Status Rumah</Label>                                            
                        <Col md={2} xs={6}>
                            <Label check>
                                <Field type="radio" component={InputBs} name="status_kepemilikan" value="milik_sendiri" />{' '}
                                Milik Sendiri
                            </Label>
                        </Col>
                        <Col md={2} xs={6}>
                            <Label check>
                                <Field type="radio" component={InputBs} name="status_kepemilikan" value="bersama_saudara" />{' '}
                                Tinggal Bersama Saudara
                            </Label>
                        </Col>
                        <Col md={2} xs={6}>
                            <Label check>
                                <Field type="radio" component={InputBs} name="status_kepemilikan" value="kontrak" />{' '}
                                Kontrak
                            </Label>
                        </Col>
                        <Col md={3} xs={6}>
                            <Label check>
                                <Field type="radio" component={InputBs} name="status_kepemilikan" value="menumpang" />{' '}
                                Menumpang
                            </Label>
                        </Col>
                    </FormGroup>
        
        
                    { status_kepemilikan === "milik_sendiri" && (
                        <div>
                            <FormGroup row>
                                <Label for="status_sertifikat" md={3}>Status Sertifikat</Label>                                            
                                <Col md={9}>
                                    <Col md={12}>
                                        <Label check>
                                            <Field type="radio" name="status_sertifikat" component={InputBs} value="hak_milik" />{' '}
                                            Hak Milik
                                        </Label>
                                    </Col>
                                    <Col md={12}>
                                        <Label check>
                                            <Field type="radio" name="status_sertifikat" component={InputBs} value="hak_guna_bangunan"/>{' '}
                                            Hak Guna Bangunan
                                        </Label>
                                    </Col>
                                    <Col md={12}>
                                        <Label check>
                                            <Field type="radio" name="status_sertifikat" component={InputBs} value="tanpa_sertifikat"/>{' '}
                                            Tanpa Sertifikat
                                        </Label>
                                    </Col>
                                    <Col md={12}>
                                        <Label check>
                                            <Field type="radio" name="status_sertifikat" component={InputBs} value="tanah_girik"/>{' '}
                                            Tanah Girik
                                        </Label>
                                    </Col>
                                    <Col md={12}>
                                        <Label check>
                                            <Field type="radio" name="status_sertifikat" component={InputBs} value="lainnya"/>{' '}
                                            Lainnya
                                        </Label>
                                    </Col>
                                </Col>
                            </FormGroup>
                        </div>
                    )}
        
        
                    { status_kepemilikan === "bersama_saudara" && (
                        <div>
                            <FormGroup row>
                                <Label for="jumlah_kepala_keluarga" md={3}>Jumlah Kepala Keluarga</Label>
                                <Col md={9}>
                                    <Field type="text" component={InputBs} name="jumlah_kepala_keluarga" id="jumlah_kepala_keluarga" placeholder="Jumlah Kepala Keluarga Dalam Satu Rumah" />
                                </Col>
                            </FormGroup>
                        </div>     
                    )}               
        
        
                    { (status_kepemilikan === "milik_sendiri" || status_kepemilikan === "bersama_saudara") && (
                        <div>          
                            <FormGroup row>
                                <Label for="luas_tanah" md={3}>Luas Tanah</Label>
                                <Col md={9}>
                                    <Field type="text" component={InputBs} name="luas_tanah" id="luas_tanah" placeholder="Luas Tanah" />
                                    <FormText color="muted">
                                        <ul className="list-reset">
                                            <li>Luas tanah sesuai PBB;</li>
                                            <li>Dalam satuan m<sup>2</sup>.</li>
                                        </ul>
                                    </FormText>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="luas_bangunan" md={3}>Luas Bangunan</Label>
                                <Col md={9}>
                                    <Field type="text" component={InputBs} name="luas_bangunan" id="luas_bangunan" placeholder="Luas Bangunan" />
                                    <FormText color="muted">
                                        <ul className="list-reset">
                                            <li>Luas bangunan sesuai PBB;</li>
                                            <li>Dalam satuan m<sup>2</sup>.</li>
                                        </ul>
                                    </FormText>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="biaya_pbb" md={3}>Biaya PBB</Label>
                                <Col md={5} xs={12}>
                                    <Field type="number" component={InputBs} pattern="[0-9]*" title="Hanya isi dengan angka (0-9)" name="biaya_pbb" placeholder="Biaya PBB Terbaru" id="biaya_pbb" validate={[ money ]}/>
                                    <FormText color="muted">
                                        <ul className="list-reset">
                                            <li>Biaya PBB terbaru / tahun terakhir;</li>
                                            <li>Hanya isi dengan angka (0-9).</li>
                                        </ul>
                                    </FormText>
                                </Col>
                                <Col md={4} xs={12}>
                                    <Alert color="success">{ rupiah(biaya_pbb) } </Alert>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="file_scan_pbb" md={3}>Tagihan PBB</Label>
                                <Col md={5}>
                                    <Field component={InputFileBs} type="file" name="file_scan_pbb" id="file_scan_pbb" />
                                    <FormText color="muted">
                                        <ul className="list-reset">
                                            <li>Ekstensi berkas berupa PDF;</li>
                                            <li>Ukuran berkas tidak lebih dari 500KB.</li>
                                        </ul>
                                    </FormText>
                                </Col>
                                { props.initialValues.scan_pbb && (
                                    <Col md={4}>
                                        <Link to={storage+"/"+props.initialValues.no_peserta+"/"+props.initialValues.scan_pbb} target="_blank" className="btn btn-success btn-block"><i className="fa fa-file"></i> Lihat Tagihan PBB</Link>
                                    </Col>
                                )}
                            </FormGroup>
                        </div>
                    )}
        
                    { status_kepemilikan === "kontrak" && (
                        <div>
                            <FormGroup row>
                                <Label for="biaya_kontrak" md={3}>Biaya Kontrak</Label>
                                <Col md={5} xs={12}>
                                    <Field type="number" component={InputBs} pattern="[0-9]*" title="Hanya isi dengan angka (0-9)" name="biaya_kontrak" placeholder="Biaya Kontrak Terbaru" id="biaya_kontrak" validate={[ money ]}/>
                                    <FormText color="muted">
                                        <ul className="list-reset">
                                            <li>Biaya kontrak <b>per tahun</b>;</li>
                                            <li>Hanya isi dengan angka (0-9).</li>
                                        </ul>
                                    </FormText>
                                </Col>
                                <Col md={4} xs={12}>
                                    <Alert color="success">{ rupiah(biaya_kontrak) } </Alert>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="file_scan_kontrak" md={3}>Surat Perjanjian Kontrak</Label>
                                <Col md={5}>
                                    <Field component={InputFileBs} type="file" name="file_scan_kontrak" id="file_scan_kontrak" />
                                    <FormText color="muted">
                                        <ul className="list-reset">
                                            <li>Ekstensi berkas berupa PDF;</li>
                                            <li>Ukuran berkas tidak lebih dari 500KB.</li>
                                        </ul>
                                    </FormText>
                                </Col>
                                <Col md={4}>
                                    <Button color="primary" size="sm" block><i className="fa fa-download"></i> Unduh Contoh <br/>Surat Perjanjian Kontrak</Button>
                                    { props.initialValues.scan_kontrak && (
                                        <Link to={storage+"/"+props.initialValues.no_peserta+"/"+props.initialValues.scan_kontrak} target="_blank" className="btn btn-success btn-block btn-sm"><i className="fa fa-file"></i> Lihat Surat Perjanjian Kontrak</Link>
                                    )}
                                </Col>
                            </FormGroup>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter className="text-right">
                    <Button color="success" type="submit" form="form-rumah" disabled={pristine || submitting}><i className="fa fa-save"></i> Simpan</Button>{' '}
                    <Button color="warning" onClick={handleToggleRumah}>Batal</Button>
                </ModalFooter>
            </Modal>
        </Form>
    )
}

class Rumah extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            modalToggle: false
        }
        this.modalToggle = this.modalToggle.bind(this)
        this.submitRumah = this.submitRumah.bind(this)
    }
    componentWillMount(){
        this.props.dispatch(rumah.getById(cookies.get(cookieName), this.props.noPeserta))
    }
    modalToggle = () => {
        this.setState({
            modalToggle: !this.state.modalToggle
        })
    }
    submitRumah = (values) => {
        this.setState({
            modalToggle: !this.state.modalToggle
        })
        var formData = new FormData()
        for(var key in values){
            var file = key.startsWith("file_scan") ? key : null
            if(file){
                formData.append(key, values[key][0])   
                document.getElementById(file).value = null;     
            }else{
                formData.append(key, values[key])
            }
        }
        this.props.dispatch(rumah.updateData(cookies.get(cookieName), formData, this.props.noPeserta))
        this.props.dispatch(reset('DataRumahSeleksi'));
    }
    render(){
        return (
            <Row>
                <Col md={12}>
                    <Row>
                        <Col md="6">
                            <h4>Rumah</h4>
                        </Col>
                        <Col md="6" className="text-right">
                            { this.props.editable && (
                                <Button color="warning" size="sm" onClick={this.modalToggle}><i className="fa fa-pencil"></i> Perbarui</Button>
                            )}
                        </Col>
                    </Row>
                    <hr/>
                    <Table responsive striped bordered>
                        <tbody>
                            <tr>
                                <td width="30%">Status Rumah</td>
                                <td width="5%">:</td>
                                <td>{ this.props.rumah.status_kepemilikan }</td>
                            </tr>
                            { this.props.rumah.status_kepemilikan !== "menumpang" && (
                                <tr>
                                    <td>Jumlah Kepala Keluarga</td>
                                    <td>:</td>
                                    <td>{ this.props.rumah.jumlah_kepala_keluarga } <b>Kepala Keluarga dalam 1 rumah</b></td>
                                </tr>
                            )}
                        </tbody>

                        { this.props.rumah.status_kepemilikan === "milik_sendiri" && (
                            <tbody>                            
                                <tr>
                                    <td>Status Sertifikat</td>
                                    <td>:</td>
                                    <td>{ this.props.rumah.status_sertifikat }</td>
                                </tr>
                            </tbody>
                        )}

                        { (this.props.rumah.status_kepemilikan === "milik_sendiri" ||  this.props.rumah.status_kepemilikan === "bersama_saudara") && (
                            <tbody>
                                <tr>
                                    <td>Luas Tanah</td>
                                    <td>:</td>
                                    <td>{ this.props.rumah.luas_tanah } m<sup>2</sup></td>
                                </tr>
                                <tr>
                                    <td>Luas Bangunan</td>
                                    <td>:</td>
                                    <td>{ this.props.rumah.luas_bangunan } m<sup>2</sup></td>
                                </tr>
                                <tr>
                                    <td>Biaya PBB</td>
                                    <td>:</td>
                                    <td>{ rupiah(this.props.rumah.biaya_pbb) } <b>/ tahun</b></td>
                                </tr>
                                <tr>
                                    <td>Bukti Tagihan PBB</td>
                                    <td>:</td>
                                    <td>
                                    { this.props.rumah.scan_pbb && (                                        
                                        <Link to={ storage+"/"+this.props.rumah.no_peserta+"/"+this.props.rumah.scan_pbb } target="_blank">
                                            <Button color="primary" size="sm"><i className="fa fa-download"></i> Lihat Bukti Tagihan PBB</Button>
                                        </Link>
                                    )}
                                    </td>
                                </tr>
                            </tbody>
                        )}

                        { this.props.rumah.status_kepemilikan === "kontrak" && (
                            <tbody>
                                <tr>
                                    <td>Biaya Kontrak</td>
                                    <td>:</td>
                                    <td>{ rupiah(this.props.rumah.biaya_kontrak) } <b>/ tahun</b></td>
                                </tr>
                                <tr>
                                    <td>Surat Perjanjian Kontrak</td>
                                    <td>:</td>
                                    <td>
                                    { this.props.rumah.scan_kontrak && (
                                        <Link to={ storage+"/"+this.props.rumah.no_peserta+"/"+this.props.rumah.scan_kontrak } target="_blank">
                                            <Button color="primary" size="sm"><i className="fa fa-download"></i> Lihat Surat Perjanjian Kontrak</Button>
                                        </Link>
                                    )}
                                    </td>
                                </tr>
                            </tbody>
                        )}
                    </Table>
                    <FormRumah
                        onSubmit={this.submitRumah}
                        initialValues={this.props.rumah}
                        toggleRumah={this.state.modalToggle}
                        handleToggleRumah={this.modalToggle}
                        /> 
                </Col>
            </Row>
        )
    }
}

FormRumah = reduxForm({
    form: 'DataRumahSeleksi',
    enableReinitialize: true,
})(FormRumah)

const selector = formValueSelector('DataRumahSeleksi')

FormRumah = connect((store) => {
    let {status_kepemilikan, biaya_pbb, biaya_kontrak} = selector(store, 'status_kepemilikan', 'biaya_pbb', 'biaya_kontrak')
    return {
        status_kepemilikan,
        biaya_pbb,
        biaya_kontrak,
    }
})(FormRumah)

export default connect(
    (store) => ({
        rumah: store.rumah.rumah,
    })
)(Rumah)