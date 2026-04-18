
import React from 'react';
import moment from 'moment';
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
                <Label for="status_wali" col="12" xl="3" className="mb-2 mb-xl-0">
                    Status Wali
                </Label>
                <Col col="12" xl="9">
                    <Row>
                        <Col col="6" sm="4" xl="3">
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

                        <Col col="6" sm="8" xl="9">
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
                        <Label for="nama_wali" col="12" xl="3" className="mb-2 mb-xl-0">
                            Nama Lengkap
                        </Label>
                        <Col col="12" xl="9">
                            <Field
                                name="nama_wali"
                                component={InputBs}
                                type="text"
                                placeholder="Nama Lengkap"
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="alamat_wali" col="12" xl="3" className="mb-2 mb-xl-0">
                            Alamat Lengkap
                        </Label>
                        <Col col="12" xl="9">
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
                        <Label for="provinsi_wali" col="12" xl="3" className="mb-2 mb-xl-0">
                            Provinsi
                        </Label>
                        <Col col="12" xl="9">
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
                        <Label for="kabkot_wali" col="12" xl="3" className="mb-2 mb-xl-0">
                            Kab/Kota
                        </Label>
                        <Col col="12" xl="9">
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
                        <Label for="kecamatan_wali" col="12" xl="3" className="mb-2 mb-xl-0">
                            Kecamatan
                        </Label>
                        <Col col="12" xl="9">
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
                        <Label for="kesanggupan_wali" col="12" xl="3" className="mb-2 mb-xl-0">
                            Komitmen Pembiayaan
                        </Label>
                        <Col col="12" xl="6">
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
                                <ul className="list-reset text-xs sm:text-sm">
                                    <li>
                                        Komitmen pembiayaan <b>per bulan</b>;
                                    </li>
                                </ul>
                            </FormText>
                        </Col>
                        <Col col="12" xl="3" className="mt-2 mt-xl-0">
                            <Alert color="success" className="mb-0 py-2 text-center text-sm">{rupiah(kesanggupan_wali)}</Alert>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="file_scan_wali" col="12" xl="3" className="mb-2 mb-xl-0">
                            Surat Komitmen Pembiayaan Wali
                        </Label>
                        <Col col="12" xl="6">
                            <Field
                                component={InputFileBs}
                                type="file"
                                accept="application/pdf"
                                name="file_scan_wali"
                                id="file_scan_wali"
                            />
                            <FormText color="muted">
                                <ul className="list-reset text-xs sm:text-sm">
                                    <li>Ekstensi berkas berupa PDF;</li>
                                    <li>Ukuran berkas tidak lebih dari 500KB.</li>
                                </ul>
                            </FormText>
                        </Col>
                        <Col col="12" xl="3" className="mt-3 mt-xl-0">
                            <Button color="primary" size="sm" block onClick={unduhWali} className="py-2">
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
                                    className="btn btn-success btn-block btn-sm mt-2 py-2"
                                >
                                    <i className="fa fa-file"></i> Lihat Surat Komitmen Wali
                                </a>
                            )}
                        </Col>
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
                        disabled={submitting}
                    >
                        <i className="fa fa-save mr-2"></i> Simpan Data Wali
                    </Button>
                </Col>
            </FormGroup>
        </Form>
    );
};

class DataWaliSeleksi extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textUnduhWali: 'Unduh Contoh Surat Komitmen Wali',
        };
    }

    UNSAFE_componentWillMount() {
        this.props.dispatch(provinsi.fetchProvinsi());
        this.props.dispatch(wali.fetchAllData(cookies.get(cookieName)));
    }

    unduhWali = () => {
        this.setState({ textUnduhWali: 'Sedang mengunduh...' });
        files.unduhWali()
            .then(() => {
                this.setState({ textUnduhWali: 'Unduh Contoh Surat Komitmen Wali' });
            })
            .catch(() => {
                this.setState({ textUnduhWali: 'Unduh Contoh Surat Komitmen Wali' });
            });
    }

    submitForm = (values) => {
        var formData = new FormData();
        let processedValues = { ...values };

        // LOGIKA PENYESUAIAN DENGAN BACKEND (GOLANG SERVICE)
        if (values.status_wali === 'tidak') {
            // Kita kirim string kosong ("") agar Backend tidak melakukan Preload pada tabel wilayah (mencegah error 500)
            processedValues['nama_wali'] = "-";
            processedValues['alamat_wali'] = "-";
            processedValues['provinsi_wali'] = "";
            processedValues['kabkot_wali'] = "";
            processedValues['kecamatan_wali'] = "";
            processedValues['kesanggupan_wali'] = "0";
        }

        for (var key in processedValues) {
            var fileField = key.startsWith('file_scan') ? key : null;
            if (fileField) {
                // Hanya append jika ada file baru yang diunggah
                if (processedValues[key] && processedValues[key].length > 0) {
                    formData.append(key, processedValues[key][0]);
                    const el = document.getElementById(fileField);
                    if (el) el.value = null;
                }
            } else {
                let val = processedValues[key];
                
                // Format tanggal jika ada
                if (val instanceof Date || moment.isMoment(val)) {
                    val = moment(val).format("YYYY-MM-DD");
                }
                // Handle object value dari dropdown/select
                else if (val && typeof val === 'object' && !Array.isArray(val)) {
                    val = val.provinsi_id || val.kab_id || val.kecam_id || val.id || "";
                }
                
                formData.append(key, val === undefined || val === null ? "" : val);
            }
        }
        
        // Panggil Action Update
        return this.props.dispatch(wali.updateData(cookies.get(cookieName), formData))
            .then(() => {
                if (this.props.updateVerifikasi) {
                    this.props.updateVerifikasi();
                }
                // Refresh data setelah simpan
                this.props.dispatch(wali.fetchAllData(cookies.get(cookieName)));
            })
            .catch(err => {
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
                    <small className="ml-4">Pilih opsi "Tidak Ada" jika Anda tidak memiliki wali.</small>
                </Alert>
                <FormWaliSeleksi
                    onSubmit={this.submitForm}
                    initialValues={this.props.wali}
                    allow={this.props.allow}
                    unduhWali={this.unduhWali}
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