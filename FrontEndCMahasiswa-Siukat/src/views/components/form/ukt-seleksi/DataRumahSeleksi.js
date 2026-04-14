import React from 'react';
import {
    Card,
    Button,
    CardTitle,
    Col,
    Alert,
    Form,
    FormGroup,
    FormText,
    Label,
    Row
} from 'reactstrap';
import { Field, reduxForm, reset, formValueSelector } from 'redux-form';
import {
    InputBs,
    InputFileBs,
    money,
    AlertFormLengkap,
    AlertFormBelumLengkap,
} from '../';
import { rumah } from '../../../../actions';
import { files } from '../../../../api';
import { connect } from 'react-redux';
import { cookies, cookieName, rupiah, storage } from '../../../../global';

let FormRumahSeleksi = (props) => {
    const {
        handleSubmit,
        pristine,
        submitting,
        status_kepemilikan,
        biaya_kontrak,
        biaya_pbb,
        textUnduhKontrak,
        unduhKontrak,
    } = props;
    return (
        <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
                <Label for="status_kepemilikan" md={3} xs={12}>Status Rumah</Label>
                <FormGroup tag="fieldset" className="col">
                    <FormGroup check>
                        <Label check>
                            <Field
                                type="radio"
                                component={InputBs}
                                name="status_kepemilikan"
                                value="milik_sendiri"
                            />{' '}Milik Sendiri</Label>
                    </FormGroup>
                    <FormGroup check>
                        <Label check>
                            <Field
                                type="radio"
                                component={InputBs}
                                name="status_kepemilikan"
                                value="bersama_saudara"
                            />{' '}Tinggal Bersama Saudara</Label>
                    </FormGroup>
                    <FormGroup check>
                        <Label check>
                            <Field
                                type="radio"
                                component={InputBs}
                                name="status_kepemilikan"
                                value="kontrak"
                            />{' '}Kontrak</Label>
                    </FormGroup>
                    <FormGroup check>
                        <Label check>
                            <Field
                                type="radio"
                                component={InputBs}
                                name="status_kepemilikan"
                                value="menumpang"
                            />{' '}Menumpang</Label>
                    </FormGroup>
                </FormGroup>
            </Row>
            {status_kepemilikan === 'milik_sendiri' && (
                <Row className="mb-4">
                    <Label for="status_sertifikat" md={3}>Status Sertifikat</Label>
                    <FormGroup tag="fieldset" className="col">
                        <FormGroup check>
                            <Label check>
                                <Field
                                    type="radio"
                                    name="status_sertifikat"
                                    component={InputBs}
                                    value="hak_milik"
                                />{' '}Hak Milik</Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Field
                                    type="radio"
                                    name="status_sertifikat"
                                    component={InputBs}
                                    value="hak_guna_bangunan"
                                />{' '}Hak Guna Bangunan</Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Field
                                    type="radio"
                                    name="status_sertifikat"
                                    component={InputBs}
                                    value="tanpa_sertifikat"
                                />{' '}Tanpa Sertifikat</Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Field
                                    type="radio"
                                    name="status_sertifikat"
                                    component={InputBs}
                                    value="tanah_girik"
                                />{' '}Tanah Girik</Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Field
                                    type="radio"
                                    name="status_sertifikat"
                                    component={InputBs}
                                    value="lainnya"
                                />{' '}Lainnya</Label>
                        </FormGroup>
                    </FormGroup>
                </Row>
            )}

            {
                status_kepemilikan === 'bersama_saudara' && (
                    <div>
                        <FormGroup row className="mb-4">
                            <Label for="jumlah_kepala_keluarga" md={3}>Jumlah Kepala Keluarga</Label>
                            <Col md={9}>
                                <Field
                                    type="text"
                                    component={InputBs}
                                    name="jumlah_kepala_keluarga"
                                    id="jumlah_kepala_keluarga"
                                    placeholder="Jumlah Kepala Keluarga Dalam Satu Rumah"
                                />
                            </Col>
                        </FormGroup>
                    </div>
                )
            }

            {
                (status_kepemilikan === 'milik_sendiri' || status_kepemilikan === 'bersama_saudara') && (
                    <div>
                        <FormGroup row className="mb-4">
                            <Label for="luas_tanah" md={3}>Luas Tanah</Label>
                            <Col md={9}>
                                <Field
                                    type="text"
                                    component={InputBs}
                                    name="luas_tanah"
                                    id="luas_tanah"
                                    placeholder="Luas Tanah"
                                />
                                <FormText color="muted">
                                    <ul className="list-reset">
                                        <li>Luas tanah sesuai PBB;</li>
                                        <li>Dalam satuan m<sup>2</sup>.</li>
                                    </ul>
                                </FormText>
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-4">
                            <Label for="luas_bangunan" md={3}>Luas Bangunan</Label>
                            <Col md={9}>
                                <Field
                                    type="text"
                                    component={InputBs}
                                    name="luas_bangunan"
                                    id="luas_bangunan"
                                    placeholder="Luas Bangunan"
                                />
                                <FormText color="muted">
                                    <ul className="list-reset">
                                        <li>Luas bangunan sesuai PBB;</li>
                                        <li>Dalam satuan m<sup>2</sup>.</li>
                                    </ul>
                                </FormText>
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-4">
                            <Label for="biaya_pbb" md={3}>Biaya PBB</Label>
                            <Col md={5} xs={12}>
                                <Field
                                    type="number"
                                    component={InputBs}
                                    pattern="[0-9]*"
                                    title="Hanya isi dengan angka (0-9)"
                                    name="biaya_pbb"
                                    placeholder="Biaya PBB Terbaru"
                                    id="biaya_pbb"
                                    validate={[money]}
                                />
                                <FormText color="muted">
                                    <ul className="list-reset">
                                        <li>Biaya PBB terbaru / tahun terakhir;</li>
                                        <li>
                                            Isi dengan angka <b>satu (1)</b> jika biaya PBB sama dengan
Rp. 0.</li>
                                    </ul>
                                </FormText>
                            </Col>
                            <Col md={4} xs={12}>
                                <Alert color="success">{rupiah(biaya_pbb)} </Alert>
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-4">
                            <Label for="file_scan_pbb" md={3}>Tagihan PBB</Label>
                            <Col md={5}>
                                <Field
                                    component={InputFileBs}
                                    type="file"
                                    accept="application/pdf"
                                    name="file_scan_pbb"
                                    id="file_scan_pbb"
                                />
                                <FormText color="muted">
                                    <ul className="list-reset">
                                        <li>Ekstensi berkas berupa PDF;</li>
                                        <li>Ukuran berkas tidak lebih dari 500KB.</li>
                                    </ul>
                                </FormText>
                            </Col>
                            {props.initialValues.scan_pbb && (
                                <Col md={4}>
                                    <a
                                        href={
                                            storage +
                                            '/' +
                                            props.initialValues.scan_pbb
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-success btn-block"
                                    >
                                        <i className="fa fa-file"></i> Lihat Tagihan PBB</a>
                                </Col>
                            )}
                        </FormGroup>
                    </div>
                )
            }

            {
                status_kepemilikan === 'kontrak' && (
                    <div>
                        <FormGroup row className="mb-4">
                            <Label for="biaya_kontrak" md={3}>Biaya Kontrak</Label>
                            <Col md={5} xs={12}>
                                <Field
                                    type="number"
                                    component={InputBs}
                                    pattern="[0-9]*"
                                    title="Hanya isi dengan angka (0-9)"
                                    name="biaya_kontrak"
                                    placeholder="Biaya Kontrak Terbaru"
                                    id="biaya_kontrak"
                                    validate={[money]}
                                />
                                <FormText color="muted">
                                    <ul className="list-reset">
                                        <li>Biaya kontrak <b>per tahun</b>;</li>
                                        {/* <li>Hanya isi dengan angka (0-9).</li> */}
                                    </ul>
                                </FormText>
                            </Col>
                            <Col md={4} xs={12}>
                                <Alert color="success">{rupiah(biaya_kontrak)} </Alert>
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-4">
                            <Label for="file_scan_kontrak" md={3}>Surat Perjanjian Kontrak</Label>
                            <Col md={5}>
                                <Field
                                    component={InputFileBs}
                                    type="file"
                                    accept="application/pdf"
                                    name="file_scan_kontrak"
                                    id="file_scan_kontrak"
                                />
                                <FormText color="muted">
                                    <ul className="list-reset">
                                        <li>Ekstensi berkas berupa PDF;</li>
                                        <li>Ukuran berkas tidak lebih dari 500KB.</li>
                                    </ul>
                                </FormText>
                            </Col>
                            <Col md={4}>
                                <Button color="primary" size="sm" block onClick={unduhKontrak}>
                                    <i className="fa fa-download"></i> {textUnduhKontrak}
                                </Button>
                                {props.initialValues.scan_kontrak && (
                                    <a
                                        href={
                                            storage +
                                            '/' +
                                            props.initialValues.scan_kontrak
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-success btn-block btn-sm"
                                    >
                                        <i className="fa fa-file"></i> Lihat Surat Perjanjian Kontrak
                                    </a>
                                )}
                            </Col>
                        </FormGroup>
                    </div>
                )
            }

            <FormGroup row className="mt-5 border-top pt-4 mb-0">
                <Col md={{ size: 8 }} xs="12">
                    {!props.allow ? <AlertFormBelumLengkap /> : <AlertFormLengkap />}
                </Col>
                <Col md={{ size: 4 }} xs="12">
                    <Button
                        type="submit"
                        className="modern-btn-primary w-100 py-3 shadow-sm font-weight-bold"
                        disabled={pristine || submitting}
                    >
                        <i className="fa fa-save mr-2"></i> Simpan Data Rumah
                    </Button>
                </Col>
            </FormGroup>
        </Form >
    );
};
class DataRumahSeleksi extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textUnduhKontrak: 'Unduh Contoh Surat Perjanjian Kontrak',
        };
    }
    UNSAFE_componentWillMount() {
        this.props.dispatch(rumah.getByLoggedIn(cookies.get(cookieName)));
    }

    unduhKontrak = () => {
        this.setState({
            textUnduhKontrak: 'Sedang mengunduh...',
        });
        files
            .unduhKontrak()
            .then(() => {
                this.setState({
                    textUnduhKontrak: 'Unduh Contoh Surat Perjanjian Kontrak',
                });
            })
            .catch(() => {
                this.setState({
                    textUnduhKontrak: 'Unduh Contoh Surat Perjanjian Kontrak',
                });
            });
    }
    submitForm = (values) => {
        var formData = new FormData();
        for (var key in values) {
            var file = key.startsWith('file_scan') ? key : null;
            if (file) {
                formData.append(key, values[key][0]);
                document.getElementById(file).value = null;
            } else {
                let val = values[key];
                // Ekstraksi value jika berupa object
                if (val && typeof val === 'object' && !Array.isArray(val)) {
                    // Cek apakah ini Redux Form Field object
                    if (val.input || val.meta || (val.name && val.onChange)) {
                        val = "";
                    } else {
                        val = val.kode || val.id || val.provinsi_id || val.kab_id || val.kecam_id || "";
                    }
                }
                formData.append(key, val || "");
            }
        }
        this.props.dispatch(rumah.updateData(cookies.get(cookieName), formData)).then(() => {
            // this.props.dispatch(reset('DataRumahSeleksi'));
            if (this.props.updateVerifikasi) {
                this.props.updateVerifikasi();
            }
        }).catch(err => {
            console.error("Gagal simpan data rumah:", err);
        });
    }

    render() {
        return (
            <Card className="premium-card p-4 p-md-5">
                <CardTitle tag="h4" className="mb-4">Kondisi & Data Rumah</CardTitle>
                <Alert color="warning" className="rounded-lg border-0 shadow-sm mb-4">
                    <i className="fa fa-info-circle mr-2"></i>
                    <strong>Seluruh kolom pada Data Rumah Wajib Diisi</strong>
                </Alert>
                <FormRumahSeleksi
                    onSubmit={this.submitForm}
                    initialValues={this.props.rumah}
                    allow={this.props.allow}
                    unduhKontrak={this.unduhKontrak.bind(this)}
                    textUnduhKontrak={this.state.textUnduhKontrak}
                />
            </Card>
        );
    }
}

FormRumahSeleksi = reduxForm({
    form: 'DataRumahSeleksi',
    enableReinitialize: true,
})(FormRumahSeleksi);

const selector = formValueSelector('DataRumahSeleksi');

FormRumahSeleksi = connect((store) => {
    let { status_kepemilikan, biaya_pbb, biaya_kontrak } = selector(
        store,
        'status_kepemilikan',
        'biaya_pbb',
        'biaya_kontrak'
    );
    return {
        status_kepemilikan,
        biaya_pbb,
        biaya_kontrak,
    };
})(FormRumahSeleksi);

export default connect((store) => ({
    rumah: store.rumah.rumah,
}))(DataRumahSeleksi);
