import '../styles/globals.css';
import { Flowbite } from 'flowbite-react';
import { SessionProvider } from 'next-auth/react';
import { RecoilRoot } from 'recoil';
import { flowbiteTheme as theme } from '@lib/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


import type { AppProps } from 'next/app';
const queryClient = new QueryClient();
function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <Flowbite theme={{ theme }}>
            <Component {...pageProps} />
          </Flowbite>
          <ReactQueryDevtools position='top-left' />
        </QueryClientProvider>
      </RecoilRoot>
    </SessionProvider>
  );
}

export default App;
