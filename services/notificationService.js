import * as signalR from '@microsoft/signalr';

class NotificationService {
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7129/notificationHub")
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.on("ReceiveNotification", this.onReceiveNotification);
  }

  // async start() {
  //   try {
  //     await this.connection.start();
  //     console.log("SignalR Connected.");
  //   } catch (err) {
  //     console.error("Error connecting to SignalR:", err);
  //     setTimeout(() => this.start(), 5000); // Retry connection
  //   }
  // }

  onReceiveNotification(message) {
    // Implement your notification handling logic here
    console.log("Received notification:", message);
  }

  addNotificationHandler(handler) {
    this.connection.on("ReceiveNotification", handler);
  }

  removeNotificationHandler(handler) {
    this.connection.off("ReceiveNotification", handler);
  }
}

const notificationService = new NotificationService();
export default notificationService;
