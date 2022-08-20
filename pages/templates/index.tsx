import React, { useCallback, useEffect, useState } from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Sidebar from '../../components/Sidebar';
import Head from 'next/head';
import { useRecoilState } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import TemplateOverview from '../../components/TemplateOverview';
import Drawer from '../../components/Frontstate/Drawer';
import { createCollection } from '../../fetch/collections';
import { addCollectionToGroup, getGroups } from '../../fetch/group';
import { useRouter } from 'next/router';
import { IItem, ITemplate, SortOption } from '../../interfaces';
import { templates as rawTemplates } from '../../data/templates';
import ViewRadioGroup from '../../components/ViewRadioGroup';
import useLocalStorage from '../../hooks/useLocalStorage';
import SortOptionsListbox from '../../components/SortOptionsListbox';
import Header from '../../components/Header';

const sortOptions: SortOption[] = [
  { name: 'Name Ascending', alias: 'name+asc' },
  { name: 'Name Descending', alias: 'name+des' },
];

const TemplatesPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const router = useRouter();
  const [sidebar, setSidebar] = useRecoilState(sidebarState);

  const [showDrawer, setShowDrawer] = useState(false);
  const openDrawer = () => setShowDrawer(true);
  const closeDrawer = () => {
    setShowDrawer(false);
    setCurrentTemplateId(null);
  };

  const [selectedView, setSelectedView] = useLocalStorage<string>(
    'templateView',
    'grid'
  );
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
  const [templates, setTemplates] = useState(rawTemplates);

  const dynamicSort = (par: string) => {
    const [property, order] = par.split('+');

    const sortOrder = order === 'asc' ? 1 : -1;

    return (a: ITemplate, b: ITemplate) => {
      const aPorperty = a[property as keyof typeof a] || a.name;
      const bPorperty = b[property as keyof typeof b] || b.name;
      let result = aPorperty < bPorperty ? -1 : aPorperty > bPorperty ? 1 : 0;
      return result * sortOrder;
    };
  };

  useEffect(
    () => setTemplates(templates.sort(dynamicSort(selectedSort.alias))),
    [selectedSort]
  );

  const [currentTemplateId, setCurrentTemplateId] = useState<string | null>(
    null
  );
  const [currentTemplate, setCurrentTemplate] = useState<ITemplate>();

  const getTemplate = useCallback(
    (id: string) => {
      const template = templates.find((template) => template._id === id);
      return template;
    },
    [templates]
  );

  useEffect(() => {
    if (!currentTemplateId) return;
    setCurrentTemplate(getTemplate(currentTemplateId));
  }, [templates, currentTemplateId]);

  const handleOnClickTemplateOverview = (id: string) => {
    setCurrentTemplateId(id);
    openDrawer();
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
        items: [],
        properties: properties.map(({ name, type, values }) => ({
          name,
          type,
          values,
        })),
      });

      if (!collection._id) throw 'Collection creation failed';
      await addCollectionToGroup(groups[0]._id, collection._id);

      router.push('/collections/' + collection._id);
    } catch (error) {
      console.log(error);
    }
  };

  const getPropertyValue = (item: IItem, id: string): string => {
    if (id === '') return '';
    const property = item.properties.find((property) => property._id === id);
    if (!property) return '';
    return property.value;
  };

  return (
    <>
      <Head>
        <title>Templates</title>
      </Head>
      <Sidebar />
      <main
        className={`${
          sidebar ? 'w-full md:has-sidebar-width md:ml-60' : 'w-full'
        } main-content flex  md:space-x-2  -z-10`}>
        <div
          className={`${
            showDrawer ? 'w-0 md:w-2/3' : 'w-full'
          } h-full flex flex-col space-y-2`}>
          {/* Header  */}
          <Header
            title='Templates'
            sidebar={sidebar}
            onClickMenuBtn={() => setSidebar(true)}
          />

          {/* body  */}
          <div
            className='space-y-1.5 grow px-4 pb-2 overflow-y-scroll scrollbar-thin
             scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scroll-smooth'>
            {/*sortlist and views */}
            <div className='flex justify-between items-center'>
              {/*SORT */}
              <SortOptionsListbox
                sortOptions={sortOptions}
                value={selectedSort}
                setValue={setSelectedSort}
              />
              {/* VIEW  */}
              <ViewRadioGroup value={selectedView} setValue={setSelectedView} />
            </div>

            {/* Templates  */}
            <div
              className={`${
                selectedView === 'grid'
                  ? 'grid grid-cols-2 lg:grid-cols-3  gap-1 lg:gap-1.5 max-h-full '
                  : 'flex flex-col space-y-2'
              } `}>
              {templates &&
                templates.map((template, idx) => (
                  <TemplateOverview
                    key={idx}
                    active={currentTemplateId === template._id}
                    template={template}
                    view={selectedView}
                    onClickTemplate={handleOnClickTemplateOverview}
                  />
                ))}
            </div>
          </div>
        </div>
        {/* Drawer  */}
        {currentTemplate && (
          <Drawer
            opened={showDrawer}
            onClose={closeDrawer}
            title={
              <h1 className='font-semibold text-2xl'>{currentTemplate.name}</h1>
            }>
            <Drawer.Description>
              <h3 className='font-medium'>About this template</h3>
              <p>{currentTemplate.description}</p>
            </Drawer.Description>

            <Drawer.Body>
              <div className='space-y-2'>
                <div>
                  <p>Example of item </p>
                  <div className='flex flex-col space-y-2'>
                    {currentTemplate.items.map((item, idx) => (
                      <span
                        key={idx}
                        className='w-full px-2 flex flex-col border-l-2 border-green-500 '>
                        <span className='font-semibold text-lg'>
                          {item.name}
                        </span>
                        {currentTemplate.properties.map(
                          (templateProperty, idx) =>
                            getPropertyValue(
                              item,
                              templateProperty._id || ''
                            ) != '' && (
                              <span key={idx} className='space-x-1'>
                                <span>{templateProperty.name}</span>
                                <span className='px-1 font-light rounded  bg-gray-200 dark:bg-gray-700'>
                                  {getPropertyValue(
                                    item,
                                    templateProperty._id || ''
                                  )}
                                </span>
                              </span>
                            )
                        )}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p>Properties</p>
                  <table
                    className='w-full border-separate border-spacing-2 
                    border-l-2 border-gray-300 dark:border-gray-600 '>
                    <thead>
                      <tr>
                        <th className='rounded-tl border-2 border-gray-300 dark:border-gray-600'>
                          Name
                        </th>
                        <th className='rounded-tr border-2 border-gray-300 dark:border-gray-600'>
                          Type
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTemplate.properties.map((property, idx) => (
                        <tr key={idx}>
                          <td className='border-2 border-gray-300 dark:border-gray-600'>
                            {property.name}
                          </td>
                          <td
                            className='border-2 border-gray-300 dark:border-gray-600
                          first-letter:uppercase'>
                            {property.type}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Drawer.Body>
            <Drawer.Footer>
              <button
                onClick={createCollectionBasedOnTemplate}
                className='w-full flex items-center justify-center p-1 rounded 
                  bg-primary-200 hover:bg-primary-300'>
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
