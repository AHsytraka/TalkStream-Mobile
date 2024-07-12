import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from "react-native";
import { router, useRouter } from "expo-router";
import SearchBar from "../../../components/searchBar";
import authService from "../../../services/authService";
import { getAllFriends } from "../../../services/friendshipService";


const getInitials = (name) => {
    return name.split(' ').map((word) => word[0]).join('');
};

const UserItem = ({ uid, name }) => (
    <TouchableOpacity
    onPress={() => router.push(`/chat/${uid}?name=${encodeURIComponent(name)}`)}
    style={styles.userContainer}>
        <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(name)}</Text>
        </View>
        <Text style={styles.nameText}>{name}</Text>
    </TouchableOpacity>
);

export default function FriendList() {
    const [currentUser, setCurrentUser] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const initialize = async () => {
            const userData = await authService.fetchUser(); // Use fetchUser from authService
            setCurrentUser(userData);
        }

        initialize();
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchFriends(currentUser.uid);
        }
    }, [currentUser])

    const fetchFriends = async (uid) => {
        const res =  await getAllFriends(uid);
        setContacts(res);
        setFilteredData(res);
    };

    const handleSearch = (query) => {
        if (!query.trim()) {
            setFilteredData(contacts);
            return;
        }
        const filtered = contacts.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
        setFilteredData(filtered);
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <SearchBar onSearch={handleSearch} style={styles.search} />
            </View>
            <View style={styles.header}>
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.uid}
                    renderItem={({ item }) => <UserItem name={item.name} uid={item.uid} />}
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        fontSize: 18,
        alignItems: 'center',
    },
    header: {
        display: 'flex',
        width: '100%',
        backgroundColor: '#fcfcfc',
        flexDirection: 'row',
    },
    userContainer: {
        flex: 1,
        justifyContent:'center',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 10,
        marginBottom: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1B1A55',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    avatarText: {
        color: '#fff',
        fontSize: 16,
    },
    nameText: {
        fontSize: 18,
        textAlign:'center'
    },
    search: {
        backgroundColor: 'rgb(255, 255, 255)',
        width: '100%'
    }
})