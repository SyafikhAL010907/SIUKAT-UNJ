import React from 'react'
import {
    Button, Alert,
    Form, FormGroup, FormText, Label, Input, Card, CardTitle, Row
} from 'reactstrap'
import { captcha } from '../../../actions'
import { auth } from '../../../api'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { notif, setToken, cookies, cookieName } from '../../../global';

class FormLogin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            no_peserta: '',
            password: '',
            kode_captcha: '',
            jawaban: '',
            authCookie: null,
            tombolMasuk: 'Masuk',
        }
    }
    UNSAFE_componentWillMount() {
        this.props.dispatch(captcha.fetchCaptcha())
        this.setState({
            authCookie: cookies.get(cookieName)
        })
    }
    handleNomorPendaftaran(e) {
        this.setState({
            no_peserta: e.target.value
        })
    }
    handleTanggalLahir(e) {
        this.setState({
            password: e.target.value
        })
    }
    handleCaptcha(e) {
        var self = this
        this.setState({
            jawaban: e.target.value,
            kode_captcha: self.props.captcha.kode
        })
    }
    login = (e) => {
        e.preventDefault()
        this.setState({
            tombolMasuk: 'Mohon Menunggu'
        })
        auth.login(this.state).then(res => {
            setToken(res.token);
            notif("Berhasil!", "Anda berhasil masuk", "success")
            const flag = res.flag
            this.setState({
                authCookie: cookies.get(cookieName)
            })

            if (this.state.authCookie) {
                if (flag === 'terima_ukt' || flag === 'pengumuman' || flag === 'sanggah_ukt' || flag === 'pengisian' || flag === 'selesai_sanggah' || flag === 'selesai_isi' || flag === 'tunggu_pengumuman') {
                    this.props.history.push('/main/ukt')
                } else {
                    this.props.history.push('/main')
                }
            }
        }, function (err) {
            notif("Gagal!", "Periksa kembali nomor peserta, tanggal lahir, captcha dan verifikasi akademik", "error")
        })
        this.setState({
            tombolMasuk: 'Masuk'
        })
    }
    render() {
        const flag = this.props.cmahasiswa.flag
        if (this.state.authCookie) {
            if (flag === 'terima_ukt' || flag === 'pengumuman' || flag === 'sanggah_ukt' || flag === 'pengisian' || flag === 'selesai_sanggah' || flag === 'selesai_isi' || flag === 'tunggu_pengumuman') {
                return <Redirect to='/main/ukt' />
            } else {
                return <Redirect to='/main' />
            }
        }
        const online = this.props.captcha.pertanyaan !== undefined;
        const stage_detail = this.props.stage;
        const open_login = this.props.open_login;
        return (
            <Form onSubmit={this.login}>
                {!online ?
                    <h5 className="text-warning">Service Currently Offline</h5> : ''
                }
                <FormGroup>
                    <Label for="no_peserta">
                        Nomor Peserta {" "}
                        <span style={{ textTransform: "uppercase" }}>
                            {stage_detail === 'mandiri' ? 'Mandiri Ujian Tulis' : stage_detail}
                        </span>
                    </Label>
                    <Input type="text" name="no_peserta" id="no_peserta" placeholder="01234567890" onChange={this.handleNomorPendaftaran.bind(this)} disabled={!online} required />
                </FormGroup>
                <FormGroup>
                    <Label for="password">Tanggal Lahir
                        <FormText className="text-white">(Contoh: 31121999)</FormText>
                    </Label>
                    <Input type="password" name="password" id="password" placeholder="ddmmyyyy" onChange={this.handleTanggalLahir.bind(this)} disabled={!online} required />
                </FormGroup>
                <FormGroup>
                    <Alert color="warning"><Label for="jawaban" className="mb-0">{online ? `Berapakah ${this.props.captcha.pertanyaan}?` : 'Offline'}</Label></Alert>
                    <Input type="hidden" name="kode_captcha" id="kode_captcha" defaultValue={this.props.captcha.kode} disabled={!online} />
                    <Input type="text" name="jawaban" id="jawaban" placeholder="Jawaban Anda" onChange={this.handleCaptcha.bind(this)} disabled={!online} required />
                </FormGroup>
                {!open_login && (
                    <FormGroup>
                        <Card body style={{ borderRadius: '10px' }} color="danger">
                            <CardTitle style={{ textAlign: "center" }}>Pengisian data ekonomi blm dibuka
                                {/* <Button color="danger" block disabled>Pengisian data ekonomi blm dibuka</Button> */}
                            </CardTitle>
                        </Card>
                    </FormGroup>
                )}
                {open_login && (
                    <FormGroup>
                        <Button color="success" block type="submit" disabled={!online}><i className="fa fa-sign-in"></i> {this.state.tombolMasuk}</Button>
                    </FormGroup>
                )}
            </Form>
        )
    }
}


export default connect((store) => {
    return {
        captcha: store.captcha.captcha,
        cmahasiswa: store.cmahasiswa.cmahasiswa,
    }
})(FormLogin)