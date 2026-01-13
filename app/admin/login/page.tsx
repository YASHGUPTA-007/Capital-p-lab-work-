// app/admin/login/page.tsx
'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin');
    } catch (err: any) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#c1b4df]/20 via-[#f4f7f5] to-[#c7d6c1]/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#c1b4df]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-[#c7d6c1]/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#c1b4df] to-[#c7d6c1] p-1 mb-6 shadow-xl">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <Image 
                src="/logo.png" 
                alt="The Capital P Lab" 
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-serif text-[#755eb1] font-bold mb-2">
            The Capital P Lab
          </h1>
          <p className="text-[#4f75d] text-sm">Administrator Portal</p>
        </div>
        
        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-[#c1b4df]/30 overflow-hidden">
          {/* Header Gradient */}
          <div className="h-2 bg-gradient-to-r from-[#755eb1] via-[#6b54a5] to-[#4f75d]" />
          
          <div className="p-8">
            <h2 className="text-xl font-serif text-[#755eb1] mb-6 text-center">
              Sign in to continue
            </h2>
            
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#4f75d] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#755eb1]/40" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#f4f7f5] border-2 border-[#c1b4df]/30 rounded-xl text-[#2b2e34] focus:outline-none focus:ring-2 focus:ring-[#755eb1] focus:border-transparent transition-all"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[#4f75d] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#755eb1]/40" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#f4f7f5] border-2 border-[#c1b4df]/30 rounded-xl text-[#2b2e34] focus:outline-none focus:ring-2 focus:ring-[#755eb1] focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#755eb1] to-[#4f75d] hover:from-[#6b54a5] hover:to-[#5a8a6a] text-white font-bold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[#4f75d]/60 text-xs mt-6">
          Authorized access only • {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}