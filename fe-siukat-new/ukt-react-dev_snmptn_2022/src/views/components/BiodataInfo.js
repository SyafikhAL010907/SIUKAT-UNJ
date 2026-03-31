import React from 'react';
import { Card, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { cmahasiswa, ukt } from '../../actions';
import { cookies, cookieName, rupiah } from '../../global';

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

    render() {
        // if (this.props.cmahasiswa.ukt_tinggi === "ya") {
        //   return <Redirect to="/main/ukt/tinggi" />;
        // }
        return (
            <div>
                <Card className="margin-top-20 card-warning" body>
                    <CardTitle>
                        <i className="fa fa-info-circle"></i> Perhatian!
                    </CardTitle>
                    <div className="card-body">
                        <div className="text-justify">
                            Isilah Biodata sesuai dengan aslinya, karena data ini akan
                            digunakan pada Sistem Akademik Universitas Negeri Jakarta
                        </div>
                        {/* <Button
              onClick={this.toggle}
              color="danger"
              className="margin-top-20"
              block
            >
              Pilih UKT Kelompok Atas
            </Button> */}
                    </div>
                </Card>
                <br />
                {/* <Modal isOpen={this.state.modal} size="lg" toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Silakan pilih salah satu UKT Kelompok Atas</ModalHeader>
                    <ModalBody>
                        <Alert color="success" className="text-center">
                            Anda akan ditetapkan dalam <br />
                            <b>UKT Kelompok {this.state.kategori} - {this.state.besar_ukt}</b>.
                        </Alert>
                        <Alert color="warning" className="text-justify">
                            <i className="fa fa-info-circle"></i> Anda dapat membatalkannya dengan menekan tombol <b>"Batal UKT Kelompok Atas"</b> yang ada di bagian bawah setiap laman selama anda belum menyelesaikan seluruh proses.
                        </Alert>
                        <Row>
                            {this.renderUkt()}
                        </Row>
                    </ModalBody>
                    <ModalFooter className="text-right">
                        <Button disabled={this.state.bersediaDisabled} color="success" onClick={this.handleBatalUktRendah.bind(this)}>
                            {this.state.bersediaDisabled === false ? <IconCheck /> : ""}{" "}
                            {this.state.tombolBersedia}
                        </Button>
                        <Button color="danger" onClick={this.toggle}>Batal</Button>
                    </ModalFooter>
                </Modal> */}
            </div>
        );
    }
}

export default connect((store) => ({
    cmahasiswa: store.cmahasiswa.cmahasiswa,
    ukt: store.ukt.ukt,
}))(BatalUktRendah);
