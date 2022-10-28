import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"
import { registerRoute } from "./utils/APIRoutes";

function RegisterPage() {
    const navigate = useNavigate();

    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    useEffect(()=>{
        if(localStorage.getItem("chattisUser")){
            navigate("/")
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (handleValidation()) {
            //call api
            const { password, username, email } = values;
            const { data } = await axios.post(registerRoute, {
                username, email, password
            });
            if (data.status === false){
                alert(data.msg)
            }
            if ( data.status == true){
                localStorage.setItem('chattisUser', JSON.stringify(data.user))
                navigate("/setProfilePic");
            }
        }
    }

    const handleValidation = () => {
        const { password, confirmPassword, username, email } = values;

        if (password !== confirmPassword) {
            alert("password and confirm password don't match")
            return false
        }
        else if (password.length < 8){
            alert("password should be longer than 8")
        }
        else if (username.length < 3){
            alert("username should be longer than 3")
        }
        else {
            return true
        }
    }

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })

    }

    return (
        <div className="flex content-center items-center justify-center h-screen w-full flex-col">

            <form className="w-1/3 h-1/2" onSubmit={handleSubmit}>
                <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="username">
                            Username
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <input
                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                            type="text"
                            onChange={(e) => handleChange(e)}
                            name="username"

                        />
                    </div>
                </div>
                <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="email">
                            Email
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                            type="email"
                            onChange={(e) => handleChange(e)}
                            name="email"
                        />
                    </div>
                </div>

                <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="password">
                            Password
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                            type="password"
                            onChange={(e) => handleChange(e)}
                            name="password"
                        />
                    </div>
                </div>

                <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="confirmPassword" >
                            Confirm Password
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                            type="password"
                            onChange={(e) => handleChange(e)}
                            name="confirmPassword"
                        />
                    </div>
                </div>

                <div className="md:flex md:items-center">
                    <div className="md:w-1/3"></div>
                    <div className="md:w-2/3">
                        <button className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                            Sign Up
                        </button>
                    </div>
                </div>
                <div className="flex justify-center mt-12">
                    <span> Already have an account? <Link to="/login" className="text-sky-900"> Login </Link> </span>
                </div>

            </form>



        </div>
    );
}

export default RegisterPage;
