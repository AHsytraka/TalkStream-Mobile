import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import authService from '../../services/authService';
import { sendMessage, getMessages, onReceiveMessage, onReceiveMessageHistory, connection } from '../../services/signalRService';

export default function HubScreen() {
    const params = useLocalSearchParams();
    const friendId = params.uid.toString();
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const scrollViewRef = useRef();

    useEffect(() => {
        const initialize = async () => {
            const userData = await authService.fetchUser();
            setUser(userData);
            // scrollViewRef.current?.scrollToEnd({ animated: false });
        }
        initialize();
    }, []);

    useEffect(() => {
        if (user && friendId) {
            getMessages(user.uid, friendId).catch(console.error);
            const messageHandler = (senderId, content, timestamp) => {
                setMessages((prev) => {
                    const msgExists = prev.some(msg => msg.senderId === senderId && msg.content === content && msg.timestamp === timestamp);
                    if (!msgExists) {
                        return [...prev, { senderId, content, timestamp }];
                    }
                    return prev;
                });
            };
    
            onReceiveMessage(messageHandler);

            onReceiveMessageHistory((history) => {
                setMessages(history);
            });

            return () => {
                connection.off("ReceiveMessage", messageHandler);
            };
        }
    }, [user, friendId]);

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const handleSendMessage = async () => {
        if (message.trim() !== "") {
            const timestamp = new Date().toISOString();
            const newMessage = { senderId: user.uid, content: message, timestamp };
            setMessages(prevMessages => [...prevMessages, newMessage]);
            await sendMessage(user.uid, friendId, message);
            setMessage("");
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.chatWindow} ref={scrollViewRef}>
                {messages.map((msg, index) => (
                    <View
                        key={index}
                        style={[
                            styles.message,
                            msg.senderId === user.uid ? styles.sent : styles.received,
                        ]}
                    >
                        <Text style={styles.messageContent}>{msg.content}</Text>
                        <Text style={styles.messageTimestamp}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                        </Text>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.messageInput}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    onSubmitEditing={handleSendMessage}
                    returnKeyType="send"
                />
                <TouchableOpacity onPress={handleSendMessage} style={styles.button}>
                    <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    chatWindow: {
        flex: 1,
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    message: {
        marginVertical: 5,
        padding: 5,
        borderRadius: 5,
    },
    sent: {
        backgroundColor: '#daf8cb',
        alignSelf: 'flex-end',
    },
    received: {
        backgroundColor: '#f1f0f0',
        alignSelf: 'flex-start',
    },
    messageContent: {
        marginBottom: 5,
    },
    messageTimestamp: {
        fontSize: 12,
        color: '#999',
    },
    messageInput: {
        flexDirection: 'row',
        padding: 10,
    },
    input: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    button: {
        marginLeft: 5,
        backgroundColor: '#007bff',
        borderRadius: 5,
        padding: 10,
    },
    buttonText: {
        color: '#fff',
    },
});


// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
// import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
// import authService from '../../services/authService';
// import { useLocalSearchParams } from 'expo-router';

// function HubScreen() {
//     const params = useLocalSearchParams();
//     const friendId = params.uid.toString();
//     const [user, setUser] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState('');
//     const [connection, setConnection] = useState(null);
//     const flatListRef = useRef();
//     const connectionRef = useRef(null); // Use useRef for the connection


//     useEffect(() => {
//         const initialize = async () => {
//             const userData = await authService.fetchUser();
//             setUser(userData);

//             const connection = new HubConnectionBuilder()
//                 .withUrl('https://localhost:7129/hub')
//                 .configureLogging(LogLevel.Information)
//                 .withAutomaticReconnect()
//                 .build();

//             connection.on('ReceiveMessage', (senderId, content, timestamp) => {
//                 console.log('ReceiveMessage event received:', { senderId, content, timestamp });
//                 setMessages(prevMessages => [
//                     ...prevMessages,
//                     { senderId, content, timestamp }
//                 ]);
//             });


//             connection.on('ReceiveMessageHistory', (messageHistory) => {
//                 // console.log('ReceiveMessageHistory event received:', messageHistory);
//                 setMessages(messageHistory);
//             });

//             await connection.start();
//             console.log('SignalR connection established');
//             setConnection(connection);

//             connection.invoke('GetMessages', userData.uid, friendId);
//         };
//         initialize();
//         flatListRef.current.scrollToEnd({ animated: true });

//     }, [messages]);

//     const sendMessage = async () => {
//         if (connection && newMessage.trim() !== '') {
//             const message = {
//                 senderId: user.uid,
//                 receiverId: friendId,
//                 content: newMessage,
//                 timestamp: new Date().toISOString()
//             };

//             setMessages(prevMessages => [...prevMessages, message]);
//             flatListRef.current.scrollToEnd({ animated: true });
//             await connection.invoke('SendMessage', user.uid, friendId, newMessage);
//             setNewMessage('');
//         }
//     };

//     const renderItem = ({ item }) => (
//         <View style={item.senderId === user.uid ? styles.myMessage : styles.theirMessage}>
//             <Text>{item.content}</Text>
//             <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
//         </View>
//     );

//     return (
//         <View style={styles.container}>
//             <FlatList
//                 ref={flatListRef}
//                 data={messages}
//                 renderItem={renderItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.messageList}
//             />
//             <View style={styles.inputContainer}>
//                 <TextInput
//                     style={styles.input}
//                     value={newMessage}
//                     onChangeText={setNewMessage}
//                     placeholder="Type a message"
//                 />
//                 <Button title="Send" onPress={sendMessage} />
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 10,
//     },
//     messageList: {
//         flex: 1,
//     },
//     myMessage: {
//         alignSelf: 'flex-end',
//         backgroundColor: '#DCF8C6',
//         padding: 10,
//         borderRadius: 5,
//         marginVertical: 5,
//     },
//     theirMessage: {
//         alignSelf: 'flex-start',
//         backgroundColor: '#ECECEC',
//         padding: 10,
//         borderRadius: 5,
//         marginVertical: 5,
//     },
//     timestamp: {
//         fontSize: 10,
//         color: 'grey',
//         textAlign: 'right',
//     },
//     inputContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 5,
//     },
//     input: {
//         flex: 1,
//         borderColor: 'gray',
//         borderWidth: 1,
//         borderRadius: 5,
//         padding: 10,
//         marginRight: 10,
//     },
// });

// export default HubScreen;
