const reducer = (state, action) => {
    switch (action.type) {
        case "ADMIN_MODE":
            return {
                ...state,
                adminMode: action.payload
            }
        default:
            return state;
    }
};

export default reducer;