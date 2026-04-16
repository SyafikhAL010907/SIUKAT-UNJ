import React, {Component} from 'react'
import { cmahasiswa } from '../../actions'
import { connect } from 'react-redux'
import { cookies, cookieName } from '../../global'
import { Button } from 'reactstrap'
import { exportMasterDataExcel } from '../../utils/exportExcel'

const columnsHeaders = [
    {label:"Nomor Peserta", key:"no_peserta"},
    {label:"Nama Lengkap", key:"nama_cmahasiswa"},
    {label:"BM", key:"bidik_misi_cmahasiswa"},
    {label:"Fakultas", key:"fakultas.nama"},
    {label:"Program Studi", key:"prodi.nama"},
    {label:"Kelompok UKT", key:"golongan_id"},
    {label:"Status", key:"flag"},
    {label:"UKT Tinggi", key:"ukt_tinggi"},
    {label:"Nominal UKT", key:"ukt.nominal"},
]

class Exports extends Component{
    constructor(props){
        super(props)
        this.state = {
            isDownloading: false
        }
        this.handleExport = this.handleExport.bind(this)
        this.csvLink = React.createRef()
    }

    componentWillReceiveProps(nextProps){
        // Jika sedang dalam proses download dan data baru sudah sampai
        if(this.state.isDownloading && nextProps.fetched){
            exportMasterDataExcel(nextProps.cmahasiswa);
            this.setState({ isDownloading: false });
        }
    }

    handleExport(e, perPage, to=1, key=""){
        this.setState({ isDownloading: true })
        this.props.dispatch(cmahasiswa.fetchCmahasiswa(cookies.get(cookieName), {perPage: this.props.count, page: 1, keyword: key}))
    }

    render(){
        return(
            <div className="inline-block">
                <Button 
                    className={this.props.className || "btn btn-sm btn-info text-white margin-left-10 margin-top-10"} 
                    onClick={(e)=>{this.handleExport(e,this.props.count)}}
                    disabled={this.state.isDownloading}
                >
                    <i className={this.state.isDownloading ? "fa fa-spinner fa-spin" : "fa fa-file-excel-o"}></i> 
                    {this.state.isDownloading ? " Loading..." : ` Excel ${this.props.title}`}
                </Button>
                
                {/* Download handled via centralized utility in componentWillReceiveProps */}
            </div>
        )
    }
}

export default connect((store) => ({
    cmahasiswa: store.cmahasiswa.cmahasiswa,
    count: store.cmahasiswa.datatable.count,
    fetched: store.cmahasiswa.fetched,
    totalPages: store.cmahasiswa.datatable.totalPages,
    currentPage: store.cmahasiswa.datatable.currentPage,
    perPage: store.cmahasiswa.datatable.perPage,
    keyword: store.cmahasiswa.datatable.keyword,
}))(Exports)