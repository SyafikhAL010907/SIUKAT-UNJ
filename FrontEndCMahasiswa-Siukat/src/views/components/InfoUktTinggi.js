import React from 'react'
import { Card, CardTitle } from 'reactstrap'
import { connect } from 'react-redux'
import { cmahasiswa, ukt } from '../../actions'
import { cookies, cookieName, rupiah } from '../../global'

class InfoUktTinggi extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(ukt.getByLoggedIn(cookies.get(cookieName)))
        this.props.dispatch(cmahasiswa.getByLoggedIn(cookies.get(cookieName)))
    }
    renderUktTinggi = () => {
        var ukt_now = {
            kategori: [this.props.cmahasiswa.golongan_id],
            besar_ukt: this.props.ukt[this.props.cmahasiswa.golongan_id]
        }
        return (
            <div className="bg-emerald-light p-3 rounded-lg border-emerald shadow-sm">
                <div className="text-emerald font-weight-bold" style={{fontSize: '1.1rem'}}>Kelompok {ukt_now.kategori}</div>
                <div className="text-dark font-weight-bold mt-1" style={{fontSize: '1.4rem'}}>{rupiah(ukt_now.besar_ukt)}</div>
            </div>
        )
    }
    render() {
        return (
            <Card className="premium-card shadow-sm border-0 mb-3 overflow-hidden">
                <CardTitle className="p-3 mb-0 border-bottom d-flex align-items-center bg-emerald text-white" style={{borderRadius: '16px 16px 0 0'}}>
                    <div className="info-icon mr-2 bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{width: '32px', height: '32px'}}>
                        <i className="fa fa-university text-emerald" style={{fontSize: '14px'}}></i>
                    </div>
                    <span className="font-weight-bold" style={{fontSize: '1rem'}}>Informasi Penetapan UKT</span>
                </CardTitle>
                <div className="card-body p-4 text-center">
                    <p className="text-muted mb-3" style={{fontSize: '0.875rem'}}>Anda telah ditetapkan dalam kelompok:</p>
                    {(this.props.ukt !== undefined) ? this.renderUktTinggi() : <div className="p-3 text-muted">Memuat data...</div>}
                </div>
            </Card>
        )
    }
}

export default connect((store) => ({
    ukt: store.ukt.ukt,
    cmahasiswa: store.cmahasiswa.cmahasiswa
}))(InfoUktTinggi)