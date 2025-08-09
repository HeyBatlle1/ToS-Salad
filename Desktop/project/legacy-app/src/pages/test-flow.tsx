import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Use service role for testing (bypasses RLS)
const supabaseUrl = 'https://nqmfytuxboiwdumnovlz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xbWZ5dHV4Ym9pd2R1bW5vdmx6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDYyMzYxNiwiZXhwIjoyMDcwMTk5NjE2fQ.KnIQppoZKoUAGu8eiKjvmB--ejqWyUX_PJNeuJrYfS8';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test user for testing (matches the one we created in auth.users)
const TEST_USER_ID = '11111111-1111-1111-1111-111111111111';
const mockUser = {
  id: TEST_USER_ID,
  email: 'test@legacy.app'
};

const TestFlow: NextPage = () => {
  const [confession, setConfession] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState('');
  const [triggerDays, setTriggerDays] = useState(30);
  const [status, setStatus] = useState('');

  const addRecipient = () => {
    if (newRecipient && !recipients.includes(newRecipient)) {
      setRecipients([...recipients, newRecipient]);
      setNewRecipient('');
    }
  };

  const generateKey = async () => {
    return await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  };

  const encryptText = async (text: string, key: CryptoKey) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    return {
      encrypted: Array.from(new Uint8Array(encrypted)),
      iv: Array.from(iv)
    };
  };

  const exportKey = async (key: CryptoKey) => {
    const exported = await crypto.subtle.exportKey('raw', key);
    return Array.from(new Uint8Array(exported));
  };

  const saveConfession = async () => {
    if (!confession || recipients.length === 0) {
      setStatus('Please enter confession and at least one recipient');
      return;
    }

    try {
      setStatus('Encrypting and saving confession...');
      
      const key = await generateKey();
      const { encrypted, iv } = await encryptText(confession, key);
      const exportedKey = await exportKey(key);

      // Save confession using service role (bypass RLS for testing)
      const { data: confessionData, error: confessionError } = await supabase
        .from('confessions')
        .insert({
          user_id: mockUser.id,
          encrypted_content: JSON.stringify({ encrypted, iv })
        })
        .select()
        .single();

      if (confessionError) throw confessionError;

      // Save recipients with key shares
      const keyString = exportedKey.join(',');
      for (const recipientEmail of recipients) {
        const { error: recipientError } = await supabase
          .from('recipients')
          .insert({
            confession_id: confessionData.id,
            email: recipientEmail,
            decrypt_key: keyString
          });

        if (recipientError) throw recipientError;
      }

      // Update heartbeat
      const { error: heartbeatError } = await supabase
        .from('heartbeats')
        .upsert({
          user_id: mockUser.id,
          last_seen: new Date().toISOString(),
          trigger_after: `${triggerDays} days`
        });

      if (heartbeatError) throw heartbeatError;

      setStatus(`✅ Confession saved successfully! Confession ID: ${confessionData.id}`);
      setConfession('');
      setRecipients([]);
    } catch (error: any) {
      console.error('Error saving confession:', error);
      setStatus(`❌ Error: ${error.message || error}`);
    }
  };

  const updateHeartbeat = async () => {
    try {
      setStatus('Updating heartbeat...');
      
      const { error } = await supabase
        .from('heartbeats')
        .upsert({
          user_id: mockUser.id,
          last_seen: new Date().toISOString(),
          trigger_after: `${triggerDays} days`
        });

      if (error) throw error;
      setStatus('✅ Heartbeat updated! Timer reset.');
    } catch (error: any) {
      console.error('Error updating heartbeat:', error);
      setStatus(`❌ Heartbeat error: ${error.message || error}`);
    }
  };

  const manualTrigger = async () => {
    try {
      setStatus('Triggering dead man\'s switch...');
      
      const response = await fetch('/api/check-triggers', {
        method: 'POST',
      });
      const result = await response.json();
      setStatus(`✅ Manual trigger executed. Processed: ${result.processed} users. Check console for recipient URLs.`);
    } catch (error: any) {
      console.error('Error triggering:', error);
      setStatus(`❌ Trigger error: ${error.message || error}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Head>
        <title>Dead Man's Switch - Test Flow</title>
      </Head>
      
      <h1>Dead Man's Switch - Test Flow</h1>
      <p><strong>Mock User:</strong> {mockUser.email} (ID: {mockUser.id})</p>
      
      {status && (
        <div style={{ 
          padding: '10px', 
          margin: '10px 0', 
          backgroundColor: status.includes('❌') ? '#ffebee' : '#e8f5e8',
          border: `1px solid ${status.includes('❌') ? '#f44336' : '#4caf50'}`,
          borderRadius: '4px'
        }}>
          {status}
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <h2>1. Create Confession</h2>
        <textarea
          placeholder="Your confession..."
          value={confession}
          onChange={(e) => setConfession(e.target.value)}
          rows={5}
          style={{ width: '100%', padding: '10px' }}
        />
        
        <h3>Recipients</h3>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            placeholder="Recipient email"
            value={newRecipient}
            onChange={(e) => setNewRecipient(e.target.value)}
            style={{ padding: '5px', marginRight: '10px' }}
          />
          <button onClick={addRecipient}>Add Recipient</button>
        </div>
        
        <ul>
          {recipients.map((email, index) => (
            <li key={index}>{email}</li>
          ))}
        </ul>
        
        <div style={{ margin: '10px 0' }}>
          <label>
            Trigger after days of inactivity:
            <input
              type="number"
              value={triggerDays}
              onChange={(e) => setTriggerDays(Number(e.target.value))}
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </label>
        </div>
        
        <button 
          onClick={saveConfession}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Save Confession
        </button>
      </div>
      
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
        <h2>2. Heartbeat Control</h2>
        <button 
          onClick={updateHeartbeat}
          style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          I'm Still Alive (Reset Timer)
        </button>
        <p>Click this button to reset your heartbeat timer and prevent the dead man's switch from triggering.</p>
      </div>
      
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
        <h2>3. Manual Trigger (Testing)</h2>
        <button 
          onClick={manualTrigger}
          style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Manual Trigger Dead Man's Switch
        </button>
        <p>This will manually trigger the dead man's switch for testing. Check the console for recipient URLs.</p>
      </div>
    </div>
  );
};

export default TestFlow;
