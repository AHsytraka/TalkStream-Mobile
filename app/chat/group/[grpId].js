import React, { useState, useCallback, useEffect, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { GiftedChat, Bubble, InputToolbar, Composer } from "react-native-gifted-chat";
import { ActionSheetProvider, useActionSheet } from "@expo/react-native-action-sheet";
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';

const Chat = () => {
    const router = useRouter();
    const { id, name, members} = useLocalSearchParams();
    const [messages, setMessages] = useState([]);
    const { showActionSheetWithOptions } = useActionSheet();
    const actionSheetRef = useRef(null);
    const [actionOptions, setActionOptions] = useState([]);
    const [cancelButtonIndex, setCancelButtonIndex] = useState(0);

    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: 'lastMessage',
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
                    _id: 3,
                    name: 'lara jean',
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
    }, [name]);

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    }, []);

    const onLongPress = (context, message) => {
        if (message.user._id !== 1) return;

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
                    <MaterialIcons style={styles.actionButton} name="attach-file" size={25} color="purple"/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
                    <MaterialIcons name="photo" size={25} color="purple"/>
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
                        backgroundColor: 'purple',                      
                    },
                    left: {
                        backgroundColor: '#fce2db',
                    }
                }}
                textStyle={{
                    right: {
                        color: 'white',
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
                    borderTopColor: 'purple',
                    // borderRadius: 10,
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
                    color: 'black',
                    backgroundColor: 'white',
                    borderRadius: 20,
                    padding: 10,
                    marginLeft: 0,
                    marginRight: 0,
                }}
            />
        );
    };

    const showMenuOptions = () => {
        const options = ['Quitter le groupe', 'Ajouter un membre'];
        if (1 === 1) { 
            options.push('Supprimer le groupe', 'Retirer');
        }
        options.push('Cancel');
        const cancelButtonIndex = options.length - 1;

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'bold',
                },
                titleTextStyle: {
                    color: '#007bff',
                },
                destructiveButtonIndex: -1,
            },
            buttonIndex => {
                switch (options[buttonIndex]) {
                    case 'Quitter le groupe':
                        leaveGroup();
                        break;
                    case 'Ajouter un membre':
                        addMember();
                        break;
                    case 'Supprimer le groupe':
                        deleteGroup();
                        break;
                    case 'Retirer':
                        removeMember();
                        break;
                }
            }
        );
    };

    // const showMenuOptions = () => {
    //     const options = ['Leave Group', 'Add Member'];
    //     if (1 === 1) { // replace 1 with the current user's id
    //         options.push('Delete Group', 'Remove Member');
    //     }
    //     options.push('Cancel');
    //     const cancelButtonIndex = options.length - 1;

    //     setActionOptions(options);
    //     setCancelButtonIndex(cancelButtonIndex);
    //     actionSheetRef.current.show();
    // };

    // const handleMenuOption = (index) => {
    //     switch (actionOptions[index]) {
    //         case 'Leave Group':
    //             leaveGroup();
    //             break;
    //         case 'Add Member':
    //             addMember();
    //             break;
    //         case 'Delete Group':
    //             deleteGroup();
    //             break;
    //         case 'Remove Member':
    //             removeMember();
    //             break;
    //     }
    // };

    const leaveGroup = () => {
        // Logic to leave group
        console.log('Leave Group');
    };

    const addMember = () => {
        // Logic to add a member
        console.log('Add Member');
    };

    const deleteGroup = () => {
        // Logic to delete the group
        console.log('Delete Group');
    };

    const removeMember = () => {
        // Logic to remove a member
        console.log('Remove Member');
    };


    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.menuButton} onPress={showMenuOptions}>
                <MaterialIcons name="menu" size={25} color="purple" />
            </TouchableOpacity>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                onLongPress={onLongPress}
                user={{
                    _id: 1,
                    name: 'Current User',
                }}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolBar}
                renderComposer={renderComposer}
            />
            {/* <ActionSheet
                ref={actionSheetRef}
                options={actionOptions}
                cancelButtonIndex={cancelButtonIndex}
                destructiveButtonIndex={actionOptions.indexOf('Delete Group')}
                onPress={handleMenuOption}
                styles={actionSheetStyles}
                useNativeDriver={true}
            /> */}
        </View>
    );
};

export default function GroupChat() {
    return (
        <ActionSheetProvider>
            <Chat/>
        </ActionSheetProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    actionButton: {
        padding: 5,
    },
    actionButtonText: {
        color: 'purple',
    },
    menuButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
    },
});

const actionSheetStyles = {
    titleBox: {
        backgroundColor: '#f7f7f7',
    },
    titleText: {
        color: '#333',
        fontSize: 16,
    },
    messageBox: {
        backgroundColor: '#f7f7f7',
    },
    messageText: {
        color: '#333',
        fontSize: 14,
    },
    buttonBox: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        borderTopLeftRadius: 15,  // Ajouter bord arrondi en haut à gauche
        borderTopRightRadius: 15, // Ajouter bord arrondi en haut à droite
    },
    buttonText: {
        color: '#333',
        fontSize: 18,
    },
    cancelButtonBox: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        borderTopLeftRadius: 15,  // Ajouter bord arrondi en haut à gauche
        borderTopRightRadius: 15, // Ajouter bord arrondi en haut à droite
    },
    cancelButtonText: {
        color: '#333',
        fontSize: 18,
    },
};
