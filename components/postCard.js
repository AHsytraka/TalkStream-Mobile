import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome, AntDesign, Octicons } from '@expo/vector-icons';
import { addComment, addReaction } from '../services/postService';
import authService from '../services/authService';

function PostCard({ post }) {
    const [user, setUser] = useState();
    const [isReacted, setIsReacted] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [comments, setComments] = useState(post.comments);
    const [commentText, setCommentText] = useState('');
    const [reactions, setReactions] = useState(post.reactions);

    useEffect(() => {
        const initialize = async () => {
            const userData = await authService.fetchUser();
            setUser(userData);
            setIsReacted(post.reactions.some(reaction => reaction.userId === userData.uid));
        }
        initialize();
    }, [post.reactions]);

    const handleReaction = async () => {
        const reactionData = { userId: user.uid, type: 'Love' };
        const reaction = await addReaction(post.id, reactionData);
        setReactions([...reactions, reaction]);
        setIsReacted(true);
    };

    const handleComment = async () => {
        const commentData = { userId: user.uid, content: commentText };
        const comment = await addComment(post.id, commentData);
        setComments([...comments, comment]);
        setCommentText('');
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        return new Intl.DateTimeFormat('fr-FR', options).format(date);
    };

    return (
        <ScrollView>
            <View style={styles.card}>
                <View style={styles.header}>
                    <FontAwesome name="user-circle-o" size={24} color="gray" />
                    <Text style={styles.posterName}>{post.sender.username}</Text>
                </View>
                <Text style={styles.postDate}>{formatDate(post.timestamp)}</Text>
                <View style={styles.content}>
                    <Text>{post.content}</Text>
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={handleReaction}>
                        <AntDesign name={isReacted ? "heart" : "hearto"} size={24} color={isReacted ? "red" : "gray"} />
                        <Text>{reactions.length}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setModalVisible(true)}>
                        <Octicons name="comment-discussion" size={24} color="gray" />
                        <Text>{comments.length}</Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                        <View style={styles.modalOverlay}>
                            <TouchableWithoutFeedback>
                                <View style={styles.modalView}>
                                    <Text style={styles.modalTitle}>Comments</Text>
                                    <ScrollView>
                                        {comments.map(comment => (
                                            <View key={comment.id} style={styles.comment}>
                                                <Text style={styles.commentUser}>{comment.user}</Text>
                                                <Text>{comment.content}</Text>
                                                <Text style={styles.commentDate}>{formatDate(comment.timestamp)}</Text>
                                            </View>
                                        ))}
                                    </ScrollView>
                                    <View style={styles.inputRow}>
                                        <TextInput
                                            style={styles.input}
                                            value={commentText}
                                            onChangeText={setCommentText}
                                            placeholder="Add a comment"
                                        />
                                        <Button title="Submit" onPress={handleComment} />
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        </ScrollView>
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalView: {
        backgroundColor: 'white',
        padding: 20,
        height: '75%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    comment: {
        marginBottom: 10,
    },
    commentUser: {
        fontWeight: 'bold',
    },
    commentDate: {
        fontSize: 12,
        color: 'grey',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginRight: 10,
        paddingLeft: 8,
    },
});

export default PostCard;
