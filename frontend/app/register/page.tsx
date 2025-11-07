'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/Context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShoppingBag, Loader2, Dumbbell } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [agreed, setAgreed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // if () {
  //   router.push('/');
  //   return null;
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    if (agreed === false) {
      setError('You must agree to the terms and conditions');
      setLoading(false);
      return;
    }

    const { error: signUpError } = await signUp(email, password,);

    if (signUpError) {
      setError(signUpError.message || 'Failed to create account');
      setLoading(false);
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-emerald-100 rounded-full">
              <Dumbbell className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">FITZDO</CardTitle>
          <CardDescription>Create an account to start shopping</CardDescription>

        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

          </CardContent>
          <CardFooter className="flex flex-col space-y-4">

            <div className="flex items-center text-sm text-slate-600 space-x-2 mt-2">
              <input
                type="checkbox"
                id="agree"
                className="w-4 h-4 text-emerald-400 border-slate-300 rounded focus:ring-emerald-500"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor="agree" className="flex flex-wrap items-center gap-1">
                By continuing I agree to FITZDO's
                <Link
                  href="#"
                  className="text-emerald-400 hover:text-emerald-700 font-semibold"
                >
                  Privacy Policy
                </Link>
                {' '}and{' '}
                <Link
                  href="#"
                  className="text-emerald-400 hover:text-emerald-700 font-semibold"
                >
                  Terms of Service
                </Link>
              </label>
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            <p className="text-sm text-center text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div >
  );
}
