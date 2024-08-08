import { Server } from "socket.io";
const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});
let onlineUser = [];
const addUser = (userId, socketId) => {
  const userExits = onlineUser.find((user) => user.userId === userId);
  if (!userExits) {
    onlineUser.push({ userId, socketId });
  }
};
const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};
const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};
io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });
  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    io.to(receiver.socketId).emit("getMessage", data);
  });
  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});
io.listen("4000");
// import { createContext, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { AuthContext } from "./AuthContext";

// export const SocketContext = createContext();

// export const SocketContextProvider = ({ children }) => {
//   const { currentUser } = useContext(AuthContext);
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     setSocket(io("http://localhost:4000"));
//   }, []);

//   useEffect(() => {
//     currentUser && socket?.emit("newUser", currentUser.id);
//   }, [currentUser, socket]);

//   return (
//     <SocketContext.Provider value={{ socket }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };
