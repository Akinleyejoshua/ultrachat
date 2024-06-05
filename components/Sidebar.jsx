import { useEffect, useRef, useState } from "react";
import { Space } from "./Space";
import { Avater } from "./Avater";
import { io } from "socket.io-client";
import { useParams, useRouter } from "next/navigation";
import useTime from "@/hooks/useTime";

export const Sidebar = ({ openChat }) => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const { id: username } = useParams();
  const router = useRouter();

  const { relativeTime } = useTime()

  const socketRef = useRef(
    io("http://localhost:4000/", { autoConnect: false })
  );

  const onUsers = (users) => {
    setUsers(users);
  };

  const onUser = (user) => {
    setUser(user);
  };

  const onLoggedout = () => {
    socketRef.current.connect();
    socketRef.current.emit("logged-out", username)
    router.push("/")
  }

  useEffect(() => {
    socketRef.current.connect();
    socketRef.current.on("user-does-not-exist", onLoggedout)
    socketRef.current.emit("logged-in", username);
    socketRef.current.emit("re-logged-in", username);
    socketRef.current.on("get-users", onUsers);
    socketRef.current.on("get-user", onUser);
    socketRef.current.on("user-active", onUsers);

    return () => {
      socketRef.current.off("get-users");
      socketRef.current.off("user-active");
      socketRef.current.off("get-user");
    };
  }, []);

  return (
    <section className="sidebar col">
      <div className="top">
        <a href="/">Ultra Chat</a>
        <Space val={".3rem"} />
        <Avater data={{ ...user }} />
        <Space val={".3rem"} />
        <h3>{user.name}</h3>
      </div>
      <div className="center">
        {/* <small>Users</small> */}
        <Space val={".3rem"} />
        {users.map((item, i) => {
          return (
            item?.name !== username && (
              <div
                onClick={() => {
                  const chatName = () => {
                    if (item?.name.length < username.length) {
                      return `${item?.name}_${username}`
                    } else {
                      return `${username}_${item?.name}`
                    }
                  }
                  openChat({
                    name: item?.name,
                    chatName: chatName(),
                    chatHeader: true,
                    chatBar: true,
                  })
                }

                }
                className="item col space-between"
                key={i}
              >
                <div className="row">
                  <Avater data={{ name: item?.name, active: item?.active }} />
                  <div className="col">
                    <h3>{item?.name}</h3>
                    <small>
                      {item?.active ? (
                        "Active now"
                      ) : (
                        relativeTime(item?.time)
                      )}
                    </small>
                  </div>

                </div>
                <Space val={".3rem"} />
                <div className="col data">
                  {(item?.lastMsgChat?.to == item?.name && item?.lastMsgChat?.sender == username)
                    &&
                    <div className="lastmsg">{item?.lastMsgChat?.msg !== "" ? item?.lastMsgChat?.msg : "no message"}</div>
                  }
                </div>
              </div>
            )
          );
        })}
      </div>
    </section>
  );
};
