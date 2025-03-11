import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { syncService } from '../api/syncService';

type NetworkContextType = {
  isConnected: boolean;
  lastConnected: Date | null;
  trySync: () => Promise<void>;
  pendingOperations: number;
};

const NetworkContext = createContext<NetworkContextType>({
  isConnected: true,
  lastConnected: null,
  trySync: async () => {},
  pendingOperations: 0,
});

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [lastConnected, setLastConnected] = useState<Date | null>(null);
  const [pendingOperations, setPendingOperations] = useState<number>(0);

  // Subscribe to network state updates
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(handleNetworkChange);

    // Initial check
    NetInfo.fetch().then(handleNetworkChange);

    return () => {
      unsubscribe();
    };
  }, []);

  // Check pending operations periodically
  useEffect(() => {
    const checkPendingOperations = async () => {
      const queue = await syncService.getSyncQueue();
      setPendingOperations(queue.length);
    };

    // Check once at startup
    checkPendingOperations();

    // And then every 30 seconds
    const interval = setInterval(checkPendingOperations, 30000);
    return () => clearInterval(interval);
  }, []);

  // Try to process sync queue whenever we're online
  useEffect(() => {
    if (isConnected && pendingOperations > 0) {
      trySync();
    }
  }, [isConnected, pendingOperations]);

  const handleNetworkChange = (state: NetInfoState) => {
    setIsConnected(state.isConnected ?? false);
    
    if (state.isConnected) {
      setLastConnected(new Date());
    }
  };

  const trySync = async () => {
    if (isConnected) {
      try {
        await syncService.processSyncQueue();
        // Update pending operations count
        const queue = await syncService.getSyncQueue();
        setPendingOperations(queue.length);
      } catch (error) {
        console.error('Error syncing:', error);
      }
    }
  };

  return (
    <NetworkContext.Provider 
      value={{ 
        isConnected, 
        lastConnected, 
        trySync,
        pendingOperations,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);
