import { AiOutlineLogout } from "react-icons/ai"
import { Avater } from "./Avater"
import { Space } from "./Space"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"
import useTime from "@/hooks/useTime";

export const ChatHeader = ({ user }) => {
    const router = useRouter();
    const { id: username } = useParams();
    const [data, setData] = useState({});
    const { relativeTime } = useTime()
    const [typing, setTyping] = useState(false);

    const socketRef = useRef(
        io("http://localhost:4000/", { autoConnect: false })
    );

    const onLoggedout = () => {
        socketRef.current.connect();
        socketRef.current.emit("logged-out", username)
        router.push("/")
    }

    const onLoadUserData = (user) => {
        setData(user);
    }

    const onTyping = (user) => {
        if (user === username) return;
        else setTyping(true);
    }

    const notTyping = (user) => {
        if (user === username) return;
        else setTyping(false);
    }

    useEffect(() => {
        socketRef.current.connect();
        socketRef.current.emit("get-chat-user", user?.name)
        socketRef.current.on("get-chat-user", onLoadUserData);
        socketRef.current.on("typing", onTyping);
        socketRef.current.on("not-typing", notTyping)

        return () => {
            socketRef.current.off("get-user");
        }
    }, [user])


    return <section className="chat-header w100">
        <nav className="">

            {!user?.chatHeader ?
                <div>
                    <h1>Chat</h1>
                </div>
                :
                <div className="row">
                    <Avater data={{ ...data }} />
                    <Space val={".3rem"} />

                    <div className="col">
                        <h3>{data?.name}</h3>
                        <small>
                            {
                                typing ? "Typing ..." :
                                    data?.active ? "Active now" :
                                        relativeTime(data?.time)

                            }

                        </small>
                    </div>
                </div>
            }


            <div className="actions">
                <button className="b-red" onClick={onLoggedout}>
                    <AiOutlineLogout className="icon" />
                </button>
            </div>
        </nav>
    </section>
}