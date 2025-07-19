import Type from "../types";

const initalState=null;
const loadingReducers=(state=initalState,action)=>{
    switch(action.type){
        case Type.loading.show:
            return true;
        case Type.loading.hide:
            return false;
        default:
            return state;
    }
}
export default loadingReducers;
