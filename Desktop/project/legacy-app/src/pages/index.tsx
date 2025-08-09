import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const Home: NextPage = () => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [confession, setConfession] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState('');
  const [triggerDays, setTriggerDays] = useState(30);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    if (!error) {
      setMessage('Check your email for the login link');
    } else {
      setMessage('Error sending magic link: ' + error.message);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

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
    if (!user || !confession || recipients.length === 0) return;

    try {
      const key = await generateKey();
      const { encrypted, iv } = await encryptText(confession, key);
      const exportedKey = await exportKey(key);

      // Save confession
      const { data: confessionData, error: confessionError } = await supabase
        .from('confessions')
        .insert({
          user_id: user.id,
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
      await updateHeartbeat();

      alert('Confession saved successfully!');
      setConfession('');
      setRecipients([]);
    } catch (error) {
      console.error('Error saving confession:', error);
    }
  };

  const updateHeartbeat = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('heartbeats')
        .upsert({
          user_id: user.id,
          last_seen: new Date().toISOString(),
          trigger_after: `${triggerDays} days`
        });

      if (error) throw error;
      alert('Heartbeat updated! Timer reset.');
    } catch (error) {
      console.error('Error updating heartbeat:', error);
    }
  };

  const manualTrigger = async () => {
    try {
      const response = await fetch('/api/check-triggers', {
        method: 'POST',
      });
      const result = await response.json();
      alert(`Manual trigger executed. Check console for recipient URLs. Processed: ${result.processed} users`);
    } catch (error) {
      console.error('Error triggering:', error);
      alert('Error triggering dead man\'s switch');
    }
  };

  if (!user) {
    return (
      <div>
        <Head>
          <title>Legacy App</title>
        </Head>
        <main>
          <h1>Legacy App - Sign In</h1>
          <div>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={() => signInWithMagicLink(email)}>
              Send Login Link
            </button>
            {message && <p>{message}</p>}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Legacy App</title>
      </Head>
      <main>
        <h1>Legacy App</h1>
        <p>Signed in as: {user.email}</p>
        <button onClick={signOut}>Sign Out</button>
        
        <div>
          <h2>Create Confession</h2>
          <textarea
            placeholder="Your confession..."
            value={confession}
            onChange={(e) => setConfession(e.target.value)}
            rows={5}
            cols={50}
          />
          
          <h3>Recipients</h3>
          <div>
            <input
              type="email"
              placeholder="Recipient email"
              value={newRecipient}
              onChange={(e) => setNewRecipient(e.target.value)}
            />
            <button onClick={addRecipient}>Add Recipient</button>
          </div>
          
          <ul>
            {recipients.map((email, index) => (
              <li key={index}>{email}</li>
            ))}
          </ul>
          
          <div>
            <label>
              Trigger after days of inactivity:
              <input
                type="number"
                value={triggerDays}
                onChange={(e) => setTriggerDays(Number(e.target.value))}
              />
            </label>
          </div>
          
          <button onClick={saveConfession}>Save Confession</button>
          
          <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd' }}>
            <h3>Heartbeat Status</h3>
            <button onClick={updateHeartbeat}>I'm still alive (resets timer)</button>
            <p>Last heartbeat will be updated when you click the button above.</p>
          </div>
          
          <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd' }}>
            <h3>Testing</h3>
            <button onClick={manualTrigger}>Manual Trigger (for testing)</button>
            <p>This will manually trigger the dead man's switch for testing purposes.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
