import React, { useState } from 'react';
import { signMessage, verifySignature, parseSignature } from '@/lib/crypto/signatures';
import type { RSAKeyPair } from '@/lib/types';
import { FileSignature, Shield, CheckCircle, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import { m } from 'framer-motion';

interface SignVerifyPanelProps {
  keyPair: RSAKeyPair | null;
}

export const SignVerifyPanel: React.FC<SignVerifyPanelProps> = ({ keyPair }) => {
  const [activeTab, setActiveTab] = useState<'sign' | 'verify'>('sign');

  // Sign tab state
  const [signMessage_input, setSignMessage_input] = useState('');
  const [generatedSignature, setGeneratedSignature] = useState<number | null>(null);

  // Verify tab state
  const [verifyMessage, setVerifyMessage] = useState('');
  const [verifySignature_input, setVerifySignature_input] = useState('');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [verificationError, setVerificationError] = useState('');

  const [previousKeyPair, setPreviousKeyPair] = useState(keyPair);
  if (previousKeyPair !== keyPair) {
    setPreviousKeyPair(keyPair);
    setGeneratedSignature(null);
    setVerificationResult(null);
    setVerificationError('');
  }

  if (!keyPair) {
    return (
      <div className="glass-card p-6 text-center opacity-50">
        <FileSignature className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
        <p className="text-slate-500 dark:text-slate-400">Generate a key pair first to sign and verify messages</p>
      </div>
    );
  }

  const handleSign = () => {
    if (signMessage_input.trim()) {
      const sig = signMessage(signMessage_input, keyPair.privateKey);
      setGeneratedSignature(sig);
    }
  };

  const handleVerify = () => {
    if (verifyMessage.trim() && verifySignature_input.trim()) {
      const sig = parseSignature(verifySignature_input, keyPair.publicKey.n);
      if (sig === null) {
        setVerificationResult(null);
        setVerificationError(`Enter a whole decimal signature from 0 to ${keyPair.publicKey.n - 1}.`);
        return;
      }
      setVerificationError('');
      const isValid = verifySignature(verifyMessage, sig, keyPair.publicKey);
      setVerificationResult(isValid);
    }
  };

  const copySignature = () => {
    if (generatedSignature !== null) {
      navigator.clipboard.writeText(generatedSignature.toString());
    }
  };

  const useGeneratedForVerify = () => {
    if (generatedSignature !== null) {
      setVerifyMessage(signMessage_input);
      setVerifySignature_input(generatedSignature.toString());
      setActiveTab('verify');
      setVerificationResult(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-500 rounded-xl">
            <Shield className="w-5 h-5 text-white" />
          </div>
          Interactive Sign & Verify
        </h3>

        {/* Tab Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('sign')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              activeTab === 'sign'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <FileSignature className="w-4 h-4 inline mr-2" />
            Sign Message
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              activeTab === 'verify'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <CheckCircle className="w-4 h-4 inline mr-2" />
            Verify Signature
          </button>
        </div>

        {/* Sign Tab */}
        {activeTab === 'sign' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="quick-sign-message" className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 block">
                Enter message to sign:
              </label>
              <textarea
                id="quick-sign-message"
                value={signMessage_input}
                onChange={(e) => {
                  setSignMessage_input(e.target.value);
                  setGeneratedSignature(null);
                }}
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                placeholder="Type your message here..."
                rows={3}
              />
            </div>

            <button
              onClick={handleSign}
              disabled={!signMessage_input.trim()}
              className="w-full btn-primary justify-center py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileSignature className="w-4 h-4" />
              Generate Signature
            </button>

            {generatedSignature !== null && (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 dark:bg-amber-500/10 border-2 border-amber-300 dark:border-amber-500/30 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Generated Signature</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Using private key (d={keyPair.privateKey.d}, n={keyPair.privateKey.n})
                    </p>
                  </div>
                  <Shield className="w-8 h-8 text-amber-500 dark:text-amber-400" />
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl mb-4">
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Signature:</div>
                  <div className="text-3xl font-bold font-mono text-amber-600 dark:text-amber-400">
                    {generatedSignature}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copySignature}
                    className="flex-1 btn-secondary text-sm py-2"
                  >
                    Copy Signature
                  </button>
                  <button
                    onClick={useGeneratedForVerify}
                    className="flex-1 btn-primary text-sm py-2 bg-emerald-500 hover:bg-emerald-600"
                  >
                    Test Verification
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </m.div>
            )}
          </div>
        )}

        {/* Verify Tab */}
        {activeTab === 'verify' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="verify-message" className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 block">
                Message to verify:
              </label>
              <textarea
                id="verify-message"
                value={verifyMessage}
                onChange={(e) => {
                  setVerifyMessage(e.target.value);
                  setVerificationResult(null);
                  setVerificationError('');
                }}
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                placeholder="Enter the message..."
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="verify-signature" className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 block">
                Signature:
              </label>
              <input
                id="verify-signature"
                type="text"
                value={verifySignature_input}
                onChange={(e) => {
                  setVerifySignature_input(e.target.value);
                  setVerificationResult(null);
                  setVerificationError('');
                }}
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-mono"
                placeholder="Enter the signature number..."
              />
            </div>

            <button
              onClick={handleVerify}
              disabled={!verifyMessage.trim() || !verifySignature_input.trim()}
              className="w-full btn-primary justify-center py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4" />
              Verify Signature
            </button>

            {verificationError && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{verificationError}</p>}

            {verificationResult !== null && (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border-2 rounded-xl p-6 ${
                  verificationResult
                    ? 'bg-green-50 dark:bg-green-500/10 border-green-300 dark:border-green-500/30'
                    : 'bg-red-50 dark:bg-red-500/10 border-red-300 dark:border-red-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                      {verificationResult ? 'Signature Valid!' : 'Signature Invalid!'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Using public key (e={keyPair.publicKey.e}, n={keyPair.publicKey.n})
                    </p>
                  </div>
                  {verificationResult ? (
                    <CheckCircle className="w-8 h-8 text-green-500 dark:text-green-400" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
                  )}
                </div>
                <div className={`p-4 rounded-xl ${
                  verificationResult
                    ? 'bg-green-100 dark:bg-green-500/20'
                    : 'bg-red-100 dark:bg-red-500/20'
                }`}>
                  <p className={`text-sm font-medium ${
                    verificationResult
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-red-700 dark:text-red-300'
                  }`}>
                    {verificationResult ? (
                      <>
                        <Sparkles className="w-4 h-4 inline mr-1" />
                        The toy signature matches. Hash collisions and small keys mean this does not prove authenticity.
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 inline mr-1" />
                        The signature does not match. The message may have been altered or signed with a different key.
                      </>
                    )}
                  </p>
                </div>

                {/* Try tampering suggestion */}
                {verificationResult && (
                  <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      <strong>Try this:</strong> Change the message and verify again. Most changes fail, but this toy hash can collide.
                    </p>
                  </div>
                )}
              </m.div>
            )}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <span className="font-semibold text-amber-600 dark:text-amber-400">Key Insight:</span>{' '}
            {activeTab === 'sign'
              ? 'Anyone can verify your signature with your public key, but only you (with the private key) can create it. This is opposite to encryption!'
              : 'Verification compares truncated FNV-1a hashes with small RSA keys. Different messages can collide, so this demonstration does not provide message integrity.'}
          </div>
        </div>
      </div>
    </div>
  );
};
