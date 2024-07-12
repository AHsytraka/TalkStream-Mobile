import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as SignalR from '@microsoft/signalr';
import authService from '../../../services/authService';
import axios from 'axios';

const GroupChat = () => {
    const { groupId } = useLocalSearchParams();
    // const groupName = params.name ? decodeURIComponent(params.name) : '';
    const [user, setUser] = useState();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [connection, setConnection] = useState(null);

    useEffect(() => {
        const initialize = async () => {
            const userData = await authService.fetchUser();
            setUser(userData);

            const connection = new SignalR.HubConnectionBuilder()
                .withUrl('https://localhost:7129/groupHub')
                .withAutomaticReconnect()
                .build();

            connection.on('ReceiveMessage', (userId, username, content, timestamp) => {
                setMessages((prevMessages) => [...prevMessages, { userId, username, content, timestamp }]);
            });

            await connection.start();
            await connection.invoke('JoinGroup', groupId);

            // Fetch message history
            const response = await axios.get(`https://localhost:7129/Group/${groupId}/messages`);
            const messageHistory = response.data;
            setMessages(messageHistory);

            setConnection(connection);
        };

        initialize();

        return () => {
            if (connection) {
                connection.stop();
            }
        };
    }, [groupId]);

    const handleSendMessage = async () => {
        if (message && user) {
            try {
                const timestamp = new Date().toISOString();
                await connection.invoke('SendMessage', groupId, user.uid, user.username, message, timestamp);
                setMessage('');
            } catch (e) {
                console.log(e);
            }
        }
    };

    const renderMessage = ({ item }) => (
        <View
            style={[
                styles.messageContainer,
                item.userId === user?.uid ? styles.sentMessage : styles.receivedMessage,
            ]}
        >
            <Text style={styles.senderName}>{item.username}</Text>
            <Text style={styles.messageText}>{item.content}</Text>
            <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.head}>
                {/* <Text style={styles.headText}>{groupName}</Text> */}
            </View>
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderMessage}
                style={styles.messagesList}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message"
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                    <Text style={styles.sendButtonText}>Envoyer</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },

    head: {
        padding: 10,
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },

    title: {
        fontSize: 24,
        marginBottom: 10,
    },
    messagesList: {
        flex: 1,
        marginBottom: 20,
    },
    messageContainer: {
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        maxWidth: '80%', // Ensures messages don't take up the full width
    },
    sentMessage: {
        backgroundColor: '#dcf8c6',
        alignSelf: 'flex-end',
    },
    receivedMessage: {
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
    },
    senderName: {
        fontSize: 16,
    },
    messageText: {
        fontSize: 16,
    },
    timestamp: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#4caf50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default GroupChat;
