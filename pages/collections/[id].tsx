import React, { useEffect } from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import { useRecoilValue } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import { useQuery } from 'react-query';
import { ICollection } from '../../interfaces';
import Collection from '../../components/Collection';

const Collections: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const router = useRouter();
  const { id } = router.query;
  const sidebar = useRecoilValue(sidebarState);

  const { data: collection, refetch } = useQuery<ICollection>(
    'collection',
    async (): Promise<ICollection> => {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + '/collections/' + id
      );
      const response = await res.json();
      return response.data;
    }
  );

  useEffect(() => {
    refetch();
  }, [id]);

  return (
    <>
      <Head>
        <title> {collection ? collection.name : 'Loading...'}</title>
      </Head>
      <Sidebar />
      <main
        className={`${
          sidebar ? 'w-full md:has-sidebar-width md:ml-60' : 'w-full'
        } main-content`}>
        {collection && (
          <Collection>
            <Collection.Header collection={collection}>
              <h1 className='font-medium'>{collection.name}</h1>
            </Collection.Header>
            <Collection.Title>{collection.name}</Collection.Title>
            <Collection.Description>
              {collection.description}
            </Collection.Description>
            <Collection.Body>heo</Collection.Body>
          </Collection>
        )}
      </main>
    </>
  );
};

export default Collections;

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    // access the user session
    const session = getSession(ctx.req, ctx.res);
    console.log(session);
    return { props: { customProp: 'bar' } };
  },
});
