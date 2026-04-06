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
                <Card className="premium-card-warning shadow-sm border-0 mb-4 overflow-hidden">
                    <CardTitle className="p-2 px-3 mb-0 border-bottom d-flex align-items-center bg-white" style={{borderRadius: '16px 16px 0 0', fontSize: '0.9rem'}}>
                        <div className="info-icon mr-2 bg-warning text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '24px', height: '24px'}}>
                            <i className="fa fa-exclamation-triangle" style={{fontSize: '12px'}}></i>
                        </div>
                        <span className="font-weight-bold" style={{color: '#92400e'}}>Perhatian!</span>
                    </CardTitle>
                    <div className="card-body p-3">
                        <Button
                            onClick={this.toggle}
                            className="modern-btn-danger w-100 py-2 shadow-sm small mb-3"
                            style={{background: '#ef4444 !important', fontSize: '0.8rem', fontWeight: 'bold'}}
                        >
                            <i className="fa fa-warning mr-2"></i> Batal UKT Kelompok Atas
                        </Button>
                        <div className="text-justify" style={{fontSize: '0.75rem', color: '#92400e'}}>
                            Batalkan pilihan <strong>UKT Kelompok Atas</strong> untuk kembali ke data ekonomi.
                        </div>
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
                    <ModalFooter className="p-4 bg-light border-top d-flex justify-content-end">
                        <Button className="modern-btn-primary px-4" onClick={this.handleBatalUktTinggi.bind(this)}>
                            <i className="fa fa-check mr-2"></i> Ya, Saya Yakin
                        </Button>{' '}
                        <Button color="link" className="text-secondary font-weight-bold" onClick={this.toggle}>
                            Batal
                        </Button>
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