import React, { useEffect, useState } from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Sidebar from '../../components/Sidebar';
import Head from 'next/head';
import { useQuery } from 'react-query';
import CollectionOverview from '../../components/CollectionOverview/CollectionOverview';
import { useRecoilState } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import ActionIcon from '../../components/Frontstate/ActionIcon';
import { AdjustmentsIcon, MenuAlt2Icon, XIcon } from '@heroicons/react/outline';
import { ITemplate } from '../../interfaces';
import { createTemplate, getTemplates } from '../../fetch/templates';
import TemplateOverview from '../../components/TemplateOverview';
import Drawer from '../../components/Drawer';

const TemplatesPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const [sidebar, setSidebar] = useRecoilState(sidebarState);

  const [showDetails, setShowDetails] = useState(false);
  const openDetails = () => setShowDetails(true);
  const closeDetails = () => setShowDetails(false);

  const [currentTemplateId, setCurrentTemplateId] = useState<Number>();
  const [currentTemplate, setCurrentTemplate] = useState<ITemplate>();

  //TODO: Add loading and error
  const { data: templates } = useQuery<ITemplate[], Error>(
    'templates',
    getTemplates
  );

  useEffect(() => {
    if (!templates) return;
    setCurrentTemplate(
      templates.filter((temlate) => temlate._id === currentTemplateId)[0]
    );
  }, [templates, currentTemplateId]);

  const handleOnClickTemplateOverview = (id: Number) => {
    setCurrentTemplateId(id);
    openDetails();
  };

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
        } transition-all duration-200 ease-linear 
        flex h-screen  space-x-2 dark:bg-gray-900 dark:text-white -z-10`}>
        <div className={`${showDetails ? 'w-1/2' : 'w-full'} py-2 px-4`}>
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
          <button onClick={openDetails} className='btn btn-primary'>
            More
          </button>

          {/* Templates  */}
          <div
            className='grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-2 max-h-full
                overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600'>
            {templates &&
              templates.map((template, idx) => (
                <TemplateOverview
                  key={idx}
                  template={template}
                  onTemplateClick={handleOnClickTemplateOverview}
                />
              ))}
          </div>
        </div>
        {/* Details  */}
        {currentTemplate && (
          <Drawer opened={showDetails} onClose={closeDetails}>
            <Drawer.Title>{currentTemplate.name}</Drawer.Title>
            <Drawer.Description>
              <h3>About this template</h3>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>{' '}
            </Drawer.Description>
            <Drawer.Body>
              <div>Some example</div>
              <div>
                <button className='btn btn-primary'>Use template</button>
              </div>
            </Drawer.Body>
            <Drawer.Footer>
              nfn
            </Drawer.Footer>
          </Drawer>
        )}
      </main>
    </>
  );
};

export default TemplatesPage;

export const getServerSideProps = withPageAuthRequired();
