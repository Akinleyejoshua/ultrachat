"use client";

import { ChatBar } from "@/components/ChatBar";
import { ChatHeader } from "@/components/ChatHeader";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Space } from "@/components/Space";
import TimeDifference from "@/components/TimeDifference";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AiOutlineLogin, AiOutlineSend } from "react-icons/ai";
import { io } from "socket.io-client";

export default function Chat() {
    const { id: username } = useParams();
    const socketRef = useRef(
        io("http://localhost:4000/", { autoConnect: false })
    );

    const [openChat, setOpenChat] = useState({});
    const [text, setText] = useState("");

    const sendChat = () => {
        socketRef.current.connect();
        socketRef.current.emit("save-chat", {
            chatName: openChat.chatName,
            chat: {
                sender: username,
                msg: text,
                status: "sent",
            }
            
        })

        socketRef.current.emit("save-last-msg", {
            chatName: openChat.chatName,
            chat: {
                sender: username,
                to: openChat?.name,
                status: "sent",
                msg: text,
            }
            
        })
    }

    const handleInput = (text) => {
        socketRef.current.connect();
        socketRef.current.emit("typing", username);
        setText(text);
    }


    return (
        <main className="chat">
            <div className="row full">
                <Sidebar
                    openChat={(val) => setOpenChat(val)}
                />
                <div className="col full">
                    <ChatHeader user={openChat} />
                    <div className="main full">
                        {openChat?.chatBar ?
                            <ChatBar chat={openChat} /> :
                            <h1>Select a chat</h1>
                        }
                        {openChat?.chatBar
                            &&
                            <form onSubmit={e => {
                                e.preventDefault();
                                sendChat();
                                document.querySelector("input.text-input").input = "";
                            }}>

                                <div className="chatinput">
                                    <input className="text-input" defaultValue={text} type="text" placeholder="Message" onChange={e => handleInput(e.target.value)}/>
                                    <Space val={".3rem"} />
                                    <button>
                                        <AiOutlineSend className="icon" />
                                    </button>
                                </div>
                            </form>

                        }

                    </div>
                </div>
            </div>
        </main>
    );
}
