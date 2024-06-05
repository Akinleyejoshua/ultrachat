"use client"

import { Header } from "@/components/Header";
import { Space } from "@/components/Space";
import { get, save } from "@/utils/helpers";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AiOutlineLogin, AiOutlineSend, AiOutlineUser } from "react-icons/ai"
import { io } from "socket.io-client";

export default function Home() {
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const router = useRouter();
  const [created, setCreated] = useState(false);


  const socketRef = useRef(io("http://localhost:4000/", { autoConnect: false }));

  const open = () => {
    socketRef.current.emit("logged-in", input);
    router.push(`/chat/${input}`)
  }

  const login = () => {
    if (input === "") {
      setMsg("Empty Field!")
      setMsgType("error")
    } else {
      setMsg("")
      setMsgType("")
      save("username-input", input);
      socketRef.current.connect();
      socketRef.current.emit("login", input);
    }

  }

  const onMessage = (msg) => {
    if (msg.error) {
      setMsgType("error")
    } else {
      setMsgType("success")
    }

    if (msg.type === "account-created") {
      setCreated(true);
    } else if (msg.type === "already-exist"){
      setCreated(true);

    }

    setMsg(msg.msg)

  }

  useEffect(() => {
    setInput(get("username-input"));

    socketRef.current.on("msg", onMessage)

    return () => {
      socketRef.current.off("msg");
    }
  }, [])

  return (
    <main className="home">
      <Header />
      <div className="main">
        <h1>Create an Account / Sign in</h1>
        <Space val={"1rem"} />
        <form onSubmit={e => {
          e.preventDefault();
        }}>

          <small>Username</small>
          <Space val={".3rem"} />

          <div className="input">
            <AiOutlineUser className="icon" />
            <Space val={".3rem"} />
            <input defaultValue={input} type="text" placeholder="Username" onChange={e => setInput(e.target.value)} />
          </div>
          <Space val={"1rem"} />

          {msg !== "" && <>
            <small className={msgType}>{msg}</small>
            <Space val={"1rem"} />
          </>
          }

          {
            created ?
              <button onClick={open}>Continue
                <Space val={".3rem"} />
                <AiOutlineLogin className="icon" />
              </button>
              :
              <button onClick={login}>Login
                <Space val={".3rem"} />
                <AiOutlineLogin className="icon" />
              </button>
          }


        </form>
      </div>
    </main>
  );
}
