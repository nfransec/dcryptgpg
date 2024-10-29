'use client';

import React, { useState } from 'react';
import * as openpgp from 'openpgp';

export default function Home() {
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');

  const handleDecrypt = async () => {
    const privateKeyArmored = process.env.NEXT_PUBLIC_PRIVATE_KEY;
    const passphrase = process.env.NEXT_PUBLIC_PASSPHRASE;

    if (!privateKeyArmored) {
      console.error('Private key not found');
      return;
    }

    try {
      const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
        passphrase,
      });

      const decrypted = await openpgp.decrypt({
        message: await openpgp.readMessage({ armoredMessage: encryptedMessage }),
        decryptionKeys: privateKey,
      });

      setDecryptedMessage(decrypted.data.toString());
    } catch (error) {
      console.error('Decryption failed:', error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">
          <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text">
            Hello, Let's decrypt your message
          </span>
        </h1>
        <textarea
          value={encryptedMessage}
          onChange={(e) => setEncryptedMessage(e.target.value)}
          placeholder="Paste your encrypted message here"
          className="w-full text-black mt-4 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button onClick={handleDecrypt} className="mt-4 p-2 bg-indigo-500 text-white rounded-md">
          Decrypt
        </button>
        {decryptedMessage && (
          <div>
            <h2>Decrypted Message</h2>
            <p>{decryptedMessage}</p>
          </div>
        )}
        <input
          type="file"
          className="mt-4 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        {/* Footer content */}
      </footer>
    </div>
  );
}
