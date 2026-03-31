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
                <Col md={4} xs={12} className="radio-custom text-center" key={key}>
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
                        <span className="">UKT Kelompok {data[0]}</span>
                        <br />
                        <b>{data[1] === 0 ? 'Tidak Tersedia' : rupiah(data[1])}</b>
                    </Label>
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
                <Card className="margin-top-20 card-warning" body>
                    <CardTitle>
                        <i className="fa fa-info-circle"></i> Perhatian!
                    </CardTitle>
                    <div className="card-body">
                        <div className="text-justify">
                            Anda dapat memilih pilihan UKT Kelompok Atas dengan klik tombol di
                            bawah ini
                        </div>
                        <Button
                            onClick={this.toggle}
                            color="danger"
                            className="margin-top-20"
                            block
                        >
                            Pilih UKT Kelompok Atas
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
                    <ModalFooter className="text-right">
                        <Button
                            disabled={this.state.bersediaDisabled}
                            color="success"
                            onClick={this.handleBatalUktRendah.bind(this)}
                        >
                            {this.state.bersediaDisabled === false ? <IconCheck /> : ''}{' '}
                            {this.state.tombolBersedia}
                        </Button>
                        <Button color="danger" onClick={this.toggle}>
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
