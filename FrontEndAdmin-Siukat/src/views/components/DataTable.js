import React from 'react'
import { Link } from 'react-router-dom'

class DataTable extends React.Component {
    renderColumns() {
        return Object.entries(this.props.columns).map((data, key) => (
            <th key={key} className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                {data[1]}
            </th>
        ))
    }

    renderValues(values) {
        return Object.entries(this.props.columns).map((data, key) => {
            const isLast = key === Object.entries(this.props.columns).length - 1;
            
            if (!isLast) {
                let keys = data[0].split(".")
                let val = (keys.length > 1) ? (values[keys[0]] ? values[keys[0]][keys[1]] : "") : values[data[0]]
                return (
                    <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {val}
                    </td>
                )
            } else {
                return (
                    <td key={key} className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {this.props.update !== undefined && this.props.delete !== undefined ? (
                            <>
                                <button 
                                    onClick={(e) => this.props.update(e, values[this.props.primaryKey])}
                                    className="inline-flex items-center px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-emerald-900 text-xs font-bold rounded transition-colors shadow-sm"
                                >
                                    <i className="fa fa-pencil mr-1"></i> Edit
                                </button>
                                <button 
                                    onClick={(e) => this.props.update(e, values[this.props.primaryKey])}
                                    className="inline-flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded transition-colors shadow-sm"
                                >
                                    <i className="fa fa-close mr-1"></i> Hapus
                                </button>
                            </>
                        ) : (
                            <Link 
                                to={"/admin/peserta/" + values[this.props.primaryKey]} 
                                className="inline-flex items-center px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded transition-colors shadow-sm"
                            >
                                <i className="fa fa-eye mr-1"></i> Lihat
                            </Link>
                        )}
                    </td>
                )
            }
        })
    }

    renderList() {
        return Array.isArray(this.props.data) ? this.props.data.map((data, key) => (
            <tr key={key} className="hover:bg-emerald-50 transition-colors border-b border-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-800 bg-gray-50/50">
                    {key + 1}
                </td>
                {this.renderValues(data)}
            </tr>
        )) : null
    }

    renderPagination() {
        let items = [];
        let currentPage = parseInt(this.props.currentPage, 10);
        let totalPages = parseInt(this.props.totalPages, 10);

        const btnClass = "relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ";
        const activeClass = "z-10 bg-emerald-700 border-emerald-700 text-white";
        const inactiveClass = "bg-white border-gray-300 text-gray-500 hover:bg-emerald-50 hover:text-emerald-700";

        // Previous
        items.push(
            <button
                key="prev"
                disabled={currentPage === 1}
                onClick={(e) => this.props.renderData(e, this.props.perPage, currentPage - 1, this.props.keyword)}
                className={`${btnClass} rounded-l-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : inactiveClass}`}
            >
                Prev
            </button>
        );

        // Numbers
        let start = (currentPage === 1) ? 1 : (currentPage >= 4) ? currentPage - 2 : 1;
        let end = Math.min(start + 4, totalPages);

        for (let i = start; i <= end; i++) {
            items.push(
                <button
                    key={i}
                    onClick={(e) => this.props.renderData(e, this.props.perPage, i, this.props.keyword)}
                    className={`${btnClass} ${i === currentPage ? activeClass : inactiveClass}`}
                >
                    {i}
                </button>
            );
        }

        // Next
        items.push(
            <button
                key="next"
                disabled={currentPage === totalPages}
                onClick={(e) => this.props.renderData(e, this.props.perPage, currentPage + 1, this.props.keyword)}
                className={`${btnClass} rounded-r-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : inactiveClass}`}
            >
                Next
            </button>
        );

        return items;
    }

    render() {
        return (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-emerald-100">
                {/* Header Controls */}
                <div className="p-5 flex flex-col md:flex-row justify-between items-center gap-4 bg-white border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-600">Tampilkan</span>
                        <select 
                            value={this.props.perPage} 
                            onChange={this.props.handlePerPage}
                            className="block w-20 pl-3 pr-10 py-1.5 text-sm border-emerald-200 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 rounded-md shadow-sm"
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                        <span className="text-sm font-medium text-gray-600">Entri</span>
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
                            className="block w-full pl-10 pr-3 py-2 border border-emerald-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                        />
                    </div>
                </div>

                {/* Table Area */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-emerald-200">
                        <thead className="bg-emerald-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider">
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

                {/* Footer / Pagination */}
                <div className="px-5 py-4 flex flex-col md:flex-row justify-between items-center bg-gray-50 border-t border-emerald-100">
                    <div className="mb-4 md:mb-0">
                        <p className="text-sm text-gray-600">
                            Menampilkan <span className="font-bold text-emerald-700">{(this.props.data.length > this.props.perPage) ? this.props.perPage : this.props.data.length}</span> dari <span className="font-bold text-emerald-700">{this.props.total}</span> data
                        </p>
                    </div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        {this.renderPagination()}
                    </nav>
                </div>
            </div>
        )
    }
}

export default DataTable