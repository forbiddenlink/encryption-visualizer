import React, { useState } from 'react';
import { encryptRSA, decryptRSA } from '@/lib/crypto/rsa';
import type { RSAKeyPair } from '@/lib/types';
import { Lock, Unlock, ArrowRight, Sparkles } from 'lucide-react';
import { m } from 'framer-motion';

interface RSAEncryptDecryptPanelProps {
  keyPair: RSAKeyPair | null;
}

export const RSAEncryptDecryptPanel: React.FC<RSAEncryptDecryptPanelProps> = ({ keyPair }) => {
  const [message, setMessage] = useState('42');
  const [encrypted, setEncrypted] = useState<number | null>(null);
  const [decrypted, setDecrypted] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!keyPair) {
    return (
      <div className="glass-card p-6 text-center opacity-50">
        <Lock className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
        <p className="text-slate-500 dark:text-slate-400">Generate a key pair first to encrypt and decrypt messages</p>
      </div>
    );
  }

  const handleEncrypt = () => {
    const messageNum = Number(message);
    if (!message.trim() || !Number.isInteger(messageNum) || messageNum < 0 || messageNum >= keyPair.publicKey.n) {
      setError(`Message must be a whole number between 0 and ${keyPair.publicKey.n - 1}`);
      return;
    }
    setError(null);
    const ciphertext = encryptRSA(messageNum, keyPair.publicKey);
    setEncrypted(ciphertext);
    setDecrypted(null);
  };

  const handleDecrypt = () => {
    if (encrypted === null) return;
    const plaintext = decryptRSA(encrypted, keyPair.privateKey);
    setDecrypted(plaintext);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-green-600 rounded-xl">
            <Lock className="w-5 h-5 text-white" />
          </div>
          Encrypt & Decrypt Messages
        </h3>

        {/* Message Input */}
        <div className="space-y-2">
          <label htmlFor="rsa-message" className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Enter a number to encrypt (0 to {keyPair.publicKey.n - 1}):
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="rsa-message"
              aria-invalid={error !== null}
              aria-describedby={error ? 'rsa-message-error' : undefined}
              type="number"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              min="0"
              max={keyPair.publicKey.n - 1}
              className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all font-mono"
              placeholder="Enter a number..."
            />
            <button
              onClick={handleEncrypt}
              className="btn-primary px-6"
            >
              <Lock className="w-4 h-4" />
              Encrypt
            </button>
          </div>
          {error && <p id="rsa-message-error" role="alert" className="text-sm text-red-700 dark:text-red-300">{error}</p>}
        </div>

        {/* Encryption Flow */}
        {encrypted !== null && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Encrypted Value */}
            <div className="bg-red-50 dark:bg-red-500/10 border-2 border-red-300 dark:border-red-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Encrypted Message</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Using public key (e={keyPair.publicKey.e}, n={keyPair.publicKey.n})</p>
                </div>
                <Lock className="w-8 h-8 text-red-500 dark:text-red-400" />
              </div>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl">
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Ciphertext:</div>
                <div className="text-3xl font-bold font-mono text-red-600 dark:text-red-400">{encrypted}</div>
              </div>
              <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                Formula: C = M^e mod n = {message}^{keyPair.publicKey.e} mod {keyPair.publicKey.n} = {encrypted}
              </div>
            </div>

            {/* Decrypt Button */}
            <div className="flex justify-center">
              <button
                onClick={handleDecrypt}
                className="btn-primary px-8 py-4"
              >
                <Unlock className="w-5 h-5" />
                Decrypt with Private Key
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Decrypted Value */}
            {decrypted !== null && (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 dark:bg-green-500/10 border-2 border-green-300 dark:border-green-500/30 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Decrypted Message</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Using private key (d={keyPair.privateKey.d}, n={keyPair.privateKey.n})</p>
                  </div>
                  <Unlock className="w-8 h-8 text-green-500 dark:text-green-400" />
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl">
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Original message recovered:</div>
                  <div className="text-3xl font-bold font-mono text-green-600 dark:text-green-400">{decrypted}</div>
                </div>
                <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                  Formula: M = C^d mod n = {encrypted}^{keyPair.privateKey.d} mod {keyPair.privateKey.n} = {decrypted}
                </div>
                {decrypted === parseInt(message) && (
                  <div className="mt-4 flex items-center gap-2 p-3 bg-green-100 dark:bg-green-500/20 border border-green-300 dark:border-green-500/30 rounded-xl">
                    <Sparkles className="w-5 h-5 text-green-500 dark:text-green-400" />
                    <span className="text-sm font-bold text-green-700 dark:text-green-300">
                      ✓ Successfully decrypted! Original message matches.
                    </span>
                  </div>
                )}
              </m.div>
            )}
          </m.div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <span className="font-semibold text-purple-600 dark:text-purple-400">The Magic of RSA:</span> Anyone can encrypt a message with your public key, but only you (with the private key) can decrypt it. This is the foundation of secure communication!
          </div>
        </div>
      </div>
    </div>
  );
};
