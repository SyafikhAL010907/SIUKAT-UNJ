import React from 'react';
import {
    Card,
    Button,
    CardTitle,
    Col,
    Form,
    FormGroup,
    Label,
    FormText,
} from 'reactstrap';
import { Field, reduxForm, reset, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { pendukung } from '../../../../actions';
import { files } from '../../../../api';
import { InputFileBs, AlertFormLengkap, AlertFormBelumLengkap } from '../';
import { cookies, cookieName, storage } from '../../../../global';

let FormDataPendukung = (props) => {
    const {
        handleSubmit,
        pristine,
        submitting,
        scan_pernyataan_ukt_tinggi,
    } = props;

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup row className="mb-4">
                <Label for="file_scan_pernyataan_ukt_tinggi" col="12" xl="3" className="mb-2 mb-xl-0">
                    Surat Pernyataan
                </Label>
                <Col col="12" xl="5" className="mb-3 mb-xl-0">
                    <Field
                        component={InputFileBs}
                        type="file"
                        accept="application/pdf"
                        name="file_scan_pernyataan_ukt_tinggi"
                        id="file_scan_pernyataan_ukt_tinggi"
                    />
                    <FormText color="muted">
                        <ul className="list-reset mt-2">
                            <li>Ekstensi berkas berupa <b>PDF</b>;</li>
                            <li>Ukuran berkas tidak lebih dari <b>500KB</b>.</li>
                        </ul>
                    </FormText>
                </Col>
                {scan_pernyataan_ukt_tinggi && (
                    <Col col="12" xl="4">
                        <a
                            href={
                                storage +
                                '/' +
                                scan_pernyataan_ukt_tinggi
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-success btn-block py-2"
                        >
                            <i className="fa fa-file-pdf-o mr-2"></i> Lihat Surat Pernyataan
                        </a>
                    </Col>
                )}
            </FormGroup>
            
            <FormGroup row className="mt-5 border-top pt-4">
                <Col md={{ size: 8 }} xs="12" className="mb-3 mb-md-0">
                    {!props.allow ? <AlertFormBelumLengkap /> : <AlertFormLengkap />}
                </Col>
                <Col md={{ size: 4 }} xs="12">
                    <Button
                        type="submit"
                        className="modern-btn-primary w-100 py-3 font-weight-bold"
                        disabled={pristine || submitting}
                    >
                        <i className="fa fa-save mr-2"></i> Simpan Data
                    </Button>
                </Col>
            </FormGroup>
        </Form>
    );
};
class DataPendukung extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textSuratPernyataan: 'Unduh Surat Pernyataan UKT Kelompok Atas',
        };
    }
    UNSAFE_componentWillMount() {
        this.props.dispatch(pendukung.getByLoggedIn(cookies.get(cookieName)));
    }
    submitForm = (values) => {
        var formData = new FormData();
        for (var key in values) {
            if (key === 'file_scan_pernyataan_ukt_tinggi') {
                formData.append(key, values[key][0]);
                document.getElementById('file_scan_pernyataan_ukt_tinggi').value = null;
            } else {
                formData.append(key, values[key]);
            }
        }
        this.props.dispatch(
            pendukung.updateData(cookies.get(cookieName), formData)
        );
        this.props.dispatch(reset('DataPendukung'));
        this.props.updateVerifikasi();
    }
    unduhSuratPernyataan = () => {
        this.setState({
            textSuratPernyataan: 'Sedang mengunduh...',
        });
        files
            .unduhSuratPernyataanUKTAtas(cookies.get(cookieName))
            .then(() => {
                this.setState({
                    textSuratPernyataan: 'Unduh Surat Pernyataan UKT Kelompok Atas',
                });
            })
            .catch(() => {
                this.setState({
                    textSuratPernyataan: 'Unduh Surat Pernyataan UKT Kelompok Atas',
                });
            });
    }
    render() {
        return (
            <Card body>
                <CardTitle>Surat Pernyataan</CardTitle>
                <div>
                    <i className="fa fa-info-circle"></i> Berikut ini tahapan untuk menyelesaikan surat pernyataan:
                </div>
                <ol>
                    <li>
                        <Button
                            size="sm"
                            color="danger"
                            onClick={this.unduhSuratPernyataan.bind(this)}
                        >
                            <i className="fa fa-download"></i>{' '}
                            {this.state.textSuratPernyataan}
                        </Button>
                    </li>
                    <li>Cetak surat pernyataan;</li>
                    <li>Isi surat pernyataan;</li>
                    <li>Scan surat pernyataan;</li>
                    <li>Unggah surat pernyataan pada form di bawah ini.</li>
                </ol>
                <hr />
                <FormDataPendukung
                    onSubmit={this.submitForm}
                    initialValues={this.props.pendukung}
                    allow={this.props.allow}
                />
            </Card>
        );
    }
}

FormDataPendukung = reduxForm({
    form: 'DataPendukung',
    enableReinitialize: true,
})(FormDataPendukung);

const selector = formValueSelector('DataPendukung');

FormDataPendukung = connect((store) => {
    let scan_pernyataan_ukt_tinggi = selector(
        store,
        'scan_pernyataan_ukt_tinggi'
    );
    return {
        scan_pernyataan_ukt_tinggi,
    };
})(FormDataPendukung);

export default connect((store) => ({
    pendukung: store.pendukung.pendukung,
}))(DataPendukung);
