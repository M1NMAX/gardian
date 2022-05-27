import React, { useState } from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Sidebar from '../../components/Sidebar';
import Head from 'next/head';
import { useQuery } from 'react-query';
import CollectionOverview from '../../components/CollectionOverview/CollectionOverview';
import { useRecoilState } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import ActionIcon from '../../components/Frontstate/ActionIcon';
import { AdjustmentsIcon, MenuAlt2Icon } from '@heroicons/react/outline';
import { ITemplate } from '../../interfaces';
import { createTemplate, getTemplates } from '../../fetch/templates';
import TemplateOverview from '../../components/TemplateOverview';

const TemplatesPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ user }) => {
  const [sidebar, setSidebar] = useRecoilState(sidebarState);

  //TODO: Add loading and error
  const { data: templates } = useQuery<ITemplate[], Error>(
    'templates',
    getTemplates
  );

  const create = async () => {
    let newTemplate: ITemplate = {
      name: 'Events',
      properties: [
        { name: 'onve', type: 'text', values: [''], color: '#dc2626' },
        {
          name: 'teow',
          type: 'select',
          values: ['one', 'm'],
          color: '#facc15',
        },
      ],
    };
    const res = await createTemplate(newTemplate);
    console.log(res);
  };

  return (
    <>
      <Head>
        <title>Collections</title>
      </Head>
      <Sidebar />
      <main
        className={`${
          sidebar ? 'w-full md:has-sidebar-width md:ml-60' : 'w-full'
        } main-content`}>
        <div className='flex justify-between items-center'>
          {/* Header  */}
          <div className='flex items-center space-x-2'>
            {!sidebar && (
              <ActionIcon
                icon={<MenuAlt2Icon />}
                onClick={() => setSidebar(true)}
              />
            )}
          </div>
          <div className='flex items-center space-x-1.5'>
            <ActionIcon
              icon={<AdjustmentsIcon className='rotate-90' />}
              variant='filled'
            />
          </div>
        </div>

        {/* Title  */}
        <h1 className='font-semibold text-3xl '>Templates</h1>
        <button onClick={create} className='btn btn-primary'>
          More
        </button>

        {/* Templates  */}
        <div
          className='grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-2 max-h-full
                overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600'>
          {templates &&
            templates.map((template, idx) => (
              <TemplateOverview key={idx} template={template} />
            ))}
        </div>
      </main>
    </>
  );
};

export default TemplatesPage;

export const getServerSideProps = withPageAuthRequired();
