const initialState = null;

const changeCurrProduct = (state = initialState , action) => {
    switch(action.type){
        case "CURRPRODUCT": return action.currProduct;
        default: return state;
    }
}

export default changeCurrProduct; 