import React, {createContext, useContext, useReducer} from 'react';
import {useLocalState} from "../util/userLocalStorage";


export const JwtContext =  createContext(undefined);

//Action types for Reducer
const SET_JWT = 'SET_JWT';

// Reducer function
const jwtReducer = (state, action) => {
    switch (action.type) {
        case SET_JWT:
            return action.payload;
        default:
            return state;
    }
};

export function useJwt(){
    return useContext(JwtContext);
}

export const JwtProvider = ({ children }) => {
    const [jwt, setLocalJwt] = useLocalState("", "jwt");

    const [state, dispatch] = useReducer(jwtReducer, jwt);

    const setJwt = (newJwt) => {
        if(newJwt !== state){
            setLocalJwt(newJwt);
            dispatch({type: SET_JWT, payload: newJwt});
        }
    }

    const value = {
        jwt: state,
        setJwt,
    }

    return(
        <JwtContext.Provider value = {value}>
            {children}
        </JwtContext.Provider>
    )


}