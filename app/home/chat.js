import React, { useState } from "react";
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

const conversations = [
    { id: '1', name: 'John Doe', lastMessage: 'Hey, how are you?' },
    { id: '2', name: 'Jane Smith', lastMessage: 'Are we still on for tomorrow?' },
    { id: '3', name: 'Jane Doe', lastMessage: 'Are we still on for tomorrow?' },
    { id: '4', name: 'Janis ', lastMessage: 'Are we still on for tomorrow?' },
    { id: '5', name: 'Jordan Michael', lastMessage: 'Are we still on for tomorrow?' },
    { id: '6', name: 'J J', lastMessage: 'Are we still on for tomorrow?' },
    
  ];

export default function ChatScreen(){

    const router = useRouter();
    const [filteredData, setFilterdData] = useState(conversations);

    const renderItem = ({ item }) => (
       
            <TouchableOpacity
               onPress={() => router.push({
                pathname: `/chat/users/${item.id}`,
                params: { name: item.name, lastMessage: item.lastMessage, id: item.id }
               })}
               >
                <View style={styles.box}>
                    <Text style={styles.conversationName}>{item.name}</Text>
                    <Text style={styles.conversationMessage}>{item.lastMessage}</Text>
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
                  onPress={()=> router.push(`/chat/list/creerGroup`)}            
                  >
                </FontAwesome.Button>
              </TouchableOpacity>
              <SearchBar onSearch={handleSearch}/>
            </View>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
              style={styles.svgDecor}
            >
              <Path
                fill="#0f142b"
                fillOpacity="1"
                d="M0,224L8.9,202.7C17.8,181,36,139,53,106.7C71.1,75,89,53,107,74.7C124.4,96,142,160,160,154.7C177.8,149,196,75,213,53.3C231.1,32,249,64,267,112C284.4,160,302,224,320,250.7C337.8,277,356,267,373,250.7C391.1,235,409,213,427,218.7C444.4,224,462,256,480,234.7C497.8,213,516,139,533,96C551.1,53,569,43,587,80C604.4,117,622,203,640,218.7C657.8,235,676,181,693,176C711.1,171,729,213,747,245.3C764.4,277,782,299,800,304C817.8,309,836,299,853,288C871.1,277,889,267,907,229.3C924.4,192,942,128,960,122.7C977.8,117,996,171,1013,192C1031.1,213,1049,203,1067,181.3C1084.4,160,1102,128,1120,101.3C1137.8,75,1156,53,1173,64C1191.1,75,1209,117,1227,117.3C1244.4,117,1262,75,1280,96C1297.8,117,1316,203,1333,240C1351.1,277,1369,267,1387,234.7C1404.4,203,1422,149,1431,122.7L1440,96L1440,0L1431.1,0C1422.2,0,1404,0,1387,0C1368.9,0,1351,0,1333,0C1315.6,0,1298,0,1280,0C1262.2,0,1244,0,1227,0C1208.9,0,1191,0,1173,0C1155.6,0,1138,0,1120,0C1102.2,0,1084,0,1067,0C1048.9,0,1031,0,1013,0C995.6,0,978,0,960,0C942.2,0,924,0,907,0C888.9,0,871,0,853,0C835.6,0,818,0,800,0C782.2,0,764,0,747,0C728.9,0,711,0,693,0C675.6,0,658,0,640,0C622.2,0,604,0,587,0C568.9,0,551,0,533,0C515.6,0,498,0,480,0C462.2,0,444,0,427,0C408.9,0,391,0,373,0C355.6,0,338,0,320,0C302.2,0,284,0,267,0C248.9,0,231,0,213,0C195.6,0,178,0,160,0C142.2,0,124,0,107,0C88.9,0,71,0,53,0C35.6,0,18,0,9,0L0,0Z"
              ></Path>
            </Svg>
          </View>
          <BlurView intensity={20} tint='light' style={styles.blurView}>
            <View style={styles.bodyContent}>
                <FlatList
                    style={styles.body}
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />               
            </View>
          </BlurView>
        </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        height: '100%',
        width:'100%',
        // position: 'absolute',
        fontSize: 18,
        zIndex: 3,
        backgroundColor: '#9290c3',
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