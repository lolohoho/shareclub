'use client';

import { LoginLink } from '@kinde-oss/kinde-auth-nextjs';
import { LogIn } from 'lucide-react';

const LoginButton = () => {
  return (
    <LoginLink className="flex w-12 lg:w-full items-center gap-2 hover:bg-primary-foreground font-bold hover:text-primary px-2 py-1 rounded-full justify-center lg:justify-normal">
      <LogIn className="w-6 h-6" />
      <span className="hidden lg:block">Login</span>
    </LoginLink>
  );
};

export default LoginButton;
