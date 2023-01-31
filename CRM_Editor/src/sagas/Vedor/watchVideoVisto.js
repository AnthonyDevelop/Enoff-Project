import { actionTypes } from "../../Constantes/ActionTypes";
import { takeEvery, call, put } from'redux-saga/effects';
import videoVisto from "../../api/Vedor/videoVisto";


export const watchVideoVisto= function * (){
    yield takeEvery(actionTypes.SET_VIDEO_VISTO, fetchVideoVisto)
}

function* fetchVideoVisto(action){
    try{
        const data = yield call(videoVisto, action.data)
        if(data){
          
        }
    }catch(err){
        console.log(err)

    }
}