'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Copy, Download, EyeOff, Trash } from 'lucide-react';
import './page.css';
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
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-emerald-400 mb-4 sm:mb-6">Recent Decryptions</h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-2 sm:p-4 border-b border-gray-700">Type</th>
              <th className="p-2 sm:p-4 border-b border-gray-700">Input</th>
              <th className="p-2 sm:p-4 border-b border-gray-700">Output</th>
              <th className="p-2 sm:p-4 border-b border-gray-700">Status</th>
              <th className="p-2 sm:p-4 border-b border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record, index) => (
              <tr key={index} className="hover:bg-gray-800">
                <td className="p-2 sm:p-4 border-b border-gray-700">
                  {record.type === 'text' ? 'Text Decryption' : 'File Decryption'}
                </td>
                <td className="p-2 sm:p-4 border-b border-gray-700">
                  {record.filename || 'Custom Input by User'}
                </td>
                <td className="p-2 sm:p-4 border-b border-gray-700">
                  {record.type === 'file' ? (
                    <>
                      <div className="flex flex-row items-center">
                      decrypted_message.txt
                      <button
                        onClick={() => downloadDecryptedMessage(record.output)}
                        className="ml-2 text-gray-400 hover:text-gray-500"
                      > 
                        <Download className="w-5 h-5" />
                      </button>
                      </div>
                    </>
                    
                  ) : (
                    expandedIndex === index ? record.output : '********'
                  )}
                </td>
                <td className="p-2 sm:p-4 border-b border-gray-700">
                  <div className="w-16 sm:w-24 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-1 bg-emerald-400" style={{ width: '100%' }}></div>
                  </div>
                </td>
                <td className="p-2 sm:p-4 border-b border-gray-700 space-x-1 sm:space-x-2">
                  <button onClick={() => toggleExpand(index)} className="text-gray-400 hover:text-gray-500">
                    {expandedIndex === index ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <button onClick={() => navigator.clipboard.writeText(record.output)} className="text-gray-400 hover:text-gray-500">
                    <Copy className="w-5 h-5" />
                  </button>
                  <button onClick={() => deleteRecord(index)} className="text-gray-400 hover:text-gray-500">
                    <Trash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

