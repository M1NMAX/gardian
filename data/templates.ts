import { Prisma, PropertyType } from '@prisma/client';

export const templatesData: Prisma.TemplateCreateInput[] = [
  {
    name: 'Events',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    properties: [
      {
        id: 'b61c1e22-2dcb-11ed-a261-0242ac120002',
        name: 'Date',
        type: PropertyType.DATE,
        values: [],
      },
      {
        id: 'e93c1ae6-2dcb-11ed-a261-0242ac120002',
        name: 'Notes',
        type: PropertyType.TEXTAREA,
        values: [],
      },
    ],
    items: [
      {
        name: 'Apple WWDC',
        properties: [
          { id: 'b61c1e22-2dcb-11ed-a261-0242ac120002', value: '2022-06-24' },
          { id: 'e93c1ae6-2dcb-11ed-a261-0242ac120002', value: '06:00 PM' },
        ],
      },
      {
        name: 'S birthdate',
        properties: [
          { id: 'b61c1e22-2dcb-11ed-a261-0242ac120002', value: '2022-08-25' },
          {
            id: 'e93c1ae6-2dcb-11ed-a261-0242ac120002',
            value: 'I need to buy a chocolate cake',
          },
        ],
      },
    ],
  },
  {
    name: 'Tasks',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    properties: [
      {
        id: '22462764-2dcc-11ed-a261-0242ac120002',
        name: 'Done',
        type: PropertyType.CHECKBOX,
        values: [],
      },
      {
        id: '22462944-2dcc-11ed-a261-0242ac120002',
        name: 'Conclusion date',
        type: PropertyType.DATE,
        values: [],
      },
      {
        id: '22462a3e-2dcc-11ed-a261-0242ac120002',
        name: 'Notes',
        type: PropertyType.DATE,
        values: [],
      },
    ],
    items: [
      {
        name: 'Organize the agenda',
        properties: [
          { id: '22462764-2dcc-11ed-a261-0242ac120002', value: 'true' },
          { id: '22462944-2dcc-11ed-a261-0242ac120002', value: '2022-06-24' },
          {
            id: '22462a3e-2dcc-11ed-a261-0242ac120002',
            value: 'Start from september',
          },
        ],
      },
      {
        name: 'Change battery of smoke detecter',
        properties: [
          { id: '22462764-2dcc-11ed-a261-0242ac120002', value: '' },
          { id: '22462944-2dcc-11ed-a261-0242ac120002', value: '2022-08-25' },
          {
            id: '22462a3e-2dcc-11ed-a261-0242ac120002',
            value: 'I John for help',
          },
        ],
      },
    ],
  },
  {
    name: 'Links',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    properties: [
      {
        id: '6c01497e-2dcc-11ed-a261-0242ac120002',
        name: 'url',
        type: PropertyType.URL,
        values: [''],
      },
    ],
    items: [
      {
        name: 'Static data forum',
        properties: [
          {
            id: '6c01497e-2dcc-11ed-a261-0242ac120002',
            value:
              'https://laracasts.com/discuss/channels/general-discussion/is-it-best-to-use-json-or-db-for-static-data?page=1',
          },
        ],
      },
      {
        name: 'Headless ui',
        properties: [
          {
            id: '6c01497e-2dcc-11ed-a261-0242ac120002',
            value: 'https://headlessui.dev',
          },
        ],
      },
    ],
  },

  {
    name: 'Movies',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    properties: [
      {
        id: '801badd2-2dcc-11ed-a261-0242ac120002',
        name: 'Status',
        type: PropertyType.SELECT,
        values: ['Plan to watch', 'Watching', 'Watched'],
      },
      {
        id: '801bafbc-2dcc-11ed-a261-0242ac120002',
        name: 'Score',
        type: PropertyType.SELECT,
        values: [
          '1-Appaling',
          '2-Horrible',
          '3-Very Bad',
          '4-Bad',
          '5-Average',
          '6-Fine',
          '7-Good',
          '8-Very Good',
          '9-Great',
          '10-Masterpiece',
        ],
      },
      {
        id: '801bb0b6-2dcc-11ed-a261-0242ac120002',
        name: 'Plataform',
        type: PropertyType.SELECT,
        values: ['Netflix', 'Vizer.tv', 'Stremio'],
      },
    ],
    items: [
      {
        name: 'Taken',
        properties: [
          {
            id: '801badd2-2dcc-11ed-a261-0242ac120002',
            value: 'Plan to watch',
          },
          { id: '801bafbc-2dcc-11ed-a261-0242ac120002', value: '' },
          { id: '801bb0b6-2dcc-11ed-a261-0242ac120002', value: 'Vizer.tv' },
        ],
      },
      {
        name: 'The accountant',
        properties: [
          { id: '801badd2-2dcc-11ed-a261-0242ac120002', value: 'Watched' },
          { id: '801bafbc-2dcc-11ed-a261-0242ac120002', value: '7-Good' },
          { id: '801bb0b6-2dcc-11ed-a261-0242ac120002', value: 'Stremio' },
        ],
      },
    ],
  },
];
