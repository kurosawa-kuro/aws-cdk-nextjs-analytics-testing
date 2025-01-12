'use client';

import { useEffect, useState } from 'react';

export default function EnvironmentIndicator() {
  const [env, setEnv] = useState('loading...');

  useEffect(() => {
    setEnv(process.env.NEXT_PUBLIC_ENVIRONMENT || 'development');
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-black/10 dark:bg-white/10 px-4 py-2 rounded-full text-sm">
      Environment: {env}
    </div>
  );
} 