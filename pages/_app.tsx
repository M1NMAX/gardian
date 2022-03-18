import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import "react-datepicker/dist/react-datepicker.css";

const queryClient = new QueryClient();
function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
          <ReactQueryDevtools position='bottom-right' />
        </QueryClientProvider>
      </RecoilRoot>
    </UserProvider>
  );
}

export default App
