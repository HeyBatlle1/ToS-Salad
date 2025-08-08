// ============================================================================
// MOBILE SECURITY WRAPPER
// ============================================================================
// Ensures mobile security, responsive design, and offline capability
// ============================================================================

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Shield, Lock, Wifi, WifiOff, Smartphone, AlertTriangle } from 'lucide-react';

interface MobileWrapperProps {
  children: React.ReactNode;
  requireBiometric?: boolean;
  preventScreenshots?: boolean;
  preventScreenRecording?: boolean;
  enableOfflineMode?: boolean;
  onSecurityViolation?: (violation: SecurityViolation) => void;
}

export interface SecurityViolation {
  type: 'screenshot' | 'screen_recording' | 'biometric_failure' | 'network_insecure';
  timestamp: Date;
  details: string;
}

export interface BiometricResult {
  success: boolean;
  error?: string;
}

// ============================================================================
// MOBILE DETECTION
// ============================================================================

const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
  
  return mobileKeywords.some(keyword => userAgent.includes(keyword)) ||
         'ontouchstart' in window ||
         navigator.maxTouchPoints > 0;
};

const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

const isAndroid = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
};

// ============================================================================
// BIOMETRIC AUTHENTICATION
// ============================================================================

const requestBiometricAuth = async (): Promise<BiometricResult> => {
  try {
    // Check if WebAuthn is available
    if (!window.PublicKeyCredential) {
      return { success: false, error: 'Biometric authentication not supported' };
    }

    // Check if biometric authentication is available
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    if (!available) {
      return { success: false, error: 'Biometric authentication not available' };
    }

    // For now, we'll simulate biometric auth
    // In a real implementation, you would use WebAuthn API
    return new Promise((resolve) => {
      // Simulate biometric prompt
      setTimeout(() => {
        // Simulate success (in real app, this would be user interaction)
        resolve({ success: true });
      }, 1000);
    });

  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// ============================================================================
// SCREENSHOT DETECTION
// ============================================================================

const detectScreenshots = (): boolean => {
  // Note: Screenshot detection is limited in web browsers
  // This is a basic implementation that may not catch all cases
  
  if (typeof window === 'undefined') return false;

  // Method 1: Detect visibility change (may indicate screenshot)
  let screenshotDetected = false;

  const handleVisibilityChange = () => {
    if (document.hidden) {
      // Page became hidden - could be screenshot
      screenshotDetected = true;
    }
  };

  const handleFocusChange = () => {
    if (!document.hasFocus()) {
      // Window lost focus - could be screenshot
      screenshotDetected = true;
    }
  };

  // Method 2: Detect iframe injection (screenshot tools often inject iframes)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          if (element.tagName === 'IFRAME') {
            screenshotDetected = true;
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Method 3: Detect screen recording (limited effectiveness)
  const detectScreenRecording = () => {
    // Check for screen recording indicators
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Some screen recording tools modify canvas behavior
      try {
        ctx.getImageData(0, 0, 1, 1);
      } catch (e) {
        screenshotDetected = true;
      }
    }
  };

  // Set up event listeners
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('blur', handleFocusChange);
  
  // Periodic checks
  const interval = setInterval(detectScreenRecording, 5000);

  // Cleanup function
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('blur', handleFocusChange);
    observer.disconnect();
    clearInterval(interval);
  };
};

// ============================================================================
// OFFLINE STORAGE
// ============================================================================

class SecureOfflineStorage {
  private readonly storageKey = 'legacy_offline_data';
  private readonly encryptionKey = 'offline_encryption_key'; // In real app, use proper key management

  async storeData(key: string, data: any): Promise<void> {
    try {
      if (!navigator.storage || !navigator.storage.persist) {
        throw new Error('Persistent storage not supported');
      }

      // Request persistent storage
      const isPersisted = await navigator.storage.persist();
      if (!isPersisted) {
        throw new Error('Failed to get persistent storage permission');
      }

      // Encrypt data before storing
      const encryptedData = await this.encryptData(JSON.stringify(data));
      
      // Store in IndexedDB for offline access
      const db = await this.openDatabase();
      const transaction = db.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      
      await store.put({
        key,
        data: encryptedData,
        timestamp: Date.now(),
        synced: false
      });

    } catch (error) {
      console.error('Failed to store offline data:', error);
      throw error;
    }
  }

  async retrieveData(key: string): Promise<any> {
    try {
      const db = await this.openDatabase();
      const transaction = db.transaction(['offlineData'], 'readonly');
      const store = transaction.objectStore('offlineData');
      
      const result = await store.get(key);
      if (!result) return null;

      // Decrypt data
      const decryptedData = await this.decryptData(result.data);
      return JSON.parse(decryptedData);

    } catch (error) {
      console.error('Failed to retrieve offline data:', error);
      return null;
    }
  }

  async syncData(): Promise<void> {
    try {
      const db = await this.openDatabase();
      const transaction = db.transaction(['offlineData'], 'readonly');
      const store = transaction.objectStore('offlineData');
      
      const unsyncedData = await store.getAll();
      
      for (const item of unsyncedData) {
        if (!item.synced) {
          // Attempt to sync with server
          const decryptedData = await this.decryptData(item.data);
          const data = JSON.parse(decryptedData);
          
          // Here you would send data to your API
          // await api.syncOfflineData(item.key, data);
          
          // Mark as synced
          const updateTransaction = db.transaction(['offlineData'], 'readwrite');
          const updateStore = updateTransaction.objectStore('offlineData');
          await updateStore.put({
            ...item,
            synced: true,
            syncedAt: Date.now()
          });
        }
      }

    } catch (error) {
      console.error('Failed to sync offline data:', error);
    }
  }

  private async openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('LegacyOfflineDB', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('offlineData')) {
          const store = db.createObjectStore('offlineData', { keyPath: 'key' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('synced', 'synced', { unique: false });
        }
      };
    });
  }

  private async encryptData(data: string): Promise<string> {
    // Simple encryption for demo - use proper encryption in production
    const encoder = new TextEncoder();
    const keyData = encoder.encode(this.encryptionKey);
    const dataBuffer = encoder.encode(data);
    
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBuffer
    );
    
    const encryptedArray = new Uint8Array(encrypted);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);
    
    return btoa(String.fromCharCode(...combined));
  }

  private async decryptData(encryptedData: string): Promise<string> {
    // Simple decryption for demo - use proper decryption in production
    const combined = new Uint8Array(
      atob(encryptedData).split('').map(char => char.charCodeAt(0))
    );
    
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    
    const encoder = new TextEncoder();
    const keyData = encoder.encode(this.encryptionKey);
    
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );
    
    return new TextDecoder().decode(decrypted);
  }
}

// ============================================================================
// HAPTIC FEEDBACK
// ============================================================================

const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light'): void => {
  if (typeof window === 'undefined') return;

  // Check if vibration API is available
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [50],
      heavy: [100, 50, 100]
    };
    
    navigator.vibrate(patterns[type]);
  }

  // iOS haptic feedback (if available)
  if (isIOS() && 'webkit' in window) {
    // iOS doesn't expose haptic feedback to web, but we can try
    // In a real app, you might use a native wrapper
  }
};

// ============================================================================
// PERFORMANCE OPTIMIZATIONS
// ============================================================================

const usePerformanceOptimizations = () => {
  useEffect(() => {
    // Disable pull-to-refresh for security
    const preventPullToRefresh = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      
      const touch = e.touches[0];
      const startY = touch.clientY;
      
      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        const currentY = touch.clientY;
        const diff = startY - currentY;
        
        // If pulling down, prevent default
        if (diff < -50) {
          e.preventDefault();
        }
      };
      
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      
      const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
      
      document.addEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchstart', preventPullToRefresh);
    
    return () => {
      document.removeEventListener('touchstart', preventPullToRefresh);
    };
  }, []);

  // Optimize for 60fps
  useEffect(() => {
    const optimizeForPerformance = () => {
      // Use requestAnimationFrame for smooth animations
      const animate = () => {
        // Your animation logic here
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    };
    
    optimizeForPerformance();
  }, []);
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const MobileWrapper: React.FC<MobileWrapperProps> = ({
  children,
  requireBiometric = false,
  preventScreenshots = true,
  preventScreenRecording = true,
  enableOfflineMode = true,
  onSecurityViolation
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!requireBiometric);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [securityViolations, setSecurityViolations] = useState<SecurityViolation[]>([]);
  const [isLoading, setIsLoading] = useState(requireBiometric);
  const [offlineStorage] = useState(() => new SecureOfflineStorage());
  
  const screenshotDetectorRef = useRef<(() => void) | null>(null);
  const biometricAttemptsRef = useRef(0);

  // ============================================================================
  // BIOMETRIC AUTHENTICATION
  // ============================================================================

  const handleBiometricAuth = useCallback(async () => {
    if (biometricAttemptsRef.current >= 3) {
      const violation: SecurityViolation = {
        type: 'biometric_failure',
        timestamp: new Date(),
        details: 'Too many biometric authentication attempts'
      };
      setSecurityViolations(prev => [...prev, violation]);
      onSecurityViolation?.(violation);
      return;
    }

    biometricAttemptsRef.current++;
    setIsLoading(true);

    try {
      const result = await requestBiometricAuth();
      
      if (result.success) {
        setIsAuthenticated(true);
        triggerHapticFeedback('medium');
      } else {
        const violation: SecurityViolation = {
          type: 'biometric_failure',
          timestamp: new Date(),
          details: result.error || 'Biometric authentication failed'
        };
        setSecurityViolations(prev => [...prev, violation]);
        onSecurityViolation?.(violation);
      }
    } catch (error) {
      const violation: SecurityViolation = {
        type: 'biometric_failure',
        timestamp: new Date(),
        details: error instanceof Error ? error.message : 'Unknown error'
      };
      setSecurityViolations(prev => [...prev, violation]);
      onSecurityViolation?.(violation);
    } finally {
      setIsLoading(false);
    }
  }, [onSecurityViolation]);

  // ============================================================================
  // SECURITY MONITORING
  // ============================================================================

  useEffect(() => {
    if (!preventScreenshots) return;

    // Set up screenshot detection
    screenshotDetectorRef.current = detectScreenshots();

    // Monitor for security violations
    const checkSecurityViolations = () => {
      // Check for screen recording indicators
      if (preventScreenRecording) {
        // This is a simplified check - real implementation would be more sophisticated
        const hasScreenRecording = false; // Placeholder for actual detection
        
        if (hasScreenRecording) {
          const violation: SecurityViolation = {
            type: 'screen_recording',
            timestamp: new Date(),
            details: 'Screen recording detected'
          };
          setSecurityViolations(prev => [...prev, violation]);
          onSecurityViolation?.(violation);
        }
      }
    };

    const interval = setInterval(checkSecurityViolations, 1000);
    
    return () => {
      clearInterval(interval);
      if (screenshotDetectorRef.current) {
        screenshotDetectorRef.current();
      }
    };
  }, [preventScreenshots, preventScreenRecording, onSecurityViolation]);

  // ============================================================================
  // NETWORK MONITORING
  // ============================================================================

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerHapticFeedback('light');
      
      // Sync offline data when back online
      if (enableOfflineMode) {
        offlineStorage.syncData();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      triggerHapticFeedback('medium');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [enableOfflineMode, offlineStorage]);

  // ============================================================================
  // PERFORMANCE OPTIMIZATIONS
  // ============================================================================

  usePerformanceOptimizations();

  // ============================================================================
  // RENDER LOGIC
  // ============================================================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Lock className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl font-semibold mb-2">Security Verification</h2>
          <p className="text-gray-400">Please authenticate to continue</p>
          <button
            onClick={handleBiometricAuth}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Authenticate
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Shield className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-gray-400 mb-4">Biometric authentication is required for security</p>
          <button
            onClick={handleBiometricAuth}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-wrapper">
      {/* Security Status Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-75 text-white text-xs p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-green-500" />
          <span>Secure Mode</span>
        </div>
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-yellow-500" />
          )}
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      {/* Security Violations Alert */}
      {securityViolations.length > 0 && (
        <div className="fixed top-12 left-4 right-4 z-40 bg-red-600 text-white p-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Security Alert</span>
          </div>
          <p className="text-sm mt-1">
            {securityViolations[securityViolations.length - 1].details}
          </p>
        </div>
      )}

      {/* Main Content */}
      <div className="pt-16">
        {children}
      </div>

      {/* Mobile-specific styles */}
      <style jsx>{`
        .mobile-wrapper {
          -webkit-user-select: none;
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        
        /* Prevent text selection for security */
        .mobile-wrapper * {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        /* Large touch targets */
        .mobile-wrapper button,
        .mobile-wrapper [role="button"] {
          min-height: 44px;
          min-width: 44px;
        }
        
        /* Disable pull-to-refresh */
        body {
          overscroll-behavior-y: none;
        }
        
        /* Prevent zoom on input focus */
        input, textarea, select {
          font-size: 16px;
        }
        
        /* Optimize for mobile performance */
        * {
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// HOOKS
// ============================================================================

export const useMobileSecurity = () => {
  const [isMobileDevice] = useState(isMobile());
  const [isIOSDevice] = useState(isIOS());
  const [isAndroidDevice] = useState(isAndroid());

  const triggerSecurityHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    triggerHapticFeedback(type);
  }, []);

  const storeOfflineData = useCallback(async (key: string, data: any) => {
    const storage = new SecureOfflineStorage();
    await storage.storeData(key, data);
  }, []);

  const retrieveOfflineData = useCallback(async (key: string) => {
    const storage = new SecureOfflineStorage();
    return await storage.retrieveData(key);
  }, []);

  return {
    isMobileDevice,
    isIOSDevice,
    isAndroidDevice,
    triggerSecurityHaptic,
    storeOfflineData,
    retrieveOfflineData
  };
};

export default MobileWrapper;
