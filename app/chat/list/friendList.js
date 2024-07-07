import React, { useState } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import SearchBar from "../../../components/searchBar";

const users = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'James Bond' },
    { id: '4', name: 'Alice Johnson' },
    { id: '5', name: 'Robert Brown' },
    { id: '6', name: 'Michael Davis' },
    { id: '7', name: 'Jennifer Wilson' },
    { id: '8', name: 'William Martinez' },
    { id: '9', name: 'Linda Anderson' },
    { id: '10', name: 'David Thomas' },
    { id: '11', name: 'Barbara Jackson' },
    { id: '12', name: 'Richard White' },
    { id: '13', name: 'Susan Harris' },
    { id: '14', name: 'Joseph Clark' },
    { id: '15', name: 'Sarah Lewis' },
    { id: '16', name: 'Thomas Robinson' },
    { id: '17', name: 'Karen Walker' },
    { id: '18', name: 'Charles Young' },
    { id: '19', name: 'Lisa Allen' },
    { id: '20', name: 'Daniel King' },
    { id: '21', name: 'Nancy Wright' },
    { id: '22', name: 'Paul Scott' },
    { id: '23', name: 'Betty Green' },
    { id: '24', name: 'Mark Adams' },
    { id: '25', name: 'Sandra Baker' },
    { id: '26', name: 'Steven Nelson' },
    { id: '27', name: 'Ashley Hill' },
    { id: '28', name: 'George Campbell' },
    { id: '29', name: 'Deborah Mitchell' },
    { id: '30', name: 'Kenneth Carter' },
    { id: '31', name: 'Laura Roberts' },
    { id: '32', name: 'Brian Phillips' },
    { id: '33', name: 'Carol Evans' },
    { id: '34', name: 'Kevin Turner' },
    { id: '35', name: 'Helen Parker' },
    { id: '36', name: 'Edward Collins' },
    { id: '37', name: 'Sharon Edwards' },
    { id: '38', name: 'Ronald Stewart' },
    { id: '39', name: 'Michelle Sanchez' },
    { id: '40', name: 'Anthony Morris' },
    { id: '41', name: 'Jessica Rogers' },
    { id: '42', name: 'Jason Reed' },
    { id: '43', name: 'Sarah Cook' },
    { id: '44', name: 'Timothy Morgan' },
    { id: '45', name: 'Margaret Bell' },
    { id: '46', name: 'Matthew Murphy' },
    { id: '47', name: 'Dorothy Bailey' },
    { id: '48', name: 'Joshua Rivera' },
    { id: '49', name: 'Amy Cooper' },
    { id: '50', name: 'Larry Richardson' },
    { id: '51', name: 'Rebecca Cox' },
    { id: '52', name: 'Scott Howard' },
    { id: '53', name: 'Laura Ward' },
    { id: '54', name: 'Eric Torres' },
    { id: '55', name: 'Kathleen Peterson' },
    { id: '56', name: 'Gary Gray' },
    { id: '57', name: 'Shirley Ramirez' },
    { id: '58', name: 'Ryan James' },
    { id: '59', name: 'Maria Watson' },
    { id: '60', name: 'Nicholas Brooks' },
    { id: '61', name: 'Dorothy Kelly' },
    { id: '62', name: 'Frank Foster' },
    { id: '63', name: 'Emma Sanders' },
    { id: '64', name: 'Jonathan Price' },
    { id: '65', name: 'Victoria Bennett' },
    { id: '66', name: 'Raymond Wood' },
    { id: '67', name: 'Alexis Barnes' },
    { id: '68', name: 'Gregory Powell' },
    { id: '69', name: 'Megan Ross' },
    { id: '70', name: 'Samuel Perry' },
    { id: '71', name: 'Kimberly Patterson' },
    { id: '72', name: 'Patrick Hughes' },
    { id: '73', name: 'Crystal Simmons' },
    { id: '74', name: 'Stephen Butler' },
    { id: '75', name: 'Katherine Foster' },
    { id: '76', name: 'Jeffrey Gonzalez' },
    { id: '77', name: 'Janet Bryant' },
    { id: '78', name: 'Brandon Alexander' },
    { id: '79', name: 'Christine Russell' },
    { id: '80', name: 'Dennis Griffin' },
    { id: '81', name: 'Diane Diaz' },
    { id: '82', name: 'Jerry Hayes' },
    { id: '83', name: 'Judy Morales' },
    { id: '84', name: 'Aaron Cox' },
    { id: '85', name: 'Carolyn Richardson' },
    { id: '86', name: 'Walter Coleman' },
    { id: '87', name: 'Rachel Coleman' },
    { id: '88', name: 'Henry Henderson' },
    { id: '89', name: 'Anna Jenkins' },
    { id: '90', name: 'Douglas Perry' },
    { id: '91', name: 'Kathryn West' },
    { id: '92', name: 'Jack Long' },
    { id: '93', name: 'Doris Spencer' },
    { id: '94', name: 'Brian Ward' },
    { id: '95', name: 'Debra West' },
    { id: '96', name: 'Roger Sullivan' },
    { id: '97', name: 'Janice Gonzales' },
    { id: '98', name: 'Gerald Howard' },
    { id: '99', name: 'Marie Reynolds' },
    { id: '100', name: 'Carl Sanders' },
  ];
  
const getInitials = (name)=>{
    return name.split(' ').map((word)=> word[0]).join('');
};

const UserItem = ({name})=>(
    <View style={styles.userContainer}>
        <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(name)}</Text>
        </View>
        <Text style={styles.nameText}>{name}</Text>
    </View>
);

export default function FriendList(){

    const [filteredData, setFilterdData] = useState(users);
    const router = useRouter();

    const handleSearch = (query)=>{
        const filtered = users.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
        setFilterdData(filtered);
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.search}>
                <SearchBar onSearch={handleSearch}/>
            </View>
            <TouchableOpacity
                onPress={() => {router.push({
                    pathname: `/users/${filteredData.id}`,
                    params: { name: filteredData.name, lastMessage: 'last', id: filteredData.id }
                   });
                   console.log(filteredData.name)
                }
                }
            >
                <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <UserItem name={item.name} />}
            />
            </TouchableOpacity>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        fontSize: 18,
        backgroundColor:'#9290c3',
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
      },
      avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1B1A55',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
      },
      avatarText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
      nameText: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      search: {
        marginLeft: 50,
        marginTop: 3,
        marginBottom: 3,
      }
})