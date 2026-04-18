import React from 'react';
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
} from 'reactstrap';
import { Field, reduxForm, reset, formValueSelector } from 'redux-form';
import {
    InputFileBs,
} from '../';
import { keringanan } from '../../../../actions';
import { connect } from 'react-redux';
import { cookies, cookieName, storage } from '../../../../global';

let FormSanggah = (props) => {
    return (
        <Form onSubmit={props.handleSubmit}>
            <FormGroup row>
                <Label for="file_scan_keringanan" md={12}>
                    Unggah Perubahan Data
                </Label>
                <Col md={12}>
                    <Field
                        component={InputFileBs}
                        type="file"
                        name="file_scan_keringanan"
                        id="file_scan_keringanan"
                        accept="application/pdf"
                    />
                    <input
                        type="text"
                        name="no_peserta"
                        id="no_peserta"
                        style={{ display: 'none' }}
                        defaultValue={props.initialValues?.no_peserta}
                    />
                </Col>
                {props.initialValues?.scan_keringanan && (
                    <Col md={6}>
                        <a
                            href={
                                storage +
                                '/' +
                                props.initialValues?.scan_keringanan
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-success btn-block"
                        >
                            <i className="fa fa-file"></i>
                            Lihat Perubahan Data
                        </a>
                    </Col>
                )}
            </FormGroup>
            <FormGroup row>
                <Col md={12} xs="12">
                    <Button
                        type="submit"
                        color="success"
                        block
                        disabled={props.pristine || props.submitting}
                        className="py-2.5 font-weight-bold shadow-sm"
                        style={{ borderRadius: '12px' }}
                    >
                        {props.submitting ? <i className="fa fa-spinner fa-spin mr-2"></i> : <i className="fa fa-save mr-2"></i>}
                        {props.submitting ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                </Col>
            </FormGroup>
        </Form>
    );
};
class UnggahSanggah extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(keringanan.getData(cookies.get(cookieName)));
    }
    submitForm = (values) => {
        console.log(values)
        var formData = new FormData();
        formData.append('no_peserta', values?.no_peserta);
        formData.append('file_scan_keringanan', values?.file_scan_keringanan[0]);
        formData.append('flag', 'menunggu')
        this.props.dispatch(keringanan.updateData(cookies.get(cookieName), formData));
        this.props.dispatch(reset('UnggahSanggah'));
        this.props.dispatch(keringanan.getData(cookies.get(cookieName)));
        window.location.reload();
    }
    render() {
        return (
            <Card body>
                <FormSanggah
                    onSubmit={this.submitForm}
                    initialValues={this.props.keringanan}
                    allow={this.props.allow}
                />
            </Card>
        );
    }
}

FormSanggah = reduxForm({
    form: 'UnggahSanggah',
    enableReinitialize: true,
})(FormSanggah);

const selector = formValueSelector('UnggahSanggah');
FormSanggah = connect((store) => {
    let { no_peserta, file_scan_keringanan, flag } = selector(
        store,
        'no_peserta',
        'file_scan_keringanan',
        'flag',
    );
    return {
        no_peserta,
        file_scan_keringanan,
        flag,
    };
})(FormSanggah);
export default connect((store) => ({
    keringanan: store.keringanan.keringanan,
}))(UnggahSanggah);
