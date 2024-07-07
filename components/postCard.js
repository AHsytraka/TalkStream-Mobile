import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

function PostCard({ post }) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <FontAwesome name="user-circle-o" size={24} color="gray" />
                <Text style={styles.posterName}>Poster's Name</Text>
            </View>
            <View style={styles.content}>
                <Text>{post.postContent}</Text>
                <Text style={styles.postDate}>{post.postDate}</Text>
            </View>
            <View style={styles.footer}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <AntDesign name="hearto" size={24} color="gray" />
                    <Text>{post.postLikes}</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <MaterialCommunityIcons name="comment-multiple" size={24} color="gray" />
                    <Text>{post.postComments}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    posterName: {
        marginLeft: 10,
        fontWeight: 'bold',
    },
    content: {
        marginBottom: 5,
    },
    postDate: {
        fontSize: 12,
        color: 'grey',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
});

export default PostCard;