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
                <Col key={key} className="col-12 col-sm-6 col-lg-4 ukt-selection-tile mb-3">
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
                <Card className="premium-card p-3 p-sm-4 p-md-5 border-0 shadow-lg">
                    <div className="text-center mb-5 mt-2">
                        <div className="d-inline-block p-2 p-sm-3 rounded-circle bg-emerald-light mb-3">
                            <i className="fa fa-university fa-lg fa-sm-2x text-emerald"></i>
                        </div>
                        <h2 className="font-weight-bold color-emerald mb-2 text-lg sm:text-2xl md:text-3xl" style={{ letterSpacing: '-0.5px' }}>
                            Pemilihan Kelompok UKT
                        </h2>
                        <p className="text-muted mx-auto text-xs sm:text-sm md:text-base" style={{ maxWidth: '600px', lineHeight: '1.6' }}>
                            Berdasarkan data prodi Anda, silakan pilih apakah Anda bersedia ditetapkan pada <strong>UKT Kelompok Atas</strong> atau melalui <strong>Verifikasi Ekonomi</strong>.
                        </p>

                        {this.props.cmahasiswa.prodi != null && (
                            <div className="mt-4">
                                <Badge color="success" pill className="px-3 px-sm-4 py-2 shadow-sm text-wrap" style={{ fontSize: '0.75rem', sm: '0.9rem', backgroundColor: '#0f6d3f', maxWidth: '100%' }}>
                                    <i className="fa fa-graduation-cap mr-2"></i>
                                    Prodi: {this.props.cmahasiswa.prodi.nama}
                                </Badge>
                            </div>
                        )}
                    </div>

                    <div className="row justify-content-center mb-5">
                        <div className="col-12 col-md-11 col-lg-10">
                            <div
                                className="ukt-high-group-container p-3 p-sm-4 rounded-xl shadow-sm"
                                style={{
                                    background: '#ffffff',
                                    border: '2px solid #0f6d3f',
                                    borderRadius: '24px',
                                    position: 'relative',
                                    marginTop: '20px'
                                }}
                            >
                                <div className="text-center" style={{ position: 'absolute', top: '-15px', left: '0', right: '0' }}>
                                    <span className="px-3 px-sm-4 py-1 font-weight-bold text-white bg-emerald rounded-pill shadow-sm" style={{ fontSize: '0.7rem', sm: '0.85rem', letterSpacing: '1px' }}>
                                        OPSI 1: UKT KELOMPOK TINGGI
                                    </span>
                                </div>

                                <div className="mt-4">
                                    <Row className="justify-content-center">
                                        {this.renderUkt()}
                                    </Row>
                                    <div className="text-center mt-2 text-muted text-[10px] sm:text-xs">
                                        <i className="fa fa-info-circle mr-1"></i> Tanpa perlu verifikasi berkas ekonomi yang rumit.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-center mb-5 px-3">
                        <div className="col-12 col-md-10">
                            <div className="d-flex align-items-center mb-4">
                                <hr className="flex-grow-1" style={{ borderColor: '#e2e8f0' }} />
                                <span className="mx-2 mx-sm-4 text-muted font-weight-bold text-uppercase text-[10px] sm:text-xs" style={{ letterSpacing: '2px' }}>Atau</span>
                                <hr className="flex-grow-1" style={{ borderColor: '#e2e8f0' }} />
                            </div>

                            <div className="row justify-content-center">
                                <Col lg={6} md={8} xs={12} className="ukt-selection-tile">
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
                                        style={{ borderRadius: '20px', padding: '20px' }}
                                    >
                                        <div className="icon-box mb-3" style={{ background: '#f1f5f9', color: '#475569', width: '50px', height: '50px' }}>
                                            <i className="fa fa-calculator" style={{ fontSize: '1.2rem' }}></i>
                                        </div>
                                        <span className="group-name font-weight-bold text-dark mb-1 text-sm sm:text-base text-center">Gunakan Data Ekonomi</span>
                                        <div className="price-tag text-muted text-[11px] sm:text-xs mb-2 text-center">
                                            (Seleksi Kelompok I s.d. VIII)
                                        </div>
                                        <div className="badge badge-light text-primary border p-2" style={{ fontSize: '0.65rem', sm: '0.75rem' }}>
                                            <i className="fa fa-file-text-o mr-1"></i> Wajib Upload Berkas
                                        </div>
                                    </label>
                                </Col>
                            </div>
                        </div>
                    </div>

                    <Row className="mb-5 justify-content-center px-2">
                        <Col lg={10} xs={12}>
                            <div className="row">
                                <Col md="6" xs={12} className="mb-3">
                                    <div className="info-card-premium status-green shadow-sm h-100 p-3 p-sm-4 rounded-xl border-0" style={{ background: '#f0fdf4' }}>
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="p-2 rounded bg-white shadow-sm mr-3 text-success">
                                                <i className="fa fa-bolt"></i>
                                            </div>
                                            <h6 className="mb-0 font-weight-bold text-success text-sm sm:text-base">Keuntungan UKT Tinggi</h6>
                                        </div>
                                        <ul className="list-reset pl-0 mb-0 text-[11px] sm:text-xs md:text-sm text-muted">
                                            <li className="mb-2 d-flex"><i className="fa fa-check text-success mr-2 mt-1"></i> Langsung ditetapkan UKT permanen</li>
                                            <li className="mb-2 d-flex"><i className="fa fa-check text-success mr-2 mt-1"></i> Tidak perlu upload slip gaji/listrik</li>
                                            <li className="d-flex"><i className="fa fa-check text-success mr-2 mt-1"></i> Proses registrasi jauh lebih singkat</li>
                                        </ul>
                                    </div>
                                </Col>
                                <Col md="6" xs={12} className="mb-3">
                                    <div className="info-card-premium status-blue shadow-sm h-100 p-3 p-sm-4 rounded-xl border-0" style={{ background: '#f0f7ff' }}>
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="p-2 rounded bg-white shadow-sm mr-3 text-primary">
                                                <i className="fa fa-search"></i>
                                            </div>
                                            <h6 className="mb-0 font-weight-bold text-primary text-sm sm:text-base">Verifikasi Dokumen</h6>
                                        </div>
                                        <ul className="list-reset pl-0 mb-0 text-[11px] sm:text-xs md:text-sm text-muted">
                                            <li className="mb-2 d-flex"><i className="fa fa-info-circle text-primary mr-2 mt-1"></i> Verifikasi manual oleh tim Universitas</li>
                                            <li className="mb-2 d-flex"><i className="fa fa-info-circle text-primary mr-2 mt-1"></i> Berpeluang mendapat kelompok UKT I - VIII</li>
                                            <li className="d-flex"><i className="fa fa-info-circle text-primary mr-2 mt-1"></i> Wajib input detail penghasilan & aset</li>
                                        </ul>
                                    </div>
                                </Col>
                            </div>
                        </Col>
                    </Row>

                    <div className="text-center pt-4 border-top px-2">
                        <Button
                            disabled={this.state.nextDisabled}
                            className={`modern-btn-primary px-4 px-sm-5 py-2 py-sm-3 shadow-lg w-100 w-sm-auto ${this.state.nextDisabled ? 'opacity-50' : ''}`}
                            style={{ borderRadius: '50px', fontSize: '0.9rem', sm: '1.1rem' }}
                            onClick={
                                this.state.kategori !== '0'
                                    ? this.toggleBersedia
                                    : this.toggleTidakBersedia
                            }
                        >
                            {this.state.nextDisabled === false ? <IconCheck /> : ''}{' '}
                            <span className="ml-2">{this.state.nextButton}</span>
                        </Button>
                        <p className="mt-3 text-muted text-[10px] sm:text-xs font-italic">
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
                    <ModalBody className="p-4">
                        <div className="alert-premium-success mb-4 p-4 text-center rounded-xl shadow-sm border-0">
                            <div className="icon-circle bg-success text-white mx-auto mb-3" style={{ width: '50px', height: '50px', lineHeight: '50px', fontSize: '1.5rem' }}>
                                <i className="fa fa-check"></i>
                            </div>
                            <h5 className="font-weight-bold text-success mb-2">Konfirmasi Pilihan</h5>
                            <p className="mb-0 text-muted text-sm">
                                Anda akan ditetapkan dalam kelompok UKT:
                            </p>
                            <div className="mt-2 py-2 px-3 bg-white d-inline-block rounded-pill border font-weight-bold text-success shadow-sm">
                                UKT Kelompok {this.state.kategori} - {this.state.besar_ukt}
                            </div>
                        </div>

                        <div className="alert-premium-warning p-3 rounded-lg border-left shadow-sm" style={{ borderLeft: '4px solid #f59e0b', background: '#fffbeb' }}>
                            <div className="d-flex align-items-start">
                                <i className="fa fa-info-circle text-warning mr-3 mt-1" style={{ fontSize: '1.2rem' }}></i>
                                <div className="text-muted text-xs sm:text-sm">
                                    <strong className="text-warning d-block mb-1">Penting:</strong>
                                    Anda dapat membatalkannya dengan menekan tombol <b>"Batal UKT Kelompok Atas"</b> di bagian bawah laman sebelum proses selesai.
                                </div>
                            </div>
                        </div>
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
                    <ModalBody className="p-4">
                        <div className="alert-premium-emerald mb-4 p-4 text-center rounded-xl shadow-sm border-0" style={{ background: '#f0fdf4' }}>
                            <div className="icon-circle bg-emerald text-white mx-auto mb-3" style={{ width: '50px', height: '50px', lineHeight: '50px', fontSize: '1.5rem', backgroundColor: '#0f6d3f' }}>
                                <i className="fa fa-calculator"></i>
                            </div>
                            <h5 className="font-weight-bold mb-2" style={{ color: '#0f6d3f' }}>Verifikasi Data Ekonomi</h5>
                            <p className="mb-0 text-muted text-sm">
                                Anda akan menjalani proses penentuan Kelompok UKT melalui seleksi data ekonomi.
                            </p>
                        </div>

                        <div className="alert-premium-warning p-3 rounded-lg border-left shadow-sm" style={{ borderLeft: '4px solid #f59e0b', background: '#fffbeb' }}>
                            <div className="d-flex align-items-start">
                                <i className="fa fa-info-circle text-warning mr-3 mt-1" style={{ fontSize: '1.2rem' }}></i>
                                <div className="text-muted text-xs sm:text-sm">
                                    <strong className="text-warning d-block mb-1">Informasi:</strong>
                                    Anda tetap berpeluang mendapat UKT kelompok VI, VII, atau VIII. Pilihan UKT Kelompok Atas tetap tersedia di menu samping selama proses belum selesai.
                                </div>
                            </div>
                        </div>
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