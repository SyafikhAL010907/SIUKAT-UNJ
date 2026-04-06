import React from 'react'
import { Row, Col } from 'reactstrap'
import Widget01 from '../coreui/views/Widgets/Widget01'
import { cmahasiswa } from '../../actions'
import { connect } from 'react-redux'
import { cookies, cookieName } from '../../global'

class SummaryCmahasiswa extends React.Component{
    componentWillMount(){
        this.props.dispatch(cmahasiswa.flagCount(cookies.get(cookieName)))       
    }
    render(){
        return(
            <Row>
                <Col xs="12" sm="6" lg="3">
                    <Widget01 color="success" 
                        header={this.props.flagCount.total_selesai.toString()} mainText="Selesai Mengisi" value={this.props.flagCount.percentSelesai.toString()} 
                        smallText={"Belum Selesai Mengisi: " + this.props.flagCount.total_belum.toString()}
                        icon="fa-user"/>
                </Col>
                <Col xs="12" sm="6" lg="3">
                    <Widget01 color="info" 
                        header={this.props.flagCount.ukt_tinggi.toString()} mainText="UKT Tinggi" value={this.props.flagCount.percentUktTinggi.toString()}  
                        smallText={"UKT Seleksi: " +this.props.flagCount.ukt_seleksi.toString()}
                        icon="fa-user"/>
                </Col>
                <Col xs="12" sm="6" lg="3">
                    <Widget01 color="warning" 
                        header={this.props.flagCount.terima_ukt.toString()} mainText="Terima UKT" value={this.props.flagCount.percentTerima.toString()} 
                        smallText={"Belum Memilih: " +this.props.flagCount.pengumuman.toString()}
                        icon="fa-user"/>
                </Col>
                <Col xs="12" sm="6" lg="3">
                    <Widget01 color="danger" 
                        header={this.props.flagCount.selesai_sanggah.toString()} mainText="Selesai Sanggah" value={this.props.flagCount.percentSanggah.toString()} 
                        smallText={"Sanggah UKT: " +this.props.flagCount.sanggah_ukt.toString()}
                        icon="fa-user"/>
                </Col>
            </Row>
        )
    }
}

export default connect((store) => ({
    flagCount: store.cmahasiswa.flagCount
}))(SummaryCmahasiswa)