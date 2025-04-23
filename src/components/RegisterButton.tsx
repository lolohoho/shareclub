'use client';

import { RegisterLink } from '@kinde-oss/kinde-auth-nextjs';
import { UserPlus } from 'lucide-react';

const RegisterButton = () => {
  return (
    <RegisterLink className="flex w-12 lg:w-full items-center gap-2 hover:bg-primary-foreground font-bold hover:text-primary px-2 py-1 rounded-full justify-center lg:justify-normal">
      <UserPlus className="w-6 h-6" />
      <span className="hidden lg:block">Register</span>
    </RegisterLink>
  );
};

export default RegisterButton;
