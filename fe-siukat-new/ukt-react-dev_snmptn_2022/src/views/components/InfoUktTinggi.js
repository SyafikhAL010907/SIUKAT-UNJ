import React from 'react'
import { Card, CardTitle, CardText } from 'reactstrap'
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
            <b>Kelompok {ukt_now.kategori} <br /> { rupiah(ukt_now.besar_ukt)} </b>
        )
    }
    render() {
        return (
            <Card className="card-success" body>
                <CardTitle><i className="fa fa-money"></i> UKT Anda</CardTitle>
                <CardText className="text-center">
                    Anda bersedia ditetapkan dalam UKT:<br />
                    {(this.props.ukt !== undefined) ? this.renderUktTinggi() : "Memuat data..."}
                </CardText>
            </Card>
        )
    }
}

export default connect((store) => ({
    ukt: store.ukt.ukt,
    cmahasiswa: store.cmahasiswa.cmahasiswa
}))(InfoUktTinggi)