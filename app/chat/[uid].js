import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import axios from 'axios';
import authService from '../../services/authService';
import { useLocalSearchParams } from 'expo-router';

export default function HubScreen() {
    const params = useLocalSearchParams();
    const friendId = params.uid.toString();
    const friendUsername = params.name ? decodeURIComponent(params.name) : '';
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [connection, setConnection] = useState(null);
    const flatListRef = useRef();

    useEffect(() => {
        const initialize = async () => {
            const userData = await authService.fetchUser();
            setUser(userData);

            // Fetch chat history
            if (userData) {
                const res = await axios.get(`https://localhost:7129/PrivateChat/${userData.uid}/${friendId}/messages`);
                setMessages(res.data);
            }
        };

        initialize();
    }, []);

    useEffect(() => {
        if (user) {
            // Set up SignalR connection
            const newConnection = new HubConnectionBuilder()
                .withUrl(`https://localhost:7129/messagingHub`)
                .configureLogging(LogLevel.Information)
                .build();

            newConnection.start()
                .then(() => {
                    setConnection(newConnection);
                    newConnection.invoke("JoinChat", user.uid, friendId);

                    newConnection.on("ReceiveMessage", (senderId, username, message, timestamp) => {
                        setMessages((prevMessages) => [...prevMessages, { senderId, username, content: message, timestamp }]);
                    });
                })
                .catch((e) => console.log('Connection failed: ', e));
        }

        return () => {
            if (connection) {
                connection.invoke("LeaveChat", user.uid, friendId);
                connection.stop();
            }
        };
    }, [user]);

    const sendMessage = async () => {
        if (connection && newMessage.trim()) {
            const message = {
                content: newMessage,
                senderId: user.uid,
                receiverId: friendId,
                senderUsername: user.username,
            };

            try {
                await axios.post(`https://localhost:7129/PrivateChat/${user.uid}/${friendId}/messages`, message);
                setNewMessage('');
            } catch (e) {
                console.log('Sending message failed: ', e);
            }
        }
    };

    const renderItem = ({ item }) => (
        <View style={item.senderId === user.uid ? styles.myMessage : styles.theirMessage}>
            <Text style={styles.username}>{item.username}</Text>
            <Text>{item.content}</Text>
            <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.head}>
                <Text style={styles.headText}>{friendUsername}</Text>
            </View>
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.messageList}
                onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
                onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message"
                />
                <Button title="Send" onPress={sendMessage} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    head: {
        padding: 10,
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    messageList: {
        flex: 1,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
    },
    theirMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#ECECEC',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
    },
    timestamp: {
        fontSize: 10,
        color: 'grey',
        textAlign: 'right',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
    input: {
        flex: 1,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
    username: {
        fontWeight: '500',
    },
});
