import { actionTypes } from "../Constantes/ActionTypes"; 

export const getVideosPorUsuario = (data) => {
    return {
        type: actionTypes.GET_VIDEOS_POR_USUARIO,
        data
    }
}

export const setVideosPorUsuario = (data) => {
    return {
        type: actionTypes.SET_VIDEOS_POR_USUARIO,
        data
    }
}