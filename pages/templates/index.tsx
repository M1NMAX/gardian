import React, { useEffect, useState } from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Sidebar from '../../components/Sidebar';
import Head from 'next/head';
import { useQuery } from 'react-query';
import { useRecoilState } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import ActionIcon from '../../components/Frontstate/ActionIcon';
import { AdjustmentsIcon, MenuAlt2Icon } from '@heroicons/react/outline';
import { ITemplate } from '../../interfaces';
import { createTemplate, getTemplates } from '../../fetch/templates';
import TemplateOverview from '../../components/TemplateOverview';
import Drawer from '../../components/Frontstate/Drawer';
import { createCollection } from '../../fetch/collections';
import { getGroups } from '../../fetch/group';
import { useRouter } from 'next/router';

const TemplatesPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const router = useRouter();
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

  const createMockTemplate = async () => {
    let newTemplate: ITemplate = {
      name: 'Events',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
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

  const createCollectionFromTemplate = async (blank: boolean) => {
    if (!templates) return;
    const template: ITemplate = templates.filter(
      (temlate) => temlate._id === currentTemplateId
    )[0];

    const { name, properties } = template;
    try {
      const groups = await getGroups();
      //make sure that the first group id is not null
      if (!groups[0]._id) return;

      const res = await createCollection({
        collection: { name, template: { name: 'empty', properties } },
        groupId: groups[0]._id,
      });

      router.push('/collections/' + res._id);
    } catch (error) {
      console.log(error);
    }
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
        <div className={`${showDetails ? 'w-2/3' : 'w-full'} py-2 px-4`}>
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
          <button onClick={createMockTemplate} className='btn btn-primary'>
            Create mock template
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
              <h3 className='font-medium'>About this template</h3>
              <p>{currentTemplate.description}</p>
            </Drawer.Description>

            <Drawer.Body>
              <div>
                <p>Example of item </p>
                <div></div>
              </div>
            </Drawer.Body>
            <Drawer.Footer>
              <div className='flex space-x-2'>
                <button
                  onClick={() => createCollectionFromTemplate(false)}
                  className='btn btn-primary'>
                  Use blank template
                </button>
                <button
                  onClick={() => createCollectionFromTemplate(true)}
                  className='btn btn-primary'>
                  Use pre-filled
                </button>
              </div>
            </Drawer.Footer>
          </Drawer>
        )}
      </main>
    </>
  );
};

export default TemplatesPage;

export const getServerSideProps = withPageAuthRequired();
