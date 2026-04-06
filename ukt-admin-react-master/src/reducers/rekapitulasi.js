export default function reducer(state={
    rekapFakultas:[],
    rekapProdi:[],
    loading:false
},action){
    switch(action.type){        
        case "FETCH_REKAP_FAKULTAS":{
            return{
                ...state,
                loading:true                
            }
        }
        case "FETCH_REKAP_FAKULTAS_FULFILLED":{            
            return{
                ...state,
                loading:false,
                rekapFakultas:action.payload
            }
        }
        case "FETCH_REKAP_PRODI":{
            return{
                ...state,
                loading:true                
            }
        }
        case "FETCH_REKAP_PRODI_FULFILLED":{            
            return{
                ...state,
                loading:false,
                rekapProdi:action.payload
            }
        }
        default:{
            return {
                ...state
            }
        }
    }
}