import { useEffect } from "react";
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
            });
        }
    }, [sapp])

    return (
        <>
            {props.children}
        </>
    )
}

export default AuthProvider;