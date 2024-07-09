import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Text, TextInput, FlatList } from 'react-native';
import { withAuthProtection } from '../../components/withAuthProtection';
import axios from 'axios';
import {useRouter, router } from 'expo-router';

function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);


  const debounce = (func, wait)=> {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const searchUser = async () => {
    try {
      const response = await axios.get(`https://localhost:7129/Search/${searchQuery}`);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const debouncedSearchUser = useCallback(debounce(searchUser, 100), [searchQuery]);

  useEffect(() => {
    if(searchQuery.trim()) {
      debouncedSearchUser();
    } else {
      setUsers([]);
    }
  },[searchQuery, debouncedSearchUser]);

  const toSearchResult = (username) => {
    router.navigate(`/search/${username}`)
  }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <FlatList 
              data={users}
              keyExtractor={item => item.uid.toString()}
              renderItem={({ item }) => 
                  <Text onPress={() => toSearchResult(item.username)}>{item.username}</Text> 
              }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
    },
    searchBar: {
      height: 40,
      width: '80%',
      margin: 10,
      borderWidth: 1,
      padding: 10,
      borderRadius: 5
    }
  });

export default withAuthProtection(SearchScreen)