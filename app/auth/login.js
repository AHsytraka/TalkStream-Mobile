import { View, StyleSheet, Text, TextInput, Button } from 'react-native';
import React, { useState } from 'react';
import authService from '../../services/authService';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await authService.login(usernameOrEmail, password);
      console.log('Connexion reussit', response.data);
      if(response.data.jwt)
        {
          router.push('/home');
        }
    }
    catch(error) {
      console.error('Connexion echouer', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Connexion</Text>

      {/* <Text style={styles.label}>Adresse email ou Nom d'utilisateur</Text> */}
      <TextInput
        style={styles.input}
        placeholder="Email ou nom d'utilisateur"
        value={usernameOrEmail}
        onChangeText={setUsernameOrEmail}
      />

        {/* <Text style={styles.label}>Mot de passe</Text> */}
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
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