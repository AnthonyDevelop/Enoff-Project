import { actionTypes } from "../../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';
import listaUsuariosConVideos from "../../api/SuperAdmin/listaUsuariosConVideos";
import { setListUsersConVideos } from "../../Actions/SuperAdmin/listUsersConVideos";


export const watchListaUserConVideos = function * (){
    yield takeEvery(actionTypes.GET_LISTA_USERS_CON_VIDEOS, fetchListaUserConVideos)
}

function* fetchListaUserConVideos(action){
    try{
        const data = yield call(listaUsuariosConVideos, action.data)
        if(data){
            yield put(setListUsersConVideos(data))
        }
    }catch(err){
        console.log(err)
    }
}