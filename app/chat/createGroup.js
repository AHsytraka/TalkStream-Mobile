import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import authService from '../../services/authService';
import { getAllFriends } from '../../services/friendshipService';

const CreateGroup = () => {
    const [user, setUser] = useState(null);
    const [friends, setFriends] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [selectedFriends, setSelectedFriends] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const initialize = async () => {
            const userData = await authService.fetchUser();
            setUser(userData);
        };

        initialize();
    }, []);

    useEffect(() => {
        if (user) {
            const fetchFriend = async () => {
                const friendsData = await getAllFriends(user.uid);
                setFriends(friendsData);
            }
            fetchFriend();
        }
    }, [user]);

    const handleCreateGroup = async () => {
        if (groupName && user) {
            try {
                const response = await axios.post('https://localhost:7129/Group', {
                    name: groupName,
                    creatorId: user.uid
                });

                const groupId = response.data.id;
                for (const friend of selectedFriends) {
                    await axios.post(`https://localhost:7129/Group/${groupId}/addUser`, {
                        userId: friend.uid
                    });
                }

                router.push(`/chat/groupChat/${groupId}`);
            } catch (error) {
                console.error('Error creating group:', error);
            }
        }
    };

    const toggleSelectFriend = (friend) => {
        setSelectedFriends((prevSelectedFriends) =>
            prevSelectedFriends.includes(friend)
                ? prevSelectedFriends.filter((f) => f.uid !== friend.uid)
                : [...prevSelectedFriends, friend]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Groupe de discussion</Text>
            <TextInput
                style={styles.input}
                placeholder="Nom du groupe"
                value={groupName}
                onChangeText={setGroupName}
            />
            <Text style={styles.subtitle}>Ajouter des amis</Text>
            <FlatList
                data={friends}
                keyExtractor={(item) => item.uid}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => toggleSelectFriend(item)}>
                        <View style={styles.checkboxContainer}>
                            <View style={[styles.checkbox, selectedFriends.includes(item) && styles.checkboxSelected]} />
                            <Text style={styles.friendName}>{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                style={styles.friendsList}
            />
            <TouchableOpacity style={styles.createButton} onPress={handleCreateGroup}>
                <Text style={styles.createButtonText}>Create Group</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
        borderRadius: 5,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    friendsList: {
        flex: 1,
        marginBottom: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 10,
    },
    checkboxSelected: {
        backgroundColor: 'blue',
    },
    friendName: {
        fontSize: 16,
    },
    createButton: {
        backgroundColor: 'blue',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 5,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default CreateGroup;
