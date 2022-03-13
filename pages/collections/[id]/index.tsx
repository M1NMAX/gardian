import React from 'react'
import { InferGetServerSidePropsType, NextPage } from 'next';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router'
import Head from 'next/head';
import Sidebar from '../../../components/Sidebar';

const Collection: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <>
            <Head>
                <title>
                    {id}
                </title>
            </Head>
            <Sidebar />
            <main className='has-sidebar-width ml-60'>

                Collection {id}
            </main>

        </>
    )
}

export default Collection;

export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx) {
        // access the user session
        const session = getSession(ctx.req, ctx.res);
        console.log(session)
        return { props: { customProp: 'bar' } };
    }
});