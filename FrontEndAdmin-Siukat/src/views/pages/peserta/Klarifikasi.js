import React from "react";
import { Row, Col, Card, CardHeader, CardBody } from "reactstrap";
import { cmahasiswa, user } from "../../../actions";
import { connect } from "react-redux";
import { cookies, cookieName } from "../../../global";
import { DataTable, SummaryCmahasiswa, Exports } from "../../components";

class Klarifikasi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleCalonMahasiswa: false,
      perPage: 10,
      keyword: "",
    };
    this.toggleCalonMahasiswa = this.toggleCalonMahasiswa.bind(this);
    this.renderData = this.renderData.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handlePerPage = this.handlePerPage.bind(this);
  }
  toggleCalonMahasiswa() {
    this.setState({
      toggleCalonMahasiswa: !this.state.toggleCalonMahasiswa,
    });
  }
  componentDidMount() {
    this.props.dispatch(user.getByLoggedIn(cookies.get(cookieName)));
    this.props.dispatch(
      cmahasiswa.fetchKlarifikasi(cookies.get(cookieName), {
        perPage: this.state.perPage,
        page: 1,
        keyword: "",
      }),
    );

    // Real-time Update: Polling setiap 15 detik untuk tabel klarifikasi
    this.pollingKlarifikasi = setInterval(() => {
      if (!this.state.keyword) {
        this.props.dispatch(
          cmahasiswa.fetchKlarifikasi(cookies.get(cookieName), {
            perPage: this.state.perPage,
            page: this.props.currentPage || 1,
            keyword: "",
          }),
        );
      }
    }, 60000);
  }

  componentWillUnmount() {
    if (this.pollingKlarifikasi) clearInterval(this.pollingKlarifikasi);
  }

  // DATATABLE HANDLERS
  renderData(e, perPage = 10, to = 1, key = null) {
    e.preventDefault();
    this.props.dispatch(
      cmahasiswa.fetchKlarifikasi(cookies.get(cookieName), {
        perPage: perPage,
        page: to,
        keyword: key,
      }),
    );
  }
  handlePerPage(e) {
    this.setState({
      perPage: e.target.value,
    });
    this.renderData(e, e.target.value, 1, this.state.keyword);
  }
  handleSearch(e) {
    this.setState({
      keyword: e.target.value,
    });
    this.renderData(e, this.state.perPage, 1, e.target.value);
  }

  render() {
    return (
      <Row>
        <Col xs="12">
          <SummaryCmahasiswa />
          <Card className="card-accent-success">
            <CardHeader>
              <Row>
                <Col md="6">
                  <span>Data Klarifikasi</span>
                </Col>
                <Col md="6" className="text-right">
                  {/* <Button className="btn btn-sm btn-success margin-left-10"><i className="fa fa-file-pdf-o"></i> PDF Bidik Misi</Button>
                                    <Button className="btn btn-sm btn-danger margin-left-10 margin-top-10"><i className="fa fa-file-excel-o"></i> Excel Bidik Misi</Button> */}

                  {/* <Button className="btn btn-sm btn-success margin-left-10">
                                        <i className="fa fa-file-pdf-o"></i> PDF Data Klarifikasi
                                    </Button>
                                    <Exports count={this.props.count} title="Data Klarifikasi"/> */}
                  {/* <Button className="btn btn-sm btn-info text-white margin-left-10 margin-top-10" onClick={(e)=>{this.handleExport(e,"csv")}}><i className="fa fa-file-excel-o"></i> Excel Calon Mahasiswa</Button> */}
                </Col>
              </Row>
            </CardHeader>
            <CardBody className="card-body">
              <DataTable
                data={this.props.cmahasiswa}
                columns={{
                  no_peserta: "Nomor Peserta",
                  foto_cmahasiswa: "Foto",
                  nama_cmahasiswa: "Nama Lengkap",
                  bidik_misi_cmahasiswa: "KIPK",
                  "fakultas.nama": "Fakultas",
                  "prodi.nama": "Program Studi",
                  golongan_id: "Kelompok UKT",
                  "ukt.nominal": "Nominal UKT",
                  flag: "Status",
                  ukt_tinggi: "UKT Tinggi",
                  aksi: "Aksi",
                }}
                primaryKey="no_peserta"
                total={this.props.count}
                currentPage={this.props.currentPage}
                totalPages={this.props.totalPages}
                perPage={this.state.perPage}
                keyword={this.state.keyword}
                handlePerPage={this.handlePerPage}
                handleSearch={this.handleSearch}
                renderData={this.renderData}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default connect((store) => ({
  cmahasiswa: store.cmahasiswa.cmahasiswa,
  count: store.cmahasiswa.datatable.count,
  totalPages: store.cmahasiswa.datatable.totalPages,
  currentPage: store.cmahasiswa.datatable.currentPage,
  perPage: store.cmahasiswa.datatable.perPage,
  keyword: store.cmahasiswa.datatable.keyword,

  user: store.user.user,
}))(Klarifikasi);
