import React from 'react';
import {
    Card,
    CardTitle,
    Button,
    Row,
    Col,
    Input,
    Label,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Alert,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { cmahasiswa, ukt } from '../../actions';
import { cookies, cookieName, rupiah } from '../../global';

const IconCheck = () => <i className="fa fa-check"></i>;

class BatalUktRendah extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kategori: '',
            besar_ukt: '',

            modal: false,
            bersediaDisabled: true,
            tombolBersedia: 'Pilih salah satu Kelompok UKT Kelompok Atas',
        };

        this.toggle = this.toggle.bind(this);
        this.radioUktTinggi = this.radioUktTinggi.bind(this);
    }
    UNSAFE_componentWillMount() {
        this.props.dispatch(ukt.getByLoggedIn(cookies.get(cookieName)));
        this.props.dispatch(cmahasiswa.getByLoggedIn(cookies.get(cookieName)));
    }
    toggle() {
        this.setState({
            modal: !this.state.modal,
        });
    }
    radioUktTinggi(e) {
        var kategori = e.target.value.toString();
        this.setState({
            bersediaDisabled: false,
            tombolBersedia: 'Ya, Saya bersedia',
            kategori: kategori,
            besar_ukt: rupiah(this.props.ukt[kategori]),
        });
    }
    handleBatalUktRendah() {
        this.props.dispatch(
            cmahasiswa.updateFlagUktTinggi(
                { golongan_id: this.state.kategori },
                cookies.get(cookieName)
            )
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
                            padding: '20px 10px'
                        }}
                    >
                        <div className="icon-box" style={{width: '40px', height: '40px', fontSize: '18px', marginBottom: '10px'}}>
                            <i className="fa fa-money"></i>
                        </div>
                        <span className="group-name" style={{fontSize: '0.9rem'}}>Kelompok {data[0]}</span>
                        <div className="price-tag" style={{fontSize: '1rem'}}>
                            {data[1] === 0 ? 'N/A' : rupiah(data[1])}
                        </div>
                    </label>
                </Col>
            ));
        }
    }
    render() {
        if (this.props.cmahasiswa.ukt_tinggi === 'ya') {
            return <Redirect to="/main/ukt/tinggi" />;
        }
        return (
            <div>
                <Card className="premium-card-warning shadow-sm border-0">
                    <CardTitle className="p-3 mb-0 border-bottom d-flex align-items-center bg-white" style={{borderRadius: '16px 16px 0 0'}}>
                        <div className="info-icon mr-2 bg-warning text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '24px', height: '24px'}}>
                            <i className="fa fa-exclamation-triangle" style={{fontSize: '12px'}}></i>
                        </div>
                        <span className="font-weight-bold" style={{color: '#92400e'}}>Perhatian!</span>
                    </CardTitle>
                    <div className="card-body p-4">
                        <div className="text-justify mb-4" style={{fontSize: '0.9rem', color: '#92400e'}}>
                            Anda dapat memilih pilihan <strong>UKT Kelompok Atas</strong> jika Anda tidak ingin melalui proses pengisian data yang panjang.
                        </div>
                        <Button
                            onClick={this.toggle}
                            className="modern-btn-danger w-100 py-3 shadow-sm"
                            style={{background: '#ef4444 !important'}}
                        >
                            <i className="fa fa-arrow-circle-up mr-2"></i> Pilih UKT Kelompok Atas
                        </Button>
                    </div>
                </Card>
                <Modal
                    isOpen={this.state.modal}
                    size="lg"
                    toggle={this.toggle}
                    className={this.props.className}
                >
                    <ModalHeader toggle={this.toggle}>
                        Silakan pilih salah satu UKT Kelompok Atas
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
                        <Row>{this.renderUkt()}</Row>
                    </ModalBody>
                    <ModalFooter className="p-4 bg-light border-top d-flex justify-content-end">
                        <Button
                            disabled={this.state.bersediaDisabled}
                            className={`modern-btn-primary px-4 ${this.state.bersediaDisabled ? 'opacity-50' : ''}`}
                            onClick={this.handleBatalUktRendah.bind(this)}
                        >
                            {this.state.bersediaDisabled === false ? <IconCheck /> : ''}{' '}
                            {this.state.tombolBersedia}
                        </Button>{' '}
                        <Button color="link" className="text-secondary font-weight-bold" onClick={this.toggle}>
                            Batal
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default connect((store) => ({
    cmahasiswa: store.cmahasiswa.cmahasiswa,
    ukt: store.ukt.ukt,
}))(BatalUktRendah);
