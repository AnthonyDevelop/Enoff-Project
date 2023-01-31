import { actionTypes } from "../../Constantes/ActionTypes";
import { store } from "../../Store/index";

function reducerVeedorRecibirVideosDescartados (state = store.veedorVideosDescartados, action){
    switch(action.type){
        case actionTypes.SET_VEEDOR_RECIBIR_VIDEOS_DESCARTADOS:
            let veedorVideosDescartadosData = action.data
            return Object.assign({}, state, {
                data: veedorVideosDescartadosData,
            })
            default:
                return state
    }
}

export default reducerVeedorRecibirVideosDescartados
;