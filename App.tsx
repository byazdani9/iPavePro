// App.tsx
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import Navigation from './src/navigation';
import { NetworkProvider } from './src/context/NetworkContext';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <NetworkProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" />
          <Navigation />
        </SafeAreaView>
      </NetworkProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
