import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../lib/supabase';

const RecipientPage: NextPage = () => {
  const router = useRouter();
  const { id, key } = router.query;
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id && key) {
      decryptConfession();
    }
  }, [id, key]);

  const importKey = async (keyArray: number[]) => {
    const keyBuffer = new Uint8Array(keyArray).buffer;
    return await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
  };

  const decryptText = async (encryptedData: any, key: CryptoKey) => {
    const encrypted = new Uint8Array(encryptedData.encrypted);
    const iv = new Uint8Array(encryptedData.iv);
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  };

  const decryptConfession = async () => {
    try {
      setLoading(true);
      
      // Fetch the confession
      const { data: confession, error: confessionError } = await supabase
        .from('confessions')
        .select('encrypted_content')
        .eq('id', id)
        .single();

      if (confessionError) throw confessionError;

      // Parse the decrypt key
      const keyArray = (key as string).split(',').map(Number);
      const cryptoKey = await importKey(keyArray);

      // Decrypt the content
      const encryptedData = JSON.parse(confession.encrypted_content);
      const decrypted = await decryptText(encryptedData, cryptoKey);

      setDecryptedMessage(decrypted);
    } catch (error) {
      console.error('Error decrypting confession:', error);
      setError('Failed to decrypt message. The link may be invalid or corrupted.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Head>
          <title>Decrypting Message...</title>
        </Head>
        <main>
          <h1>Decrypting Message...</h1>
          <p>Please wait while we decrypt your message.</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Head>
          <title>Error</title>
        </Head>
        <main>
          <h1>Error</h1>
          <p>{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Legacy Message</title>
      </Head>
      <main>
        <h1>Legacy Message</h1>
        <p>You have received a message from someone who is no longer with us:</p>
        <div style={{ 
          border: '1px solid #ccc', 
          padding: '20px', 
          margin: '20px 0',
          backgroundColor: '#f9f9f9',
          whiteSpace: 'pre-wrap'
        }}>
          {decryptedMessage}
        </div>
        <p><em>This message was automatically delivered as part of their digital legacy.</em></p>
      </main>
    </div>
  );
};

export default RecipientPage;
