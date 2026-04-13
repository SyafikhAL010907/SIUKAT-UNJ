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
    InputDayPicker,
    InputFileBs,
    money,
    AlertFormLengkap,
    AlertFormBelumLengkap,
} from '../';
import { wali, kabkot, kecamatan, provinsi, pekerjaan } from '../../../../actions';
import { files } from '../../../../api';
import { connect } from 'react-redux';
import { cookies, cookieName, rupiah, storage } from '../../../../global';

let FormWaliSeleksi = (props) => {
    const {
        handleSubmit,
        pristine,
        submitting,
        dispatch,
        ref_provinsi_wali,
        ref_kabkot_wali,
        ref_kecamatan_wali,
        status_wali,
        kesanggupan_wali,
        textUnduhWali,
        unduhWali,
    } = props;

    const handleProvinsi = (e) => {
        dispatch(kabkot.fetchForWali(e.target.value));
        dispatch(
            {
                type: 'FETCH_KECAMATAN_WALI_FULFILLED',
                payload: [],
            }
        );
    };
    const handleKabkot = (e) => {
        dispatch(kecamatan.fetchForWali(e.target.value));
    };
    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup row className="mb-4">
                <Label for="status_wali" md={3}>
                    Status Wali
                </Label>
                <Col md={9}>
                    <Row>
                        <Col md={3}>
                            <FormGroup check>
                                <Label check>
                                    <Field
                                        name="status_wali"
                                        component={InputBs}
                                        type="radio"
                                        value="ada"
                                    />{' '}Ada</Label>
                            </FormGroup>
                        </Col>

                        <Col md={3}>
                            <Label check>
                                <Field
                                    name="status_wali"
                                    component={InputBs}
                                    type="radio"
                                    value="tidak"
                                />{' '}Tidak Ada</Label>
                        </Col>
                    </Row>
                </Col>
            </FormGroup>

            {status_wali === 'ada' && (
                <div>
                    <FormGroup row className="mb-4">
                        <Label for="nama_wali" md={3}>
                            Nama Lengkap
                        </Label>
                        <Col md={9}>
                            <Field
                                name="nama_wali"
                                component={InputBs}
                                type="text"
                                placeholder="Nama Lengkap"
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="alamat_wali" md={3}>
                            Alamat Lengkap
                        </Label>
                        <Col md={9}>
                            <Field
                                name="alamat_wali"
                                component={InputBs}
                                type="textarea"
                                rows="3"
                                placeholder="Alamat Lengkap"
                            />{' '}
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="provinsi_wali" md={3}>
                            Provinsi
                        </Label>
                        <Col md={9}>
                            <Field
                                name="provinsi_wali"
                                component={InputBs}
                                type="select"
                                onChange={handleProvinsi}
                            >
                                {' '}
                                <option value="">-- Pilih Provinsi --</option>
                                {Array.isArray(ref_provinsi_wali)
                                    ? ref_provinsi_wali.map((data, key) => (
                                        <option value={data.provinsi_id} key={key}>
                                            {data.provinsi_nama}
                                        </option>
                                    ))
                                    : ''}
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="kabkot_wali" md={3}>
                            Kab/Kota
                        </Label>
                        <Col md={9}>
                            <Field
                                name="kabkot_wali"
                                component={InputBs}
                                type="select"
                                onChange={handleKabkot}
                            >
                                {' '}
                                <option value="">-- Pilih Kabupaten/Kota --</option>
                                {Array.isArray(ref_kabkot_wali)
                                    ? ref_kabkot_wali.map((data, key) => (
                                        <option value={data.kab_id} key={key}>
                                            {data.kab_nama}
                                        </option>
                                    ))
                                    : ''}
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="kecamatan_wali" sm={3}>
                            Kecamatan
                        </Label>
                        <Col sm={9}>
                            <Field name="kecamatan_wali" component={InputBs} type="select">
                                {' '}
                                <option value="">-- Pilih Kecamatan --</option>
                                {Array.isArray(ref_kecamatan_wali)
                                    ? ref_kecamatan_wali.map((data, key) => (
                                        <option value={data.kecam_id} key={key}>
                                            {data.kecam_nama}
                                        </option>
                                    ))
                                    : ''}
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="kesanggupan_wali" md={3}>
                            Komitmen Pembiayaan
                        </Label>
                        <Col md={5} xs={12}>
                            <Field
                                type="number"
                                component={InputBs}
                                pattern="[0-9]*"
                                title="Hanya isi dengan angka (0-9)"
                                name="kesanggupan_wali"
                                id="kesanggupan_wali"
                                placeholder="Komitmen Pembiayaan Wali"
                                validate={[money]}
                            />
                            <FormText color="muted">
                                <ul className="list-reset">
                                    <li>
                                        Komitmen pembiayaan <b>per bulan</b>;
                                    </li>
                                </ul>
                            </FormText>
                        </Col>
                        <Col md={4} xs={12}>
                            <Alert color="success">{rupiah(kesanggupan_wali)}</Alert>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="file_scan_wali" md={3}>
                            Surat Komitmen Pembiayaan Wali
                        </Label>
                        <Col md={5}>
                            <Field
                                component={InputFileBs}
                                type="file"
                                accept="application/pdf"
                                name="file_scan_wali"
                                id="file_scan_wali"
                            />
                            <FormText color="muted">
                                <ul className="list-reset">
                                    <li>Ekstensi berkas berupa PDF;</li>
                                    <li>Ukuran berkas tidak lebih dari 500KB.</li>
                                </ul>
                            </FormText>
                        </Col>
                        <Col md={4}>
                            <Button color="primary" size="sm" block onClick={unduhWali}>
                                <i className="fa fa-download"></i> {textUnduhWali}
                            </Button>
                            {props.initialValues.scan_wali && (
                                <a
                                    href={
                                        storage +
                                        '/' +
                                        props.initialValues.scan_wali
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-success btn-block btn-sm"
                                >
                                    <i className="fa fa-file"></i> Lihat Surat Komitmen Wali
                                </a>
                            )}
                        </Col>
                    </FormGroup>
                </div>
            )}
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
                        <i className="fa fa-save mr-2"></i> Simpan Data Wali
                    </Button>
                </Col>
            </FormGroup>
        </Form>
    );
};
class DataWaliSeleksi extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(provinsi.fetchProvinsi());
        this.props.dispatch(wali.fetchAllData(cookies.get(cookieName)));
        this.setState({
            textUnduhWali: 'Unduh Contoh Surat Komitmen Wali',
        });
    }
    unduhWali = () => {
        this.setState({
            textUnduhWali: 'Sedang mengunduh...',
        });
        files
            .unduhWali()
            .then(() => {
                this.setState({
                    textUnduhWali: 'Unduh Contoh Surat Komitmen Wali',
                });
            })
            .catch(() => {
                this.setState({
                    textUnduhWali: 'Unduh Contoh Surat Komitmen Wali',
                });
            });
    }
    submitForm = (values) => {
        var formData = new FormData();
        for (var key in values) {
            var fileField = key.startsWith('file_scan') ? key : null;
            if (fileField) {
                // Pastikan file didefinisikan sebelum append (mencegah error saat edit tanpa re-upload)
                if (values[key] && values[key].length > 0) {
                    formData.append(key, values[key][0]);
                    const el = document.getElementById(fileField);
                    if (el) el.value = null;
                }
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
        this.props.dispatch(wali.updateData(cookies.get(cookieName), formData)).then(() => {
            this.props.dispatch(reset('DataWaliSeleksi'));
            if (this.props.updateVerifikasi) {
                this.props.updateVerifikasi();
            }
        }).catch(err => {
            console.error("Gagal simpan data wali:", err);
        });
    }
    render() {
        return (
            <Card className="premium-card p-4 p-md-5">
                <CardTitle tag="h4" className="mb-4">Data Wali</CardTitle>
                <Alert color="warning" className="rounded-lg border-0 shadow-sm mb-4">
                    <i className="fa fa-info-circle mr-2"></i>
                    <strong>Seluruh kolom pada Data Wali Wajib Diisi</strong>
                    <br />
                    <small className="ml-4">Isi dengan tanda strip (-) jika tidak memiliki wali.</small>
                </Alert>
                <FormWaliSeleksi
                    onSubmit={this.submitForm}
                    initialValues={this.props.wali}
                    allow={this.props.allow}
                    unduhWali={this.unduhWali.bind(this)}
                    textUnduhWali={this.state.textUnduhWali}
                />
            </Card>
        );
    }
}

FormWaliSeleksi = reduxForm({
    form: 'DataWaliSeleksi',
    enableReinitialize: true,
})(FormWaliSeleksi);

const selector = formValueSelector('DataWaliSeleksi');

FormWaliSeleksi = connect(
    (store) => {
        let { status_wali, kesanggupan_wali } = selector(
            store,
            'status_wali',
            'kesanggupan_wali'
        );
        return {
            status_wali,
            kesanggupan_wali,

            ref_provinsi_wali: store.provinsi.provinsi,
            ref_kabkot_wali: store.kabkot.kabkot_wali,
            ref_kecamatan_wali: store.kecamatan.kecamatan_wali,
        };
    }
)(FormWaliSeleksi);

export default connect((store) => ({
    wali: store.wali.wali,
}))(DataWaliSeleksi);
