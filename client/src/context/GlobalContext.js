// @ts-nocheck
import React, { createContext, useReducer } from "react";
import GlobalReducer from "./GlobalReducer";

const mainState = {
    adminMode: true
};

export const GlobalContext = createContext(mainState);
export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(GlobalReducer, mainState);


    const changeAdminMode = (mode) => {
        dispatch(
            {
                "type": "ADMIN_MODE",
                payload: mode
            }
        )
    }


    return (
        < GlobalContext.Provider value={{
            adminMode: state.adminMode,
            changeAdminMode
        }}>
            {children}
        </GlobalContext.Provider >
    );
};
