import React, { useEffect, useState } from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Sidebar from '../../components/Sidebar';
import Head from 'next/head';
import { useRecoilState } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import ActionIcon from '../../components/Frontstate/ActionIcon';
import { AdjustmentsIcon, MenuAlt2Icon } from '@heroicons/react/outline';
import TemplateOverview from '../../components/TemplateOverview';
import Drawer from '../../components/Frontstate/Drawer';
import { createCollection } from '../../fetch/collections';
import { addCollectionToGroup, getGroups } from '../../fetch/group';
import { useRouter } from 'next/router';
import { IItem, ITemplate } from '../../interfaces';
import templates from '../../data/templates';
import Property from '../../backend/models/Property';

const TemplatesPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const router = useRouter();
  const [sidebar, setSidebar] = useRecoilState(sidebarState);

  const [showDetails, setShowDetails] = useState(false);
  const openDetails = () => setShowDetails(true);
  const closeDetails = () => setShowDetails(false);

  const [currentTemplateId, setCurrentTemplateId] = useState<number>();
  const [currentTemplate, setCurrentTemplate] = useState<ITemplate>();

  const getTemplate = (id: number) => {
    const template = templates.find((template) => template._id === id);
    return template;
  };

  useEffect(() => {
    if (!currentTemplateId) return;
    setCurrentTemplate(getTemplate(currentTemplateId));
  }, [currentTemplateId]);

  const handleOnClickTemplateOverview = (id: number) => {
    setCurrentTemplateId(id);
    openDetails();
  };

  const isIItem = (obj: any): obj is IItem => {
    return 'name' in obj && 'properties' in obj;
  };
  const createCollectionBasedOnTemplate = async () => {
    if (!currentTemplateId) return;

    const template = getTemplate(currentTemplateId);
    if (!template) return;

    const { name, properties } = template;
    try {
      const groups = await getGroups();
      //make sure that the first group id is not null
      if (!groups[0]._id) throw 'There are not group available';
      const collection = await createCollection({
        name,
        description: '',
        isDescriptionHidden: false,
        isFavourite: false,
        properties: properties.map((property) => ({
          name: property.name,
          type: property.type,
          values: property.values,
          color: property.color,
        })),
      });

      if (!collection._id) throw 'Collection creation failed';
      await addCollectionToGroup(groups[0]._id, collection._id);

      router.push('/collections/' + collection._id);
    } catch (error) {
      console.log(error);
    }
  };
  const getPropertyValue = (item: IItem, id: number): string => {
    if (!id) return '';
    const property = item.properties.find((property) => property._id === id);
    if (!property) return '';
    return property.value;
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
                <div className='flex flex-col space-y-2'>
                  {currentTemplate.items?.map(
                    (item, idx) =>
                      isIItem(item) && (
                        <span
                          key={idx}
                          className='w-full px-2 flex flex-col border-l-2 border-green-500 '>
                          <span className='font-semibold text-lg'>
                            {item.name}
                          </span>
                          {currentTemplate.properties.map(
                            (templateProperty) =>
                              getPropertyValue(
                                item,
                                templateProperty._id || -1
                              ) != '' && (
                                <span className='space-x-1'>
                                  <span>{templateProperty.name}</span>
                                  <span className='px-1 font-light rounded  bg-gray-200 dark:bg-gray-700'>
                                    {getPropertyValue(
                                      item,
                                      templateProperty._id || -1
                                    )}
                                  </span>
                                </span>
                              )
                          )}
                        </span>
                      )
                  )}
                </div>
              </div>
            </Drawer.Body>
            <Drawer.Footer>
              <button
                onClick={createCollectionBasedOnTemplate}
                className='w-full flex items-center justify-center p-1 rounded 
                  bg-primary hover:bg-primary-dark'>
                Use this template
              </button>

              <span className='text-xs text-center'>
                The collection will start empty
              </span>
            </Drawer.Footer>
          </Drawer>
        )}
      </main>
    </>
  );
};

export default TemplatesPage;

export const getServerSideProps = withPageAuthRequired();
