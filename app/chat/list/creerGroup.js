import React, {useState, useEffect} from "react";
import { StyleSheet, View, Text, FlatList, Button, TextInput, TouchableOpacity } from "react-native";
import CheckBox from 'expo-checkbox';
import { useRouter } from "expo-router";
import SearchBar from "../../../components/searchBar";
import authService from "../../../services/authService";
import { getAllFriends } from "../../../services/friendshipService";


export default function CreerGroup(){
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [ groupName, setGroupName] = useState(''); 
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState();

    const router = useRouter();
    
    const [filteredData, setFilterdData] = useState([]);

    useEffect(() => {
      const initialize = async () => {
          const userData = await authService.fetchUser(); // Use fetchUser from authService
          setUser(userData);
      }

      initialize();
  }, []);

  useEffect(() => {
      if (user) {
          fetchFriends(user.uid);
      }
  }, [user])

  const fetchFriends = async (uid) => {
      const res =  await getAllFriends(uid);
      setUsers(res);
      setFilterdData(res);
  };

    const handleSearch = (query)=>{
      const filtered = users.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
      setFilterdData(filtered);
    }

    const toggleSelection = (userId) => {
        setSelectedUsers((prevSelectedUsers) => {
          if (prevSelectedUsers.includes(userId)) {
            return prevSelectedUsers.filter((id) => id !== userId);
          } else {
            return [...prevSelectedUsers, userId];
          }
        });
      };

    const handleAdd = () => {
        console.log('Selected Users:', selectedUsers);
        router.push({
          pathname: `../group/1`,
          params: {name: groupName, members: selectedUsers, id: user.uid},
        })
      };

    const renderItem = ({ item }) => {
        const isSelected = selectedUsers.includes(item.uid);
        const initials = item.name.split(' ').map((part) => part[0]).join('');
    
        return (
          <View style={styles.itemContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <Text style={styles.name}>{item.name}</Text>
            <CheckBox
              value={isSelected}
              onValueChange={() => toggleSelection(item.uid)}
              color={isSelected ? '#4630EB' : undefined}
              style={styles.CheckBox}
            />
          </View>
        );
      };

    const handleChange = (text)=>{
      setGroupName(text);
    };

    return (
        <View style={styles.container}>
          <View style={styles.search}>
            <SearchBar onSearch={handleSearch}/>
          </View>
          
            <TextInput
              style={styles.groupNameInput}
              onChangeText={handleChange}
              value={groupName}
              placeholder="Nom du groupe ... "
            />
            <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item) => item.uid}
            />
            <TouchableOpacity style={styles.Addbtn} onPress={handleAdd}>
              <Text style={styles.btnText}>AJOUTER</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        fontSize: 18,
        backgroundColor:'#9290c3',
        // alignItems: 'center',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor:'rgba(255, 255, 255, 0.5)',
        paddingRight: 20,
        paddingLeft: 5,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#545e92',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    avatarText: {
      color: 'white',
      fontWeight: 'bold',
      // fontSize: 30,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    groupNameInput: {
      height: 40,  
      padding: 10,
      marginTop: 5,
      borderBottomColor: '#0f142b',
      borderBottomWidth: 3,
    },
    Addbtn: {
      textAlign: 'center',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      height: 40,
      backgroundColor: '#0f142b',
    },
    btnText: {
      color: 'white',
      paddingTop: 6,
      fontSize: 20,
      fontWeight: 'bold',
    },
    CheckBox: {
      marginLeft: 'auto',
    },
    search: {
      marginLeft: 50,
      marginTop: 3,
    }
})