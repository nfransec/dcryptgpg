'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Shield, Lock, Upload, Copy, Download, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import * as openpgp from 'openpgp';

export default function Home() {
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const storedHistory = localStorage.getItem('decryptionHistory');
    if (!storedHistory) {
      localStorage.setItem('decryptionHistory', JSON.stringify([]));
    }
  }, []);

  const updateHistory = (input: string, output: string, type: 'text' | 'file', filename?: string) => {
    const storedHistory = localStorage.getItem('decryptionHistory');
    const history = storedHistory ? JSON.parse(storedHistory) : [];
    history.push({ input, output, type, filename });
    localStorage.setItem('decryptionHistory', JSON.stringify(history));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && /\.(txt|eml|pgp)$/i.test(file.name)) {
      const reader = new FileReader();
      reader.onload = () => {
        setFileContent(reader.result as string);
      };
      reader.readAsText(file);
    } else {
      setError('Please upload a valid .txt, .eml, or .pgp file');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDecrypt = async (content: string, type: 'text' | 'file', filename?: string) => {
    try {
      const privateKeyArmored = process.env.NEXT_PUBLIC_PRIVATE_KEY;
      const passphrase = process.env.NEXT_PUBLIC_PASSPHRASE;

      if (!privateKeyArmored || !passphrase) {
        throw new Error('Private key or passphrase not found');
      }

      const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
        passphrase,
      });

      const message = await openpgp.readMessage({
        armoredMessage: content,
      });

      const { data: decrypted } = await openpgp.decrypt({
        message,
        decryptionKeys: privateKey,
      });

      const decryptedString = typeof decrypted === 'string' ? decrypted : await streamToString(decrypted as ReadableStream<Uint8Array>);

      setDecryptedMessage(decryptedString);
      updateHistory(content, decryptedString, type, filename);
    } catch (err) {
      console.error('Decryption Error:', err);
      setError('Decryption failed. Please check your private key and passphrase.');
    }
  };

  const downloadDecryptedMessage = () => {
    const blob = new Blob([decryptedMessage], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'decrypted_message.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col p-8 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="grid gap-8 w-full max-w-7xl mx-auto">  
        <div className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-emerald-500 to-emerald-600 ">
          <h2 className="text-4xl font-bold text-white flex items-center gap-3">
            <Shield className="w-10 h-10" />
            GPG Email Decryption
          </h2>
          <p className="text-white mt-2 text-lg">
            Securely decrypt PGP-encrypted messages
          </p>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <div className="bg-gray-800 rounded-xl shadow-xl p-8 space-y-4">
            <h3 className="text-xl font-semibold text-emerald-500">Encrypted Message</h3>
            <Textarea
              value={encryptedMessage}
              onChange={(e) => setEncryptedMessage(e.target.value)}
              placeholder="Paste your encrypted message here"
              className="min-h-[300px] text-gray-300 bg-gray-900 border border-gray-700 rounded-lg"
            />
            <Button onClick={() => handleDecrypt(encryptedMessage, 'text')} className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:to-emerald-700 text-white py-4 text-lg">
              <Lock className="mr-3 h-5 w-5" /> Decrypt Message
            </Button>
          </div>


          <div className="bg-gray-800 rounded-xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-emerald-500">Decrypted Message</h3>
              
            </div>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error Occurred</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {decryptedMessage ? (
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 relative">
                <div className='absolute top-2 right-2 flex space-x-2'>
                  <button
                    onClick={() => navigator.clipboard.writeText(decryptedMessage)}
                    className="text-gray-400 hover:text-emerald-500"
                    title="Copy to clipboard"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                  <button
                    onClick={downloadDecryptedMessage}
                    className="text-gray-400 hover:text-emerald-500 p-2"
                    title="Download as text file"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
                <div className="h-[300px] overflow-auto text-gray-300 ">
                  <p className="whitespace-pre-wrap">{decryptedMessage}</p>
                </div>
                <button
                  onClick={() => setDecryptedMessage('')}
                  className="mt-4 w-full py-2 px-4 bg-red-400 hover:bg-red-500 text-gray-200 rounded-lg flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-4 w-4" /> Clear
                </button>
              </div>
            ) : (
              <div className="min-h-[300px] flex items-center justify-center text-gray-500">
                Decrypted message will appear here
              </div>
            )}
          </div>
        </div>


        <div className="bg-gray-800 rounded-xl shadow-xl p-8">
          <div className="flex gap-4">
            <Button variant="outline" className="w-full py-8 text-lg" onClick={triggerFileInput}>
              <Upload className="mr-3 h-5 w-5" /> Upload Encrypted File
              <span className="text-gray-500 text-sm">
                (txt, eml, pgp)
              </span>
            </Button>
            <input
              type="file"
              accept=".txt,.eml,.pgp"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          {fileContent && (
            <div className="mt-4 bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h4 className="font-medium text-emerald-500">File Content</h4>
              <div className="min-h-[300px] overflow-auto text-gray-300 p-2">
                <p className="whitespace-pre-wrap">{fileContent}</p>
              </div>
              <Button onClick={() => handleDecrypt(fileContent, 'file', 'uploaded_file.txt')} className="mt-4 w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:to-emerald-700 text-white py-2 text-lg">
                <Lock className="mr-3 h-5 w-5" /> Decrypt File Content
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


async function streamToString(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = '';
  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    if (value) {
      result += decoder.decode(value, { stream: true });
    }
  }

  return result;
}
