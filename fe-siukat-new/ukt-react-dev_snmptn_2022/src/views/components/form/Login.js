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
            showPassword: false,
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
                {!online && <Alert color="danger" className="rounded-lg border-0 shadow-sm mb-4">Service Currently Offline</Alert>}
                
                <FormGroup className="modern-input-group mb-4">
                    <Label for="no_peserta" style={{color: '#ffffff', fontWeight: '800'}}>
                        Nomor Peserta {" "}
                        <span className="text-uppercase" style={{opacity: 1, fontSize: '0.8rem', fontWeight: '800', color: '#ffffff'}}>
                            {stage_detail === 'mandiri' ? 'Mandiri Ujian Tulis' : stage_detail}
                        </span>
                    </Label>
                    <Input type="text" name="no_peserta" id="no_peserta" placeholder="01234567890" onChange={this.handleNomorPendaftaran.bind(this)} disabled={!online} required />
                </FormGroup>

                <FormGroup className="modern-input-group mb-4">
                    <Label for="password" style={{color: '#ffffff', fontWeight: '800'}}>
                        Tanggal Lahir
                        <span className="ml-2 font-weight-bold small" style={{opacity: 1, color: '#ffffff'}}>(Contoh: 31121999)</span>
                    </Label>
                    <div className="position-relative password-toggle-wrapper">
                        <Input 
                            type={this.state.showPassword ? "text" : "password"} 
                            name="password" 
                            id="password" 
                            placeholder="ddmmyyyy" 
                            onChange={this.handleTanggalLahir.bind(this)} 
                            disabled={!online} 
                            required 
                            style={{ paddingRight: '45px' }}
                        />
                        <div 
                            className="password-eye-btn" 
                            onClick={() => this.setState({ showPassword: !this.state.showPassword })}
                        >
                            <i className={`fa ${this.state.showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </div>
                    </div>
                </FormGroup>

                <FormGroup className="modern-input-group mb-4">
                    <div className="bg-white rounded-lg p-2 mb-2 text-center text-emerald font-weight-bold shadow-sm" style={{fontSize: '0.9rem'}}>
                        {online ? `Berapakah ${this.props.captcha.pertanyaan}?` : 'Offline'}
                    </div>
                    <Input type="hidden" name="kode_captcha" id="kode_captcha" defaultValue={this.props.captcha.kode} disabled={!online} />
                    <Input type="text" name="jawaban" id="jawaban" placeholder="Jawaban Anda" onChange={this.handleCaptcha.bind(this)} disabled={!online} required />
                </FormGroup>

                {open_login ? (
                    <Button block className="modern-btn-primary py-3 font-weight-bold shadow mt-4" type="submit" disabled={!online}>
                        <i className="fa fa-sign-in mr-2"></i> {this.state.tombolMasuk}
                    </Button>
                ) : (
                    <Alert color="danger" className="rounded-lg border-0 shadow-sm mt-4 text-center font-weight-bold">
                        Pengisian data ekonomi belum dibuka
                    </Alert>
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