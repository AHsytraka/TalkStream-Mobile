import React, {useState} from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { MaterialIcons} from '@expo/vector-icons';

export default function SearchBar({ onSearch }){
    const [search, setSearch] = useState('');

    const handleSearch = () => {
        if(onSearch){
            onSearch(search);
        }
    }

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="rechercher ..."
                onChangeText={setSearch}
                onChange={handleSearch}
                style={styles.searchInput}
            />
            <MaterialIcons
                name="search"
                size={24}
                color="grey"
                style={styles.searchIcon}
                onPress={handleSearch}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:'#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        position: 'relative',
        width: 250,
        height: 50,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        padding: 10,
        paddingLeft: 35,
        // width: 100,
    },
    searchIcon: {
        position: 'absolute',
        left: 10,
        top: 14,
    }
})