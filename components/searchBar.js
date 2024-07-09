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
        flex:1,
        width:50,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor:'white',
        borderRadius: 10,
    },

    searchInput: {
        flex: 1,
        fontSize: 16,
        padding: 10,
        width: '100%',
        height: 50,
        // width: 100,
    },
    searchIcon: {
        paddingLeft:15,
    }
})