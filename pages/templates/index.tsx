import React, { Fragment, useEffect, useState } from 'react';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Sidebar from '../../components/Sidebar';
import Head from 'next/head';
import { useRecoilState } from 'recoil';
import { sidebarState } from '../../atoms/sidebarAtom';
import ActionIcon from '../../components/Frontstate/ActionIcon';
import {
  CheckIcon,
  MenuAlt2Icon,
  SelectorIcon,
  ViewGridIcon,
  ViewListIcon,
} from '@heroicons/react/outline';
import TemplateOverview from '../../components/TemplateOverview';
import Drawer from '../../components/Frontstate/Drawer';
import { createCollection } from '../../fetch/collections';
import { addCollectionToGroup, getGroups } from '../../fetch/group';
import { useRouter } from 'next/router';
import { IItem, ITemplate } from '../../interfaces';
import { Listbox, RadioGroup, Transition } from '@headlessui/react';
import { templates as rawTemplates } from '../../data/templates';

const sortOptions = [
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

  const [selectedView, setSelectedView] = useState<string>('grid');
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

  const [currentTemplateId, setCurrentTemplateId] = useState<number | null>(
    null
  );
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
    openDrawer();
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
        flex h-screen md:space-x-2 dark:bg-gray-900 dark:text-white -z-10`}>
        <div
          className={`${
            showDrawer ? 'w-0  md:w-2/3 md:px-2' : 'w-full px-4'
          } py-2 space-y-2`}>
          {/* Header  */}
          {!sidebar && (
            <ActionIcon
              icon={<MenuAlt2Icon />}
              onClick={() => setSidebar(true)}
            />
          )}

          {/* Title  */}
          <h1 className='font-semibold text-3xl pl-1 border-l-4 border-primary-bright'>
            Templates
          </h1>

          {/*Filter */}
          <div className='flex justify-between items-center'>
            <Listbox value={selectedSort} onChange={setSelectedSort}>
              <div className='relative mt-1 flex flex-col'>
                <Listbox.Label className='text-xs'>Sort by</Listbox.Label>
                <Listbox.Button
                  className='relative w-52 cursor-default rounded bg-gray-100 dark:bg-gray-700 
              py-2 pl-3 pr-10 text-left shadow-md focus:outline-none 
              focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white 
              focus-visible:ring-opacity-75 focus-visible:ring-offset-2 
              focus-visible:ring-offset-orange-300 sm:text-sm'>
                  <span className='block truncate'>{selectedSort.name}</span>
                  <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                    <SelectorIcon
                      className='h-5 w-5 text-gray-400'
                      aria-hidden='true'
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave='transition ease-in duration-100'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'>
                  <Listbox.Options
                    className='absolute mt-1 max-h-60 w-full overflow-auto rounded 
                  bg-gray-200 dark:bg-gray-700  py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 
                focus:outline-none sm:text-sm'>
                    {sortOptions.map((option, optionIdx) => (
                      <Listbox.Option
                        key={optionIdx}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? 'bg-green-100 text-green-800'
                              : 'text-gray-900 dark:text-white'
                          }`
                        }
                        value={option}>
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}>
                              {option.name}
                            </span>
                            {selected ? (
                              <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-green-500'>
                                <CheckIcon
                                  className='icon-sm'
                                  aria-hidden='true'
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
            <RadioGroup
              value={selectedView}
              onChange={(e) => {
                setSelectedView(e);
                close();
              }}>
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
                        checked ? 'text-white' : 'text-black dark:text-gray-50'
                      }`}>
                      <ViewGridIcon className='icon-xs' />
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
                        checked ? 'text-white' : 'text-black dark:text-gray-50'
                      }`}>
                      <ViewListIcon className='icon-xs' />
                    </RadioGroup.Label>
                  )}
                </RadioGroup.Option>
              </div>
            </RadioGroup>
          </div>

          {/* Templates  */}
          <div
            className={`${
              selectedView === 'grid'
                ? 'grid grid-cols-2 lg:grid-cols-3  gap-1 lg:gap-1.5 max-h-full '
                : 'flex flex-col space-y-2'
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
        {/* Drawer  */}
        {currentTemplate && (
          <Drawer opened={showDrawer} onClose={closeDrawer}>
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
                    {currentTemplate.items.map(
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
