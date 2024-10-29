'use client';

import React, { useState } from 'react';
import * as openpgp from 'openpgp';

export default function EncryptPage() {
  const [message, setMessage] = useState('');
  const [encryptedMessage, setEncryptedMessage] = useState('');

  const handleEncrypt = async () => {
    try {
      const publicKeyArmored = process.env.NEXT_PUBLIC_PUBLIC_KEY!;
      const privateKeyArmored = process.env.NEXT_PUBLIC_PRIVATE_KEY!;
      const passphrase = process.env.NEXT_PUBLIC_PASSPHRASE!;

      const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
      const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
        passphrase,
      });

      const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: message }),
        encryptionKeys: publicKey,
        signingKeys: privateKey,
      });

      setEncryptedMessage(encrypted.toString());
    } catch (error) {
      console.error('Encryption failed:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen rounded-lg shadow-lg bg-gray-900]">
      <h1 className="text-2xl font-bold text-emerald-500 mb-4">Encrypt Message</h1>
      <textarea
        className="w-full p-3 mb-4 rounded-md border border-gray-700 bg-gray-900 text-white"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message here"
      />
      <button
        className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
        onClick={handleEncrypt}
      >
        Encrypt Message
      </button>
      {encryptedMessage && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-emerald-500 mb-2">Encrypted Message</h2>
          <pre className="p-3 bg-gray-900 rounded-md text-white">{encryptedMessage}</pre>
        </div>
      )}
    </div>
  );
}