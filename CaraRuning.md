
cd BackEnd-Siukat > go run cmd/api/main.go
go build ./cmd/api/main.go

cd FrontEndAdmin-Siukat > npm install
cd FrontEndAdmin-Siukat > npm start 

cd FrontEndCMahasiswa-Siukat > npm install
cd FrontEndCMahasiswa-Siukat > npm start  


go run scripts/utils/rollback_full/main.go < running rollbackc
go run scripts/utils/dynamic_injector/main.go < running inject
go run scripts/utils/generate_master_excel/main.go < running clean excel


Nomor Peserta: 925111008305   
Password (ddmmyyyy): 16092006 (berdasarkan tanggal lahir 16 September 2006)

login Admin
Username: SyafikhAL
Password: 09012007

-- Gunakan IN untuk mencari beberapa nilai sekaligus
SELECT * FROM `tb_cmahasiswa` 
WHERE `no_peserta` IN ('925111008305', '426000001', '426000002');

go run scripts/utils/rollback_full/main.go > Hapus DB Masal
go run scripts/utils/dynamic_injector/main.go > Inject Data Masal
go run scripts/utils/generate_master_excel/main.go > Generate Excel Masal
go run scripts/utils/Inject1/main.go > Inject 1 Data
