import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { signIn, clearError } from '../../store/authSlice';
import { RootState, AppDispatch } from '../../store';
import { supabase } from '../../api/supabase';

export const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  // Clear any previous errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Show error alert when error changes
  useEffect(() => {
    if (error) {
      Alert.alert('Authentication Error', error);
    }
  }, [error]);

  async function handleSignIn() {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Email and password are required');
      return;
    }
    
    dispatch(signIn({ email, password }));
  }

  async function handleRegister() {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Email and password are required');
      return;
    }

    setLocalLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        Alert.alert('Registration Error', error.message);
      } else if (data) {
        Alert.alert(
          'Registration Successful', 
          'Your account has been created! You can now sign in.',
          [{ text: 'OK', onPress: () => setIsRegister(false) }]
        );
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'An unknown error occurred');
    } finally {
      setLocalLoading(false);
    }
  }

  // Create a test account for development
  async function createTestAccount() {
    setLocalLoading(true);
    try {
      const testEmail = 'test@example.com';
      const testPassword = 'password123';
      
      // Check if user already exists
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });
      
      if (!signInError && signInData.user) {
        // User exists, just use these credentials
        setEmail(testEmail);
        setPassword(testPassword);
        Alert.alert('Test Account', 'Test account credentials filled in. You can now sign in.');
        return;
      }
      
      // Create test user
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      });

      if (error) {
        Alert.alert('Error Creating Test Account', error.message);
      } else {
        setEmail(testEmail);
        setPassword(testPassword);
        Alert.alert('Test Account Created', 'Test account credentials filled in. You can now sign in.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'An unknown error occurred');
    } finally {
      setLocalLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>iPavePro</Text>
      <Text style={styles.subtitle}>{isRegister ? 'Create an Account' : 'Sign In'}</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      {isLoading || localLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <>
          <View style={styles.buttonContainer}>
            <Button
              title={isRegister ? "Register" : "Sign In"}
              onPress={isRegister ? handleRegister : handleSignIn}
              disabled={isLoading}
            />
          </View>
          
          <TouchableOpacity 
            onPress={() => setIsRegister(!isRegister)}
            style={styles.switchButton}
          >
            <Text style={styles.switchText}>
              {isRegister ? "Already have an account? Sign In" : "Don't have an account? Register"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={createTestAccount}
            style={styles.testAccountButton}
          >
            <Text style={styles.testAccountText}>
              Create Test Account
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  loader: {
    marginVertical: 15,
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    color: '#0066cc',
    fontSize: 16,
  },
  testAccountButton: {
    marginTop: 30,
    alignItems: 'center',
    padding: 10,
  },
  testAccountText: {
    color: '#888',
    fontSize: 14,
    textDecorationLine: 'underline',
  }
});
