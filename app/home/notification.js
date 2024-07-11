import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { withAuthProtection } from '../../components/withAuthProtection';
import authService from '../../services/authService';
import { getReceivedFriendRequests, respondToFriendRequest } from '../../services/friendshipService';



function PostsTab() {
  const [notifications, setNotifications] = useState([]);
  const viewPost = () => {
    router.push('../unePost');
  }

  return (
    <FlatList
      style={styles.root}
      data={notifications}
      ItemSeparatorComponent={() => {
        return <View style={styles.separator} />
      }}
      keyExtractor={item => {
        return item.id
      }}
      renderItem={item => {
        const Notification = item.item
        let attachment = <View />

        let mainContentStyle
        if (Notification.attachment) {
          mainContentStyle = styles.mainContent
          attachment = <Image style={styles.attachment} source={{ uri: Notification.attachment }} />
        }
        let bckLuNonLu = null
        if (!Notification.lu) {
          bckLuNonLu = styles.bcklu
        }
        return (
          <><TouchableOpacity style={[styles.container, bckLuNonLu]} onPress={viewPost}>
            <Image source={{ uri: Notification.image }} style={styles.avatar} />
            <View style={styles.content}>
              <View style={mainContentStyle}>
                <View style={styles.text}>
                  <Text style={styles.name}>{Notification.name}</Text>
                  <Text>{Notification.text}</Text>
                </View>
                <Text style={styles.timeAgo}>2 hours ago</Text>
              </View>
              {attachment}
            </View>
          </TouchableOpacity></>
        )
      }}
    />
  );
}

function FriendsTab() {
  const [currentUser, setCurrentUser] = useState();
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const initialize = async () => {
      const userData = await authService.fetchUser();
      if (userData && userData.uid !== currentUser?.uid) {
        setCurrentUser(userData);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const fetchRequests = async () => {
        console.log(currentUser)
        const res = await getReceivedFriendRequests(currentUser.uid);
        setFriendRequests(res);
      };
      fetchRequests();
    }
  }, [currentUser]);

  const addFriend = async (requesterId, addresseeId) => {
    const accept = true;
    await respondToFriendRequest(requesterId, addresseeId, accept);
  }

  const decline = async (requesterId, addresseeId) => {
    const accept = false;
    await respondToFriendRequest(requesterId, addresseeId, accept);
  }

  const viewProfil = () => {
  }

  return (
    <FlatList
      data={friendRequests}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.friendCard}>
          <TouchableOpacity onPress={viewProfil}>
            {/* <Image source={{ uri: item.image }} style={styles.avatar} /> */}
          </TouchableOpacity>
          <View style={styles.friendContent}>
            <Text style={styles.name}></Text>
            <Text style={styles.mutualFriends}>hello friend !</Text>
            <View row={true} style={styles.btnAmis}>

              <Pressable onPress={() => addFriend(item.requesterId, item.addresseeId)} style={styles.btnCf}>
                <Text style={{ color: 'white' }}> Confirmer</Text>
              </Pressable>

              <Pressable onPress={() => decline(item.requesterId, item.addresseeId)} style={styles.btnDel} >
                <Text>Supprimer</Text>
              </Pressable>
            </View>
          </View>
        </View>

      )}
    />
  );
}

function NotificationScreen() {
  const [selectedTab, setSelectedTab] = useState('Posts');

  return (
    <View style={styles.mainContainer}>
      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tabButton} onPress={() => setSelectedTab('Posts')}>
          <Text style={selectedTab === 'Posts' ? styles.activeTabText : styles.inactiveTabText}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => setSelectedTab('Friends')}>
          <Text style={selectedTab === 'Friends' ? styles.activeTabText : styles.inactiveTabText}>Friends</Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'Posts' ? <PostsTab /> : <FriendsTab />}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'center',
    padding: 10,
    width: '95%',
    borderRadius: 50,
    backgroundColor: '#33497B',
    marginVertical: 10,
  },
  tabButton: {
    padding: 5,
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 17,

  },
  inactiveTabText: {
    color: '#fef',
    fontSize: 16,

  },
  container: {
    padding: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#FFFFFF',
    alignItems: 'flex-start',
  },
  bcklu: {
    backgroundColor: '#EDE3EE',
  },

  text: {
    marginBottom: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  content: {
    flex: 1,
    marginLeft: 16,
    marginRight: 0,
  },
  mainContent: {
    marginRight: 60,
  },
  img: {
    height: 50,
    width: 50,
    margin: 0,
  },
  attachment: {
    position: 'absolute',
    right: 0,
    height: 50,
    width: 50,
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  timeAgo: {
    fontSize: 12,
    color: '#696969',
  },
  name: {
    fontSize: 16,
    color: '#1E90FF',
  },
  friendCard: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  notificationContent: {
    flex: 1,
    paddingLeft: 10,
  },
  friendContent: {
    flex: 1,
    paddingLeft: 10,
  },

  mutualFriends: {
    marginTop: 5,
    color: '#888',
  },
  btnAmis: {
    justifyContent: 'space-evenly'
  },
  btnCf: {
    backgroundColor: '#48469C',
    width: 100,
    paddingHorizontal: 5,
    paddingVertical: 6,
    alignItems: 'center',
    color: 'white',
    marginTop: 5,
    borderRadius: 4,

  },
  btnDel: {
    backgroundColor: 'lightgrey',
    width: 100,
    paddingHorizontal: 5,
    paddingVertical: 6,
    alignItems: 'center',
    color: 'white',
    marginTop: 5,
    borderRadius: 4,

  }
});

export default withAuthProtection(NotificationScreen)