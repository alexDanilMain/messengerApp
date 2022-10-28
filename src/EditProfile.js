import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { GiHound, GiImpLaugh, GiHeavyHelm, GiSnowman, GiGorilla } from "react-icons/gi";

function EditProfile(){
    const navigate = useNavigate()
    const [currentUser, setCurrentUser] = useState(undefined)


    useEffect(() => {
        if (!localStorage.getItem("chattisUser")) {
          navigate("/login")
        } else {
          setLocalStorage()
        }
      }, [])
    
      const setLocalStorage = async () => {
        setCurrentUser(await JSON.parse(localStorage.getItem("chattisUser")))
      }

      const displayProfilePic = (currentUser) =>{

        if (currentUser) {
            var userProfilePic;
            switch (currentUser.profilePic) {
              case 0:
                userProfilePic = <GiHound size={100} style={{ color: currentUser.color }} />
                break;
              case 1:
                userProfilePic = <GiHound size={100} style={{ color: currentUser.color }} />
                break;
              case 2:
                userProfilePic = <GiImpLaugh size={100} style={{ color: currentUser.color }} />
                break;
              case 3:
                userProfilePic = <GiHeavyHelm size={100} style={{ color: currentUser.color }} />
                break;
              case 4:
                userProfilePic = <GiSnowman size={100} style={{ color: currentUser.color }} />
                break;
              case 5:
                userProfilePic = <GiGorilla size={100} style={{ color: currentUser.color }} />
                break;

            }
                        
            return(
                userProfilePic
            )
        }
        return("loading ...")
      }

      const displayUserName = (currentUser) => {
        if (currentUser){
            return (currentUser.username)
        }
        return("loading ...")
      }

      const logOut = ()=>{
        localStorage.clear();
        navigate("/login")
      }

    return(
        <div className="flex w-full h-screen justify-center items-center bg-gray-100 overflow-hidden">
            <div className="h-2/3 w-1/2 bg-gray-200 shadow-lg flex flex-col absolute items-center">
                <div className="flex w-full flex-row justify-center pt-5 overflow-hidden">
                    <div className="bg-white rounded-full w-36 h-36 flex flex-col justify-center items-center">
                        {displayProfilePic(currentUser)}
                    
                    </div>
                </div>

                <button onClick={()=>{navigate("/setProfilePic")}} className="mt-5 bg-gray-300 hover:bg-gray-400 text-black rounded-full text-sm w-24 h-6"> Edit </button>
                
                <div className="mt-5 flex flex-row">
                    Username : {displayUserName(currentUser)}
                </div>

                <button onClick={logOut} className="mt-5 bg-gray-300 hover:bg-gray-400 text-black rounded-full text-sm w-24 h-6"> Log out </button>

            </div>
        </div>
    )
}

export default EditProfile;