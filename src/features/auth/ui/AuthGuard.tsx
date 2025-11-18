import React, { useEffect, useState } from 'react';
import { useAuth } from '../model/useAuth';
import { AuthRequiredScreen } from './AuthRequiredScreen';
import { useRouter } from 'expo-router';

interface AuthGuardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  icon?: any;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  title,
  description,
  icon,
}) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <AuthRequiredScreen
        title={title}
        description={description}
        icon={icon}
      />
    );
  }

  return <>{children}</>;
};
