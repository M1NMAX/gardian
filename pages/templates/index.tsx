import {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
    NextPage
} from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { authOptions } from '@api/auth/[...nextauth]';
import { sidebarState } from '@atoms/sidebarAtom';
import Header from '@components/Header';
import Sidebar from '@components/Sidebar';
import { SORT_ASCENDING, SORT_DESCENDING } from '@constants';
import { createCollection } from '@features/collections';
import { GroupPickerPopover } from '@features/groups';
import { SortOptionsListbox, useSort } from '@features/sort';
import { getTemplates, TemplateOverview } from '@features/templates';
import { ActionIcon, Drawer } from '@frontstate-ui';
import { ViewBoardsIcon, ViewGridIcon } from '@heroicons/react/outline';
import useDrawer from '@hooks/useDrawer';
import useLocalStorage from '@hooks/useLocalStorage';
import { getSession } from '@lib/auth/session';
import { MockItem } from '@prisma/client';
import { SortOptionType } from '@types';


const sortOptions: SortOptionType[] = [
  { field: 'name', order: SORT_ASCENDING },
  { field: 'name', order: SORT_DESCENDING },
];

const TemplatesPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const router = useRouter();
  const sidebar = useRecoilValue(sidebarState);

  const { data: templates, isLoading } = useQuery(['templates'], getTemplates);
  console.log(templates);

  //Feedback
  const positiveFeedback = (msg: string) => toast.success(msg);
  const negativeFeedback = () => toast.error('Something went wrong, try later');

  const drawer = useDrawer(() => setSelectedTemplateId(null));

  //View
  const [isGridView, setIsGridView] = useLocalStorage<boolean>(
    'templateView',
    false
  );

  //Sort templates
  const {
    selectedSortOption,
    sortedList: sortedTemplates,
    onChangeSortOption,
  } = useSort(sortOptions[0], templates || []);

  //Selected template
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );

  const selectedTemplate = useMemo(() => {
    if (!templates) return;

    return templates.find((template) => template.id === selectedTemplateId);
  }, [templates, selectedTemplateId]);

  const handleOnClickTemplateOverview = (id: string) => {
    setSelectedTemplateId(id);
    drawer.openDrawer();
  };

  const getPropertyValue = (item: MockItem, id: string): string => {
    const property = item.properties.find((property) => property.id === id);
    return property ? property.value : '';
  };

  const createCollectionBasedOnTemplate = async (groupId: string) => {
    if (!selectedTemplateId || !selectedTemplate) return;

    const { name, properties } = selectedTemplate;

    const collection = await createCollection({
      name,
      properties,
      groupId,
    });

    router.push('/collections/' + collection.id);
  };

  const handleOnClickGroup = async (gid: string) => {
    try {
      await createCollectionBasedOnTemplate(gid);
      positiveFeedback('Collection created');
    } catch (error) {
      negativeFeedback();
    }
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
            drawer.isOpen ? 'w-0 md:w-2/3' : 'w-full'
          } h-full flex flex-col space-y-2`}>
          {/* Header  */}
          <Header>
            <h1
              className='grow font-semibold text-xl md:text-2xl 
            pl-1 border-l-4 border-primary-100'>
              Templates
            </h1>

            <div className='flex items-center space-x-1.5'>
              {/*SORT */}
              <SortOptionsListbox
                sortOptions={sortOptions}
                selectedOption={selectedSortOption}
                onChangeOption={onChangeSortOption}
              />
              {/* views  */}
              <ActionIcon
                variant='filled'
                onClick={() => setIsGridView(!isGridView)}>
                {isGridView ? (
                  <ViewGridIcon className='icon-sm' />
                ) : (
                  <ViewBoardsIcon className='icon-sm rotate-90' />
                )}
              </ActionIcon>
            </div>
          </Header>

          {/* body  */}
          <div
            className='space-y-1.5 grow px-4 pb-2 overflow-y-scroll scrollbar-thin
             scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scroll-smooth'>
            {/* Templates  */}
            <div
              className={`${
                isGridView
                  ? 'grid grid-cols-2 lg:grid-cols-3  gap-1 lg:gap-1.5 max-h-full '
                  : 'flex flex-col space-y-2'
              } `}>
              {sortedTemplates &&
                sortedTemplates.map((template) => (
                  <TemplateOverview
                    key={template.id}
                    active={selectedTemplateId === template.id}
                    template={template}
                    isGridView={isGridView}
                    onClickTemplate={handleOnClickTemplateOverview}
                  />
                ))}
            </div>
          </div>
        </div>
        {/* Drawer  */}
        {selectedTemplate && (
          <Drawer
            opened={drawer.isOpen}
            onClose={drawer.closeDrawer}
            title={
              <h1 className='font-semibold text-2xl'>
                {selectedTemplate.name}
              </h1>
            }>
            <div
              className='grow space-y-1.5 pr-2.5 pt-0.5 overflow-y-auto scrollbar-thin
                      scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600'>
              <div>
                <h3 className='font-medium'>About this template</h3>
                <p>{selectedTemplate.description}</p>
              </div>
              <div className='space-y-2'>
                <div>
                  <p>Example of item </p>
                  <div className='flex flex-col space-y-2'>
                    {selectedTemplate.items.map((item, idx) => (
                      <span
                        key={idx}
                        className='w-full px-2 flex flex-col border-l-2 border-green-500'>
                        <span className='font-semibold text-lg'>
                          {item.name}
                        </span>
                        {selectedTemplate.properties.map(
                          (templateProperty, idx) => (
                            <span key={idx} className='space-x-1'>
                              <span>{templateProperty.name}</span>
                              <span className='px-1 font-light rounded  bg-gray-200 dark:bg-gray-700'>
                                {getPropertyValue(item, templateProperty.id)}
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
                      {selectedTemplate.properties.map((property, idx) => (
                        <tr key={idx}>
                          <td className='border-2 border-gray-300 dark:border-gray-600'>
                            {property.name}
                          </td>
                          <td
                            className='border-2 border-gray-300 dark:border-gray-600
                          first-letter:uppercase'>
                            {property.type.toLowerCase()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div>
              <GroupPickerPopover onClickGroup={handleOnClickGroup}>
                <span
                  className='w-full flex items-center justify-center p-1 text-white
                rounded bg-primary-200 hover:bg-primary-300 font-semibold'>
                  Use this template
                </span>
              </GroupPickerPopover>

              <span className='text-xs text-center'>
                The collection will start empty
              </span>
            </div>
          </Drawer>
        )}
      </main>
    </>
  );
};

export default TemplatesPage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const sesssion = await getSession(ctx.req, ctx.res, authOptions);

  if (!sesssion) {
    return {
      redirect: {
        destination: '/account/signin',
        permanent: false,
      },
    };
  }
  return { props: {} as never };
}
