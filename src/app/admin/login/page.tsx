'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="w-full px-3 py-3 font-mono text-sm bg-white border border-black outline-none focus:outline-none"
            autoFocus
            disabled={loading}
          />
          
          {error && (
            <p className="text-xs font-mono text-center">incorrect password</p>
          )}
          
          <button
            type="submit"
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
