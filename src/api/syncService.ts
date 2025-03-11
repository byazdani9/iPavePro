import { supabase } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SYNC_QUEUE_KEY = 'offlineSyncQueue';

interface SyncOperation {
  id: string;
  table: string;
  operation: 'insert' | 'update' | 'delete';
  data: any;
  timestamp: number;
}

export const syncService = {
  // Add an operation to the sync queue
  async addToSyncQueue(operation: Omit<SyncOperation, 'id' | 'timestamp'>): Promise<void> {
    try {
      const queue = await this.getSyncQueue();
      const newOperation: SyncOperation = {
        ...operation,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      };
      
      queue.push(newOperation);
      await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Error adding to sync queue:', error);
    }
  },
  
  // Get the current sync queue
  async getSyncQueue(): Promise<SyncOperation[]> {
    try {
      const queueJson = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
      return queueJson ? JSON.parse(queueJson) : [];
    } catch (error) {
      console.error('Error getting sync queue:', error);
      return [];
    }
  },
  
  // Process the sync queue when online
  async processSyncQueue(): Promise<void> {
    try {
      const queue = await this.getSyncQueue();
      
      if (queue.length === 0) return;
      
      // Sort by timestamp to maintain order
      const sortedQueue = [...queue].sort((a, b) => a.timestamp - b.timestamp);
      
      let successfulOps = [];
      
      for (const op of sortedQueue) {
        try {
          switch (op.operation) {
            case 'insert':
              await supabase.from(op.table).insert(op.data);
              break;
              
            case 'update':
              if (!op.data.id) throw new Error('Missing ID for update operation');
              await supabase.from(op.table).update(op.data).eq('id', op.data.id);
              break;
              
            case 'delete':
              if (!op.data.id) throw new Error('Missing ID for delete operation');
              await supabase.from(op.table).delete().eq('id', op.data.id);
              break;
          }
          
          successfulOps.push(op.id);
        } catch (error) {
          console.error(`Error processing operation ${op.id}:`, error);
        }
      }
      
      // Remove successful operations from queue
      if (successfulOps.length > 0) {
        const newQueue = queue.filter(op => !successfulOps.includes(op.id));
        await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(newQueue));
      }
    } catch (error) {
      console.error('Error processing sync queue:', error);
    }
  },
  
  // Check if device is online
  isOnline(): boolean {
    // In a real app, use NetInfo to check connectivity
    return true;
  }
};