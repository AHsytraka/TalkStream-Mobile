import { withAuthProtection } from '../../components/withAuthProtection';

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';

function NewPostScreen() {
    const [postContent, setPostContent] = useState('');

    const handleSubmit = () => {
        Alert.alert('Post Submitted', postContent);
        setPostContent('');
    };

    const handleAddPhoto = () => {
        Alert.alert('Add or Take Photo');
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                multiline
                placeholder="What's on your mind?"
                value={postContent}
                onChangeText={setPostContent}
            />
            <TouchableOpacity style={styles.photoButton} onPress={handleAddPhoto}>
                <Text style={styles.photoButtonText}>Add/Take Photo</Text>
            </TouchableOpacity>
            <Button title="Post" onPress={handleSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
    },
    input: {
        height: 150,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    photoButton: {
        backgroundColor: '#fff',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        marginTop: 10,
    },
    photoButtonText: {
        textAlign: 'center',
        color: 'black',
    },
});

export default withAuthProtection(NewPostScreen);