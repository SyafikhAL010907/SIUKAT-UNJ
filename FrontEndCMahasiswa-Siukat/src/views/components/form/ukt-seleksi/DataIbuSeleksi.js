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
    Label,
    FormText,
    Row
} from 'reactstrap';
import { Field, reduxForm, reset, formValueSelector } from 'redux-form';
import {
    InputBs,
    InputDayPicker,
    InputFileBs,
    money,
    SyaratScan,
    AlertFormLengkap,
    AlertFormBelumLengkap,
} from '../';
import { ibu, pekerjaan, kabkot, kecamatan, provinsi } from '../../../../actions';
import { connect } from 'react-redux';
import { cookies, cookieName, rupiah, storage } from '../../../../global';

let FormIbuSeleksi = (props) => {
    const {
        handleSubmit,
        pristine,
        submitting,
        dispatch,
        ref_pekerjaan,
        ref_provinsi_ibu,
        ref_kabkot_ibu,
        ref_kecamatan_ibu,
        status_ibu,
        penghasilan_ibu,
        sampingan_ibu,
        pekerjaan_ibu,
    } = props;

    const handleProvinsi = (e) => {
        dispatch(kabkot.fetchForIbu(e.target.value));
        dispatch(
            { type: 'FETCH_KECAMATAN_IBU_FULFILLED', payload: [] }
        );
    };
    const handleKabkot = (e) => {
        dispatch(kecamatan.fetchForIbu(e.target.value));
    };
    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup row className="mb-4">
                <Label for="nama_ibu" md={3}>
                    Nama Lengkap
                </Label>
                <Col md={9}>
                    <Field
                        name="nama_ibu"
                        component={InputBs}
                        type="text"
                        placeholder="Nama Lengkap"
                    />
                </Col>
            </FormGroup>
            <FormGroup row className="mb-4">
                <Label for="status_ibu" md={3}></Label>
                <Col md={9}>
                    <Row>
                        <Col md={3}>
                            <FormGroup check>
                                <Label check>
                                    <Field
                                        name="status_ibu"
                                        component={InputBs}
                                        type="radio"
                                        value="hidup"
                                    />{' '}Hidup</Label>
                            </FormGroup>
                        </Col>
                        <Col md={9}>
                            <FormGroup check>
                                <Label check>
                                    <Field
                                        name="status_ibu"
                                        component={InputBs}
                                        type="radio"
                                        value="wafat"
                                    />{' '}Wafat / Tidak Diketahui Keberadaaanya</Label>
                            </FormGroup>
                        </Col>
                    </Row>
                </Col>
            </FormGroup>

            {status_ibu === 'hidup' && (
                <div>
                    <FormGroup row className="mb-4">
                        <Label for="nik_ibu" md={3}>
                            NIK
                        </Label>
                        <Col md={9}>
                            <Field
                                name="nik_ibu"
                                component={InputBs}
                                type="text"
                                placeholder="NIK Ibu"
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="file_scan_ktp_ibu" md={3}>
                            KTP Ibu
                        </Label>
                        <Col md={5}>
                            <Field
                                component={InputFileBs}
                                type="file"
                                name="file_scan_ktp_ibu"
                                id="file_scan_ktp_ibu"
                                accept="application/pdf"
                            />
                            <SyaratScan />
                        </Col>
                        {props.initialValues.scan_ktp_ibu && (
                            <Col md={4}>
                                <a
                                    href={
                                        storage +
                                        '/' +
                                        props.initialValues.scan_ktp_ibu
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-success btn-block"
                                >
                                    <i className="fa fa-file"></i> Lihat KTP Ibu
                                </a>
                            </Col>
                        )}
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label md={3} xs={12}>
                            Tempat & <br />
              Tanggal Lahir
                        </Label>
                        <Col md={5}>
                            <Field
                                name="tempat_lahir_ibu"
                                component={InputBs}
                                type="text"
                                placeholder="Tempat Lahir"
                            />{' '}
                        </Col>
                        <Col md={4} xs={12}>
                            <Field
                                name="tanggal_lahir_ibu"
                                component={InputDayPicker}
                                startYear={1940}
                                placeholder="Tanggal Lahir"
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="alamat_ibu" md={3}>
                            Alamat Lengkap
                        </Label>
                        <Col md={9}>
                            <Field
                                name="alamat_ibu"
                                component={InputBs}
                                type="textarea"
                                rows="3"
                                placeholder="Alamat Lengkap"
                            />{' '}
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="provinsi_ibu" md={3}>
                            Provinsi
                        </Label>
                        <Col md={9}>
                            <Field
                                name="provinsi_ibu"
                                component={InputBs}
                                type="select"
                                onChange={handleProvinsi}
                            >
                                {' '}
                                <option value="">-- Pilih Provinsi --</option>
                                {Array.isArray(ref_provinsi_ibu)
                                    ? ref_provinsi_ibu.map((data, key) => (
                                        <option value={data.provinsi_id} key={key}>
                                            {data.provinsi_nama}
                                        </option>
                                    ))
                                    : ''}
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="kabkot_ibu" md={3}>
                            Kab/Kota
                        </Label>
                        <Col md={9}>
                            <Field
                                name="kabkot_ibu"
                                component={InputBs}
                                type="select"
                                onChange={handleKabkot}
                            >
                                {' '}
                                <option value="">-- Pilih Kabupaten/Kota --</option>
                                {Array.isArray(ref_kabkot_ibu)
                                    ? ref_kabkot_ibu.map((data, key) => (
                                        <option value={data.kab_id} key={key}>
                                            {data.kab_nama}
                                        </option>
                                    ))
                                    : ''}
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="kecamatan_ibu" sm={3}>
                            Kecamatan
                        </Label>
                        <Col sm={9}>
                            <Field name="kecamatan_ibu" component={InputBs} type="select">
                                {' '}
                                <option value="">-- Pilih Kecamatan --</option>
                                {Array.isArray(ref_kecamatan_ibu)
                                    ? ref_kecamatan_ibu.map((data, key) => (
                                        <option value={data.kecam_id} key={key}>
                                            {data.kecam_nama}
                                        </option>
                                    ))
                                    : ''}
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="pekerjaan_ibu" md={3}>
                            Pekerjaan
                        </Label>
                        <Col md={9}>
                            <Field
                                type="select"
                                component={InputBs}
                                name="pekerjaan_ibu"
                                id="pekerjaan_ibu"
                            >
                                <option value="">-- Pilih Pekerjaan --</option>
                                {Array.isArray(ref_pekerjaan)
                                    ? ref_pekerjaan.map((data, key) => (
                                        <option value={data.kode} key={key}>
                                            {data.nama}
                                        </option>
                                    ))
                                    : ''}
                            </Field>
                        </Col>
                    </FormGroup>
                    {/* {pekerjaan_ibu !== "11" && ( */}
                    <div>
                        <FormGroup row className="mb-4">
                            <Label for="penghasilan_ibu" md={3}>
                                Penghasilan
                            </Label>
                            <Col md={5} xs={12}>
                                <Field
                                    type="number"
                                    component={InputBs}
                                    pattern="[0-9]*"
                                    title="Hanya isi dengan angka (0-9)"
                                    name="penghasilan_ibu"
                                    id="penghasilan_ibu"
                                    placeholder="Penghasilan Ibu"
                                    validate={[money]}
                                />
                                <FormText color="muted">
                                    <ul className="list-reset">
                                        <li>
                                            Penghasilan <b>per bulan</b>;
                                        </li>
                                    </ul>
                                </FormText>
                            </Col>
                            <Col md={4} xs={12}>
                                <Alert color="success">{rupiah(penghasilan_ibu)}</Alert>
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-4">
                            <Label for="sampingan_ibu" md={3}>
                                Sampingan
                            </Label>
                            <Col md={5} xs={12}>
                                <Field
                                    type="number"
                                    component={InputBs}
                                    pattern="[0-9]*"
                                    title="Hanya isi dengan angka (0-9)"
                                    name="sampingan_ibu"
                                    id="sampingan_ibu"
                                    placeholder="Penghasilan Sampingan Ibu"
                                />
                                <FormText color="muted">
                                    <ul className="list-reset">
                                        <li>
                                            Sampingan <b>per bulan</b>;
                                        </li>
                                    </ul>
                                </FormText>
                            </Col>
                            <Col md={4} xs={12}>
                                <Alert color="success">{rupiah(sampingan_ibu)}</Alert>
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-4">
                            <Label for="file_scan_slip_ibu" md={3}>
                                {/* Slip Gaji / Bukti Penghasilan */}
                                {pekerjaan_ibu !== '11' && 'Slip Gaji / Bukti Penghasilan'}
                                {pekerjaan_ibu === '11' && 'Surat Keterangan Tidak Bekerja'}
                            </Label>
                            <Col md={5}>
                                <Field
                                    component={InputFileBs}
                                    type="file"
                                    name="file_scan_slip_ibu"
                                    id="file_scan_slip_ibu"
                                    accept="application/pdf"
                                />
                                {/* <SyaratScan syarat={["Bukti Penghasilan Bulan Terakhir"]} /> */}
                                {pekerjaan_ibu !== '11' && (
                                    <SyaratScan syarat={['Bukti Penghasilan Bulan Terakhir']} />
                                )}
                                {pekerjaan_ibu === '11' && (
                                    <SyaratScan
                                        syarat={[
                                            'Surat Keterangan Dari RT dan RW untuk orang tua yang tidak bekerja',
                                        ]}
                                    />
                                )}
                            </Col>
                            {props.initialValues.scan_slip_ibu && (
                                <Col md={4}>
                                    <a
                                        href={
                                            storage +
                                            '/' +
                                            props.initialValues.scan_slip_ibu
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-success btn-block"
                                    >
                                        <i className="fa fa-file"></i>
                                        {pekerjaan_ibu !== '11' && 'Lihat Slip Gaji Ibu'}
                                        {pekerjaan_ibu === '11' && 'Lihat Surat Keterangan Ibu'}
                                    </a>
                                </Col>
                            )}
                        </FormGroup>
                    </div>
                    {/* )} */}
                    <FormGroup row className="mb-4">
                        <Label for="telepon_ibu" md={3}>
                            Nomor Telepon
                        </Label>
                        <Col md={9}>
                            <Field
                                name="telepon_ibu"
                                component={InputBs}
                                type="text"
                                placeholder="Nomor Telepon"
                                pattern="[0-9]{0,13}"
                                title="Hanya isi dengan angka 0-9. Maksimal 13 digit."
                            />
                            <FormText color="muted">
                                <ul className="list-reset">
                                    <li>Hanya isi dengan angka. Maksimal 13 digit;</li>
                                    <li>
                                        Isi dengan angka{' '}
                                        <i>
                                            <b>nol (0)</b>
                                        </i>{' '}
                    jika tidak memiliki nomor telepon.
                                    </li>
                                </ul>
                            </FormText>
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
                        <i className="fa fa-save mr-2"></i> Simpan Data Ibu
                    </Button>
                </Col>
            </FormGroup>
        </Form>
    );
};
class DataIbuSeleksi extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(pekerjaan.fetchPekerjaan(cookies.get(cookieName)));
        this.props.dispatch(provinsi.fetchProvinsi());
        this.props.dispatch(ibu.fetchAllData(cookies.get(cookieName)));
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
                if (val instanceof Date || moment.isMoment(val)) {
                    val = moment(val).format("YYYY-MM-DD");
                }
                // Ekstraksi value jika berupa object
                else if (val && typeof val === 'object' && !Array.isArray(val)) {
                    // Cek apakah ini Redux Form Field object (punya input/meta)
                    if (val.input || val.meta || (val.name && val.onChange)) {
                        val = ""; // Abaikan object internal Redux Form
                    } else {
                        val = val.kode || val.id || val.provinsi_id || val.kab_id || val.kecam_id || "";
                    }
                }
                formData.append(key, val || "");
            }
        }
        this.props.dispatch(ibu.updateData(cookies.get(cookieName), formData)).then(() => {
            this.props.dispatch(reset('DataIbuSeleksi'));
            if (this.props.updateVerifikasi) {
                this.props.updateVerifikasi();
            }
        }).catch(err => {
            console.error("Gagal simpan data ibu:", err);
        });
    }
    render() {
        return (
            <Card className="premium-card p-4 p-md-5">
                <CardTitle tag="h4" className="mb-4">Data Orang Tua: Ibu</CardTitle>
                <Alert color="warning" className="rounded-lg border-0 shadow-sm mb-4">
                    <i className="fa fa-info-circle mr-2"></i>
                    <strong>Seluruh kolom pada Data Ibu Wajib Diisi</strong>
                </Alert>
                <FormIbuSeleksi
                    onSubmit={this.submitForm}
                    initialValues={this.props.ibu}
                    allow={this.props.allow}
                />
            </Card>
        );
    }
}

FormIbuSeleksi = reduxForm({
    form: 'DataIbuSeleksi',
    enableReinitialize: true,
})(FormIbuSeleksi);

const selector = formValueSelector('DataIbuSeleksi');

FormIbuSeleksi = connect(
    (store) => {
        let {
            status_ibu,
            penghasilan_ibu,
            sampingan_ibu,
            pekerjaan_ibu,
        } = selector(
            store,
            'status_ibu',
            'penghasilan_ibu',
            'sampingan_ibu',
            'pekerjaan_ibu'
        );
        return {
            status_ibu,
            penghasilan_ibu,
            sampingan_ibu,
            pekerjaan_ibu,

            ref_provinsi_ibu: store.provinsi.provinsi,
            ref_kabkot_ibu: store.kabkot.kabkot_ibu,
            ref_kecamatan_ibu: store.kecamatan.kecamatan_ibu,
            ref_pekerjaan: store.pekerjaan.pekerjaan,
        };
    }
)(FormIbuSeleksi);

export default connect((store) => ({
    ibu: store.ibu.ibu,
}))(DataIbuSeleksi);
