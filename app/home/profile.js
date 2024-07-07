import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultPic = 'https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg';

function ProfileScreen() {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const userData = await AsyncStorage.getItem('userData');
    setUser(JSON.parse(userData));
  }

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) {
    return <View style={styles.container}><Text>Loading...</Text></View>
    ;
  }

  return (
    <View style={styles.profileContainer}>
      <View style={styles.profilePictureContainer}>
        <Image source={defaultPic} style={styles.profilePicture} />
      </View>
      <Text style={styles.username}>{user.username}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  profilePictureContainer: {
    height: 120,
    width: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 20,
  },
  profilePicture: {
    height: '100%',
    width: '100%',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;