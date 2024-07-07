import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable } from 'react-native';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

type Message = {
  sender: string;
  content: string;
  sentTime: Date;
};

export default function HubScreen() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [connection, setConnection] = useState<HubConnection | null>(null);

    useEffect(() => {
      const connect = new HubConnectionBuilder()
        .withUrl("https://localhost:7129/hub")
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();
      setConnection(connect);
      
      connect.start()
        .then(() => {
          connect.on("receivemessage", (sender, content, sentTime) => {
            setMessages((prev) => {
              const messageExists = prev.some(msg => msg.sender === sender && msg.content === content && msg.sentTime === sentTime);
              if (!messageExists) {
                return [...prev, { sender, content, sentTime }];
              }
              return prev;
            });
          });

          connect.on("messagehistory", (history) => {
            setMessages(history.map((msg: { sender: any; content: any; sentTime: string | number | Date; }) => ({
              sender: msg.sender,
              content: msg.content,
              sentTime: new Date(msg.sentTime)
            })));
          });

          connect.invoke("RetrieveMessageHistory");

        })
  
        .catch((err) =>
          console.error("Error while connecting to SignalR Hub:", err)
        );

      return () => {
        if (connection) {
          connection.off("receivemessage");
        }
      };

    }, []);

    const sendMessage = async () => {
      if (connection && newMessage.trim()) {
        const newMsg: Message = {
          sender: connection.connectionId!,
          content: newMessage,
          sentTime: new Date()
        };
        
        // Optimistically add the new message to the state
        setMessages((prev) => [...prev, newMsg]);
        
        await connection.send("PostMessage", newMessage);
        setNewMessage("");
      }
    };

    const isMyMessage = (username: string) => {
      return connection && username === connection.connectionId;
    };
  
  return (
    <View style={{ flex: 1, padding: 20 }}>
    <ScrollView style={styles.messagesContainer}>
            {messages.map((msg, index) => (
            <View
                key={index}
                style={[
                styles.message,
                isMyMessage(msg.sender) ? styles.myMessage : styles.otherMessage,
                ]}
            >
                <Text>{msg.content}</Text>
                <Text style={styles.time}>{new Date(msg.sentTime).toLocaleString()}</Text>
            </View>
            ))}
        </ScrollView>
        <View style={styles.inputContainer}>
            <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message"
            />
            <Pressable onPress={sendMessage} style={styles.button}>
              <Text style={styles.buttonText}>Send</Text>
            </Pressable>
        </View>
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
      padding: 16,
    },
    messagesContainer: {
      marginBottom: 16,
    },
    message: {
      padding: 8,
      marginVertical: 4,
      borderRadius: 8,
    },
    myMessage: {
      backgroundColor: '#bfdcff', // Light blue
      alignSelf: 'flex-end',
    },
    otherMessage: {
      backgroundColor: '#d1d5db', // Light gray
      alignSelf: 'flex-start',
    },
    time: {
      fontSize: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      input: {
        flex: 1,
        borderColor: 'gray',
        borderWidth: 1,
        marginRight: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
      },
      button: {
        backgroundColor: '#3b82f6', // Blue
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
      },
      buttonText: {
        color: 'white',
      },
});
