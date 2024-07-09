import * as signalR from '@microsoft/signalr';

class SignalRService {
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7129/notificationHub")
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  subscribeToFriendRequests(callback) {
    this.connection.on('ReceiveFriendRequest', message => {
      callback(message);
    });
  }
}

export const signalRService = new SignalRService();