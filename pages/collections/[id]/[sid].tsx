import React, { useEffect } from 'react'
import { InferGetServerSidePropsType, NextPage } from 'next';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router'
import Head from 'next/head';
import Sidebar from '../../../components/Sidebar';
import { useRecoilValue } from 'recoil';
import { sidebarState } from '../../../atoms/sidebarAtom';
import { useQuery } from 'react-query';
import { CollectionInterface } from '../../../interfaces';
import Collection from '../../../components/Collection';
import Link from 'next/link';

const Collections: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
    const router = useRouter();
    const { id, sid } = router.query;
    const sidebar = useRecoilValue(sidebarState);

    const { data: collection, refetch } = useQuery<CollectionInterface>('collection', async (): Promise<CollectionInterface> => {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/collections/' + sid);
        const response = await res.json();
        return response.data;
    })

    useEffect(() => { refetch() }, [id])

    // 624aba92bea5603fb6f1056b

    return (
        <>
            <Head>
                <title>
                    {collection ? collection.name : 'Loading...'}
                </title>
            </Head>
            <Sidebar />
            <main className={`${sidebar ? 'w-full md:has-sidebar-width md:ml-60' : 'w-full'} main-content`}>
                {collection &&
                    <Collection>
                        <Collection.Header collection={collection}>
                            <h1>
                                <span>
                                    <Link href='/collections'>
                                        <a className='hover:text-primary-bright '>
                                            Collections
                                        </a>
                                    </Link>
                                </span>
                                <span>/fgnago/</span>
                                <span className='font-medium'>
                                    {collection.name}
                                </span></h1>
                        </Collection.Header>
                        <Collection.Title>
                            {collection.name}
                        </Collection.Title>
                        <Collection.Description hidden={collection.isDescriptionHidden}>
                            {collection.description}
                        </Collection.Description>
                        <Collection.Body variant={collection.variant} />
                    </Collection>}
            </main>

        </>
    )
}

export default Collections;

export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx) {
        // access the user session
        const session = getSession(ctx.req, ctx.res);
        console.log(session)
        return { props: { customProp: 'bar' } };
    }
});