import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import swal from "sweetalert";
import axios from "axios";
import { cookies, cookieName, service, storage } from "../../global";
import defaultPhoto from "../dist/images/profile.png";
import { connect } from "react-redux";
import { cmahasiswa } from "../../actions";

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      selectedId: null,
      isLoading: false,
      errorMsg: null,
    };
  }

  toggleModal = async (id = null) => {
    this.setState({
      modalOpen: !this.state.modalOpen,
      selectedId: id,
      errorMsg: null,
    });

    if (!this.state.modalOpen && id) {
      try {
        const token = cookies.get(cookieName);
        const res = await axios.get(
          `${service}/cmahasiswa/cek-bayar-bank/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.data.sudah_bayar) {
          this.setState({
            errorMsg: `Mahasiswa ini sudah melakukan pembayaran di bank (Status: ${res.data.status}). Klarifikasi tidak akan mengubah nominal tagihan di bank!`,
          });
        }
      } catch (err) {
        console.log("Gagal cek status bayar", err);
      }
    }
  };

  handleConfirm = async () => {
    const { selectedId } = this.state;
    const { data: allData } = this.props;

    // Cek apakah siswa ini sudah punya row sanggah (buat validasi alert reset)
    // hasSanggah check removed per user request to disable alert

    this.setState({ isLoading: true, errorMsg: null });
    try {
      const token = cookies.get(cookieName);
      await axios.put(
        `${service}/cmahasiswa/flag-klarifikasi-admin/${selectedId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      this.setState({ isLoading: false });
      this.toggleModal();

      // Real-time Sync: Langsung trigger refresh statistik dashboard & tabel list
      this.props.dispatch(cmahasiswa.flagCount(token));
      if (this.props.renderData) {
        // Refresh baris tabel yang ada biar statusnya langsung berubah
        this.props.renderData(
          new Event("refresh"),
          this.props.perPage,
          this.props.currentPage,
          this.props.keyword,
        );
      }

      this.props.history.push({
        pathname: `/admin/peserta/${selectedId}`,
        state: { modeEdit: true },
      });
    } catch (err) {
      const msg = err?.response?.data?.error || "Gagal memproses klarifikasi";
      this.setState({ isLoading: false, errorMsg: msg });
    }
  };

  renderColumns() {
    return Object.entries(this.props.columns).map((data, key) => (
      <th
        key={key}
        className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"
      >
        {data[1]}
      </th>
    ));
  }

  renderValues(values) {
    return Object.entries(this.props.columns).map((data, key) => {
      const isLast = key === Object.entries(this.props.columns).length - 1;
      const columnKey = data[0];

      if (columnKey === "aksi" || isLast) {
        if (values[columnKey] && React.isValidElement(values[columnKey])) {
          return (
            <td
              key={key}
              className="px-6 py-4 whitespace-nowrap text-sm font-medium"
            >
              {values[columnKey]}
            </td>
          );
        }

        const pk = this.props.primaryKey;
        const id =
          values[pk] ||
          values[
            Object.keys(values).find(
              (k) => k.toLowerCase() === pk.toLowerCase(),
            )
          ] ||
          "undefined";

        // Jika prop update & delete tersedia, gunakan mode Edit/Hapus (Manajemen)
        if (this.props.update && this.props.delete) {
          return (
            <td
              key={key}
              className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"
            >
              {this.props.user?.role !== "validator" && (
                <button
                  onClick={(e) => this.props.update(e, id)}
                  className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-all shadow-sm active:scale-95"
                >
                  <i className="fa fa-edit mr-1.5"></i> Edit
                </button>
              )}
              {this.props.user?.role !== "validator" && (
                <button
                  onClick={async (e) => {
                    const willDelete = await swal({
                      title: "Yakin ingin menghapus?",
                      text: "Data yang sudah dihapus tidak dapat dikembalikan!",
                      icon: "warning",
                      buttons: ["Batal", "Ya, Hapus!"],
                      dangerMode: true,
                    });
                    if (willDelete) {
                      this.props.handleHapus(e, id);
                    }
                  }}
                  className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all shadow-sm active:scale-95"
                >
                  <i className="fa fa-trash mr-1.5"></i> Hapus
                </button>
              )}
            </td>
          );
        }

        // Default Mode (Calon Mahasiswa): Lihat & Sanggah
        return (
          <td
            key={key}
            className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"
          >
            {/* Tombol Lihat */}
            <Link
              to={"/admin/peserta/" + id}
              className="inline-flex items-center px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-all shadow-sm active:scale-95"
            >
              <i className="fa fa-eye mr-1.5"></i> Lihat
            </Link>

            {/* Tombol Sanggah - Hidden on original if sanggah exists (Reliable for ALL users via Backend Flag) */}
            {!(values.atribut === "original" && values.has_sanggah) &&
              this.props.user?.role !== "validator" &&
              values.flag !== "selesai_sanggah" &&
              values.flag !== "terima_ukt" && (
                <button
                  onClick={() => this.toggleModal(id)}
                  className={`inline-flex items-center px-3 py-1.5 ${values.atribut === "sanggah" ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-600" : "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-600"} hover:text-white border text-[10px] font-black uppercase tracking-wider rounded-lg transition-all shadow-sm active:scale-95`}
                >
                  <i
                    className={`fa ${values.atribut === "sanggah" ? "fa-refresh" : "fa-pencil-square-o"} mr-1.5`}
                  ></i>
                  {values.atribut === "sanggah" ? "Sanggah UKT" : "Sanggah"}
                </button>
              )}
          </td>
        );
      } else {
        let keys = columnKey.split(".");
        let val =
          keys.length > 1
            ? values[keys[0]]
              ? values[keys[0]][keys[1]]
              : ""
            : values[columnKey];

        // Jika kolom adalah foto profile mahasiswa
        if (columnKey === "foto_cmahasiswa") {
          return (
            <td key={key} className="px-6 py-4 whitespace-nowrap">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 border-2 border-white shadow-sm overflow-hidden ring-1 ring-emerald-100">
                <img
                  src={val ? `${storage}/${val}` : defaultPhoto}
                  className="h-full w-full object-cover"
                  alt="Foto Profile"
                  onError={(e) => {
                    e.target.src = defaultPhoto;
                  }}
                />
              </div>
            </td>
          );
        }

        return (
          <td
            key={key}
            className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
          >
            {val}
          </td>
        );
      }
    });
  }

  renderList() {
    return Array.isArray(this.props.data)
      ? this.props.data.map((data, key) => (
          <tr
            key={key}
            className="hover:bg-emerald-50 transition-colors border-b border-gray-100"
          >
            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-800 bg-gray-50/50">
              {(parseInt(this.props.currentPage) - 1) *
                parseInt(this.props.perPage) +
                (key + 1)}
            </td>
            {this.renderValues(data)}
          </tr>
        ))
      : null;
  }

  renderPagination() {
    let items = [];
    let currentPage = parseInt(this.props.currentPage, 10);
    let totalPages = parseInt(this.props.totalPages, 10);

    const btnClass =
      "relative inline-flex items-center px-2 py-1.5 md:px-4 md:py-2 border text-[11px] md:text-sm font-medium transition-colors ";
    const activeClass = "z-10 bg-emerald-700 border-emerald-700 text-white";
    const inactiveClass =
      "bg-white border-gray-300 text-gray-500 hover:bg-emerald-50 hover:text-emerald-700";

    items.push(
      <button
        key="prev"
        disabled={currentPage === 1}
        onClick={(e) =>
          this.props.renderData(
            e,
            this.props.perPage,
            currentPage - 1,
            this.props.keyword,
          )
        }
        className={`${btnClass} rounded-l-md ${currentPage === 1 ? "bg-gray-100 text-gray-400" : inactiveClass}`}
      >
        <i className="fa fa-chevron-left md:hidden"></i>
        <span className="hidden md:inline">Prev</span>
      </button>,
    );

    let start =
      currentPage <= 3
        ? 1
        : currentPage >= totalPages - 2
          ? Math.max(1, totalPages - 4)
          : currentPage - 2;
    let end = Math.min(start + 4, totalPages);

    for (let i = start; i <= end; i++) {
      items.push(
        <button
          key={i}
          onClick={(e) =>
            this.props.renderData(e, this.props.perPage, i, this.props.keyword)
          }
          className={`${btnClass} ${i === currentPage ? activeClass : inactiveClass}`}
        >
          {i}
        </button>,
      );
    }

    items.push(
      <button
        key="next"
        disabled={currentPage === totalPages || totalPages === 0}
        onClick={(e) =>
          this.props.renderData(
            e,
            this.props.perPage,
            currentPage + 1,
            this.props.keyword,
          )
        }
        className={`${btnClass} rounded-r-md ${currentPage === totalPages || totalPages === 0 ? "bg-gray-100 text-gray-400" : inactiveClass}`}
      >
        <span className="hidden md:inline">Next</span>
        <i className="fa fa-chevron-right md:hidden"></i>
      </button>,
    );

    return items;
  }

  render() {
    return (
      <div className="bg-white rounded-lg md:rounded-xl shadow-md overflow-hidden border border-emerald-100">
        <Modal
          isOpen={this.state.modalOpen}
          toggle={() => this.toggleModal()}
          centered
        >
          <ModalHeader toggle={() => this.toggleModal()}>
            Konfirmasi Sanggah
          </ModalHeader>
          <ModalBody>
            Apakah Anda yakin ingin melakukan sanggah untuk peserta{" "}
            <strong>{this.state.selectedId}</strong>? Sistem akan menyalin
            seluruh data ke mode sanggah dan halaman akan diarahkan ke mode
            pembaruan data.
            {this.state.errorMsg && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
                ⚠️ {this.state.errorMsg}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() => this.toggleModal()}
              disabled={this.state.isLoading}
            >
              Batal
            </Button>
            <Button
              color="warning"
              onClick={this.handleConfirm}
              disabled={this.state.isLoading}
            >
              {this.state.isLoading ? "⏳ Memproses..." : "Ya, Lanjutkan"}
            </Button>
          </ModalFooter>
        </Modal>

        <div className="p-3 md:p-5 flex flex-col md:flex-row justify-between items-center gap-4 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between w-full md:w-auto space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs md:text-sm font-medium text-gray-600">
                Tampilkan
              </span>
              <select
                value={this.props.perPage}
                onChange={this.props.handlePerPage}
                className="block w-16 md:w-20 pl-2 pr-2 py-1.5 text-xs md:text-sm border-emerald-200 rounded-md shadow-sm outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span className="text-xs md:text-sm font-medium text-gray-600">
                Entri
              </span>
            </div>
          </div>

          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fa fa-search text-emerald-500"></i>
            </div>
            <input
              type="text"
              placeholder="Cari data..."
              value={this.props.keyword}
              onChange={this.props.handleSearch}
              className="block w-full pl-10 pr-4 py-2.5 text-center border border-emerald-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 shadow-sm placeholder:text-gray-400 placeholder:text-center"
            />
          </div>
        </div>

        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-gray-50">
          <table className="min-w-full divide-y divide-emerald-200">
            <thead className="bg-emerald-700">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-[10px] md:text-xs font-bold text-yellow-400 uppercase tracking-wider">
                  No
                </th>
                {this.renderColumns()}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {this.renderList()}
            </tbody>
          </table>
        </div>

        <div className="p-3 md:p-5 flex flex-col md:flex-row justify-between items-center gap-3 bg-gray-50 border-t border-emerald-100">
          <p className="text-[11px] md:text-sm text-gray-600 order-2 md:order-1">
            Menampilkan{" "}
            <span className="font-bold text-emerald-700">
              {this.props.data ? this.props.data.length : 0}
            </span>{" "}
            dari{" "}
            <span className="font-bold text-emerald-700">
              {this.props.total || 0}
            </span>{" "}
            data
          </p>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px order-1 md:order-2">
            {this.renderPagination()}
          </nav>
        </div>
      </div>
    );
  }
}

// Gunakan withRouter & connect agar history dan dispatch tersedia
export default connect((store) => ({
  user: store.user.user,
}))(withRouter(DataTable));
