import * as SignalR from '@microsoft/signalr';

export const connection = new SignalR.HubConnectionBuilder()
    .withUrl("https://localhost:7129/groupHub")
    .configureLogging(SignalR.LogLevel.Information)
    .withAutomaticReconnect()
    .build();

connection.on("ReceiveMessage", (userId, message) => {
    // This event handler will be registered in the component to update the message state
    console.log(`User ${userId} says ${message}`);
});

connection.start().catch(err => console.error('SignalR Connection Error: ', err));
