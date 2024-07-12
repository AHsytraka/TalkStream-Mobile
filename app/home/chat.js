import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Svg, Path } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import { useRouter } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import SearchBar from "../../components/searchBar";
import authService from "../../services/authService";
import { getUsersConversation } from "../../services/conversationService";

export default function ChatScreen(){

    const router = useRouter();
    const [conversations, setConversations] = useState([]);
    const [filteredData, setFilterdData] = useState([]);
    const [user, setUser] = useState(null);


    useEffect(() => {
      const initialize = async () => {
        const userData = await authService.fetchUser();
        if (userData && userData.uid !== user?.uid) {
          setUser(userData);
        }
      };  
      initialize();
    }, []);

    useEffect(() => {
      if(user) {
        const fetchConversations = async () => {
            const conversations = await getUsersConversation(user.uid);
            setConversations(conversations);
            setFilterdData(conversations);
            console.log(conversations)
        };
        fetchConversations();
      }
    },[user])

    const renderItem = ({ item }) => (
       
            <TouchableOpacity
                onPress={() => router.push(`/chat/${item.otherUserId}`)}
               >
                <View style={styles.box}>
                    <Text style={styles.conversationName}>{item.otherUserName}</Text>
                    {/* <Text style={styles.conversationMessage}>{item.lastMessage}</Text> */}
                </View>
            </TouchableOpacity>
       
    );

    const handleSearch = (query)=>{
      const filtered = conversations.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
      setFilterdData(filtered);
    }

    return (
      <SafeAreaView>
        <View style={styles.container}>
          <View style={styles.navbar}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.userBtn}>
                <FontAwesome.Button
                  name="user" 
                  color='white' 
                  size={28}
                  backgroundColor='transparent'    
                  onPress={()=> router.push(`/chat/list/friendList`)}            
                  >
                </FontAwesome.Button>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userBtn}>
                <FontAwesome.Button
                  name="comments" 
                  color='white' 
                  size={28}
                  backgroundColor='transparent'    
                  // onPress={()=> router.push(`/chat/list/creerGroup`)}
                  onPress={()=> router.push(`/chat/createGroup`)}
                  >
                </FontAwesome.Button>
              </TouchableOpacity>
              <SearchBar onSearch={handleSearch}/>
            </View>
          </View>
          <BlurView intensity={20} tint='light' style={styles.blurView}>
            <View style={styles.bodyContent}>
                <FlatList
                    style={styles.body}
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.otherUserId}
                />               
            </View>
          </BlurView>
        </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        fontSize: 18,
    },
    navbar: {
       position: 'absolute',
       top:0,
       left: 0,
       right: 0,
    //    backgroundColor: '#eee',
       zIndex: 1000, 
    },
    navbarText: {
        color: '#ffffff',
        fontSize: 30,
        fontWeight: 'bold',
        // fontFamily: 'Arial',
        marginTop: 10,
        marginLeft: 20,
    },
    svgDecor: {
        height: 80,
    },
    header: {
       display: 'flex',
       height: 60, 
       backgroundColor: '#0f142b',
       flexDirection:'row',
    },
    body: {
        // backgroundColor: '#367',
    },
    bodyContent: {
        paddingTop: 140,
        // backgroundColor: '#445'
        display: 'flex',
        alignItems: 'center',
    },
    box: {
        height: 60,
        width: 352,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 10,
        marginBottom: 3,
        // marginStart: 1,
        paddingStart: 6,
        // elevation: 10,
    },
    conversationName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    conversationMessage: {
        fontSize: 16,
        color: '#555',
    },
    bgImage: {
        height: '100%',
        width: 360,
        expectRatio: 1,
        zIndex: 1,
    },
    userBtn: {
      width: 50,
      alignItems: 'center',
    },
    blurView: {
      flex: 1, 
      height: 200,
    },
})