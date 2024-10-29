'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Copy, Download, EyeOff, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";

type DecryptionRecord = {
  input: string;
  output: string;
  type: 'text' | 'file';
  filename?: string;
};

export default function Recents() {
  const [history, setHistory] = useState<DecryptionRecord[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const storedHistory = localStorage.getItem('decryptionHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const downloadDecryptedMessage = (output: string) => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'decrypted_message.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const deleteRecord = (index: number) => {
    const updatedHistory = history.filter((_, i) => i !== index);
    setHistory(updatedHistory);
    localStorage.setItem('decryptionHistory', JSON.stringify(updatedHistory));
  };

  return (
    <div className="min-h-screen p-8 bg-gray-900">
      <h1 className="text-3xl font-bold text-emerald-500 mb-6">Recent Decryptions</h1>
      <div className="space-y-6">
        {history.map((record, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-emerald-500 mb-2">
                  {record.type === 'text' ? 'Text Decryption' : 'File Decryption'}
                </h3>
                <p className="text-white">
                  <strong>Input:</strong> {record.filename || 'Custom Input by User'}
                </p>
                <p className="text-white">
                  <strong>Output:</strong> decrypted_message.txt
                </p>
              </div>
              <div className="flex space-x-4">
                <Button onClick={() => toggleExpand(index)} className="bg-secondary text-black hover:bg-emerald-500 hover:text-white py-2 text-lg">
                  {expandedIndex === index ? <EyeOff className="mr-2 h-5 w-5" /> : <Eye className="mr-2 h-5 w-5" />} 
                  {expandedIndex === index ? 'Hide' : 'View'}
                </Button>
                <Button onClick={() => navigator.clipboard.writeText(record.output)} className="bg-secondary text-black hover:bg-emerald-500 hover:text-white py-2 text-lg">
                  <Copy className="mr-2 h-5 w-5" /> Copy
                </Button>
                <Button onClick={() => downloadDecryptedMessage(record.output)} className="bg-secondary text-black hover:bg-emerald-500 hover:text-white py-2 text-lg">
                  <Download className="mr-2 h-5 w-5" /> Download
                </Button>
                <Button onClick={() => deleteRecord(index)} className="bg-red-500 text-white hover:bg-red-700 py-2 text-lg">
                  <Trash className="mr-2 h-5 w-5" /> Delete
                </Button>
              </div>
            </div>
            {expandedIndex === index && (
              <div className="mt-4 bg-gray-900 p-4 rounded-lg border border-gray-700">
                <h4 className="font-medium text-emerald-500">Decrypted Message</h4>
                <p className="whitespace-pre-wrap text-white">{record.output}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
