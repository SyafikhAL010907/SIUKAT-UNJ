import React, {Component} from 'react'
import { cmahasiswa } from '../../actions'
import { connect } from 'react-redux'
import { cookies, cookieName } from '../../global'
import { Button } from 'reactstrap'
import { CSVLink, CSVDownload} from 'react-csv'

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
            // Trigger download secara paksa menggunakan ref
            setTimeout(() => {
                if (this.csvLink && this.csvLink.current && this.csvLink.current.link) {
                    this.csvLink.current.link.click()
                }
                this.setState({ isDownloading: false })
            }, 500)
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
                
                {this.state.isDownloading && this.props.cmahasiswa && this.props.cmahasiswa.length > 0 && (
                    <CSVLink 
                        data={this.props.cmahasiswa} 
                        headers={columnsHeaders}
                        filename={`Data_Master_Siukat.csv`}
                        ref={this.csvLink}
                        className="hidden"
                    />
                )}
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