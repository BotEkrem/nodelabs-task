import {io} from "socket.io-client";

const socket = io("http://localhost:5354", {
    auth: {
        token: " "
    }
});

socket.on("connect", () => {
    console.log("Connected");
});

socket.on("error", (err) => {
    console.log("Error", err);
});