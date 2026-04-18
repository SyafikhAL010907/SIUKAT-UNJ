import React from 'react';
import {
    Card,
    Button,
    CardTitle,
    Col,
    Row,
    Alert,
    Form,
    FormGroup,
    Label,
    FormText
} from 'reactstrap';
import { Field, reduxForm, reset, formValueSelector } from 'redux-form';
import {
    InputBs,
    InputFileBs,
    money,
    AlertFormLengkap,
    AlertFormBelumLengkap,
} from '../';
import { kendaraan } from '../../../../actions';
import { connect } from 'react-redux';
import { cookies, cookieName, rupiah, storage } from '../../../../global';

let FormKendaraanSeleksi = (props) => {
    const {
        handleSubmit,
        pristine,
        submitting,
        status_mobil,
        status_motor,
        pajak_motor,
        pajak_mobil,
    } = props;
    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <legend className="mb-4">
                    <i className="fa fa-motorcycle mr-2"></i> Data Motor
                </legend>
            </FormGroup>
            <FormGroup row className="mb-4">
                <Label for="status_motor" col="12" xl="3" className="mb-2 mb-xl-0">Status Motor</Label>
                <Col col="12" xl="9">
                    <Row>
                        <Col col="6" sm="4" xl="3">
                            <FormGroup check>
                                <Label check>
                                    <Field
                                        type="radio"
                                        component={InputBs}
                                        name="status_motor"
                                        value="ada"
                                    />{' '}Ada</Label>
                            </FormGroup>
                        </Col>
                        <Col col="6" sm="8" xl="9">
                            <FormGroup check>
                                <Label check>
                                    <Field
                                        type="radio"
                                        component={InputBs}
                                        name="status_motor"
                                        value="tidak"
                                    />{' '}Tidak Ada</Label>
                            </FormGroup>
                        </Col>
                    </Row>
                </Col>
            </FormGroup>

            {status_motor === 'ada' && (
                <>
                    <FormGroup row className="mb-4">
                        <Label for="jumlah_motor" col="12" xl="3" className="mb-2 mb-xl-0">Jumlah Motor</Label>
                        <Col col="12" xl="9">
                            <Field
                                type="number"
                                component={InputBs}
                                name="jumlah_motor"
                                id="jumlah_motor"
                                placeholder="Jumlah Motor"
                            />
                            <FormText color="muted">
                                <ul className="list-reset text-xs sm:text-sm">
                                    <li>Jumlah motor yang dimiliki anggota keluarga dalam Kartu Keluarga</li>
                                </ul>
                            </FormText>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="pajak_motor" col="12" xl="3" className="mb-2 mb-xl-0">Total Pajak Motor</Label>
                        <Col col="12" xl="6">
                            <Field
                                type="number"
                                component={InputBs}
                                pattern="[0-9]*"
                                title="Hanya isi dengan angka (0-9)"
                                name="pajak_motor"
                                id="pajak_motor"
                                placeholder="Total Pajak Motor"
                                validate={[money]}
                            />
                            <FormText color="muted">
                                <ul className="list-reset text-xs sm:text-sm">
                                    <li>Total Pajak Motor <b>per tahun</b>;</li>
                                    <li>Jika memiliki lebih dari 1 motor, masukkan <b>jumlah total</b> pajak;</li>
                                </ul>
                            </FormText>
                        </Col>
                        <Col col="12" xl="3" className="mt-2 mt-xl-0">
                            <Alert color="success" className="mb-0 py-2 text-center text-sm">{rupiah(pajak_motor)}</Alert>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="file_scan_motor" col="12" xl="3" className="mb-2 mb-xl-0">STNK Motor</Label>
                        <Col col="12" xl="6">
                            <Field
                                component={InputFileBs}
                                type="file"
                                accept="application/pdf"
                                name="file_scan_motor"
                                id="file_scan_motor"
                            />
                            <FormText color="muted">
                                <ul className="list-reset text-xs sm:text-sm">
                                    <li>Scan seluruh STNK motor (PDF, maks 500KB);</li>
                                </ul>
                            </FormText>
                        </Col>
                        {props.initialValues.scan_motor && (
                            <Col col="12" xl="3" className="mt-2 mt-xl-0">
                                <a
                                    href={
                                        storage +
                                        '/' +
                                        props.initialValues.scan_motor
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-success btn-block py-2 text-sm"
                                >
                                    <i className="fa fa-file"></i> Lihat STNK Motor
                                </a>
                            </Col>
                        )}
                    </FormGroup>
                </>
            )}

            <FormGroup className="mt-4 pt-4 border-top">
                <legend className="mb-4">
                    <i className="fa fa-car mr-2"></i> Data Mobil
                </legend>
            </FormGroup>
            <FormGroup row className="mb-4">
                <Label for="status_mobil" col="12" xl="3" className="mb-2 mb-xl-0">
                    Status Mobil</Label>
                <Col col="12" xl="9">
                    <Row>
                        <Col col="6" sm="4" xl="3">
                            <FormGroup check>
                                <Label check>
                                    <Field
                                        type="radio"
                                        component={InputBs}
                                        name="status_mobil"
                                        value="ada"
                                    />{' '}Ada</Label>
                            </FormGroup>
                        </Col>
                        <Col col="6" sm="8" xl="9">
                            <FormGroup check>
                                <Label check>
                                    <Field
                                        type="radio"
                                        component={InputBs}
                                        name="status_mobil"
                                        value="tidak"
                                    />{' '}Tidak Ada</Label>
                            </FormGroup>
                        </Col>
                    </Row>
                </Col>
            </FormGroup>

            {status_mobil === 'ada' && (
                <div>
                    <FormGroup row className="mb-4">
                        <Label for="jumlah_mobil" col="12" xl="3" className="mb-2 mb-xl-0">Jumlah Mobil</Label>
                        <Col col="12" xl="9">
                            <Field
                                type="number"
                                component={InputBs}
                                name="jumlah_mobil"
                                id="jumlah_mobil"
                                placeholder="Jumlah Mobil"
                            />
                            <FormText color="muted">
                                <ul className="list-reset text-xs sm:text-sm">
                                    <li>Jumlah mobil yang dimiliki anggota keluarga dalam Kartu Keluarga</li>
                                </ul>
                            </FormText>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="pajak_mobil" col="12" xl="3" className="mb-2 mb-xl-0">Total Pajak Mobil</Label>
                        <Col col="12" xl="6">
                            <Field
                                type="number"
                                component={InputBs}
                                pattern="[0-9]*"
                                title="Hanya isi dengan angka (0-9)"
                                name="pajak_mobil"
                                id="pajak_mobil"
                                placeholder="Total Pajak Mobil"
                                validate={[money]}
                            />
                            <FormText color="muted">
                                <ul className="list-reset text-xs sm:text-sm">
                                    <li>Total Pajak Mobil <b>per tahun</b>;</li>
                                    <li>Jika memiliki lebih dari 1 mobil, masukkan <b>jumlah total</b> pajak;</li>
                                </ul>
                            </FormText>
                        </Col>
                        <Col col="12" xl="3" className="mt-2 mt-xl-0">
                            <Alert color="success" className="mb-0 py-2 text-center text-sm">{rupiah(pajak_mobil)}</Alert>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="file_scan_mobil" col="12" xl="3" className="mb-2 mb-xl-0">STNK Mobil</Label>
                        <Col col="12" xl="6">
                            <Field
                                component={InputFileBs}
                                type="file"
                                accept="application/pdf"
                                name="file_scan_mobil"
                                id="file_scan_mobil"
                            />
                            <FormText color="muted">
                                <ul className="list-reset text-xs sm:text-sm">
                                    <li>Scan seluruh STNK mobil (PDF, maks 500KB);</li>
                                </ul>
                            </FormText>
                        </Col>
                        {props.initialValues.scan_mobil && (
                            <Col col="12" xl="3" className="mt-2 mt-xl-0">
                                <a
                                    href={
                                        storage +
                                        '/' +
                                        props.initialValues.scan_mobil
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-success btn-block py-2 text-sm"
                                >
                                    <i className="fa fa-file"></i> Lihat STNK Mobil
                                </a>
                            </Col>
                        )}
                    </FormGroup>
                </div>
            )}

            <FormGroup row className="mt-5 border-top pt-4 mb-0">
                <Col col="12" xl="8">
                    {!props.allow ? <AlertFormBelumLengkap /> : <AlertFormLengkap />}
                </Col>
                <Col col="12" xl="4" className="mt-3 mt-xl-0">
                    <Button
                        type="submit"
                        className="modern-btn-primary w-100 py-3 shadow-sm font-weight-bold"
                        disabled={pristine || submitting}
                    >
                        <i className="fa fa-save mr-2"></i> Simpan Data Kendaraan
                    </Button>
                </Col>
            </FormGroup>
        </Form>
    );
};

class DataKendaraanSeleksi extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(kendaraan.getByLoggedIn(cookies.get(cookieName)));
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
        this.props.dispatch(kendaraan.updateData(cookies.get(cookieName), formData)).then(() => {
            // this.props.dispatch(reset('DataKendaraanSeleksi'));
            if (this.props.updateVerifikasi) {
                this.props.updateVerifikasi();
            }
        }).catch(err => {
            console.error("Gagal simpan data kendaraan:", err);
        });
    }

    render() {
        return (
            <Card className="premium-card p-4 p-md-5">
                <CardTitle tag="h4" className="mb-4">Data Kendaraan</CardTitle>
                <Alert color="warning" className="rounded-lg border-0 shadow-sm mb-4">
                    <i className="fa fa-info-circle mr-2"></i>
                    <strong>Seluruh kolom pada Data Kendaraan Wajib Diisi</strong>
                    <br />
                    <small className="ml-4">Isi dengan tanda strip (-) jika tidak memiliki kendaraan.</small>
                </Alert>
                <FormKendaraanSeleksi
                    onSubmit={this.submitForm}
                    initialValues={this.props.kendaraan}
                    allow={this.props.allow}
                />
            </Card>
        );
    }
}

FormKendaraanSeleksi = reduxForm({
    form: 'DataKendaraanSeleksi',
    enableReinitialize: true,
})(FormKendaraanSeleksi);

const selector = formValueSelector('DataKendaraanSeleksi');

FormKendaraanSeleksi = connect((store) => {
    let { status_motor, status_mobil, pajak_motor, pajak_mobil } = selector(
        store,
        'status_motor',
        'status_mobil',
        'pajak_motor',
        'pajak_mobil'
    );
    return {
        status_motor,
        status_mobil,
        pajak_motor,
        pajak_mobil,
    };
})(FormKendaraanSeleksi);

export default connect((store) => ({
    kendaraan: store.kendaraan.kendaraan,
}))(DataKendaraanSeleksi);
