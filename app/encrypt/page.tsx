'use client';

import React, { useState } from 'react';
import * as openpgp from 'openpgp';

export default function EncryptPage() {
  const [message, setMessage] = useState('');
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  const handleGenerateKeys = async () => {
    const keyPair = await openpgp.generateKey({
      userIDs: [{ name: 'John Doe', email: 'john.doe@example.com' }],
      curve: 'ed25519',
      passphrase: 'CSIRTDEVOPENPGPKEYPASSPHRASE',
    });
    setPublicKey(keyPair.publicKey);
    setPrivateKey(keyPair.privateKey);
    localStorage.setItem('publicKey', keyPair.publicKey);
    localStorage.setItem('privateKey', keyPair.privateKey);
  };

  const handleEncrypt = async () => {
    const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
    if (!publicKey) {
      console.error('Public key not found');
      return;
    }

    const encrypted = await openpgp.encrypt({
      message: await openpgp.createMessage({ text: message }),
      encryptionKeys: await openpgp.readKey({ armoredKey: publicKey }),
    });

    setEncryptedMessage(encrypted.toString());
  };

  return (
    <div>
      <h1>Encrypt a Message</h1>
      <button onClick={handleGenerateKeys}>Generate Keys</button>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message here"
        className="w-full text-black mt-4 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button onClick={handleEncrypt} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">Encrypt</button>
      {encryptedMessage && (
        <div>
          <h2>Encrypted Message</h2>
          <textarea readOnly value={encryptedMessage} className="w-full text-black mt-4 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      )}
    </div>
  );
}