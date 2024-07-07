import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity } from 'react-native';
import { withAuthProtection } from '../../components/withAuthProtection';
import { Octicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import PostCard from '../../components/postCard';

function HomeScreen() {

    const post = {
        postId: 1,
        userId:1,
        postContent: 'This is a post',
        postDate: '2021-09-01',
        postLikes: 0,
        postComments: 0,
    }

    return (
        <View>
            <View style={styles.header}>
                <Text>TS</Text>
                <View style={styles.header}>
                    <Link href="/newpost">
                        <Octicons name="diff-added" size={32} color='gray' />
                    </Link>
                    <Link href="/search">
                        <Octicons name="search" size={32} color='gray' />
                    </Link>
                </View>
            </View>

            <View style={styles.container}>
                <PostCard post={post}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        display: 'flex',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8f8f8',
    },
    container: {
        margin: 10,
        display: 'flex',
        flexDirection: 'column',
    },
});

export default withAuthProtection(HomeScreen)