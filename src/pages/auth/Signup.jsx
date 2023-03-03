import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';

import API from '../../provider/API';
import { SET_USER_INFO } from 'store/types/app.types';

const SignUp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [country, setCountry] = useState('');
    const [school, setSchool] = useState('');
 
    const Register = async (e) => {
        e.preventDefault();
        try {
            const registerRes = await API.auth.register({
                name,
                email,
                country,
                school,
                password: password,
                confPassword: confPassword
            })
            // dispatch({
            //     type: SET_USER_INFO,
            //     payload: registerRes.data
            // })
            if(registerRes.data.msg === "Registration Successful"){
                navigate("/login");
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.msg);
            }
        }
    }
    return (
        <>
            <div className="flex items-center min-h-screen p-4 bg-gray-100 lg:justify-center">
                <div
                    className="flex flex-col overflow-hidden bg-white rounded-md shadow-lg max md:flex-row md:flex-1 lg:max-w-screen-md"
                >
                    <div
                        className="p-4 py-6 text-white bg-blue-500 md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly"
                    >
                        <div className="my-3 text-4xl font-bold tracking-wider text-center">
                            <Link to="/">Literacy Game</Link>
                        </div>
                        <p className="mt-6 font-normal text-center text-gray-300 md:mt-0">
                            A tried and true game that's been keeping children around the world occupied for centuries.
                        </p>
                        <p className="flex flex-col items-center justify-center mt-10 text-center">
                            <span>Do You have an account?</span>
                            <Link to="/login" className="underline">Go To Login</Link>
                        </p>
                    </div>
                    <div className="p-5 bg-white md:flex-1">
                        <h3 className="my-4 text-2xl font-semibold text-gray-700">Account Register</h3>
                        <form action="#" onSubmit={Register} className="flex flex-col space-y-5">
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="name" className="text-sm font-semibold text-gray-500">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    autoFocus
                                    value={name} onChange={(e) => setName(e.target.value)}
                                    className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                                />
                            </div>
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="school" className="text-sm font-semibold text-gray-500">School Name</label>
                                <input
                                    type="text"
                                    id="school"
                                    value={school} onChange={(e) => setSchool(e.target.value)}
                                    className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                                />
                            </div>
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="country" className="text-sm font-semibold text-gray-500">Country</label>
                                <input
                                    type="text"
                                    id="country"
                                    value={country} onChange={(e) => setCountry(e.target.value)}
                                    className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                                />
                            </div>
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="email" className="text-sm font-semibold text-gray-500">Email address</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                    className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                                />
                            </div>
                            <div className="flex flex-col space-y-1">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="text-sm font-semibold text-gray-500">Password</label>
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                                />
                            </div>
                            <div className="flex flex-col space-y-1">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="confPassword" className="text-sm font-semibold text-gray-500">Confirm Password</label>
                                </div>
                                <input
                                    type="password"
                                    id="confPassword"
                                    value={confPassword} onChange={(e) => setConfPassword(e.target.value)}
                                    className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                                />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4"
                                >
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            <ToastContainer />
            </div>
        </>
    )
}

export default SignUp;