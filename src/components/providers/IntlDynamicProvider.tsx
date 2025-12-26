'use client';

import { ReactNode, useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { usePathname } from 'next/navigation';

interface IntlDynamicProviderProps {
  children: ReactNode;
}

// Using a broad type compatible with AbstractIntlMessages
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Messages = Record<string, any>;

export default function IntlDynamicProvider({ children }: IntlDynamicProviderProps) {
  const pathname = usePathname();
  const [locale, setLocale] = useState<'en' | 'de'>('en');
  const [messages, setMessages] = useState<Messages | null>(null);

  useEffect(() => {
    const firstSegment = pathname.split('/').filter(Boolean)[0];
    const newLocale: 'en' | 'de' = firstSegment === 'de' ? 'de' : 'en';
    setLocale(newLocale);
    let cancelled = false;
    import(`@/messages/${newLocale}.json`).then(mod => {
      if (!cancelled) setMessages(mod.default);
    }).catch(async () => {
      const fallback = await import('@/messages/en.json');
      if (!cancelled) setMessages(fallback.default);
    });
    return () => { cancelled = true; };
  }, [pathname]);

  if (!messages) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <div className="text-sm text-gray-600">Loading...</div>
      </div>
    </div>;
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Berlin">
      {children}
    </NextIntlClientProvider>
  );
}
