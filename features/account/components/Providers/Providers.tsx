import { Button } from 'flowbite-react';
import { ClientSafeProvider } from 'next-auth/react';
import Image from 'next/image';
import React, { FC } from 'react';


interface ProvidersProps {
  providers: ClientSafeProvider[];
  handleProviderSignIn: (provider: ClientSafeProvider) => void;
}

const Providers: FC<ProvidersProps> = (props) => {
  const { providers, handleProviderSignIn } = props;
  return (
    <div className='flex flex-col'>
      {providers.map((provider: ClientSafeProvider) => {
        return (
          <Button
            key={provider.id}
            type='button'
            onClick={() => handleProviderSignIn(provider)}
            color='gray'>
            <Image
              src={`/assets/${provider.id}.png`}
              alt={`${provider.name} logo`}
              width={20}
              height={20}
            />
            <span className='text-lg mx-4'>{provider.name}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default Providers;
