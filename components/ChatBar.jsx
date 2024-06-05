import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "next/navigation";

export const ChatBar = ({ chat }) => {
    const chatBarRef = useRef();
    const [chats, setChats] = useState([])
    const { id: username } = useParams();

    const socketRef = useRef(
        io("http://localhost:4000/", { autoConnect: false })
    );

    const onGetChats = (chat) => {
        setChats(chat.chats)
    }

    const onGetChat = (chat) => {
        setChats(prev => [...prev, chat])
    }

    const onSeenStatus = () => {
        socketRef.current.connect();

        socketRef.current.emit("chat-status", {
            chatName: chat?.chatName,
            status: "seen",
        })
    }

    useEffect(() => {
        window.onfocus = () => {
            onSeenStatus();
        }
    }, [])

    useEffect(() => {
        socketRef.current.connect();
        socketRef.current.emit("start-chat", chat?.chatName);
        socketRef.current.on("get-chats", onGetChats);
        socketRef.current.on("get-chat", onGetChat);
        onSeenStatus();


        return () => {
            socketRef.current.off("get-chats");
            socketRef.current.off("get-chat");
        }

    }, [chat]);


    useEffect(() => {
        const domNode = chatBarRef.current;

        if (domNode) {
            domNode.scrollTop = domNode.scollHeight;
            domNode.addEventListener("DOMNodeInserted", (event) => {
                try {
                    event.target.scrollIntoView({ behavior: "smooth", block: "start" });
                } catch (error) {
                }
            });
        }
    }, []);




    return <div className="chatbar" ref={chatBarRef}>
        {chats.map((item, i) => {
            return item?.sender == username ? (
                <div className="you" key={i}>{item?.msg}
                    <small className="status text-right">
                        {item?.status}
                    </small>
                </div>
            ) : (
                <div className="sender" key={i}>{item?.msg}

                </div>
            );
        })}
    </div>
}