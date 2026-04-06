import React from 'react'
import {Row, Col, Card, CardHeader, CardBody, Button,
        Modal, ModalBody, ModalFooter, ModalHeader,
        Form, FormGroup, Label} from 'reactstrap'
import { admin, user } from '../../../actions'
import { connect } from 'react-redux'
import { Field, reduxForm, reset } from 'redux-form'
import { cookies, cookieName } from '../../../global'
import { InputBs, DataTable } from '../../components'

let FormAdmin = (props) => {
    const { pristine, submitting,
            handleSubmit, handleToggleAdministrator, toggleAdministrator } = props
    return (
        <Form onSubmit={handleSubmit} id="form-admin" className="form-horizontal">        
            <Modal isOpen={toggleAdministrator} toggle={handleToggleAdministrator}
            className={'modal-success'}>
                <ModalHeader toggle={handleToggleAdministrator}>Form Administrator</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label htmlFor="username">Nama Pengguna</Label>
                        <Field component={InputBs} type="hidden" name="username_lama"/>                        
                        <Field component={InputBs} type="text" id="username" name="username" placeholder="Nama Pengguna"/>
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="password">Kata Sandi</Label>
                        <Field component={InputBs} type="password" id="password" name="password" placeholder="Kata Sandi"/>
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                        <Field component={InputBs}  type="text" id="nama_lengkap" name="nama_lengkap" placeholder="Nama Lengkap"/>
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="no_telepon">Nomor Telepon</Label>
                        <Field component={InputBs}  type="text" id="no_telepon" name="no_telepon" placeholder="Nomor Telepon"/>
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="role">Role</Label>
                        <Field component={InputBs} type="select" name="role" id="role">
                            <option value="">-- Pilih Role --</option>
                            <option value="developer">Developer</option>
                            <option value="operator">Operator</option>
                            <option value="validator">Validator</option>
                        </Field>
                    </FormGroup>
                </ModalBody>
                <ModalFooter className="text-right">
                    <Button color="success" type="submit" form="form-admin" disabled={pristine || submitting}>Simpan</Button>{' '}
                    <Button color="secondary" onClick={handleToggleAdministrator}>Batal</Button>
                </ModalFooter>
            </Modal>
        </Form>
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
        this.toggleAdministrator = this.toggleAdministrator.bind(this)
        this.modalDelete = this.modalDelete.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.modalUpdate = this.modalUpdate.bind(this)

        this.handlePerPage = this.handlePerPage.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.renderData = this.renderData.bind(this)
        this.submitAdmin = this.submitAdmin.bind(this)
    }
    componentWillMount(){
        this.props.dispatch(user.getByLoggedIn(cookies.get(cookieName)))
        this.props.dispatch(admin.fetchAdmin(cookies.get(cookieName), {perPage: 10, page: 1, keyword: ""}))    
    }
    toggleAdministrator(){
        this.props.dispatch(admin.emptyAdmin())
        this.setState({
            toggleAdministrator: !this.state.toggleAdministrator
        })
    }
    modalDelete(e, username) {
        this.setState({
            modalDelete: !this.state.modalDelete,
            usernameWillBeDeleted: username
        });
    }
    handleDelete(e){
        e.preventDefault()
        this.setState({
            modalDelete: !this.state.modalDelete,
            keyword: "",
            perPage: 10
        })
        this.props.dispatch(admin.deleteById(cookies.get(cookieName), this.state.usernameWillBeDeleted))
    }
    modalUpdate(e, username){
        this.props.dispatch(admin.getById(cookies.get(cookieName), username))
        this.setState({
            toggleAdministrator: !this.state.toggleAdministrator
        })
    }

    // DATATABLE HANDLERS
    renderData(e, perPage=10, to=1, key=null){
        e.preventDefault()
        this.props.dispatch(admin.fetchAdmin(cookies.get(cookieName), {perPage: perPage, page: to, keyword: key}))
    }
    handlePerPage(e){
        this.setState({
            perPage: e.target.value
        })
        this.renderData(e, e.target.value, 1, this.state.keyword)        
    }
    handleSearch(e){
        this.setState({
            keyword: e.target.value
        })
        this.renderData(e, this.state.perPage, 1, e.target.value)
    }
    submitAdmin(values){
        this.setState({
            keyword: "",
            perPage: 10
        })
        this.props.dispatch(admin.save(cookies.get(cookieName), values))
        this.props.dispatch(reset('DataAdmin'))
        this.setState({
            toggleAdministrator: !this.state.toggleAdministrator
        })
    }

    render(){
        return(
            <Row>
                <Col xs="12">
                    <Card className="card-accent-success">
                        <CardHeader>
                            <span>Administrator</span>
                            <Button className="float-right btn btn-sm btn-success" onClick={this.toggleAdministrator}><i className="fa fa-plus"></i> Tambah</Button>
                        </CardHeader>
                        <CardBody className="card-body clearfix">
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
                        </CardBody>
                    </Card>

                    <FormAdmin
                        onSubmit={this.submitAdmin}
                        initialValues={this.props.singleAdmin}
                        toggleAdministrator={this.state.toggleAdministrator}
                        handleToggleAdministrator={this.toggleAdministrator}
                        />      

                    <Modal isOpen={this.state.modalDelete} toggle={this.modalDelete}
                    className={'modal-danger'}>
                        <ModalHeader toggle={this.modalDelete}>Konfirmasi Hapus</ModalHeader>
                        <ModalBody>
                            Apakah Anda yakin ingin menghapus admin dengan data sebagai berikut?
                            <hr/>
                            <ul className="list-reset">
                                <li>Nama Pengguna: <b>{this.state.usernameWillBeDeleted}</b></li>
                            </ul>
                        </ModalBody>
                        <ModalFooter className="text-right">
                            <Button color="danger" type="submit" onClick={this.handleDelete}>Ya, Hapus!</Button>{' '}
                            <Button color="warning" onClick={this.modalDelete}>Batal</Button>
                        </ModalFooter>
                    </Modal>
                </Col>
            </Row>
        )
    }
}

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