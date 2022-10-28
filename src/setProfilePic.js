import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { setProfilePicRoute } from "./utils/APIRoutes";
import { GiHound, GiImpLaugh, GiHeavyHelm, GiSnowman, GiGorilla } from "react-icons/gi"
function SetProfilePic() {

    const navigate = useNavigate();
    const [profilePic, setProfilePic] = useState(0);
    const [color, setColor] = useState('black')

    useEffect(()=>{
        if(!localStorage.getItem("chattisUser")){
            navigate("/login")
        }
    },[])

    const setProfilePicFunction = async () => {
        console.log("starting")
        const user = await JSON.parse(localStorage.getItem("chattisUser"));
        const {username} = user;
        const { data } = await axios.put(`${setProfilePicRoute}`, {username, profilePic, color});
        if (data.status === false){
            console.log(data)
        }
        if (data.status == true){
            console.log("worked")
            localStorage.setItem('chattisUser', JSON.stringify(data.user))
            navigate("/");
        }
    }


    return (


        <div className="flex justify-center items-center flex-col h-screen ">

            <div className="text-center text-6xl">
                <h1>
                    Pick a profile pic
                </h1>
            </div>

            <div className="text-center text-4xl mt-5">
                Choose a Color
            </div>

            <div className="flex justify-center w-full mt-5">
                <div className="flex justify-between w-2/3 h-10 gap-10">
                    <div className="w-1/5 h-full bg-red-600" onClick={() => setColor("red")}>

                    </div>

                    <div className="w-1/5 h-full bg-black" onClick={() => setColor("black")}>

                    </div>


                    <div className="w-1/5 h-full bg-blue-600" onClick={() => setColor("blue")}>

                    </div>

                    <div className="w-1/5 h-full bg-pink-600" onClick={() => setColor("magenta")}>

                    </div>


                    <div className="w-1/5 h-full bg-orange-400" onClick={() => setColor("orange")}>

                    </div>
                </div>
            </div>
            <div className="text-center text-4xl mt-20">
                Choose a Profile picture
            </div>
            <div className="w-full flex justify-center mt-5">
                <div className="flex justify-between w-2/3">
                    <GiHound size={100} style={{ color: color, }} onClick={() => setProfilePic(1)} className={`${profilePic === 1 ? "border-2" : ""}`} />
                    <GiImpLaugh size={100} style={{ color: color }} onClick={() => setProfilePic(2)} className={`${profilePic === 2 ? "border-2" : ""}`} />
                    <GiHeavyHelm size={100} style={{ color: color }} onClick={() => setProfilePic(3)} className={`${profilePic === 3 ? "border-2" : ""}`} />
                    <GiSnowman size={100} style={{ color: color }} onClick={() => setProfilePic(4)} className={`${profilePic === 4 ? "border-2" : ""}`} />
                    <GiGorilla size={100} style={{ color: color }} onClick={() => setProfilePic(5)} className={`${profilePic === 5 ? "border-2" : ""}`} />
                </div>
            </div>
            <button className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded mt-5" 
            type="button" onClick={setProfilePicFunction}>
                Use Profile Picture
            </button>
        </div>


    )
}

export default SetProfilePic;