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
            <div className="p-0">
                <Card className="premium-card p-4 p-md-5">
                    <div className="text-center mb-5">
                        <h2 className="font-weight-bold color-emerald mb-2">
                           Pemilihan Kelompok UKT
                        </h2>
                        <p className="text-muted lead">
                            Apakah anda bersedia ditetapkan pada UKT Kelompok VI / VII / VIII?
                        </p>
                        {this.props.cmahasiswa.prodi != null && (
                            <div className="badge badge-emerald-soft p-2 px-3 rounded-pill mt-2">
                                <i className="fa fa-university mr-2"></i>
                                {this.props.cmahasiswa.prodi.nama}
                            </div>
                        )}
                    </div>

                    <Alert color="info" className="rounded-lg border-0 shadow-sm mb-4 text-center">
                        <i className="fa fa-info-circle mr-2"></i>
                        Silakan pilih salah satu opsi di bawah ini untuk melanjutkan proses:
                    </Alert>

                    {/* Pembungkus Khusus Kelompok Tinggi dengan Identitas UNJ */}
                    <div 
                        className="ukt-high-group-container mb-5 p-4 rounded-lg shadow-sm" 
                        style={{ 
                            background: '#ffffff', 
                            border: '3px solid #008d4c', // Hijau UNJ
                            position: 'relative',
                            marginTop: '20px'
                        }}
                    >
                        <div 
                            className="text-center" 
                            style={{ 
                                position: 'absolute', 
                                top: '-18px', 
                                left: '0', 
                                right: '0' 
                            }}
                        >
                            <span 
                                className="px-4 py-2 font-weight-bold text-uppercase" 
                                style={{ 
                                    backgroundColor: '#ffcc00', // Kuning UNJ
                                    color: '#008d4c', // Hijau UNJ
                                    borderRadius: '50px', 
                                    fontSize: '0.9rem', 
                                    letterSpacing: '1.5px',
                                    border: '2px solid #008d4c',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }}
                            >
                                <i className="fa fa-circle mr-2"></i>
                                UKT Kelompok Tinggi
                                <i className="fa fa-circle ml-2"></i>
                            </span>
                        </div>

                        <div className="mt-3">
                            <Row className="justify-content-center">
                                {this.renderUkt()}
                            </Row>
                        </div>
                    </div>

                    <Row className="mb-5 justify-content-center">
                        <Col md={12} className="text-center mb-4">
                            <div className="d-flex align-items-center justify-content-center">
                                <hr style={{ flex: 1, borderTop: '1px solid #e2e8f0' }} />
                                <span className="mx-3 text-muted font-italic" style={{ fontSize: '0.9rem' }}>
                                    Atau jika keberatan, gunakan pilihan di bawah ini:
                                </span>
                                <hr style={{ flex: 1, borderTop: '1px solid #e2e8f0' }} />
                            </div>
                        </Col>
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
                                className="label-modern" 
                                htmlFor={'ukt-tinggi-0'}
                                style={{ border: '2px solid #cbd5e1' }}
                            >
                                <div className="icon-box" style={{ background: '#f1f5f9', color: '#475569' }}>
                                    <i className="fa fa-calculator"></i>
                                </div>
                                <span className="group-name">Gunakan Data Ekonomi</span>
                                <div className="price-tag" style={{ fontSize: '0.95rem', color: '#64748b' }}>
                                    (Seleksi Kelompok I s.d. VIII)
                                </div>
                                <div className="mt-2 text-primary" style={{ fontSize: '0.8rem' }}>
                                    <i className="fa fa-info-circle mr-1"></i> 
                                    Memerlukan verifikasi berkas pendukung
                                </div>
                            </label>
                        </Col>
                    </Row>

                    <Row className="mb-5">
                        <Col md="6" className="mb-3 mb-md-0">
                            <div className="info-card-premium status-green shadow-sm">
                                <div className="info-header">
                                    <div className="info-icon">
                                        <i className="fa fa-check-circle"></i>
                                    </div>
                                    <h5 className="mb-0 font-weight-bold">Jika Bersedia (Kelompok Atas)</h5>
                                </div>
                                <ul>
                                    <li>Anda <strong>tidak perlu</strong> mengunggah data ekonomi yang rumit.</li>
                                    <li>Hanya perlu mengisi data pribadi dasar mahasiswa dan orang tua.</li>
                                    <li>Mengunggah Surat Pernyataan bersedia masuk Kelompok Atas.</li>
                                </ul>
                            </div>
                        </Col>
                        <Col md="6">
                            <div className="info-card-premium status-blue shadow-sm">
                                <div className="info-header">
                                    <div className="info-icon">
                                        <i className="fa fa-calculator"></i>
                                    </div>
                                    <h5 className="mb-0 font-weight-bold">Jika Tidak Bersedia</h5>
                                </div>
                                <ul>
                                    <li>Penetapan UKT dilakukan melalui perhitungan data kondisi ekonomi.</li>
                                    <li>Anda wajib mengunggah seluruh dokumen pendukung ekonomi.</li>
                                    <li>Tetap berpeluang mendapatkan UKT Kelompok I s.d. VIII.</li>
                                </ul>
                            </div>
                        </Col>
                    </Row>

                    <div className="text-center">
                        <Button
                            disabled={this.state.nextDisabled}
                            className={`modern-btn-primary px-5 py-3 ${this.state.nextDisabled ? 'opacity-50' : ''}`}
                            size="lg"
                            onClick={
                                this.state.kategori !== '0'
                                    ? this.toggleBersedia
                                    : this.toggleTidakBersedia
                            }
                        >
                            {this.state.nextDisabled === false ? <IconCheck /> : ''}{' '}
                            {this.state.nextButton}
                        </Button>
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