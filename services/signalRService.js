import * as signalR from "@microsoft/signalr";

export const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7129/hub")
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    .build();

connection.start().catch(err => console.error(err.toString()));

export const sendMessage = async (senderId, receiverId, message) => {
    await connection.invoke("SendMessage", senderId, receiverId, message);
};

export const getMessages = async (currentUserId, otherUserId) => {
    await connection.invoke("GetMessages", currentUserId, otherUserId);
};

export const onReceiveMessage = (callback) => {
    connection.on("ReceiveMessage", callback);
};

export const onReceiveMessageHistory = (callback) => {
    connection.on("ReceiveMessageHistory", callback);
};
