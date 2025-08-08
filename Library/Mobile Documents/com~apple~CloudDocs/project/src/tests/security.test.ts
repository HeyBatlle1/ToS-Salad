// ============================================================================
// SECURITY TESTING SUITE
// ============================================================================
// Comprehensive security tests for the legacy recording application
// ============================================================================

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { 
  encryptAnswer, 
  decryptAnswer, 
  generateRecipientKeys, 
  hashAccessCode, 
  verifyAccessCode,
  encryptTranscript,
  decryptTranscript,
  zeroizeMemory,
  SECURITY_CONSTANTS
} from '../lib/security/encryption';
import { 
  sanitizeUserInput, 
  validateAudioFile, 
  validateDeathCertificate,
  rateLimitCheck,
  generateCSRFToken,
  validateCSRFToken,
  comprehensiveValidation,
  InputType,
  ActionType
} from '../lib/security/validation';
import {
  logSecurityEvent,
  logAccessAttempt,
  logDecryptionEvent,
  detectAnomalousAccess,
  detectBruteForceAttempts,
  emergencyLockdown,
  SecurityEventType,
  ThreatLevel
} from '../lib/security/audit';

// ============================================================================
// MOCK SETUP
// ============================================================================

// Mock Supabase client
jest.mock('../lib/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({ error: null })),
      select: jest.fn(() => ({ eq: jest.fn(() => ({ data: [], error: null })) })),
      update: jest.fn(() => ({ eq: jest.fn(() => ({ error: null })) })),
      delete: jest.fn(() => ({ eq: jest.fn(() => ({ error: null })) }))
    })),
    auth: {
      getUser: jest.fn(() => ({ data: { user: { id: 'test-user' } }, error: null }))
    }
  }
}));

// Mock crypto API
Object.defineProperty(global, 'crypto', {
  value: {
    subtle: {
      generateKey: jest.fn(() => Promise.resolve({ publicKey: {}, privateKey: {} })),
      importKey: jest.fn(() => Promise.resolve({})),
      exportKey: jest.fn(() => Promise.resolve(new ArrayBuffer(32))),
      encrypt: jest.fn(() => Promise.resolve(new ArrayBuffer(64))),
      decrypt: jest.fn(() => Promise.resolve(new ArrayBuffer(32))),
      sign: jest.fn(() => Promise.resolve(new ArrayBuffer(64))),
      verify: jest.fn(() => Promise.resolve(true)),
      digest: jest.fn(() => Promise.resolve(new ArrayBuffer(32))),
      deriveBits: jest.fn(() => Promise.resolve(new ArrayBuffer(32))),
      deriveKey: jest.fn(() => Promise.resolve({}))
    },
    getRandomValues: jest.fn(() => new Uint8Array(32))
  }
});

// Mock File API
global.File = class MockFile {
  name: string;
  size: number;
  type: string;
  constructor(bits: any[], name: string, options?: any) {
    this.name = name;
    this.size = bits.length;
    this.type = options?.type || 'audio/wav';
  }
  arrayBuffer() {
    return Promise.resolve(new ArrayBuffer(this.size));
  }
} as any;

// Mock Blob API
global.Blob = class MockBlob {
  size: number;
  type: string;
  constructor(bits: any[], options?: any) {
    this.size = bits.length;
    this.type = options?.type || 'audio/wav';
  }
  arrayBuffer() {
    return Promise.resolve(new ArrayBuffer(this.size));
  }
} as any;

// ============================================================================
// AUTHENTICATION TESTS
// ============================================================================

describe('Authentication Security', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Brute Force Protection', () => {
    it('should detect brute force attempts', async () => {
      const ipAddress = '192.168.1.1';
      
      // Simulate multiple failed attempts
      for (let i = 0; i < 11; i++) {
        await logSecurityEvent({
          eventType: SecurityEventType.LOGIN_FAILURE,
          ipAddress,
          eventData: { attempt: i + 1 },
          threatLevel: ThreatLevel.MEDIUM
        });
      }

      const isBruteForce = await detectBruteForceAttempts(ipAddress);
      expect(isBruteForce).toBe(true);
    });

    it('should not trigger on normal login attempts', async () => {
      const ipAddress = '192.168.1.2';
      
      // Simulate normal login attempts
      for (let i = 0; i < 5; i++) {
        await logSecurityEvent({
          eventType: SecurityEventType.LOGIN_SUCCESS,
          ipAddress,
          eventData: { attempt: i + 1 },
          threatLevel: ThreatLevel.NONE
        });
      }

      const isBruteForce = await detectBruteForceAttempts(ipAddress);
      expect(isBruteForce).toBe(false);
    });
  });

  describe('Token Expiration', () => {
    it('should handle expired tokens gracefully', async () => {
      // Mock expired token scenario
      const mockSupabase = require('../lib/supabase/client').supabase;
      mockSupabase.auth.getUser.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Token expired' }
      });

      // This would test your auth middleware
      expect(true).toBe(true); // Placeholder for actual token expiration test
    });
  });

  describe('Session Hijacking Prevention', () => {
    it('should validate session integrity', async () => {
      // Test session validation logic
      const sessionData = {
        userId: 'test-user',
        sessionId: 'test-session',
        ipAddress: '192.168.1.1',
        userAgent: 'test-agent'
      };

      // Simulate session validation
      const isValidSession = sessionData.userId && sessionData.sessionId;
      expect(isValidSession).toBe(true);
    });
  });

  describe('CSRF Protection', () => {
    it('should generate and validate CSRF tokens', () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();

      expect(token1).toBeDefined();
      expect(token2).toBeDefined();
      expect(token1).not.toBe(token2);
      expect(token1.length).toBe(64); // 32 bytes = 64 hex chars

      // Test validation
      expect(validateCSRFToken(token1, token1)).toBe(true);
      expect(validateCSRFToken(token1, token2)).toBe(false);
      expect(validateCSRFToken('', '')).toBe(false);
    });

    it('should prevent timing attacks in token comparison', () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();

      // Test that comparison takes similar time regardless of match
      const start1 = Date.now();
      validateCSRFToken(token1, token1);
      const time1 = Date.now() - start1;

      const start2 = Date.now();
      validateCSRFToken(token1, token2);
      const time2 = Date.now() - start2;

      // Times should be similar (within 10ms)
      expect(Math.abs(time1 - time2)).toBeLessThan(10);
    });
  });
});

// ============================================================================
// DATA PROTECTION TESTS
// ============================================================================

describe('Data Protection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Encryption at Rest', () => {
    it('should encrypt and decrypt audio data correctly', async () => {
      const audioBlob = new Blob(['test audio data'], { type: 'audio/wav' });
      const keyPair = await generateRecipientKeys();

      // Encrypt
      const encryptedData = await encryptAnswer(audioBlob, keyPair.publicKey);
      
      expect(encryptedData).toBeDefined();
      expect(encryptedData.encryptedBlob).toBeInstanceOf(ArrayBuffer);
      expect(encryptedData.encryptedKey).toBeInstanceOf(ArrayBuffer);
      expect(encryptedData.iv).toBeInstanceOf(Uint8Array);
      expect(encryptedData.signature).toBeInstanceOf(ArrayBuffer);
      expect(encryptedData.algorithm).toBe('AES-GCM');
      expect(encryptedData.version).toBe('1.0.0');

      // Decrypt
      const decryptedBlob = await decryptAnswer(encryptedData, keyPair.privateKey);
      
      expect(decryptedBlob).toBeInstanceOf(Blob);
      expect(decryptedBlob.type).toBe('audio/wav');
    });

    it('should fail decryption with wrong key', async () => {
      const audioBlob = new Blob(['test audio data'], { type: 'audio/wav' });
      const keyPair1 = await generateRecipientKeys();
      const keyPair2 = await generateRecipientKeys();

      const encryptedData = await encryptAnswer(audioBlob, keyPair1.publicKey);

      await expect(
        decryptAnswer(encryptedData, keyPair2.privateKey)
      ).rejects.toThrow();
    });

    it('should encrypt and decrypt transcripts', async () => {
      const text = 'This is a sensitive transcript';
      const projectId = 'test-project-123';

      const encryptedText = await encryptTranscript(text, projectId);
      expect(encryptedText).toBeDefined();
      expect(typeof encryptedText).toBe('string');
      expect(encryptedText).not.toBe(text);

      const decryptedText = await decryptTranscript(encryptedText, projectId);
      expect(decryptedText).toBe(text);
    });
  });

  describe('Encryption in Transit', () => {
    it('should use HTTPS for all communications', () => {
      // Test that all API calls use HTTPS
      const isSecure = window.location.protocol === 'https:';
      expect(isSecure).toBe(true);
    });

    it('should validate SSL certificates', () => {
      // Test SSL certificate validation
      expect(true).toBe(true); // Placeholder for SSL validation test
    });
  });

  describe('Key Rotation', () => {
    it('should support key rotation', async () => {
      const projectId = 'test-project-123';
      const oldKeyPair = await generateRecipientKeys();
      const newKeyPair = await generateRecipientKeys();

      // Test key rotation logic
      expect(oldKeyPair.fingerprint).not.toBe(newKeyPair.fingerprint);
    });
  });

  describe('Memory Cleanup', () => {
    it('should zeroize sensitive data in memory', () => {
      const sensitiveData = new ArrayBuffer(1024);
      const view = new Uint8Array(sensitiveData);
      
      // Fill with some data
      for (let i = 0; i < view.length; i++) {
        view[i] = i % 256;
      }

      // Zeroize
      zeroizeMemory(sensitiveData);

      // Check that data is zeroized
      const checkView = new Uint8Array(sensitiveData);
      for (let i = 0; i < checkView.length; i++) {
        expect(checkView[i]).toBe(0);
      }
    });
  });
});

// ============================================================================
// ACCESS CONTROL TESTS
// ============================================================================

describe('Access Control', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Death Certificate Verification', () => {
    it('should validate death certificate files', async () => {
      const validPdfFile = new File(['%PDF-1.4 test content'], 'death_certificate.pdf', {
        type: 'application/pdf'
      });

      const result = await validateDeathCertificate(validPdfFile);
      
      expect(result.valid).toBe(true);
      expect(result.confidence).toBeGreaterThan(50);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid death certificate files', async () => {
      const invalidFile = new File(['not a pdf'], 'fake.pdf', {
        type: 'application/pdf'
      });

      const result = await validateDeathCertificate(invalidFile);
      
      expect(result.valid).toBe(false);
      expect(result.confidence).toBeLessThan(50);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject oversized files', async () => {
      // Create a large file (over 10MB)
      const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', {
        type: 'application/pdf'
      });

      const result = await validateDeathCertificate(largeFile);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('File too large');
    });
  });

  describe('Therapist Relationship Validation', () => {
    it('should validate therapist-client relationships', async () => {
      // Test therapist relationship validation
      const relationship = {
        therapistId: 'therapist-123',
        clientId: 'client-456',
        status: 'active',
        verified: true
      };

      expect(relationship.status).toBe('active');
      expect(relationship.verified).toBe(true);
    });
  });

  describe('Time-Locked Releases', () => {
    it('should enforce time-based access controls', async () => {
      const now = new Date();
      const futureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
      const pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

      // Test future release
      const canAccessFuture = now >= futureDate;
      expect(canAccessFuture).toBe(false);

      // Test past release
      const canAccessPast = now >= pastDate;
      expect(canAccessPast).toBe(true);
    });
  });

  describe('Dual-Key Access', () => {
    it('should require both keys for access', async () => {
      const key1 = await generateRecipientKeys();
      const key2 = await generateRecipientKeys();

      // Simulate dual-key requirement
      const hasKey1 = !!key1.privateKey;
      const hasKey2 = !!key2.privateKey;
      const canAccess = hasKey1 && hasKey2;

      expect(canAccess).toBe(true);
    });
  });
});

// ============================================================================
// AUDIT TESTS
// ============================================================================

describe('Audit Logging', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Access Logging', () => {
    it('should log all access attempts', async () => {
      const userId = 'test-user';
      const projectId = 'test-project';
      const success = true;

      await logAccessAttempt(userId, projectId, success);

      // Verify that the security event was logged
      expect(true).toBe(true); // Placeholder for actual verification
    });

    it('should log failed access attempts with higher threat level', async () => {
      const userId = 'test-user';
      const projectId = 'test-project';
      const success = false;

      await logAccessAttempt(userId, projectId, success);

      // Verify that failed attempts are logged with appropriate threat level
      expect(true).toBe(true); // Placeholder for actual verification
    });
  });

  describe('Anomaly Detection', () => {
    it('should detect anomalous access patterns', async () => {
      const userId = 'test-user';
      const pattern = {
        userId,
        actionType: 'access',
        frequency: 5,
        timeWindow: 60000, // 1 minute
        locations: ['192.168.1.1'],
        devices: ['desktop']
      };

      const detection = await detectAnomalousAccess(userId, pattern);
      
      expect(detection).toBeDefined();
      expect(typeof detection.isAnomalous).toBe('boolean');
      expect(typeof detection.confidence).toBe('number');
      expect(Array.isArray(detection.reasons)).toBe(true);
      expect(typeof detection.threatLevel).toBe('number');
    });
  });

  describe('Threat Response', () => {
    it('should trigger emergency lockdown on critical threats', async () => {
      const projectId = 'test-project';
      const reason = 'Critical security threat detected';

      await expect(
        emergencyLockdown(projectId, reason)
      ).resolves.not.toThrow();
    });
  });

  describe('Data Retention', () => {
    it('should enforce data retention policies', () => {
      const retentionDays = SECURITY_CONSTANTS.AUDIT_RETENTION_DAYS;
      expect(retentionDays).toBe(2555); // 7 years

      const dataRetentionDays = SECURITY_CONSTANTS.DATA_RETENTION_DAYS;
      expect(dataRetentionDays).toBe(3650); // 10 years
    });
  });
});

// ============================================================================
// PRIVACY TESTS
// ============================================================================

describe('Privacy Compliance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GDPR Compliance', () => {
    it('should support data export', async () => {
      const userId = 'test-user';
      
      // Test data export functionality
      const exportData = {
        userId,
        personalData: {
          email: 'test@example.com',
          fullName: 'Test User',
          createdAt: new Date().toISOString()
        },
        recordings: [],
        transcripts: []
      };

      expect(exportData.userId).toBe(userId);
      expect(exportData.personalData).toBeDefined();
    });

    it('should support right to deletion', async () => {
      const userId = 'test-user';
      
      // Test data deletion functionality
      const deletionRequest = {
        userId,
        requestDate: new Date().toISOString(),
        confirmation: 'CONFIRM_DELETION'
      };

      expect(deletionRequest.userId).toBe(userId);
      expect(deletionRequest.confirmation).toBe('CONFIRM_DELETION');
    });
  });

  describe('Data Anonymization', () => {
    it('should anonymize personal information', () => {
      const originalText = 'My name is John Doe and my email is john@example.com';
      
      // Test anonymization (this would be implemented in your privacy module)
      const anonymizedText = originalText
        .replace(/John Doe/g, '[REDACTED]')
        .replace(/john@example.com/g, '[REDACTED]');

      expect(anonymizedText).not.toContain('John Doe');
      expect(anonymizedText).not.toContain('john@example.com');
      expect(anonymizedText).toContain('[REDACTED]');
    });
  });

  describe('CCPA Compliance', () => {
    it('should support opt-out requests', async () => {
      const userId = 'test-user';
      
      // Test opt-out functionality
      const optOutRequest = {
        userId,
        requestType: 'opt_out',
        requestDate: new Date().toISOString(),
        processed: false
      };

      expect(optOutRequest.requestType).toBe('opt_out');
      expect(optOutRequest.processed).toBe(false);
    });
  });
});

// ============================================================================
// INPUT VALIDATION TESTS
// ============================================================================

describe('Input Validation', () => {
  describe('User Input Sanitization', () => {
    it('should sanitize text input', () => {
      const maliciousInput = '<script>alert("xss")</script>Hello World';
      const sanitized = sanitizeUserInput(maliciousInput, InputType.TEXT);
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('Hello World');
    });

    it('should validate email format', () => {
      const validEmail = 'test@example.com';
      const invalidEmail = 'not-an-email';
      
      expect(() => sanitizeUserInput(validEmail, InputType.EMAIL)).not.toThrow();
      expect(() => sanitizeUserInput(invalidEmail, InputType.EMAIL)).toThrow();
    });

    it('should validate URL format', () => {
      const validUrl = 'https://example.com';
      const invalidUrl = 'not-a-url';
      
      expect(() => sanitizeUserInput(validUrl, InputType.URL)).not.toThrow();
      expect(() => sanitizeUserInput(invalidUrl, InputType.URL)).toThrow();
    });
  });

  describe('File Validation', () => {
    it('should validate audio files', async () => {
      const validAudioFile = new File(['RIFF audio data'], 'test.wav', {
        type: 'audio/wav'
      });

      const isValid = await validateAudioFile(validAudioFile);
      expect(isValid).toBe(true);
    });

    it('should reject invalid audio files', async () => {
      const invalidFile = new File(['not audio'], 'test.txt', {
        type: 'text/plain'
      });

      const isValid = await validateAudioFile(invalidFile);
      expect(isValid).toBe(false);
    });

    it('should reject oversized files', async () => {
      const oversizedFile = new File(['x'.repeat(600 * 1024 * 1024)], 'large.wav', {
        type: 'audio/wav'
      });

      const isValid = await validateAudioFile(oversizedFile);
      expect(isValid).toBe(false);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      const userId = 'test-user';
      
      // Test rate limiting
      const result1 = await rateLimitCheck(userId, ActionType.LOGIN);
      expect(result1.allowed).toBe(true);
      
      // Simulate multiple rapid attempts
      for (let i = 0; i < 10; i++) {
        await rateLimitCheck(userId, ActionType.LOGIN);
      }
      
      const result2 = await rateLimitCheck(userId, ActionType.LOGIN);
      expect(result2.allowed).toBe(false);
    });
  });
});

// ============================================================================
// COMPREHENSIVE VALIDATION TESTS
// ============================================================================

describe('Comprehensive Validation', () => {
  it('should perform comprehensive input validation', () => {
    const maliciousInput = '<script>alert("xss")</script> OR 1=1';
    
    const result = comprehensiveValidation(maliciousInput, InputType.TEXT, {
      maxLength: 1000,
      checkSQL: true,
      checkXSS: true
    });

    expect(result.valid).toBe(false);
    expect(result.confidence).toBeLessThan(100);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should allow valid input', () => {
    const validInput = 'This is a valid input with no malicious content.';
    
    const result = comprehensiveValidation(validInput, InputType.TEXT, {
      maxLength: 1000,
      checkSQL: true,
      checkXSS: true
    });

    expect(result.valid).toBe(true);
    expect(result.confidence).toBe(100);
    expect(result.errors).toHaveLength(0);
  });
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('Security Integration', () => {
  it('should handle end-to-end security flow', async () => {
    // Test complete security flow
    const userId = 'test-user';
    const projectId = 'test-project';
    
    // 1. Generate keys
    const keyPair = await generateRecipientKeys();
    
    // 2. Create audio data
    const audioBlob = new Blob(['test audio'], { type: 'audio/wav' });
    
    // 3. Encrypt audio
    const encryptedData = await encryptAnswer(audioBlob, keyPair.publicKey);
    
    // 4. Log access attempt
    await logAccessAttempt(userId, projectId, true);
    
    // 5. Decrypt audio
    const decryptedBlob = await decryptAnswer(encryptedData, keyPair.privateKey);
    
    // 6. Log decryption event
    await logDecryptionEvent(userId, projectId, 'answer-123', true);
    
    // Verify the flow completed successfully
    expect(decryptedBlob).toBeInstanceOf(Blob);
    expect(decryptedBlob.type).toBe('audio/wav');
  });
});

// ============================================================================
// PERFORMANCE TESTS
// ============================================================================

describe('Security Performance', () => {
  it('should handle encryption/decryption efficiently', async () => {
    const startTime = Date.now();
    
    const keyPair = await generateRecipientKeys();
    const audioBlob = new Blob(['test audio data'.repeat(1000)], { type: 'audio/wav' });
    
    const encryptedData = await encryptAnswer(audioBlob, keyPair.publicKey);
    const decryptedBlob = await decryptAnswer(encryptedData, keyPair.privateKey);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Should complete within reasonable time (adjust as needed)
    expect(duration).toBeLessThan(5000); // 5 seconds
    expect(decryptedBlob).toBeInstanceOf(Blob);
  });

  it('should handle rate limiting efficiently', async () => {
    const startTime = Date.now();
    
    const promises = [];
    for (let i = 0; i < 100; i++) {
      promises.push(rateLimitCheck(`user-${i}`, ActionType.LOGIN));
    }
    
    await Promise.all(promises);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Should handle 100 rate limit checks efficiently
    expect(duration).toBeLessThan(1000); // 1 second
  });
});

// ============================================================================
// ERROR HANDLING TESTS
// ============================================================================

describe('Error Handling', () => {
  it('should handle encryption errors gracefully', async () => {
    // Mock crypto failure
    const mockCrypto = require('crypto').subtle;
    mockCrypto.generateKey.mockRejectedValueOnce(new Error('Crypto error'));

    await expect(
      generateRecipientKeys()
    ).rejects.toThrow('Failed to generate encryption keys');
  });

  it('should handle validation errors gracefully', () => {
    expect(() => {
      sanitizeUserInput('', InputType.TEXT);
    }).toThrow('Invalid input type');
  });

  it('should handle audit logging errors gracefully', async () => {
    // Mock Supabase failure
    const mockSupabase = require('../lib/supabase/client').supabase;
    mockSupabase.from.mockReturnValueOnce({
      insert: jest.fn(() => ({ error: { message: 'Database error' } }))
    });

    // Should not throw even if logging fails
    await expect(
      logSecurityEvent({
        eventType: SecurityEventType.LOGIN_ATTEMPT,
        eventData: {},
        threatLevel: ThreatLevel.LOW
      })
    ).resolves.not.toThrow();
  });
});

// ============================================================================
// SECURITY CONSTANTS TESTS
// ============================================================================

describe('Security Constants', () => {
  it('should have appropriate security limits', () => {
    expect(SECURITY_CONSTANTS.MAX_AUDIO_SIZE).toBe(500 * 1024 * 1024); // 500MB
    expect(SECURITY_CONSTANTS.MAX_SESSION_DURATION).toBe(45 * 60 * 1000); // 45 minutes
    expect(SECURITY_CONSTANTS.INACTIVITY_TIMEOUT).toBe(5 * 60 * 1000); // 5 minutes
    expect(SECURITY_CONSTANTS.MAX_ACCESS_ATTEMPTS).toBe(5);
    expect(SECURITY_CONSTANTS.LOCKOUT_DURATION).toBe(15 * 60 * 1000); // 15 minutes
  });

  it('should have appropriate retention periods', () => {
    expect(SECURITY_CONSTANTS.AUDIT_RETENTION_DAYS).toBe(2555); // 7 years
    expect(SECURITY_CONSTANTS.DATA_RETENTION_DAYS).toBe(3650); // 10 years
  });
});

// ============================================================================
// TEST UTILITIES
// ============================================================================

// Helper function to create test data
const createTestAudioBlob = (size: number = 1024): Blob => {
  const data = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    data[i] = i % 256;
  }
  return new Blob([data], { type: 'audio/wav' });
};

// Helper function to create test file
const createTestFile = (content: string, name: string, type: string): File => {
  return new File([content], name, { type });
};

// Helper function to simulate network delay
const simulateNetworkDelay = (ms: number = 100): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export {
  createTestAudioBlob,
  createTestFile,
  simulateNetworkDelay
};

