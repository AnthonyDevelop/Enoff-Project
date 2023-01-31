import { actionTypes } from "../../Constantes/ActionTypes";

export const setListUsersConVideos = (data) => {
    return {
        type: actionTypes.GET_LISTA_USERS_CON_VIDEOS,
        data
    }
}

export const getListUsersConVideos = (data) => {
    return {
        type: actionTypes.SET_LISTA_USERS_CON_VIDEOS,
        data
    }
}