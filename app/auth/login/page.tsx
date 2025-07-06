'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TreePine, User, Lock, Mail } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Handle login logic here
    console.log('Login attempt:', { email, password });
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-amber-200/50 shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="bg-amber-100 rounded-full p-3">
              <TreePine className="h-8 w-8 text-amber-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-amber-900">
            Welcome Back
          </CardTitle>
          <p className="text-amber-700">
            Sign in to your WoodCraft account
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-amber-900">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-amber-200 focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-amber-900">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-amber-200 focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label className="flex items-center space-x-2 text-sm text-amber-700">
                <input type="checkbox" className="rounded border-amber-300" />
                <span>Remember me</span>
              </Label>
              <Link href="/auth/forgot-password" className="text-sm text-amber-600 hover:text-amber-800">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <Separator className="bg-amber-200" />

          <div className="text-center space-y-4">
            <p className="text-amber-700">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-amber-600 hover:text-amber-800 font-semibold">
                Sign up
              </Link>
            </p>
            
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full border-amber-200 text-amber-700 hover:bg-amber-50"
                asChild
              >
                <Link href="/auth/manager-login">
                  <User className="h-4 w-4 mr-2" />
                  Manager Login
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}