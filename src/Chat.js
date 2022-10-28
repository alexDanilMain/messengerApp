import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GiHound, GiImpLaugh, GiHeavyHelm, GiSnowman, GiGorilla } from "react-icons/gi";
import { allUsers, sendMessageRoute, getMessageRoute, host } from "./utils/APIRoutes";
import { io } from "socket.io-client"
import { v4 as uuidv4 } from "uuid";


function Chat() {
  const socket = useRef();
  const navigate = useNavigate()
  const scrollRef = useRef();
  const [users, setUsers] = useState([])
  const [recievedMessage, setRecievedMessage] = useState(null)
  const [currentUser, setCurrentUser] = useState(undefined)
  const [currentChatID, setCurrentChatId] = useState(undefined)
  const [currentChatProfilePic, setCurrentChatProfilePic] = useState(undefined)
  const [currentChatColor, setCurrentChatColor] = useState(undefined)
  const [msg, setMsg] = useState(undefined)
  const [allMessages, setAllMessages] = useState(undefined)

  const handleSend = async (e,msg) => {
    e.preventDefault()
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChatID,
      message: msg,
    });

    socket.current.emit("send-msg", {
      to: currentChatID,
      from: currentUser._id,
      message: msg,
    })

    const msgs = [...allMessages];
    msgs.push({ fromSelf: true, message: msg })
    setAllMessages(msgs)
    setMsg("")
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setRecievedMessage({
          fromSelf: false,
          message: msg
        })
      })
    }
  }, [allMessages])

  useEffect(() => {
    console.log(recievedMessage)
    recievedMessage && setAllMessages((prev) => [...prev, recievedMessage])
  }, [recievedMessage])


  useEffect(() => {
    scrollRef.current.scrollIntoView({ block: "end", behaviour: "smooth" })
  }, [allMessages])

  useEffect(() => {
    if (!localStorage.getItem("chattisUser")) {
      navigate("/login")
    } else {
      setLocalStorage()
    }
  }, [])

  // All online users
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser])

  useEffect(() => {
    if (users.length === 0) {
      getAllUsers()
    }
  })

  useEffect(() => {
    if (currentChatID !== undefined) {
      getMessages()
    }
  }, [currentChatID])

  const setLocalStorage = async () => {
    setCurrentUser(await JSON.parse(localStorage.getItem("chattisUser")))
  }

  const getMessages = async () => {
    if (currentUser) {
      const data = await axios.post(getMessageRoute, {
        from: currentUser._id,
        to: currentChatID
      });

      setAllMessages(data.data)
    }

  }

  const getAllUsers = async () => {
    if (currentUser) {
      const data = await axios.get(`${allUsers}/${currentUser._id}`)
      console.log(data.data.users)
      setUsers(data.data.users)
    }
  }

  function DisplayAllUsers(users) {
    if (users.length > 0) return (
      users.map((users, index) => {
        var profilePic = <GiHound size={30} style={{ color: users.profilePicColor }} id={`${index}`} />
        if (users.profilePic === 2) {
          profilePic = <GiImpLaugh size={30} style={{ color: users.profilePicColor }} id={`${index}`} />
        } else if (users.profilePic === 3) {
          profilePic = <GiHeavyHelm size={30} style={{ color: users.profilePicColor }} id={`${index}`} />
        }
        else if (users.profilePic === 4) {
          profilePic = <GiSnowman size={30} style={{ color: users.profilePicColor }} id={`${index}`} />
        }
        else if (users.profilePic === 5) {
          profilePic = <GiGorilla size={30} style={{ color: users.profilePicColor }} id={`${index}`} />
        }
        return (
          <div className="" key={index} id={`parent-${index}`} onClick={(e) => isSelected(e, users.profilePic, users.profilePicColor, users.username, users._id)}>
            <div className="flex flex-row items-center p-4" id={`${index}`}>
              <div className="flex ml-2 items-center justify-center h-10 w-10 rounded-full bg-white  font-bold flex-shrink-0" id={`${index}`}>
                {profilePic}
              </div>
              <div className="flex flex-col flex-grow ml-3 " id={`${index}`}>
                <div className="flex items-center" id={`${index}`}>
                  <div className="text-sm font-medium" id={`${index}`}>{users.username}</div>
                </div>
              </div>
            </div>
          </div>
        )
      })
    )

    else return (<p>Loading ...</p>)
  }

  const logOut = ()=>{
    localStorage.clear();
    navigate("/login")
  }
  const currentUserProfilePic = (currentUser) => {
    if (currentUser) {
      var userProfilePic;
      switch (currentUser.profilePic) {
        case 0:
          userProfilePic = <GiHound size={30} style={{ color: currentUser.profilePicColor }} />
          break;
        case 1:
          userProfilePic = <GiHound size={30} style={{ color: currentUser.profilePicColor }} />
          break;
        case 2:
          userProfilePic = <GiImpLaugh size={30} style={{ color: currentUser.profilePicColor }} />
          break;
        case 3:
          userProfilePic = <GiHeavyHelm size={30} style={{ color: currentUser.profilePicColor }} />
          break;
        case 4:
          userProfilePic = <GiSnowman size={30} style={{ color: currentUser.profilePicColor }} />
          break;
        case 5:
          userProfilePic = <GiGorilla size={30} style={{ color: currentUser.profilePicColor }} />
          break;
      }
      return (

        <div className="flex flex-row items-center w-full mr-5">
          <div className="flex ml-2 items-center justify-center h-10 w-10 rounded-full bg-white font-bold flex-shrink-0" >
            {userProfilePic}
          </div>
          <div className="flex flex-grow ml-3 " >
            <div className="flex flex-row items-center" >
              <div className="text-sm font-medium" >{currentUser.username}</div>
            </div>
            <div className="flex items-center justify-end">
              <button onClick={()=>{navigate('/editProfile')}} className="ml-3 bg-gray-300 hover:bg-gray-400 text-black rounded-full text-sm w-24 h-6"> Edit profile</button>
              <button onClick={logOut}className="ml-3 bg-gray-300 hover:bg-gray-400 text-black rounded-full text-sm w-20 h-6"> Logout</button>
            </div>
          </div>
        </div>
      )
    }
    else {
      return (<p>Loading ....</p>)
    }

  }

  function DisplayAllMessages(msg, profilePic, color) {
    if (msg) return (
      msg.map((msg, index) => {
        var otherUserProfilePic = <GiHound size={30} style={{ color: color }} id={`${index}`} />
        if (profilePic === 2) {
          otherUserProfilePic = <GiImpLaugh size={30} style={{ color: color }} id={`${index}`} />
        } else if (profilePic === 3) {
          otherUserProfilePic = <GiHeavyHelm size={30} style={{ color: color }} id={`${index}`} />
        }
        else if (profilePic === 4) {
          otherUserProfilePic = <GiSnowman size={30} style={{ color: color }} id={`${index}`} />
        }
        else if (profilePic === 5) {
          otherUserProfilePic = <GiGorilla size={30} style={{ color: color }} id={`${index}`} />
        }

        var userProfilePic;
        switch (currentUser.profilePic) {
          case 0:
            userProfilePic = <GiHound size={30} style={{ color: currentUser.profilePicColor }} id={`${index}`} />
            break;
          case 1:
            userProfilePic = <GiHound size={30} style={{ color: currentUser.profilePicColor }} id={`${index}`} />
            break;
          case 2:
            userProfilePic = <GiImpLaugh size={30} style={{ color: currentUser.profilePicColor }} id={`${index}`} />
            break;
          case 3:
            userProfilePic = <GiHeavyHelm size={30} style={{ color: currentUser.profilePicColor }} id={`${index}`} />
            break;
          case 4:
            userProfilePic = <GiSnowman size={30} style={{ color: currentUser.profilePicColor }} id={`${index}`} />
            break;
          case 5:
            userProfilePic = <GiGorilla size={30} style={{ color: currentUser.profilePicColor }} id={`${index}`} />
            break;
        }

        if (msg.fromSelf)
          return (
            <div className="col-start-6 col-end-13 p-3 rounded-lg" key={uuidv4()}>
              <div className="flex items-center justify-start flex-row-reverse">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 flex-shrink-0">
                  {userProfilePic}
                </div>
                <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                  <div>{msg.message}</div>
                </div>

              </div>
            </div>
          )

        else return (

          <div className="col-start-1 col-end-8 p-3 rounded-lg" key={index}>
            <div className="flex flex-row items-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 flex-shrink-0">
                {otherUserProfilePic}
              </div>
              <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                <div>{msg.message}</div>
              </div>
            </div>
          </div>

        )


      })
    )

    else return (<p>Loading ...</p>)
  }

  const isSelected = (e, profilePic, profilePicColor, name, id) => {

    setCurrentChatProfilePic(profilePic)
    setCurrentChatColor(profilePicColor)

    for (var i = 0; i < users.length; i++) {
      document.getElementById('parent-' + i).classList.remove('bg-gray-300')
    }
    document.getElementById(`parent-${e.target.id}`).classList.add('bg-gray-300')

    for (var i = 1; i < 6; i++) {
      document.getElementById(`pic-${i}`).classList.add('hidden')
    }

    switch (profilePic) {
      case 0:
        document.getElementById('pic-1').classList.remove('hidden')
        document.getElementById('pic-1').style.color = profilePicColor
        break;
      case 1:
        document.getElementById('pic-1').classList.remove('hidden')
        document.getElementById('pic-1').style.color = profilePicColor
        break;
      case 2:
        document.getElementById('pic-2').classList.remove("hidden")
        document.getElementById('pic-2').style.color = profilePicColor
        break;
      case 3:
        document.getElementById('pic-3').classList.remove("hidden")
        document.getElementById('pic-3').style.color = profilePicColor
        break;
      case 4:
        document.getElementById('pic-4').classList.remove("hidden")
        document.getElementById('pic-4').style.color = profilePicColor
        break;
      case 5:
        document.getElementById('pic-5').classList.remove("hidden")
        document.getElementById('pic-5').style.color = profilePicColor
        break;
    }
    document.getElementById('selectedName').innerText = name
    setCurrentChatId(id)
  }

  return (
    <>
    <div className="flex flex-row h-screen antialiased text-gray-800">

      <div className="flex flex-row w-96 flex-shrink-0 bg-gray-100 p-4">
        <div className="flex flex-col w-full h-full pl-4 pr-4 py-4 -mr-4">
          <div className="flex flex-col items-center">

            {currentUserProfilePic(currentUser)}
            <hr className="h-0.5 bg-gray-400 w-full my-5"></hr>
            <div className="flex flex-row items-center">
              <div className="text-xl font-semibold">Chattis</div>
            </div>
          </div>

          <div className="mt-5">
            <ul className="flex flex-row items-center justify-between">
              <li>
                <a href="#"
                  className="flex items-center pb-3 text-xs font-semibold relative text-indigo-800">
                  <span>All Conversations</span>
                  <span className="absolute left-0 bottom-0 h-1 w-6 bg-indigo-800 rounded-full"></span>
                </a>
              </li>
            </ul>
          </div>

          <div className="h-full overflow-hidden relative pt-2">

            <div className="flex flex-col divide-y h-full overflow-y-auto -mx-4">

              {/*           User Icon           */}
              {DisplayAllUsers(users)}
            </div>

            {/*               PLUS ICON             */}
            <div className="absolute bottom-0 right-0 mr-2">
              <button className="flex items-center justify-center shadow-sm h-10 w-10 bg-red-500 text-white rounded-full">
                <svg className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full w-full bg-white px-4 py-6">
        <div className="flex flex-row items-center py-4 px-6 rounded-2xl shadow">


          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100">
            <GiHound size={30} className="" id="pic-1" />
            <GiImpLaugh size={30} className="hidden" id="pic-2" />
            <GiHeavyHelm size={30} className="hidden" id="pic-3" />
            <GiSnowman size={30} className="hidden" id="pic-4" />
            <GiGorilla size={30} className="hidden" id="pic-5" />
          </div>
          <div className="flex flex-col ml-3">
            <div className="font-semibold text-sm" id="selectedName">Please Select a User</div>
            <div className="text-xs text-gray-500">Aktiv 24/7</div>
          </div>

          {/*            Three Dots            */}
          <div className="ml-auto">
            <ul className="flex flex-row items-center space-x-2">
              <li>
                <a href="#"
                  className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-400 h-10 w-10 rounded-full">
                  <span>
                    <svg className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                    </svg>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="h-full overflow-hidden py-4" >
          <div className="h-full overflow-y-auto">
            <div className="grid grid-cols-12 gap-y-2" ref={scrollRef}>

              {DisplayAllMessages(allMessages, currentChatProfilePic, currentChatColor)}

            </div>
          </div>
        </div>
        <div className="flex flex-row items-center">
          <div className="flex flex-row items-center w-full border rounded-3xl h-12 px-5">
            <div className="w-full">
              <form onSubmit={(e)=> handleSend(e,msg)}>
              <input type="text"
                className="border border-transparent w-full focus:outline-none text-sm h-10 flex items-center"
                placeholder="Type your message...."
                id="messageBar"
                onChange={(e) => setMsg(e.target.value)}
                value = {msg}
              />
              </form>
            </div>
            <div className="flex flex-row">
            </div>
          </div>
          <div className="ml-6">
            <button className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300 text-indigo-800" onClick={(e) => handleSend(e,msg)}>
              <svg className="w-5 h-5 transform rotate-90 -mr-px"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Chat;
