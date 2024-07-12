import { View, Text, StyleSheet, TextInput, Button, Alert, Pressable } from 'react-native';
import React, { useState } from 'react';
import authService from '../../services/authService';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateUsername = (username) => {
    if (username.length < 2) {
      return "Username must be at least 2 characters long.";
    }
    return null;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }
    return null;
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return "Le mot de passe doit comporter : \n Au moins 6 caractères \n Inclure une lettre majuscule \n Inclure un caractère spécial.";
    }
    return null;
  };

  const handleRegistration = async () => {
    // const usernameError = validateUsername(username);
    // const emailError = validateEmail(email);
    // const passwordError = validatePassword(password);

    // if (usernameError || emailError || passwordError) {
    //   setErrors({
    //     username: usernameError,
    //     email: emailError,
    //     password: passwordError,
    //   });
    //   return;
    // }

    // setErrors({});

    try {
      const response = await authService.register(username, email, password);
      console.log('Registration successful', response.data);
      if (response.data.jwt) {
        router.replace('/home');
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Registration Error", "An error occurred during registration. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.inscription}>Inscription</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
      />
      {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Adresse email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <Pressable style={styles.regbtn} onPress={handleRegistration}>
          <Text style={styles.regtext}>S'inscrire</Text>
        </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  inscription: {
    fontSize: 25,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },

  regbtn: {
    width: '80%',
    borderRadius: 20,
    padding: 20,
    backgroundColor: '#4A249D'
  },

  regtext: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  }
});
