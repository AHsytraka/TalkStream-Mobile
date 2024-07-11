import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import React, { useState } from 'react';
import authService from '../../services/authService';
import {useRouter } from 'expo-router';

export default function RegisterScreen() {

  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegistration = async () => {
    try {
      const response = await authService.register(username, email, password);
      console.log('Inscription reussit', response.data);
      if(response.data.jwt)
        {
          router.replace('/home');
        }
    }catch(error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
    <Text>Inscription</Text>
    
    {/* <Text style={styles.label}>Nom</Text> */}
    <TextInput
      style={styles.input}
      placeholder="Nom d'utilisateur"
      value={username}
      onChangeText={setUsername}
    />

    {/* <Text style={styles.label}>Email</Text> */}
    <TextInput
      style={styles.input}
      placeholder="Adresse email"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
    />

    {/* <Text style={styles.label}>Mot de passe</Text> */}
    <TextInput
      style={styles.input}
      placeholder="Mot de passe"
      value={password}
      onChangeText={setPassword}
      secureTextEntry
    />

    <Button title="Register" onPress={handleRegistration} />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
//   label: {
//     width: '80%',
//     paddingLeft: 10,
//     marginBottom: -5,
//     color: '#000',
//   },
});