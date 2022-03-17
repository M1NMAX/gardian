import React from 'react'
import { InferGetServerSidePropsType, NextPage } from 'next';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router'
import Head from 'next/head';
import Sidebar from '../../../components/Sidebar';
import { useRecoilState } from 'recoil';
import { sidebarState } from '../../../atoms/sidebarAtom';
import IconBtn from '../../../components/IconBtn';
import { MenuAlt2Icon, PencilIcon } from '@heroicons/react/outline';
import { useQuery } from 'react-query';
import { CollectionInterface } from '../../../interfaces';
import Link from 'next/link';
import Collection from '../../../components/Collection';

const Collections: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
    const router = useRouter();
    const { id } = router.query;
    const [sidebar, setSidebar] = useRecoilState(sidebarState);

    const { data } = useQuery<CollectionInterface>('collection', async (): Promise<CollectionInterface> => {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/collections/' + id);
        const response = await res.json();
        return response.data;
    })


    return (
        <>
            <Head>
                <title>
                    {data ? data.name : 'Loading...'}
                </title>
            </Head>
            <Sidebar />
            <main className={`${sidebar ? 'w-full md:has-sidebar-width md:ml-60' : 'w-full'} main-content`}>
                <div className='flex justify-between items-center'>

                    <div className='flex items-center space-x-2'>
                        {!sidebar && <IconBtn icon={<MenuAlt2Icon />} onClick={() => setSidebar(true)} />}
                        <h1 className='space-x-0.5 text-xl'>
                            <span>
                                <Link href='/collections'>
                                    <a className='hover:text-primary-bright '>
                                        Collections
                                    </a>
                                </Link>
                            </span>
                            <span>/</span>
                            <span className='font-medium'>
                                {data?.name}
                            </span>
                        </h1>
                    </div>
                    <div className='flex items-center space-x-1'>
                        <button className='btn btn-primary'>New</button>
                        <button className='btn btn-primary'><PencilIcon className='icon-sm' /></button>
                    </div>
                </div>
                {data ? <Collection collection={data} /> : 'Loading...'}
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