import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { GiftedChat, Bubble, InputToolbar, Composer } from "react-native-gifted-chat";
import { ActionSheetProvider, useActionSheet } from "@expo/react-native-action-sheet";
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';

const Chat = () => {
    const router = useRouter();
    const { id, name, lastMessage} = useLocalSearchParams();
    const [messages, setMessages] = useState([]);
    const { showActionSheetWithOptions } = useActionSheet();

    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: lastMessage,
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: name,
                },
            },
            {
                _id: 2,
                text: 'Hello, how are you?',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 jour auparavant
                user: {
                    _id: 1,
                    name: 'Current User',
                },
            },
            {
                _id: 3,
                text: 'I am fine, thank you!',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 - 1000 * 60 * 5), // 1 jour et 5 minutes auparavant
                user: {
                    _id: 2,
                    name: name,
                },
            },
            {
                _id: 4,
                text: 'What about you?',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 - 1000 * 60 * 10), // 1 jour et 10 minutes auparavant
                user: {
                    _id: 2,
                    name: name,
                },
            },
        ]);
    }, [lastMessage, name]);

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    }, []);

    const onLongPress = (context, message) => {
        const options = ['Delete Message', 'Cancel'];
        const cancelButtonIndex = 1;

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            buttonIndex => {
                if (buttonIndex === 0) {
                    deleteMessage(message._id);
                }
            },
        );
    };

    const deleteMessage = messageId => {
        setMessages(previousMessages =>
            previousMessages.filter(message => message._id !== messageId)
        );
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({});
            if (result.type === "success"){
                const message = {
                    _id: Math.random().toString(36).substring(7),
                    text: '',
                    createdAt: new Date(),
                    user: {
                        _id: 1,
                        name: 'Current User',
                    },
                    file: {
                        uri: result.uri,
                        name: result.name,
                        type: result.mimeType,
                    },
                };
                onSend([message]);
            }
        } catch( err ){
            console.log(err);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            // aspect: [4, 3],
            quality: 1,
        });
        if(!result.canceled){
            const message = {
                _id: Math.random().toString(36).substring(7),
                text: '',
                createdAt: new Date(),
                user: {
                    _id: 1,
                    name: 'Current user'
                },
                image: result.assets[0].uri,
            };
            onSend([message]);
        }
    };

    const renderActions = (props) =>{
        return (
            <View style={styles.actionsContainer} >
                <TouchableOpacity onPress={pickDocument}>
                    <MaterialIcons style={styles.actionButton} name="attach-file" size={25} color="#0f142b"/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
                    <MaterialIcons name="photo" size={25} color="#0f142b"/>
                </TouchableOpacity>
            </View>
        );
    };

    const renderBubble = (props)=> {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',                      
                    },
                    left: {
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    }
                }}
                textStyle={{
                    right: {
                        color: 'black',
                    },
                    left: {
                        color: 'black',
                    }
                }}
            />
        );
    };

    const renderInputToolBar = (props)=>{
        return (
            <InputToolbar
                {...props}
                containerStyle={{
                    borderTopWidth: 1.5,
                    borderTopColor: '#0f142b',
                    padding: 2,
                }}
                renderActions={renderActions}
            />
        )
    };

    const renderComposer = (props)=> {
        return (
            <Composer
                {...props}
                textInputStyle={{
                    color: 'white',
                    backgroundColor: '#0f142b',
                    borderRadius: 20,
                    padding: 10,
                    marginLeft: 0,
                    marginRight: 0,
                }}
            />
        );
    };

    return (
        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                onLongPress={onLongPress}
                user={{
                    _id: 1,
                    name: 'Current User',
                    // avatar: 'https://placeimg.com/140/140/any',
                }}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolBar}
                renderComposer={renderComposer}
            />
        </View>
    );
};

export default function Message() {
    return (
        <ActionSheetProvider>
            <Chat />
        </ActionSheetProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#9290c3',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 4,
        
    },
    actionButton: {
        padding: 5,
        paddingBottom: 10,
    },
    actionButtonText: {
        color: 'purple',
    }
});
