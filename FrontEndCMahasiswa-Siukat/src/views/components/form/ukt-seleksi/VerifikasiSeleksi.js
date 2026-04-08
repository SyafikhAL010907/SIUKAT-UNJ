import React from 'react';
import {
    Card,
    Button,
    CardTitle,
    Row,
    Col,
    Alert,
    Form,
    FormGroup,
    Label,
    FormText,
    Collapse,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { Field, reduxForm, reset, formValueSelector } from 'redux-form';
import { InputFileBs } from '../';
import { pendukung, cmahasiswa } from '../../../../actions';
import { files } from '../../../../api';
import { connect } from 'react-redux';
import { cookies, cookieName, storage } from '../../../../global';
import {
    Ayah,
    Ibu,
    Kendaraan,
    Listrik,
    Pendukung,
    Pribadi,
    Rumah,
    Wali,
} from './details';

let FormSuratKebenaran = (props) => {
    const {
        handleSubmit,
        pristine,
        submitting,
        scan_pernyataan_kebenaran,
        unduhSuratKebenaran,
        textSuratKebenaran,
    } = props;
    const [checked, setChecked] = React.useState(false);

    return (
        <Form onSubmit={handleSubmit} className="premium-card-inner p-4 mb-4 bg-light rounded-lg shadow-sm">
            <div className="mb-3">
                <i className="fa fa-info-circle text-primary mr-2"></i> 
                <strong>Tahapan Penyelesaian Surat Pernyataan:</strong>
            </div>
            <ol className="pl-3 mb-4">
                <li>
                    <Button size="sm" color="danger" onClick={unduhSuratKebenaran} className="mb-2">
                        <i className="fa fa-download"></i> {textSuratKebenaran}
                    </Button>
                </li>
                <li>Cetak, tanda tangani, dan <strong>scan</strong> kembali surat tersebut (PDF).</li>
                <li>Unggah surat pada form di bawah ini lalu klik <strong>Simpan</strong>.</li>
            </ol>
            <hr />

            <FormGroup row className="align-items-center">
                <Label for="file_scan_pernyataan_kebenaran" md={4} className="font-weight-bold">
                    Upload Surat Pernyataan
                </Label>
                <Col md={4}>
                    <Field
                        component={InputFileBs}
                        type="file"
                        name="file_scan_pernyataan_kebenaran"
                        id="file_scan_pernyataan_kebenaran"
                        accept="application/pdf"
                    />
                </Col>
                {scan_pernyataan_kebenaran && (
                    <Col md={4}>
                        <a
                            href={storage + '/' + scan_pernyataan_kebenaran}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="modern-btn-primary py-2 w-100 btn text-white"
                            style={{fontSize: '0.85rem'}}
                        >
                            <i className="fa fa-file-pdf-o mr-2"></i> Lihat Surat
                        </a>
                    </Col>
                )}
            </FormGroup>
            
            <div className="custom-control custom-checkbox my-3">
                <input 
                    type="checkbox" 
                    className="custom-control-input" 
                    id="checkSetuju" 
                    onChange={(e) => setChecked(e.target.checked)}
                />
                <label className="custom-control-label font-weight-normal" htmlFor="checkSetuju">
                    Saya menyatakan data yang diisi adalah benar dan jujur.
                </label>
            </div>

            <Button
                type="submit"
                className="modern-btn-primary w-100 py-2"
                disabled={!checked || submitting}
            >
                <i className="fa fa-save mr-2"></i> Simpan Surat Pernyataan
            </Button>
        </Form>
    );
};

class VerifikasiSeleksi extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsePribadi: false,
            collapseAyah: false,
            collapseIbu: false,
            collapseWali: false,
            collapseRumah: false,
            collapseListrik: false,
            collapseKendaraan: false,
            collapsePendukung: false,
            textSuratKebenaran: 'Unduh Surat Pernyataan Kebenaran Data',
        };
    }

    UNSAFE_componentWillMount() {
        this.props.dispatch(cmahasiswa.getByLoggedIn(cookies.get(cookieName)));
        this.props.dispatch(pendukung.getByLoggedIn(cookies.get(cookieName)));
    }

    submitForm = (values) => {
        var formData = new FormData();
        for (var key in values) {
            var file = key.startsWith('file_scan') ? key : null;
            if (file) {
                formData.append(key, values[key][0]);
                document.getElementById(file).value = null;
            } else {
                formData.append(key, values[key]);
            }
        }
        this.props.dispatch(pendukung.updateData(cookies.get(cookieName), formData));
        this.props.dispatch(reset('DataSuratKebenaran'));
        this.props.updateVerifikasi();
    }

    toggle = (stateName, val) => {
        var obj = { [stateName]: val };
        for (var key in this.state) {
            if (key === 'textSuratKebenaran') {
                obj[key] = 'Unduh Surat Pernyataan Kebenaran Data';
            } else if (key !== stateName) {
                obj[key] = false;
            }
        }
        this.setState(obj);
    }

    verify = () => {
        this.props.dispatch(cmahasiswa.rendahSelesai(cookies.get(cookieName)));
    }

    unduhSuratKebenaran = () => {
        this.setState({ textSuratKebenaran: 'Sedang Mengunduh...' });
        files.unduhSuratKebenaran(cookies.get(cookieName))
            .then(() => {
                this.setState({ textSuratKebenaran: 'Unduh Surat Pernyataan Kebenaran Data' });
            })
            .catch(() => {
                this.setState({ textSuratKebenaran: 'Unduh Surat Pernyataan Kebenaran Data' });
            });
    }

    renderSection = (title, icon, stateName, Component) => (
        <div className="mb-3 border rounded-lg overflow-hidden shadow-sm bg-white">
            <div 
                className="d-flex align-items-center justify-content-between p-3 cursor-pointer hover-bg-light"
                onClick={() => this.toggle(stateName, !this.state[stateName])}
                style={{ cursor: 'pointer', background: this.state[stateName] ? '#f1f5f9' : '#fff' }}
            >
                <div className="font-weight-bold text-dark">
                    <i className={`fa ${icon} mr-3 text-emerald`}></i> {title}
                </div>
                <i className={`fa ${this.state[stateName] ? 'fa-chevron-up' : 'fa-chevron-down'} text-muted`}></i>
            </div>
            <Collapse isOpen={this.state[stateName]}>
                <div className="p-4 p-md-5 border-top bg-white">
                    <Component />
                </div>
            </Collapse>
        </div>
    );

    render() {
        if (this.props.cmahasiswa.flag === 'selesai_isi') {
            return <Redirect to="/main/ukt/selesai-isi" />;
        }

        // Cek apakah semua tahap sudah bernilai 1/true
        const isAllowed = this.props.allow !== undefined && this.props.allow !== 0 && this.props.allow !== false;

        return (
            <Card className="premium-card p-4 p-md-5">
                <CardTitle tag="h4" className="mb-4">Verifikasi & Finalisasi Data</CardTitle>
                
                {!isAllowed ? (
                    <div className="text-center py-5">
                        <div className="mb-4">
                            <i className="fa fa-lock text-warning" style={{ fontSize: '4rem' }}></i>
                        </div>
                        <h5 className="text-dark font-weight-bold">Mohon Maaf</h5>
                        <p className="text-muted mx-auto" style={{ maxWidth: '400px' }}>
                            Anda belum bisa melakukan verifikasi. Silakan lengkapi seluruh tahapan data pada menu di samping kiri terlebih dahulu hingga semua bertanda ceklis hijau.
                        </p>
                        <Alert color="warning" className="rounded-lg border-0 shadow-sm d-inline-block mt-3">
                            <i className="fa fa-info-circle mr-2"></i> 
                            Pastikan status di Sidebar sudah terverifikasi semua.
                        </Alert>
                    </div>
                ) : (
                    <div>
                        <FormSuratKebenaran
                            onSubmit={this.submitForm}
                            initialValues={this.props.pendukung}
                            unduhSuratKebenaran={this.unduhSuratKebenaran}
                            textSuratKebenaran={this.state.textSuratKebenaran}
                        />

                        <div className="my-4">
                            <h5 className="mb-4 font-weight-bold text-secondary border-bottom pb-2">
                                <i className="fa fa-search mr-2"></i> Pratinjau Seluruh Data:
                            </h5>
                            {this.renderSection('Data Pribadi', 'fa-user', 'collapsePribadi', Pribadi)}
                            {this.renderSection('Data Ayah', 'fa-user', 'collapseAyah', Ayah)}
                            {this.renderSection('Data Ibu', 'fa-user', 'collapseIbu', Ibu)}
                            {this.renderSection('Data Wali', 'fa-user', 'collapseWali', Wali)}
                            {this.renderSection('Data Rumah', 'fa-home', 'collapseRumah', Rumah)}
                            {this.renderSection('Data Listrik', 'fa-flash', 'collapseListrik', Listrik)}
                            {this.renderSection('Data Kendaraan', 'fa-bus', 'collapseKendaraan', Kendaraan)}
                            {this.renderSection('Data Pendukung', 'fa-file-text', 'collapsePendukung', Pendukung)}
                        </div>

                        {this.props.verified !== 0 && (
                            <div className="mt-5 pt-4 border-top">
                                <Alert color="danger" className="rounded-lg border-0 shadow-sm mb-4">
                                    <i className="fa fa-exclamation-triangle mr-2"></i>
                                    Pastikan seluruh data di atas sudah benar. Setelah finalisasi, data <strong>tidak dapat diubah kembali</strong>.
                                </Alert>
                                <Button
                                    className="modern-btn-primary w-100 py-3 shadow font-weight-bold"
                                    onClick={this.verify}
                                    disabled={!this.props.pendukung.scan_pernyataan_kebenaran}
                                >
                                    <i className="fa fa-check-circle mr-2"></i> Ya, Saya Yakin & Finalisasi Data
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Card>
        );
    }
}

FormSuratKebenaran = reduxForm({
    form: 'DataSuratKebenaran',
    enableReinitialize: true,
})(FormSuratKebenaran);

const selector = formValueSelector('DataSuratKebenaran');

FormSuratKebenaran = connect((store) => {
    let scan_pernyataan_kebenaran = selector(store, 'scan_pernyataan_kebenaran');
    return {
        scan_pernyataan_kebenaran,
    };
})(FormSuratKebenaran);

export default connect((store) => ({
    pendukung: store.pendukung.pendukung,
    cmahasiswa: store.cmahasiswa.cmahasiswa,
}))(VerifikasiSeleksi);