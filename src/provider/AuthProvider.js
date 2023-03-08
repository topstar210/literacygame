import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import API from "provider/API";
import { SET_USER_INFO } from "store/types/app.types";

const AuthProvider = (props) => {
    const dispatch = useDispatch();
    const sapp = useSelector((state) => state.sapp);

    useEffect(() => {
        if (!sapp.accToken) {
            API.auth.getToken().then((tokenRes) => {
                dispatch({
                    type: SET_USER_INFO,
                    payload: tokenRes.data
                })
            }).catch((err)=>{
                // console.log(err);
                dispatch({
                    type: SET_USER_INFO,
                    payload: "Invalid_Token"
                })
            })
        }
    }, [sapp])

    return (
        <>
            {props.children}
        </>
    )
}

export default AuthProvider;