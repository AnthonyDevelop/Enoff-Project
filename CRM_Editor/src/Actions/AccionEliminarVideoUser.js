import { actionTypes } from "../Constantes/ActionTypes"; 

export const setEliminarVideoUser = (data) => {
    return {
        type: actionTypes.SET_ELIMINAR_VIDEO_USER,
        data
    }
}

export const confirmarVideosEliminados = (data) => {
    return {
        type: actionTypes.CONFIRMAR_VIDEOS_ELIMINADOS,
        data
    }
}

