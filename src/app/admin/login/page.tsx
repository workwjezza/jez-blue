'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError(false);
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin');
      } else {
        setError(true);
        setPassword('');
      }
    } catch {
      setError(true);
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-[320px]">
        <h1 className="text-2xl uppercase tracking-tight mb-8 text-center font-mono">
          jez.blue
        </h1>
        
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
          <input
            type="text"
            name="username"
            autoComplete="username"
            value="admin"
            readOnly
            style={{position:'absolute',left:'-9999px',opacity:0}}
            tabIndex={-1}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="w-full px-3 py-3 font-mono text-sm bg-white border border-black outline-none focus:outline-none"
            autoFocus
            disabled={loading}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          
          {error && (
            <p className="text-xs font-mono text-center">incorrect password</p>
          )}
          
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading || !password}
            className="w-full px-3 py-3 font-mono text-sm bg-white border border-black hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black"
          >
            {loading ? 'checking...' : 'enter'}
          </button>
        </form>
      </div>
    </div>
  );
}
