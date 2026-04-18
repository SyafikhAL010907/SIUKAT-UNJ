import React from "react";
import { connect } from "react-redux";
import { user } from "../../../actions";
import { cookies, cookieName, service } from "../../../global";
import { DataTable } from "../../components";
import axios from "axios";
import swal from "sweetalert";

// ======== MODAL POPUP FORM (INSERT & UPDATE) ========
class FormUkt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id_ukt: 0,
      major_id: "",
      nama_prodi: "",
      I: 0,
      II: 0,
      III: 0,
      IV: 0,
      V: 0,
      VI: 0,
      VII: 0,
      VIII: 0,
      bm: 0,
      kjmu: 0,
      internasional: 0,
      status: "aktif",
      degree: "",
      lsProdi: [],
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.initialData !== prevProps.initialData) {
      if (this.props.initialData && this.props.initialData.id_ukt) {
        this.setState({ ...this.props.initialData });
      } else {
        this.setState({
          id_ukt: 0,
          major_id: "",
          nama_prodi: "",
          I: 500000,
          II: 1000000,
          III: 0,
          IV: 0,
          V: 0,
          VI: 0,
          VII: 0,
          VIII: 0,
          bm: 2400000,
          kjmu: 3600000,
          internasional: 0,
          status: "aktif",
          degree: "S1",
        });
      }
    }
  }

  formatDisplay = (val) => {
    if (!val && val !== 0) return "";
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  handleChangeMoney = (e) => {
    let val = e.target.value.replace(/\./g, "");
    if (val === "") val = "0";
    if (/^\d*$/.test(val)) {
      this.setState({ [e.target.name]: parseInt(val) });
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let dataToSave = {
      ...this.state,
      kode_fak: parseInt(this.props.selectedFakultas),
    };
    delete dataToSave.lsProdi;
    if (!this.state.id_ukt) {
      if (!this.state.major_id)
        return swal("Error", "Isi Kode Prodi dulu broo!", "error");
      if (!this.state.nama_prodi)
        return swal("Error", "Isi Nama Prodi dulu broo!", "error");
    }
    this.props.onSubmitData(dataToSave);
  };

  render() {
    const { toggleModal, handleToggleModal, initialData } = this.props;
    if (!toggleModal) return null;
    const isEdit = initialData && initialData.id_ukt ? true : false;

    return (
      <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleToggleModal}
        ></div>
        <div className="relative w-full max-w-4xl mx-auto z-[1060] bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between p-5 bg-emerald-600 text-white rounded-t-2xl">
            <h3 className="text-lg font-bold">
              <i className="fa fa-pencil-square mr-2"></i>{" "}
              {isEdit ? "Update Harga UKT Prodi" : "Insert Prodi & Harga Baru"}
            </h3>
            <button onClick={handleToggleModal} className="text-white">
              <i className="fa fa-times text-xl"></i>
            </button>
          </div>

          <div className="p-6 overflow-y-auto w-full bg-gray-50/30">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                      Program Studi {isEdit ? "" : "(Ketik Manual)"}
                    </label>
                    {isEdit ? (
                      <div className="px-4 py-3 bg-gray-100 rounded-xl border font-bold text-emerald-800">
                        {initialData.nama_prodi}{" "}
                        <span className="text-gray-400 font-normal ml-2">
                          ({initialData.major_id})
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <input
                          type="text"
                          name="major_id"
                          placeholder="Ketik Kode Prodi (Contoh: 11016)"
                          value={this.state.major_id}
                          onChange={this.handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50/50 font-bold text-emerald-800 outline-none"
                        />
                        <input
                          type="text"
                          name="nama_prodi"
                          placeholder="Ketik Nama Program Studi"
                          value={this.state.nama_prodi}
                          onChange={this.handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50/50 font-bold text-emerald-800 outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-2xl border shadow-sm">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                      Jenjang (Degree)
                    </label>
                    <input
                      type="text"
                      name="degree"
                      value={this.state.degree}
                      onChange={this.handleChange}
                      placeholder="S1 / D3 / S2"
                      className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50/50 font-bold text-emerald-800 outline-none uppercase"
                    />
                  </div>
                  <div className="bg-white p-5 rounded-2xl border shadow-sm">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                      Status Record
                    </label>
                    <select
                      name="status"
                      value={this.state.status}
                      onChange={this.handleChange}
                      className={`w-full px-4 py-3 rounded-xl border font-bold outline-none ${this.state.status === "aktif" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}
                    >
                      <option value="aktif">AKTIF</option>
                      <option value="nonaktif">NONAKTIF</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4">
                {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map(
                  (gol) => (
                    <div key={gol}>
                      <label className="block text-[10px] font-bold text-gray-400">
                        GOLONGAN {gol}
                      </label>
                      <input
                        type="text"
                        name={gol}
                        value={this.formatDisplay(this.state[gol])}
                        onChange={this.handleChangeMoney}
                        className="w-full px-3 py-2 border rounded-lg focus:border-emerald-500 outline-none font-semibold text-right"
                      />
                    </div>
                  ),
                )}
              </div>

              <div className="bg-white p-5 rounded-2xl border shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-sky-600">
                    KIP-K (BM)
                  </label>
                  <input
                    type="text"
                    name="bm"
                    value={this.formatDisplay(this.state.bm)}
                    onChange={this.handleChangeMoney}
                    className="w-full px-3 py-2 border rounded-lg border-sky-100 bg-sky-50 font-bold text-sky-900 text-right"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-blue-600">
                    KJMU
                  </label>
                  <input
                    type="text"
                    name="kjmu"
                    value={this.formatDisplay(this.state.kjmu)}
                    onChange={this.handleChangeMoney}
                    className="w-full px-3 py-2 border rounded-lg border-blue-100 bg-blue-50 font-bold text-blue-900 text-right"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-purple-600">
                    INTERNASIONAL
                  </label>
                  <input
                    type="text"
                    name="internasional"
                    value={this.formatDisplay(this.state.internasional)}
                    onChange={this.handleChangeMoney}
                    className="w-full px-3 py-2 border rounded-lg border-purple-100 bg-purple-50 font-bold text-purple-900 text-right"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end p-5 border-t gap-3 bg-white rounded-b-2xl">
            <button
              onClick={handleToggleModal}
              className="px-6 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
            >
              Batal
            </button>
            <button
              onClick={this.handleSubmit}
              className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg flex items-center justify-center transition-all active:scale-95"
            >
              <i className="fa fa-save mr-2"></i> Simpan Data Harga
            </button>
          </div>
        </div>
      </div>
    );
  }
}

// ======== HALAMAN UTAMA (LIST TABLE) ========
class RefUkt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataUkt: [],
      total: 0,
      currentPage: 1,
      perPage: 10,
      keyword: "",
      filterFakultas: "all",
      lsFakultas: [],
      modalOpen: false,
      initialData: null,
    };
  }

  componentDidMount() {
    this.props.dispatch(user.getByLoggedIn(cookies.get(cookieName)));
    this.fetchDataFakultas();
    this.loadDatatable(10, 1, "", "all");
  }

  fetchDataFakultas = async () => {
    try {
      const token = cookies.get(cookieName);
      let res = await axios.get(`${service}/fakultas/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.setState({ lsFakultas: res.data });
    } catch (error) {
      console.log(error);
    }
  };

  loadDatatable = async (perPage, page, keyword, kodeFak) => {
    try {
      const token = cookies.get(cookieName);
      let res = await axios.post(
        `${service}/admin/ukt-ref/datatable`,
        {
          perPage: parseInt(perPage),
          page: parseInt(page),
          keyword: keyword,
          kode_fak: kodeFak === "all" ? "" : kodeFak,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const customRows = res.data.rows.map((row) => ({
        ...row,
        nama_prodi: (
          <div className="flex flex-col">
            <span className="font-bold text-gray-800">
              {row.nama_prodi || "-"}
            </span>
            <span className="text-[10px] text-gray-400 italic">
              Jenjang: {row.degree || "-"}
            </span>
          </div>
        ),
        I: row.I ? row.I.toLocaleString("id-ID") : "0",
        II: row.II ? row.II.toLocaleString("id-ID") : "0",
        III: row.III ? row.III.toLocaleString("id-ID") : "0",
        IV: row.IV ? row.IV.toLocaleString("id-ID") : "0",
        V: row.V ? row.V.toLocaleString("id-ID") : "0",
        VI: row.VI ? row.VI.toLocaleString("id-ID") : "0",
        VII: row.VII ? row.VII.toLocaleString("id-ID") : "0",
        VIII: row.VIII ? row.VIII.toLocaleString("id-ID") : "0",
        bm: row.bm ? row.bm.toLocaleString("id-ID") : "0",
        internasional: row.internasional
          ? row.internasional.toLocaleString("id-ID")
          : "-",
        status: (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${row.status === "aktif" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-red-100 text-red-800 border border-red-200"}`}
          >
            {row.status}
          </span>
        ),
        aksi: (
          <button
            onClick={(e) => this.modalUpdate(e, row.id_ukt)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase rounded-lg shadow-md active:scale-95"
          >
            <i className="fa fa-pencil-square mr-2"></i> Update Harga
          </button>
        ),
      }));

      this.setState({
        dataUkt: customRows,
        total: res.data.count,
        currentPage: res.data.currentPage,
        perPage: res.data.perPage,
        keyword: res.data.keyword,
      });
    } catch (error) {
      console.log(error);
    }
  };

  renderData = (e, perPage = 10, to = 1, key = null) => {
    if (e && e.preventDefault) e.preventDefault();
    this.loadDatatable(perPage, to, key, this.state.filterFakultas);
  };

  handlePerPage = (e) =>
    this.loadDatatable(
      e.target.value,
      1,
      this.state.keyword,
      this.state.filterFakultas,
    );
  handleSearch = (e) =>
    this.loadDatatable(
      this.state.perPage,
      1,
      e.target.value,
      this.state.filterFakultas,
    );
  handleFilterFakultas = (e) => {
    this.setState({ filterFakultas: e.target.value });
    this.loadDatatable(
      this.state.perPage,
      1,
      this.state.keyword,
      e.target.value,
    );
  };

  toggleModal = () =>
    this.setState({ modalOpen: !this.state.modalOpen, initialData: null });

  modalUpdate = async (e, id_ukt) => {
    if (e) e.preventDefault();
    try {
      const token = cookies.get(cookieName);
      let res = await axios.get(`${service}/admin/ukt-ref/${id_ukt}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.setState({ initialData: res.data, modalOpen: true });
    } catch (error) {
      swal("Error!", "Gagal mengambil data detail", "error");
    }
  };

  submitAdmin = async (values) => {
    try {
      const token = cookies.get(cookieName);
      await axios.post(`${service}/admin/ukt-ref/save`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      swal("Berhasil!", "Data Prodi & UKT telah disimpan", "success");
      this.setState({ modalOpen: false, initialData: null });
      this.loadDatatable(
        this.state.perPage,
        this.state.currentPage,
        this.state.keyword,
        this.state.filterFakultas,
      );
    } catch (error) {
      swal("Gagal!", "Gagal simpan data", "error");
    }
  };

  render() {
    return (
      <div className="p-2 md:p-8 space-y-6 md:space-y-10">
        <div className="glass-header flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-10">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 text-white/80 text-[10px] md:text-xs font-bold uppercase mb-2 tracking-widest">
              <i className="fa fa-university"></i>
              <span>Database Management</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Data Tarif UKT
            </h2>
          </div>
        </div>

        <div className="modern-card">
          <div className="p-1 bg-gradient-to-r from-emerald-400 via-emerald-600 to-yellow-400"></div>
          <div className="p-4 md:p-6 border-b flex flex-col sm:flex-row items-center justify-between gap-6 bg-gray-50/50">
            <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-4 w-full sm:w-auto">
              <label className="text-xs md:text-sm font-bold text-gray-600 whitespace-nowrap">
                Filter Fakultas:
              </label>
              <select
                className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-emerald-200 outline-none font-bold text-emerald-800 bg-white text-xs md:text-sm shadow-sm"
                value={this.state.filterFakultas}
                onChange={this.handleFilterFakultas}
              >
                <option value="all">-- Semua Fakultas --</option>
                {this.state.lsFakultas.map((fak, i) => (
                  <option key={i} value={fak.kode}>
                    {fak.nama}
                  </option>
                ))}
              </select>
            </div>

            {this.state.filterFakultas !== "all" && (
              <button
                onClick={this.toggleModal}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 flex items-center justify-center space-x-2 animate-fadeIn transition-all active:scale-95"
              >
                <i className="fa fa-plus-circle"></i>
                <span>Insert Data Baru</span>
              </button>
            )}
          </div>

          <div className="p-2 sm:p-8 overflow-x-auto">
            <DataTable
              data={this.state.dataUkt}
              columns={{
                nama_prodi: "Program Studi",
                I: "Gol I",
                II: "Gol II",
                III: "Gol III",
                IV: "Gol IV",
                V: "Gol V",
                VI: "Gol VI",
                VII: "Gol VII",
                VIII: "Gol VIII",
                bm: "KIPK",
                internasional: "INTERNASIONAL",
                status: "STATUS",
                aksi: "OPSI",
              }}
              primaryKey="id_ukt"
              total={this.state.total}
              currentPage={this.state.currentPage}
              totalPages={Math.ceil(this.state.total / this.state.perPage) || 1}
              perPage={this.state.perPage}
              keyword={this.state.keyword}
              handlePerPage={this.handlePerPage}
              handleSearch={this.handleSearch}
              renderData={this.renderData}
            />
          </div>
        </div>

        <FormUkt
          initialData={this.state.initialData}
          toggleModal={this.state.modalOpen}
          handleToggleModal={this.toggleModal}
          selectedFakultas={this.state.filterFakultas}
          onSubmitData={this.submitAdmin}
        />
      </div>
    );
  }
}

export default connect((store) => ({ user: store.user.user }))(RefUkt);
