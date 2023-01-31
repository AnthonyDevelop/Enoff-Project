import { actionTypes } from "../../Constantes/ActionTypes"

export const setVideoVisto = (data) => {
    return {
        type: actionTypes.SET_VIDEO_VISTO,
        data
    }
}