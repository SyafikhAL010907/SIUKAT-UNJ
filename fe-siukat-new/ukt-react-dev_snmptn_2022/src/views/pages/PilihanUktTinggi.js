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
import { rupiah, cookies, cookieName } from '../../global';

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
        this.props.dispatch(ukt.getByLoggedIn(cookies.get(cookieName)));
        this.props.dispatch(cmahasiswa.fetchAllData(cookies.get(cookieName)));
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
        this.props.dispatch(
            cmahasiswa.updateFlagUktTinggi(
                { golongan_id: this.state.kategori },
                cookies.get(cookieName)
            )
        );
    }

    klikTidakBersedia() {
        this.props.dispatch(
            cmahasiswa.updateFlagUktRendah(cookies.get(cookieName))
        );
    }

    renderUkt() {
        if (this.props.ukt !== undefined) {
            var ukt = {};
            ukt.VI = this.props.ukt.VI;
            ukt.VII = this.props.ukt.VII;
            ukt.VIII = this.props.ukt.VIII;
            return Object.entries(ukt).map((data, key) => (
                <Col md={2} xs={12} className="radio-custom" key={key}>
                    <Input
                        type="radio"
                        id={'ukt-tinggi-' + data[0]}
                        name="ukt_tinggi"
                        value={data[0].toString()}
                        checked={this.state.kategori.toString() === data[0].toString()}
                        onChange={this.radioUktTinggi}
                        disabled={data[1] === 0}
                    />
                    <Label
                        className="label-custom"
                        htmlFor={'ukt-tinggi-' + data[0]}
                        style={{
                            pointerEvents: data[1] === 0 ? 'none' : 'default',
                            opacity: data[1] === 0 ? 0.3 : 1,
                        }}
                    >
                        <i className="fa fa-money font-size-30"></i>
                        <br />
                        <span className="">UKT - {data[0]}</span>
                        <br />
                        <b>{data[1] === 0 ? 'Tidak Tersedia' : rupiah(data[1])}</b>
                    </Label>
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
            <div>
                <Row className="margin-top-20">
                    <Col md="12">
                        <Card body className="bg-grey text-center">
                            <Row>
                                <Col md="12">
                                    <h4>
                                        Apakah anda bersedia ditetapkan pada UKT Kelompok VI / VII /
                                        VIII?
                                    </h4>
                  Program Studi
                                    <br />
                                    <b>
                                        {this.props.cmahasiswa.prodi != null &&
                                            this.props.cmahasiswa.prodi.nama}
                                    </b>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Row className="margin-top-20 text-center">
                    <Col md="12">
                        <Alert color="danger">
                            Silakan pilih salah satu dari daftar di bawah ini:
                        </Alert>
                    </Col>
                </Row>
                <Row className="text-center">
                    {this.renderUkt()}
                    <Col md={6} xs={12} className="radio-custom">
                        <Input
                            type="radio"
                            id={'ukt-tinggi-0'}
                            name="ukt_tinggi"
                            value={'0'}
                            checked={this.state.kategori.toString() === '0'}
                            onChange={this.batalUktTinggi}
                        />
                        <Label className="label-custom" htmlFor={'ukt-tinggi-0'}>
                            <i className="fa fa-file-text-o font-size-30"></i>
                            <br />
                            <span className="">Tidak Bersedia di UKT Kelompok Atas</span>
                            <br />
                            <b>(Perhitungan Data Ekonomi)</b>
                        </Label>
                    </Col>
                </Row>
                <Row className="margin-top-20">
                    <Col md="6">
                        <Alert color="orange" className="min-height-260 text-justify">
                            Jika anda <b>bersedia masuk kelompok UKT VI / VII / VIII</b>, anda
              hanya perlu:
                            <ul>
                                <li>Mengisi data pribadi calon mahasiswa dan orang tua;</li>
                                <li>
                                    Mengunggah surat pernyataan yang menyatakan bahwa Anda
                                    bersedia masuk kelompok UKT Kelompok Atas.
                                </li>
                            </ul>
                        </Alert>
                    </Col>
                    <Col md="6">
                        <Alert color="orange" className="min-height-260 text-justify">
                            Jika anda <b>tidak bersedia masuk kelompok UKT VI / VII / VIII</b>
              , maka:
                            <ul>
                                <li>
                                    Proses penetapan UKT dilakukan melalui perhitungan berdasarkan
                                    data kondisi ekonomi yang diunggah;
                                </li>
                                <li>
                                    Anda tetap mempunyai kemungkinan untuk mendapatkan salah satu
                  kelompok dari seluruh kelompok UKT yang ada{' '}
                                    <b>(Kelompok I s.d. VIII)</b> bergantung kepada kondisi
                  ekonomi orang tua/wali calon mahasiswa baru.
                                </li>
                            </ul>
                        </Alert>
                    </Col>
                </Row>
                <Row>
                    <Col md="12" className="text-center">
                        <Button
                            disabled={this.state.nextDisabled}
                            color="success"
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
                    </Col>
                </Row>

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
