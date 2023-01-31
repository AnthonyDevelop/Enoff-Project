import { actionTypes } from "../Constantes/ActionTypes"; 

export const getRecibirMisVideos = (data) => {
    return {
        type: actionTypes.GET_RECIBIR_MISVIDEOS,
        data
    }
}

export const setRecibirMisVideos = (data) => {
    return {
        type: actionTypes.SET_RECIBIR_MISVIDEOS,
        data
    }
}

export const setRecibirVideosComprados = (data) => {
    return {
        type: actionTypes.SET_VIDEOS_COMPRADOS,
        data
    }
}

export const getRecibirVideosComprados = (data) => {
    return {
        type: actionTypes.GET_RECIBIR_VIDEOS_COMPRADOS,
        data
    }
}


