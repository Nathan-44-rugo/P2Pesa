# Blind Hunter Code Review Prompt

You are a Blind Hunter code reviewer. Review the following diff only. Check for bugs, syntax errors, security flaws, type mismatches, and common React/TypeScript anti-patterns. Do not assume any external spec or context.

## Diff Output

```diff
diff --git a/p2pesa/src/context/NostrAuthContext.tsx b/p2pesa/src/context/NostrAuthContext.tsx
index 2658..3111 100644
--- a/p2pesa/src/context/NostrAuthContext.tsx
+++ b/p2pesa/src/context/NostrAuthContext.tsx
@@ -19,6 +19,8 @@
   auth: AuthState;
   login: () => Promise<void>;
   logout: () => void;
+  demoMode: boolean;
+  toggleDemoMode: () => void;
 }
 
 const defaultAuth: AuthState = {
@@ -32,6 +34,23 @@
 
 export function NostrAuthProvider({ children }: { children: ReactNode }) {
   const [auth, setAuth] = useState<AuthState>(defaultAuth);
+  const [demoMode, setDemoMode] = useState<boolean>(false);
+
+  // Load from localStorage on client-side mount
+  useEffect(() => {
+    if (typeof window !== 'undefined') {
+      const saved = localStorage.getItem('p2pesa_demo_mode');
+      setDemoMode(saved === 'true');
+    }
+  }, []);
+
+  const toggleDemoMode = useCallback(() => {
+    setDemoMode((prev) => {
+      const next = !prev;
+      localStorage.setItem('p2pesa_demo_mode', String(next));
+      return next;
+    });
+  }, []);
 
   const login = useCallback(async () => {
     setAuth({ ...defaultAuth, status: 'loading' });
@@ -91,7 +91,7 @@
   }, [login, auth.status]);
 
   return (
-    <NostrAuthContext.Provider value={{ auth, login, logout }}>
+    <NostrAuthContext.Provider value={{ auth, login, logout, demoMode, toggleDemoMode }}>
       {children}
     </NostrAuthContext.Provider>
   );
diff --git a/p2pesa/src/components/shared/Navbar.tsx b/p2pesa/src/components/shared/Navbar.tsx
index 2477..cdc7 100644
--- a/p2pesa/src/components/shared/Navbar.tsx
+++ b/p2pesa/src/components/shared/Navbar.tsx
@@ -6,7 +6,7 @@
 import { FiZap, FiLogOut, FiUser } from 'react-icons/fi';
 
 export function Navbar() {
-  const { auth, logout } = useNostrAuth();
+  const { auth, logout, demoMode, toggleDemoMode } = useNostrAuth();
 
   return (
     <nav className="sticky top-0 z-50 border-b border-brand-border bg-brand-dark/90 backdrop-blur-md">
@@ -20,35 +20,50 @@
           </span>
         </Link>
 
-        {auth.status === 'authenticated' && auth.npub ? (
-          <div className="flex items-center gap-4">
+        <div className="flex items-center gap-3">
+          <button
+            onClick={toggleDemoMode}
+            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono-tech uppercase tracking-wider transition-all duration-300 border ${
+              demoMode
+                ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
+                : 'bg-brand-surface border-brand-border text-brand-muted hover:border-amber-500/50 hover:text-amber-400/80'
+            }`}
+            title="Toggle Demo Mode"
+          >
+            <FiZap className={`w-3.5 h-3.5 ${demoMode ? 'fill-current text-amber-400' : ''}`} />
+            <span>{demoMode ? 'Demo Active' : 'Demo Mode'}</span>
+          </button>
+
+          {auth.status === 'authenticated' && auth.npub ? (
+            <div className="flex items-center gap-3">
+              <Link
+                href={`/profile/${auth.npub}`}
+                className="flex items-center gap-2 bg-brand-surface border border-brand-border rounded px-3 py-1.5 hover:border-brand-orange/60 transition-colors"
+              >
+                <FiUser className="w-3.5 h-3.5 text-brand-orange" />
+                <span className="text-white text-xs font-mono-tech">
+                  {auth.npub.slice(0, 8)}...{auth.npub.slice(-4)}
+                </span>
+              </Link>
+              <button
+                onClick={logout}
+                className="flex items-center gap-1.5 text-brand-muted text-xs hover:text-red-400 font-mono-tech uppercase tracking-wider transition-colors"
+                aria-label="Log out"
+              >
+                <FiLogOut className="w-3.5 h-3.5" />
+                <span className="hidden sm:inline">Logout</span>
+              </button>
+            </div>
+          ) : (
             <Link
-              href={`/profile/${auth.npub}`}
-              className="flex items-center gap-2 bg-brand-surface border border-brand-border rounded px-3 py-1.5 hover:border-brand-orange/60 transition-colors"
-            >
-              <FiUser className="w-3.5 h-3.5 text-brand-orange" />
-              <span className="text-white text-xs font-mono-tech">
-                {auth.npub.slice(0, 8)}...{auth.npub.slice(-4)}
-              </span>
+              href="/"
+              className="flex items-center gap-1.5 text-xs font-mono-tech uppercase tracking-wider text-brand-orange border border-brand-orange/30 rounded px-3 py-1.5 hover:bg-brand-orange/5 transition-colors"
+            >
+              <FiZap className="w-3.5 h-3.5" />
+              <span>Login</span>
             </Link>
-            <button
-              onClick={logout}
-              className="flex items-center gap-1.5 text-brand-muted text-xs hover:text-red-400 font-mono-tech uppercase tracking-wider transition-colors"
-              aria-label="Log out"
-            >
-              <FiLogOut className="w-3.5 h-3.5" />
-              <span className="hidden sm:inline">Logout</span>
-            </button>
-          </div>
-        ) : (
-          <Link
-            href="/"
-            className="flex items-center gap-1.5 text-xs font-mono-tech uppercase tracking-wider text-brand-orange border border-brand-orange/30 rounded px-3 py-1.5 hover:bg-brand-orange/5 transition-colors"
-          >
-            <FiZap className="w-3.5 h-3.5" />
-            <span>Login</span>
-          </Link>
-        )}
+          )}
+        </div>
       </div>
     </nav>
diff --git a/p2pesa/src/features/agents/AgentProfileFull.tsx b/p2pesa/src/features/agents/AgentProfileFull.tsx
index 13401..14200 100644
--- a/p2pesa/src/features/agents/AgentProfileFull.tsx
+++ b/p2pesa/src/features/agents/AgentProfileFull.tsx
@@ -16,6 +16,32 @@
 import { npubToPubkey, pubkeyToNpub } from '@/lib/nostr';
 import { fetchAgentReviewEvents } from '@/lib/reputationRelay';
 import { parseReviewEvent, calculateTrustScore } from '@/lib/reputation';
+import { useNostrAuth } from '@/hooks/useNostrAuth';
+
+const SEED_DEMO_REVIEWS = (agentNpub: string): Review[] => [
+  {
+    id: 'demo_rev_1',
+    agentNpub,
+    reviewerNpub: 'npub1reviewer999',
+    reviewerProfile: { npub: 'npub1reviewer999', pubkey: 'reviewer999', display_name: 'Alice K.', picture: 'https://api.dicebear.com/7.x/identicon/svg?seed=alice' },
+    rating: 5,
+    content: 'Excellent transaction. Quick response time and verified balance was correct.',
+    zapAmountSats: 2100,
+    zapVerified: true,
+    createdAt: Date.now() - 3600000 * 2,
+  },
+  {
+    id: 'demo_rev_2',
+    agentNpub,
+    reviewerNpub: 'npub1reviewer888',
+    reviewerProfile: { npub: 'npub1reviewer888', pubkey: 'reviewer888', display_name: 'Ben M.', picture: 'https://api.dicebear.com/7.x/identicon/svg?seed=ben' },
+    rating: 4,
+    content: 'Reliable mobile money swap. Slight delay but very honest.',
+    zapAmountSats: 1000,
+    zapVerified: true,
+    createdAt: Date.now() - 3600000 * 12,
+  }
+];
 
 interface AgentProfileFullProps {
   agent: AgentProfile;
@@ -58,6 +58,7 @@
 }
 
 export default function AgentProfileFull({ agent, reviews, isOwnProfile = false }: AgentProfileFullProps) {
+  const { demoMode } = useNostrAuth();
   const [showReviewForm, setShowReviewForm] = useState(false);
   const [localWalletVerification, setLocalWalletVerification] = useState<WalletVerification | undefined>(agent.walletVerification || agent.wallet);
   const [relayReviews, setRelayReviews] = useState<Review[]>([]);
@@ -64,5 +64,20 @@
   const [relayError, setRelayError] = useState<string | null>(null);
 
+  const activeWalletVerification = useMemo(() => {
+    if (localWalletVerification && localWalletVerification.status === 'verified') {
+      return localWalletVerification;
+    }
+    if (demoMode) {
+      return {
+        status: 'verified' as const,
+        address: 'bc1qdemoaddress123456789012345678901234567',
+        balanceSats: 4200000,
+        verifiedAt: Date.now() - 86400000,
+      };
+    }
+    return localWalletVerification;
+  }, [localWalletVerification, demoMode]);
+
   const { nostrProfile, location, paymentMethods } = agent;
   const name = nostrProfile.display_name || nostrProfile.name || 'Unknown Agent';
 
@@ -94,9 +94,16 @@
     };
   }, [agent.npub]);
 
+  const finalInitialReviews = useMemo(() => {
+    if (demoMode && reviews.length === 0) {
+      return SEED_DEMO_REVIEWS(agent.npub);
+    }
+    return reviews;
+  }, [reviews, demoMode, agent.npub]);
+
   const mergedReviews = useMemo<Review[]>(() => {
     const byId = new Map<string, Review>();
-    for (const r of reviews) {
+    for (const r of finalInitialReviews) {
       byId.set(r.id, r);
     }
     for (const r of relayReviews) {
@@ -103,11 +110,11 @@
     }
     return Array.from(byId.values()).sort((a, b) => b.createdAt - a.createdAt);
-  }, [reviews, relayReviews]);
+  }, [finalInitialReviews, relayReviews]);
 
   const computedTrustScore = useMemo(() => {
     const agentReviews = mergedReviews.map(mapReviewToAgentReview);
-    return calculateTrustScore(agentReviews, localWalletVerification);
+    return calculateTrustScore(agentReviews, activeWalletVerification);
-  }, [mergedReviews, localWalletVerification]);
+  }, [mergedReviews, activeWalletVerification]);
 
   const score = computedTrustScore.score ?? 0;
   const trades = computedTrustScore.verifiedTradeCount ?? 0;
@@ -160,7 +160,7 @@
                   {name.charAt(0).toUpperCase()}
                 </div>
               )}
-              {localWalletVerification?.status === 'verified' && (
+              {activeWalletVerification?.status === 'verified' && (
                 <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-gray-900" title="Bitcoin wallet verified">✓</span>
               )}
             </div>
@@ -218,7 +218,7 @@
       {/* ── Wallet verification ── */}
       <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 space-y-3">
         <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Bitcoin wallet</h2>
-        {localWalletVerification ? (
+        {activeWalletVerification ? (
           <div className="space-y-2">
             <div className="flex items-center justify-between">
               <span className="text-xs text-gray-500">Status</span>
@@ -225,23 +225,23 @@
-                localWalletVerification.status === 'verified'
+                activeWalletVerification.status === 'verified'
                   ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                   : 'bg-gray-800 text-gray-500'
               }`}>
-                {localWalletVerification.status === 'verified' ? '✓ Cryptographically verified' : 'Unverified'}
+                {activeWalletVerification.status === 'verified' ? '✓ Cryptographically verified' : 'Unverified'}
               </span>
             </div>
-            {localWalletVerification.balanceSats != null && (
+            {activeWalletVerification.balanceSats != null && (
               <div className="flex items-center justify-between">
                 <span className="text-xs text-gray-500">On-chain balance</span>
                 <span className="text-sm font-mono font-semibold text-amber-400">
-                  {formatBtc(localWalletVerification.balanceSats)} BTC
-                  <span className="text-gray-600 font-normal text-xs ml-1">({formatSats(localWalletVerification.balanceSats)} sats)</span>
+                  {formatBtc(activeWalletVerification.balanceSats)} BTC
+                  <span className="text-gray-600 font-normal text-xs ml-1">({formatSats(activeWalletVerification.balanceSats)} sats)</span>
                 </span>
               </div>
             )}
-            {localWalletVerification.address && (
+            {activeWalletVerification.address && (
               <div className="flex items-center justify-between gap-4">
                 <span className="text-xs text-gray-500 flex-shrink-0">Address</span>
-                <span className="text-[11px] font-mono text-gray-500 truncate">{localWalletVerification.address}</span>
+                <span className="text-[11px] font-mono text-gray-500 truncate">{activeWalletVerification.address}</span>
               </div>
             )}
             <p className="text-[11px] text-gray-600 pt-1">
@@ -253,7 +253,7 @@
       </div>
 
       {/* ── Deferred Wallet Verification Stub for Own Profile ── */}
-      {isOwnProfile && localWalletVerification?.status !== 'verified' && (
+      {isOwnProfile && activeWalletVerification?.status !== 'verified' && (
         <WalletVerificationStub
           npub={agent.npub}
           onVerified={(v) => setLocalWalletVerification(v)}
diff --git a/p2pesa/src/features/agents/WalletVerificationStub.tsx b/p2pesa/src/features/agents/WalletVerificationStub.tsx
index 04ddb4f..9932886 100644
--- a/p2pesa/src/features/agents/WalletVerificationStub.tsx
+++ b/p2pesa/src/features/agents/WalletVerificationStub.tsx
@@ -3,8 +3,9 @@
 import React, { useState } from 'react';
 import type { WalletVerification } from '@/types/nostr';
 import { generateChallenge, completeWalletVerification } from '@/lib/bitcoin';
-import { FiCheckCircle, FiLoader, FiLock, FiInfo, FiCopy, FiCheck, FiChevronDown, FiChevronUp } from 'react-icons/fi';
+import { FiCheckCircle, FiLoader, FiLock, FiInfo, FiCopy, FiCheck, FiChevronDown, FiChevronUp, FiZap } from 'react-icons/fi';
 import { SiBitcoin } from 'react-icons/si';
+import { useNostrAuth } from '@/hooks/useNostrAuth';
 
 interface WalletVerificationStubProps {
   npub: string;
@@ -17,6 +18,7 @@ export function WalletVerificationStub({
   onVerified,
   className = '',
 }: WalletVerificationStubProps) {
+  const { demoMode } = useNostrAuth();
   const [step, setStep] = useState<'idle' | 'challenge' | 'signing' | 'done'>(
     'idle'
   );
@@ -39,6 +41,11 @@ export function WalletVerificationStub({
     setTimeout(() => setCopiedChallenge(false), 2000);
   };
 
+  const handleAutoFill = () => {
+    setAddress('bc1qdemoaddress123456789012345678901234567');
+    setSignature('demo-signature-verified');
+  };
+
   const handleSubmitSignature = async () => {
     if (!address.trim() || !signature.trim()) {
       setError('Please provide both your wallet address and signature.');
@@ -49,11 +56,24 @@ export function WalletVerificationStub({
     setError(null);
 
     try {
-      const result = await completeWalletVerification(
-        address.trim(),
-        signature.trim(),
-        challenge
-      );
+      let result;
+      if (demoMode && address.trim() === 'bc1qdemoaddress123456789012345678901234567') {
+        result = {
+          data: {
+            status: 'verified' as const,
+            address: address.trim(),
+            balanceSats: 4200000,
+            verifiedAt: Date.now(),
+          },
+          error: null,
+        };
+      } else {
+        result = await completeWalletVerification(
+          address.trim(),
+          signature.trim(),
+          challenge
+        );
+      }
 
       if (result.error || !result.data || result.data.status !== 'verified') {
         setError(result.error ?? 'Verification failed.');
@@ -110,8 +130,17 @@ export function WalletVerificationStub({
       )}
 
       {(step === 'challenge' || step === 'signing') && (
-        <div className="space-y-4 font-mono-tech text-xs">
-          <div>
+        <div className="space-y-4">
+          {demoMode && (
+            <button
+              onClick={handleAutoFill}
+              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono-tech uppercase tracking-wider hover:bg-amber-500/20 transition-all shadow-[0_0_12px_rgba(245,158,11,0.05)]"
+            >
+              <FiZap className="w-3.5 h-3.5 fill-current text-amber-400" />
+              <span>Auto-fill Demo Wallet & Signature</span>
+            </button>
+          )}
+          <div className="font-mono-tech text-xs">
             <div className="flex items-center justify-between mb-1">
               <label className="text-brand-muted text-[10px] uppercase font-bold tracking-wider block">
                 Message to Sign
diff --git a/p2pesa/src/features/reviews/ReviewSubmitForm.tsx b/p2pesa/src/features/reviews/ReviewSubmitForm.tsx
index 09be05d..cdc6b51 100644
--- a/p2pesa/src/features/reviews/ReviewSubmitForm.tsx
+++ b/p2pesa/src/features/reviews/ReviewSubmitForm.tsx
@@ -23,7 +23,7 @@ type Step = 'compose' | 'zap' | 'submitting' | 'done' | 'error';
 const ZAP_PRESETS = [500, 1000, 2100, 5000];
 
 export default function ReviewSubmitForm({ agentNpub, agentName, onSubmitSuccess }: ReviewSubmitFormProps) {
-  const { auth } = useNostrAuth();
+  const { auth, demoMode } = useNostrAuth();
   const [step, setStep] = useState<Step>('compose');
   const [rating, setRating] = useState<ReviewRating | 0>(0);
   const [content, setContent] = useState('');
@@ -38,6 +38,26 @@ export default function ReviewSubmitForm({ agentNpub, agentName, onSubmitSuccess
   const canProceed = rating > 0 && content.trim().length >= MIN_CONTENT && zapReceiptJson.trim().length > 0;
   const finalZapAmount = customZap ? parseInt(customZap, 10) : zapAmount;
 
+  function handleGenerateDemoZap() {
+    const { data: agentPubkey } = npubToPubkey(agentNpub);
+    if (!agentPubkey) return;
+
+    const mockEvent = {
+      id: `demo_zap_${Math.random().toString(36).substring(2, 11)}`,
+      pubkey: auth.pubkey || 'demo_zap_sender_pubkey',
+      created_at: Math.floor(Date.now() / 1000),
+      kind: 9735,
+      tags: [
+        ['p', agentPubkey],
+        ['amount', String(finalZapAmount * 1000)],
+        ['P', auth.pubkey || '']
+      ],
+      content: ''
+    };
+
+    setZapReceiptJson(JSON.stringify(mockEvent, null, 2));
+  }
+
   async function handleZapAndSubmit() {
     if (!auth.pubkey) {
       setError('Log in with Nostr before submitting a verified review.');
@@ -186,9 +206,20 @@ export default function ReviewSubmitForm({ agentNpub, agentName, onSubmitSuccess
 
             {/* NIP-57 Zap Receipt JSON */}
             <div className="space-y-1.5">
-              <label htmlFor="zap-receipt" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
-                NIP-57 Zap Receipt JSON
-              </label>
+              <div className="flex justify-between items-center">
+                <label htmlFor="zap-receipt" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
+                  NIP-57 Zap Receipt JSON
+                </label>
+                {demoMode && (
+                  <button
+                    type="button"
+                    onClick={handleGenerateDemoZap}
+                    className="text-[10px] text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded transition-colors flex items-center gap-1"
+                  >
+                    <span>⚡ Generate Demo Zap</span>
+                  </button>
+                )}
+              </div>
               <textarea
                 id="zap-receipt"
                 rows={4}
```
