import React from 'react';
import {
    Row,
    Col,
    Card,
    Label,
    Input,
    Alert,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Badge,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { ukt, cmahasiswa } from '../../actions';
import { rupiah, getToken } from '../../global';

const IconCheck = () => <i className="fa fa-check"></i>;

class PilihanUktTinggi extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kategori: '',
            besar_ukt: '',

            modalBersedia: false,
            modalTidakBersedia: false,

            nextButton: 'Pilih salah satu daftar di atas',
            nextDisabled: true,
        };

        this.toggleBersedia = this.toggleBersedia.bind(this);
        this.toggleTidakBersedia = this.toggleTidakBersedia.bind(this);
        this.radioUktTinggi = this.radioUktTinggi.bind(this);
        this.batalUktTinggi = this.batalUktTinggi.bind(this);
        this.klikBersedia = this.klikBersedia.bind(this);
        this.klikTidakBersedia = this.klikTidakBersedia.bind(this);
    }

    UNSAFE_componentWillMount() {
        this.props.dispatch(ukt.getByLoggedIn(getToken()));
        this.props.dispatch(cmahasiswa.fetchAllData(getToken()));
    }

    toggleBersedia() {
        this.setState({
            modalBersedia: !this.state.modalBersedia,
        });
    }

    toggleTidakBersedia() {
        this.setState({
            modalTidakBersedia: !this.state.modalTidakBersedia,
        });
    }

    radioUktTinggi(e) {
        var kategori = e.target.value.toString(),
            besar_ukt = rupiah(this.props.ukt[kategori]);
        this.setState({
            nextDisabled: false,
            nextButton:
                'Saya bersedia di UKT Kelompok ' + kategori + ' - ' + besar_ukt,
            kategori: kategori,
            besar_ukt: besar_ukt,
        });
    }

    batalUktTinggi(e) {
        var kategori = e.target.value.toString();

        this.setState({
            nextDisabled: false,
            nextButton: 'Saya akan ikut perhitungan data ekonomi',
            kategori: kategori,
        });
    }

    klikBersedia() {
        console.log('DEBUG COMPONENT: klikBersedia - Token from getToken:', getToken());
        this.props.dispatch(
            cmahasiswa.updateFlagUktTinggi(
                { golongan_id: this.state.kategori },
                getToken()
            )
        );
    }

    klikTidakBersedia() {
        console.log('DEBUG COMPONENT: klikTidakBersedia - Token from getToken:', getToken());
        this.props.dispatch(
            cmahasiswa.updateFlagUktRendah(getToken())
        );
    }

    renderUkt() {
        if (this.props.ukt !== undefined) {
            var ukt = {};
            ukt.VI = this.props.ukt.VI;
            ukt.VII = this.props.ukt.VII;
            ukt.VIII = this.props.ukt.VIII;
            return Object.entries(ukt).map((data, key) => (
                <Col md={4} xs={12} key={key} className="ukt-selection-tile">
                    <input
                        type="radio"
                        id={'ukt-tinggi-' + data[0]}
                        name="ukt_tinggi"
                        value={data[0].toString()}
                        checked={this.state.kategori.toString() === data[0].toString()}
                        onChange={this.radioUktTinggi}
                        disabled={data[1] === 0}
                    />
                    <label
                        className="label-modern"
                        htmlFor={'ukt-tinggi-' + data[0]}
                        style={{
                            pointerEvents: data[1] === 0 ? 'none' : 'default',
                            opacity: data[1] === 0 ? 0.3 : 1,
                        }}
                    >
                        <div className="icon-box">
                            <i className="fa fa-money"></i>
                        </div>
                        <span className="group-name">Kelompok {data[0]}</span>
                        <div className="price-tag">
                            {data[1] === 0 ? 'Tidak Tersedia' : rupiah(data[1])}
                        </div>
                    </label>
                </Col>
            ));
        }
    }

    render() {
        if (
            this.props.cmahasiswa.flag === 'pengisian' &&
            this.props.cmahasiswa.ukt_tinggi === 'ya'
        ) {
            return <Redirect to="/main/ukt/tinggi" />;
        } else if (
            this.props.cmahasiswa.flag === 'pengisian' &&
            this.props.cmahasiswa.ukt_tinggi === 'tidak'
        ) {
            return <Redirect to="/main/ukt/seleksi" />;
        } else if (this.props.cmahasiswa.flag === 'selesai_isi') {
            return <Redirect to="/main/ukt/selesai-isi" />;
        } else if (this.props.cmahasiswa.flag === 'tunggu_pengumuman') {
            return <Redirect to="/main/ukt/tunggu-pengumuman" />;
        } else if (this.props.cmahasiswa.flag === 'pengumuman') {
            return <Redirect to="/main/ukt/terima-sanggah" />;
        } else if (
            this.props.cmahasiswa.flag === 'terima_ukt' ||
            this.props.cmahasiswa.flag === 'selesai_sanggah'
        ) {
            return <Redirect to="/main/ukt/terima" />;
        } else if (this.props.cmahasiswa.flag === 'sanggah_ukt') {
            return <Redirect to="/main/ukt/sanggah" />;
        }
        return (
            <div className="p-0 animate-fade-in">
                <Card className="premium-card p-4 p-md-5 border-0 shadow-lg">
                    <div className="text-center mb-5 mt-2">
                        <div className="d-inline-block p-3 rounded-circle bg-emerald-light mb-3">
                            <i className="fa fa-university fa-2x text-emerald"></i>
                        </div>
                        <h2 className="font-weight-bold color-emerald mb-2" style={{ letterSpacing: '-0.5px' }}>
                            Pemilihan Kelompok UKT
                        </h2>
                        <p className="text-muted lead mx-auto" style={{ maxWidth: '600px', fontSize: '1.1rem' }}>
                            Berdasarkan data prodi Anda, silakan pilih apakah Anda bersedia ditetapkan pada <strong>UKT Kelompok Atas</strong> atau melalui <strong>Verifikasi Ekonomi</strong>.
                        </p>

                        {this.props.cmahasiswa.prodi != null && (
                            <div className="mt-4">
                                <Badge color="success" pill className="px-4 py-2 shadow-sm" style={{ fontSize: '0.9rem', backgroundColor: '#0f6d3f' }}>
                                    <i className="fa fa-graduation-cap mr-2"></i>
                                    Prodi: {this.props.cmahasiswa.prodi.nama}
                                </Badge>
                            </div>
                        )}
                    </div>

                    <div className="row justify-content-center mb-5">
                        <div className="col-md-10">
                            <div
                                className="ukt-high-group-container p-4 rounded-xl shadow-sm"
                                style={{
                                    background: '#ffffff',
                                    border: '2px solid #0f6d3f',
                                    borderRadius: '24px',
                                    position: 'relative',
                                    marginTop: '20px'
                                }}
                            >
                                <div className="text-center" style={{ position: 'absolute', top: '-15px', left: '0', right: '0' }}>
                                    <span className="px-4 py-1 font-weight-bold text-white bg-emerald rounded-pill shadow-sm" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
                                        OPSI 1: UKT KELOMPOK TINGGI
                                    </span>
                                </div>

                                <div className="mt-4">
                                    <Row className="justify-content-center">
                                        {this.renderUkt()}
                                    </Row>
                                    <div className="text-center mt-3 text-muted small">
                                        <i className="fa fa-info-circle mr-1"></i> Tanpa perlu verifikasi berkas ekonomi yang rumit.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-center mb-5">
                        <div className="col-md-10">
                            <div className="d-flex align-items-center mb-4">
                                <hr className="flex-grow-1" style={{ borderColor: '#e2e8f0' }} />
                                <span className="mx-4 text-muted font-weight-bold text-uppercase small" style={{ letterSpacing: '2px' }}>Atau</span>
                                <hr className="flex-grow-1" style={{ borderColor: '#e2e8f0' }} />
                            </div>

                            <div className="row justify-content-center">
                                <Col md={6} xs={12} className="ukt-selection-tile">
                                    <input
                                        type="radio"
                                        id={'ukt-tinggi-0'}
                                        name="ukt_tinggi"
                                        value={'0'}
                                        checked={this.state.kategori.toString() === '0'}
                                        onChange={this.batalUktTinggi}
                                    />
                                    <label
                                        className="label-modern h-100 d-flex flex-column align-items-center justify-content-center"
                                        htmlFor={'ukt-tinggi-0'}
                                        style={{ border: '2px solid #cbd5e1', borderRadius: '20px', padding: '30px' }}
                                    >
                                        <div className="icon-box mb-3" style={{ background: '#f1f5f9', color: '#475569', width: '50px', height: '50px' }}>
                                            <i className="fa fa-calculator" style={{ fontSize: '1.2rem' }}></i>
                                        </div>
                                        <span className="group-name font-weight-bold text-dark mb-1">Gunakan Data Ekonomi</span>
                                        <div className="price-tag text-muted small mb-2">
                                            (Seleksi Kelompok I s.d. VIII)
                                        </div>
                                        <div className="badge badge-light text-primary border p-2" style={{ fontSize: '0.75rem' }}>
                                            <i className="fa fa-file-text-o mr-1"></i> Wajib Upload Berkas
                                        </div>
                                    </label>
                                </Col>
                            </div>
                        </div>
                    </div>

                    <Row className="mb-5 justify-content-center">
                        <Col md={10}>
                            <div className="row">
                                <Col md="6" className="mb-3 mb-md-0">
                                    <div className="info-card-premium status-green shadow-sm h-100 p-4 rounded-xl border-0" style={{ background: '#f0fdf4' }}>
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="p-2 rounded bg-white shadow-sm mr-3 text-success">
                                                <i className="fa fa-bolt"></i>
                                            </div>
                                            <h6 className="mb-0 font-weight-bold text-success">Keuntungan UKT Tinggi</h6>
                                        </div>
                                        <ul className="list-reset pl-0 mb-0 small text-muted">
                                            <li className="mb-2 d-flex"><i className="fa fa-check text-success mr-2 mt-1"></i> Langsung ditetapkan UKT permanen</li>
                                            <li className="mb-2 d-flex"><i className="fa fa-check text-success mr-2 mt-1"></i> Tidak perlu upload slip gaji/listrik</li>
                                            <li className="d-flex"><i className="fa fa-check text-success mr-2 mt-1"></i> Proses registrasi jauh lebih singkat</li>
                                        </ul>
                                    </div>
                                </Col>
                                <Col md="6">
                                    <div className="info-card-premium status-blue shadow-sm h-100 p-4 rounded-xl border-0" style={{ background: '#f0f7ff' }}>
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="p-2 rounded bg-white shadow-sm mr-3 text-primary">
                                                <i className="fa fa-search"></i>
                                            </div>
                                            <h6 className="mb-0 font-weight-bold text-primary">Verifikasi Dokumen</h6>
                                        </div>
                                        <ul className="list-reset pl-0 mb-0 small text-muted">
                                            <li className="mb-2 d-flex"><i className="fa fa-info-circle text-primary mr-2 mt-1"></i> Verifikasi manual oleh tim Universitas</li>
                                            <li className="mb-2 d-flex"><i className="fa fa-info-circle text-primary mr-2 mt-1"></i> Berpeluang mendapat kelompok UKT I - VIII</li>
                                            <li className="d-flex"><i className="fa fa-info-circle text-primary mr-2 mt-1"></i> Wajib input detail penghasilan & aset</li>
                                        </ul>
                                    </div>
                                </Col>
                            </div>
                        </Col>
                    </Row>

                    <div className="text-center pt-4 border-top">
                        <Button
                            disabled={this.state.nextDisabled}
                            className={`modern-btn-primary px-5 py-3 shadow-lg ${this.state.nextDisabled ? 'opacity-50' : ''}`}
                            style={{ borderRadius: '50px', fontSize: '1.1rem' }}
                            onClick={
                                this.state.kategori !== '0'
                                    ? this.toggleBersedia
                                    : this.toggleTidakBersedia
                            }
                        >
                            {this.state.nextDisabled === false ? <IconCheck /> : ''}{' '}
                            <span className="ml-2">{this.state.nextButton}</span>
                        </Button>
                        <p className="mt-3 text-muted small font-italic">
                            Pastikan pilihan Anda sudah benar sebelum menekan tombol konfirmasi.
                        </p>
                    </div>
                </Card>

                <Modal
                    isOpen={this.state.modalBersedia}
                    toggle={this.toggleBersedia}
                    className={this.props.className}
                >
                    <ModalHeader toggle={this.toggleBersedia}>
                        Apakah Anda yakin?
                    </ModalHeader>
                    <ModalBody>
                        <Alert color="success" className="text-center">
                            Anda akan ditetapkan dalam <br />
                            <b>
                                UKT Kelompok {this.state.kategori} - {this.state.besar_ukt}
                            </b>
                            .
                        </Alert>
                        <Alert color="warning" className="text-justify">
                            <i className="fa fa-info-circle"></i> Anda dapat membatalkannya
                            dengan menekan tombol <b>{'"Batal UKT Kelompok Atas"'}</b> yang ada di
                            bagian bawah setiap laman selama anda belum menyelesaikan seluruh
                            proses.
                        </Alert>
                    </ModalBody>
                    <ModalFooter className="text-right">
                        <Button color="success" onClick={this.klikBersedia}>
                            Ya, Saya Yakin
                        </Button>{' '}
                        <Button color="danger" onClick={this.toggleBersedia}>
                            Batalkan
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal
                    isOpen={this.state.modalTidakBersedia}
                    toggle={this.toggleTidakBersedia}
                    className={this.props.className}
                >
                    <ModalHeader toggle={this.toggleTidakBersedia}>
                        Apakah Anda yakin?
                    </ModalHeader>
                    <ModalBody>
                        <Alert color="success">
                            Anda akan menjalani dan mengikuti proses penentuan Kelompok UKT.
                        </Alert>
                        <Alert color="warning" className="text-justify">
                            <i className="fa fa-info-circle"></i> Anda tetap mempunyai
                            kemungkinan untuk mendapatkan UKT kelompok VI, VII, atau VIII.
                            Anda dapat memilih UKT Kelompok Atas dengan tombol{' '}
                            <b>{'"Pilih UKT Kelompok Atas"'}</b> yang ada di bagian samping kiri
                            laman selama anda belum menyelesaikan proses.
                        </Alert>
                    </ModalBody>
                    <ModalFooter className="text-right">
                        <Button color="success" onClick={this.klikTidakBersedia}>
                            Ya, Saya Yakin
                        </Button>{' '}
                        <Button color="danger" onClick={this.toggleTidakBersedia}>
                            Batalkan
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default connect((store) => {
    return {
        ukt: store.ukt.ukt,
        cmahasiswa: store.cmahasiswa.cmahasiswa,
    };
})(PilihanUktTinggi);