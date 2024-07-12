import React, { useEffect, useState } from "react";
import { StyleSheet, View,Text, Pressable, Button } from "react-native";
import { withAuthProtection } from "../../components/withAuthProtection";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import authService from "../../services/authService";
import { getAllFriends, sendFriendRequest } from "../../services/friendshipService";

function SearchResultScreen() {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [friends, setFriends] = useState([]);

    const searchParams = useLocalSearchParams();
    const username = searchParams.username;

    useEffect(() => {
        const initialize = async () => {
            const userData = await authService.fetchUser(); // Use fetchUser from authService
            setCurrentUser(userData);
        }
        
        initialize();
        getUsersWithUsername();
    }, [username]);

    useEffect(() => {
        if (currentUser) {
            console.log(currentUser)
            fetchFriends(currentUser.uid)
        }
    }, [currentUser]);

        
    const getUsersWithUsername = async () => {
        try {
            const response = await axios.get(`https://localhost:7129/Search/ByUsername?username=${username}`);            
            console.log(response.data);
            setUsers(response.data);
        } catch(e)
        {
            console.error(e);
        }
    }

    const fetchFriends = async (uid) => {
        const res = await getAllFriends(uid);
        setFriends(res);
    };

    const isUserAFriend = (userUid) => {
        return friends.some(friend => friend.uid === userUid);
    };

    return (
        <View style={styles.container}>
            <View style={styles.head}>
                <Text>Resultat pour {username}</Text>
            </View>
            {users.map((user, index) => (
                <View key={index} style={styles.userContainer}>
                    <Text style={styles.userName}>{user.username}</Text>
                    {isUserAFriend(user.uid) ? (
                        <Text>Ami(e)</Text>
                        ) : (
                            <Pressable style={styles.button} onPress={() => sendFriendRequest(currentUser.uid, user.uid)}>
                                <Text style={styles.buttonText}>Ajouter</Text>
                            </Pressable>
                        )
                    }
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    head: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        width: '100%',
        borderColor: '#dddddd',
        borderRadius: 5,
        textAlign: 'center',
        
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    userContainer: {
        width:'80%',
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#dddddd',
        borderRadius: 5,
    },
    userName: {
        fontSize: 16,
        color: '#333333',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        marginVertical: 5,
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 16,
        color: '#ffffff',
    },
});

export default withAuthProtection(SearchResultScreen);