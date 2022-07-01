import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Sidebar from '../../components/Sidebar';
import Head from 'next/head';
import { useRecoilState } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import ActionIcon from '../../components/Frontstate/ActionIcon';
import {
  AdjustmentsIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  MenuAlt2Icon,
  SortAscendingIcon,
  SortDescendingIcon,
  TableIcon,
  ViewGridIcon,
  ViewListIcon,
} from '@heroicons/react/outline';
import TemplateOverview from '../../components/TemplateOverview';
import Drawer from '../../components/Frontstate/Drawer';
import { createCollection } from '../../fetch/collections';
import { addCollectionToGroup, getGroups } from '../../fetch/group';
import { useRouter } from 'next/router';
import { IItem, ITemplate } from '../../interfaces';
import { templates as rawTemplates } from '../../data/templates';
import { Popover, RadioGroup, Transition } from '@headlessui/react';

const TemplatesPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const router = useRouter();
  const [sidebar, setSidebar] = useRecoilState(sidebarState);

  const [showDetails, setShowDetails] = useState(false);
  const openDetails = () => setShowDetails(true);
  const closeDetails = () => setShowDetails(false);

  const [selectedView, setSelectedView] = useState<string>('grid');
  const [selectedSort, setSelectedSort] = useState<string>('name+asc');
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
    () => setTemplates(templates.sort(dynamicSort(selectedSort))),
    [selectedSort]
  );

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
        items: [],
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
            <div>
              <Popover className='relative'>
                <Popover.Button className='action-icon-filled-variant rounded'>
                  <AdjustmentsIcon className='icon-sm rotate-90' />
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-200'
                  enterFrom='opacity-0 translate-y-1'
                  enterTo='opacity-100 translate-y-0'
                  leave='transition ease-in duration-150'
                  leaveFrom='opacity-100 translate-y-0'
                  leaveTo='opacity-0 translate-y-1'>
                  <Popover.Panel
                    className='absolute right-0 z-10 mt-1 w-screen max-w-xs py-1 px-2 
                    rounded-l-lg rounded-br-lg rounded-tr dark:border 
                    dark:border-black  origin-top-right bg-gray-200  dark:bg-gray-800
                   space-y-2 divide-y-2  divide-gray-300 dark:divide-gray-600'>
                    {({ close }) => (
                      <>
                        <RadioGroup
                          value={selectedView}
                          onChange={(e) => {
                            setSelectedView(e);
                            close();
                          }}>
                          <RadioGroup.Label className='font-semibold'>
                            View
                          </RadioGroup.Label>
                          <div className='max-w-fit flex space-x-1 rounded p-0.5 bg-gray-50 dark:bg-gray-700'>
                            <RadioGroup.Option
                              value='grid'
                              className={({ checked }) =>
                                `${
                                  checked
                                    ? 'bg-green-500  text-white'
                                    : 'bg-gray-100 dark:bg-gray-800'
                                }
                                 relative rounded shadow-md px-1 cursor-pointer flex focus:outline-none`
                              }>
                              {({ checked }) => (
                                <RadioGroup.Label
                                  as='p'
                                  className={`flex items-center space-x-1  font-medium ${
                                    checked
                                      ? 'text-white'
                                      : 'text-black dark:text-gray-50'
                                  }`}>
                                  <ViewGridIcon className='icon-xs' />
                                  <span className='text-sm'>Grid</span>
                                </RadioGroup.Label>
                              )}
                            </RadioGroup.Option>

                            <RadioGroup.Option
                              value='list'
                              className={({ checked }) =>
                                `${
                                  checked
                                    ? 'bg-green-500  text-white'
                                    : 'bg-gray-100 dark:bg-gray-800'
                                }
                                 relative rounded shadow-md px-2 py-1 cursor-pointer flex focus:outline-none`
                              }>
                              {({ checked }) => (
                                <RadioGroup.Label
                                  as='p'
                                  className={`flex items-center space-x-1 font-medium ${
                                    checked
                                      ? 'text-white'
                                      : 'text-black dark:text-gray-50'
                                  }`}>
                                  <ViewListIcon className='icon-xs' />
                                  <span className='text-sm'>List</span>
                                </RadioGroup.Label>
                              )}
                            </RadioGroup.Option>
                          </div>
                        </RadioGroup>
                        <RadioGroup
                          value={selectedSort}
                          onChange={(e) => {
                            setSelectedSort(e);
                            close();
                          }}>
                          <RadioGroup.Label className='font-medium'>
                            Sort by
                          </RadioGroup.Label>
                          <div className='space-y-1'>
                            <RadioGroup.Option
                              value='name+asc'
                              className={({ checked }) =>
                                `${
                                  checked
                                    ? 'bg-primary  text-white'
                                    : 'bg-gray-100 dark:bg-gray-800'
                                }
                                 relative rounded-md shadow-md px-2 py-1 cursor-pointer flex focus:outline-none`
                              }>
                              {({ checked }) => (
                                <>
                                  <div className='flex w-full items-center justify-between'>
                                    <RadioGroup.Label
                                      as='p'
                                      className={`flex items-center space-x-1 font-medium ${
                                        checked
                                          ? 'text-white'
                                          : 'text-black dark:text-gray-50'
                                      }`}>
                                      <SortAscendingIcon className='icon-sm' />
                                      <span className='text-sm'>Name</span>
                                    </RadioGroup.Label>

                                    {checked && (
                                      <div className='shrink-0 text-white'>
                                        <CheckIcon className='icon-sm' />
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </RadioGroup.Option>

                            <RadioGroup.Option
                              value='name+des'
                              className={({ checked }) =>
                                `${
                                  checked
                                    ? 'bg-primary  text-white'
                                    : 'bg-gray-100 dark:bg-gray-800'
                                }
                                 relative rounded-md shadow-md px-2 py-1 cursor-pointer flex focus:outline-none`
                              }>
                              {({ checked }) => (
                                <>
                                  <div className='flex w-full items-center justify-between'>
                                    <RadioGroup.Label
                                      as='p'
                                      className={`flex items-center space-x-1 font-medium ${
                                        checked
                                          ? 'text-white'
                                          : 'text-black dark:text-gray-50'
                                      }`}>
                                      <SortDescendingIcon className='icon-sm' />
                                      <span className='text-sm'>Name</span>
                                    </RadioGroup.Label>

                                    {checked && (
                                      <div className='shrink-0 text-white'>
                                        <CheckIcon className='icon-sm' />
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </RadioGroup.Option>
                          </div>
                        </RadioGroup>
                      </>
                    )}
                  </Popover.Panel>
                </Transition>
              </Popover>
            </div>
          </div>

          {/* Title  */}
          <h1 className='font-semibold text-3xl '>Templates</h1>

          {/* Templates  */}
          <div
            className={`${
              selectedView === 'grid'
                ? 'grid grid-cols-2 lg:grid-cols-3  gap-1 lg:gap-1.5 max-h-full '
                : 'flex flex-col space-y-1'
            }  overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 `}>
            {templates &&
              templates.map((template, idx) => (
                <TemplateOverview
                  key={idx}
                  active={currentTemplateId === template._id}
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
              <div className='space-y-2'>
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
                      {currentTemplate.properties.map((property) => (
                        <tr>
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
