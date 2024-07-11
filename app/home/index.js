import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { withAuthProtection } from '../../components/withAuthProtection';
import { Octicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import PostCard from '../../components/postCard';
import axios from 'axios';

function HomeScreen() {
    const [publications, setPublications] = useState([]);

    useEffect(() => {
        const fetchPubs = async () => {
            try {
                const res = await axios.get('https://localhost:7129/Publications')
                setPublications(res.data)
            } catch (e) {
                console.error(e);
            }
        }

        fetchPubs();
    }, [publications])

    const renderItem = ({ item }) => (
        <PostCard post={item} />
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text>TS</Text>
                <View style={styles.header}>
                    <Link href="/newpost">
                        <Octicons name="diff-added" size={32} color='gray' />
                    </Link>
                    <Link href="/search">
                        <Octicons name="search" size={32} color='gray' />
                    </Link>
                    {/* <Link href="/home/chat">
                    <FontAwesome5 name="comments" size={32} color='gray' />
                    </Link> */}
                </View>
            </View>
            
            <View style={styles.messContainer}>
                <FlatList
                    data={publications}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1
    },
    header: {
        display: 'flex',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8f8f8',
    },
    messContainer: {
        flex:1,
        margin: 15
    },
});

export default withAuthProtection(HomeScreen)