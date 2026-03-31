import React from 'react'
import {
    Card, CardTitle, Button, Alert,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { cmahasiswa } from '../../actions'
import { cookies, cookieName } from '../../global'

class BatalUktTinggi extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: false,
        }

        this.toggle = this.toggle.bind(this);
    }
    UNSAFE_componentWillMount = () => {
        this.props.dispatch(cmahasiswa.getByLoggedIn(cookies.get(cookieName)))
    }
    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }
    handleBatalUktTinggi = () => {
        this.props.dispatch(cmahasiswa.updateFlagUktRendah(cookies.get(cookieName)))
    }
    render() {
        if (this.props.cmahasiswa.ukt_tinggi === 'tidak') {
            return <Redirect to='/main/ukt/seleksi' />
        }
        return (
            <div>
                <Card className="margin-top-20 card-warning" body>
                    <CardTitle><i className="fa fa-info-circle"></i> Perhatian!</CardTitle>
                    <div className="card-body">
                        <div className="text-justify">Anda dapat membatalkan pilihan UKT Kelompok Atas dengan klik tombol di bawah ini</div>
                        <Button onClick={this.toggle} color="danger" className="margin-top-20" block>
                            <i className="fa fa-warning"></i> Batal <i className="fa fa-warning"></i>
                            <br />UKT Kelompok Atas
                        </Button>
                    </div>
                </Card>
                <Modal size="lg" isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Apakah Anda yakin?</ModalHeader>
                    <ModalBody>
                        <Alert color="success">
                            Anda akan menjalani dan mengikuti proses penentuan Kelompok UKT.
                        </Alert>
                        <Alert color="warning" className="text-justify">
                            <i className="fa fa-info-circle"></i> Anda tetap mempunyai kemungkinan untuk mendapatkan UKT kelompok VI, VII, atau VIII. Anda dapat memilih UKT Kelompok Atas dengan tombol <b>"Pilih UKT Kelompok Atas"</b> yang ada di bagian samping kiri laman selama anda belum menyelesaikan proses.
                        </Alert>
                    </ModalBody>
                    <ModalFooter className="text-right">
                        <Button color="success" onClick={this.handleBatalUktTinggi.bind(this)}>Ya, Saya yakin</Button>{' '}
                        <Button color="danger" onClick={this.toggle}>Batal</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default connect(
    (store) => ({
        cmahasiswa: store.cmahasiswa.cmahasiswa
    })
)(BatalUktTinggi)