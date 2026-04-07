import React from 'react'
import { admin, user } from '../../../actions'
import { connect } from 'react-redux'
import { Field, reduxForm, reset } from 'redux-form'
import { cookies, cookieName } from '../../../global'
import { InputBs, DataTable } from '../../components'

// Komponen Modal Form Admin Modern
let FormAdmin = (props) => {
    const { pristine, submitting, handleSubmit, handleToggleAdministrator, toggleAdministrator } = props
    
    if (!toggleAdministrator) return null;

    return (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black opacity-50" onClick={handleToggleAdministrator}></div>
            
            <div className="relative w-full max-w-md mx-auto z-[1060] animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-2xl border-0 flex flex-col w-full outline-none focus:outline-none">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-100 rounded-t-2xl bg-emerald-600 text-white">
                        <h3 className="text-lg font-bold">
                            <i className="fa fa-user-plus mr-2"></i> Form Administrator
                        </h3>
                        <button onClick={handleToggleAdministrator} className="text-white hover:text-yellow-400 transition-colors">
                            <i className="fa fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    {/* Body */}
                    <form onSubmit={handleSubmit} id="form-admin">
                        <div className="relative p-6 flex-auto space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nama Pengguna</label>
                                <Field component={InputBs} type="hidden" name="username_lama"/>                        
                                <Field component={InputBs} type="text" name="username" placeholder="Contoh: admin_unj" 
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Kata Sandi</label>
                                <Field component={InputBs} type="password" name="password" placeholder="••••••••"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nama Lengkap</label>
                                <Field component={InputBs} type="text" name="nama_lengkap" placeholder="Nama Lengkap Sesuai ID"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">No. Telepon</label>
                                    <Field component={InputBs} type="text" name="no_telepon" placeholder="0812..."
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Role</label>
                                    <Field component={InputBs} type="select" name="role"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-white">
                                        <option value="">-- Pilih --</option>
                                        <option value="developer">Developer</option>
                                        <option value="operator">Operator</option>
                                        <option value="validator">Validator</option>
                                    </Field>
                                </div>
                            </div>
                        </div>
                        
                        {/* Footer */}
                        <div className="flex items-center justify-end p-5 border-t border-gray-100 space-x-3">
                            <button 
                                type="button" 
                                onClick={handleToggleAdministrator}
                                className="px-6 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit" 
                                disabled={pristine || submitting}
                                className="px-6 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-100 transition-all disabled:opacity-50"
                            >
                                Simpan Data
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

class Administrator extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            toggleAdministrator: false,
            modalDelete: false,
            usernameWillBeDeleted: null,
            keyword: "",
            perPage: 10
        }
    }

    componentWillMount(){
        this.props.dispatch(user.getByLoggedIn(cookies.get(cookieName)))
        this.props.dispatch(admin.fetchAdmin(cookies.get(cookieName), {perPage: 10, page: 1, keyword: ""}))    
    }

    toggleAdministrator = () => {
        this.props.dispatch(admin.emptyAdmin())
        this.setState({ toggleAdministrator: !this.state.toggleAdministrator })
    }

    modalDelete = (e, username) => {
        this.setState({
            modalDelete: !this.state.modalDelete,
            usernameWillBeDeleted: username
        });
    }

    handleDelete = (e) => {
        e.preventDefault()
        this.setState({ modalDelete: !this.state.modalDelete, keyword: "", perPage: 10 })
        this.props.dispatch(admin.deleteById(cookies.get(cookieName), this.state.usernameWillBeDeleted))
    }

    modalUpdate = (e, username) => {
        this.props.dispatch(admin.getById(cookies.get(cookieName), username))
        this.setState({ toggleAdministrator: !this.state.toggleAdministrator })
    }

    renderData = (e, perPage=10, to=1, key=null) => {
        if(e) e.preventDefault()
        this.props.dispatch(admin.fetchAdmin(cookies.get(cookieName), {perPage: perPage, page: to, keyword: key}))
    }

    handlePerPage = (e) => {
        this.setState({ perPage: e.target.value })
        this.renderData(e, e.target.value, 1, this.state.keyword)        
    }

    handleSearch = (e) => {
        this.setState({ keyword: e.target.value })
        this.renderData(e, this.state.perPage, 1, e.target.value)
    }

    submitAdmin = (values) => {
        this.setState({ keyword: "", perPage: 10 })
        this.props.dispatch(admin.save(cookies.get(cookieName), values))
        this.props.dispatch(reset('DataAdmin'))
        this.setState({ toggleAdministrator: !this.state.toggleAdministrator })
    }

    render(){
        return(
            <div className="p-4 md:p-8 space-y-6">
                {/* Header Page */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-emerald-900 flex items-center">
                            <span className="w-2 h-8 bg-yellow-400 rounded-full mr-3"></span>
                            Manajemen Administrator
                        </h2>
                        <p className="text-gray-500 text-sm ml-5 mt-1">Kelola hak akses dan data petugas sistem SIUKAT.</p>
                    </div>
                    <button 
                        onClick={this.toggleAdministrator}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-100 transition-all flex items-center justify-center space-x-2 active:scale-95"
                    >
                        <i className="fa fa-plus"></i>
                        <span>Tambah Admin</span>
                    </button>
                </div>

                {/* Main Table Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 overflow-hidden">
                    <div className="p-1 bg-gradient-to-r from-emerald-600 to-emerald-800"></div>
                    <div className="p-6">
                        <DataTable 
                            data={this.props.admin}
                            columns={{username: 'Username', nama_lengkap: 'Nama Lengkap', no_telepon:'Nomor Telepon', role:'Role', aksi:'Aksi'}}
                            primaryKey="username"
                            total={this.props.count}
                            currentPage={this.props.currentPage}
                            totalPages={this.props.totalPages}
                            perPage={this.state.perPage}
                            keyword={this.state.keyword}
                            handlePerPage={this.handlePerPage}
                            handleSearch={this.handleSearch}
                            renderData={this.renderData}
                            update={this.modalUpdate}
                            delete={this.modalDelete}
                        />
                    </div>
                </div>

                {/* Form Modal */}
                <FormAdmin
                    onSubmit={this.submitAdmin}
                    initialValues={this.props.singleAdmin}
                    toggleAdministrator={this.state.toggleAdministrator}
                    handleToggleAdministrator={this.toggleAdministrator}
                />      

                {/* Delete Confirmation Modal Modern */}
                {this.state.modalDelete && (
                    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-black opacity-50" onClick={this.modalDelete}></div>
                        <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-fadeIn">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fa fa-trash text-2xl"></i>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">Konfirmasi Hapus</h3>
                                <p className="text-gray-500 text-sm mt-2">
                                    Apakah Anda yakin ingin menghapus akses administrator untuk:
                                    <span className="block font-bold text-gray-800 mt-1 italic">"{this.state.usernameWillBeDeleted}"</span>
                                </p>
                            </div>
                            <div className="flex space-x-3 mt-6">
                                <button onClick={this.modalDelete} className="flex-1 py-2.5 font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all">
                                    Batal
                                </button>
                                <button onClick={this.handleDelete} className="flex-1 py-2.5 font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-lg shadow-red-100 transition-all">
                                    Ya, Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

// Konfigurasi FormAdmin
FormAdmin = reduxForm({
    form: 'DataAdmin',
    enableReinitialize: true,
})(FormAdmin)

export default connect((store) => ({
    admin: store.admin.admin.rows,
    count: store.admin.admin.count,
    totalPages: store.admin.admin.totalPages,
    currentPage: store.admin.admin.currentPage,
    perPage: store.admin.admin.perPage,
    keyword: store.admin.admin.keyword,
    singleAdmin: store.admin.singleAdmin,
    user: store.user.user
}))(Administrator)