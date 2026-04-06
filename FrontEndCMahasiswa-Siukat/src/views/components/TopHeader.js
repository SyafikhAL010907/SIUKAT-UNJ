import React from 'react';
import { storage } from '../../global';

class TopHeader extends React.Component {
    render() {
        const { toggleCollapse, toggleMobile, collapsed, studentData } = this.props;
        const studentName = studentData?.nama_cmahasiswa || 'Mahasiswa';
        const studentId = studentData?.no_peserta || '925111008305';
        
        const photoUrl = studentData?.foto_cmahasiswa 
            ? (studentData.foto_cmahasiswa.startsWith('http') ? studentData.foto_cmahasiswa : storage + '/' + studentData.foto_cmahasiswa)
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(studentName)}&background=0f6d3f&color=fff`;

        return (
            <header className="top-header-container">
                <div className="header-left">
                    <h2 className="header-title-text hidden-xs">Dashboard SIUKAT</h2>
                </div>

                <div className="header-right">
                    <div className="profile-section">
                        <div className="profile-info hidden-xs">
                            <p className="profile-name">{studentName}</p>
                            <p className="profile-role">{studentId}</p>
                        </div>
                        <div className="profile-avatar-container">
                            <img 
                                src={photoUrl} 
                                alt="Profile" 
                                className="profile-avatar-img"
                                onError={(e) => {
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(studentName)}&background=0f6d3f&color=fff`;
                                }}
                            />
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

export default TopHeader;
