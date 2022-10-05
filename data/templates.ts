import { Color, Prisma, PropertyType } from '@prisma/client';


export const templatesData: Prisma.TemplateCreateInput[] = [
  {
    name: 'Events',
    icon: { name: 'CalendarDaysIcon', color: Color.RED },
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    properties: [
      {
        id: 'b61c1e22-2dcb-11ed-a261-0242ac120002',
        name: 'Date',
        type: PropertyType.DATE,
        options: [],
      },
      {
        id: 'e93c1ae6-2dcb-11ed-a261-0242ac120002',
        name: 'Notes',
        type: PropertyType.TEXT,
        options: [],
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
    icon: { name: 'CheckBadgeIcon', color: Color.BLUE },
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    properties: [
      {
        id: '22462764-2dcc-11ed-a261-0242ac120002',
        name: 'Done',
        type: PropertyType.CHECKBOX,
        options: [],
      },
      {
        id: '22462944-2dcc-11ed-a261-0242ac120002',
        name: 'Conclusion date',
        type: PropertyType.DATE,
        options: [],
      },
      {
        id: '22462a3e-2dcc-11ed-a261-0242ac120002',
        name: 'Notes',
        type: PropertyType.DATE,
        options: [],
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
    icon: { name: 'LinkIcon', color: Color.YELLOW },
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    properties: [
      {
        id: '6c01497e-2dcc-11ed-a261-0242ac120002',
        name: 'url',
        type: PropertyType.URL,
        options: [],
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
    icon: { name: 'FilmIcon' },
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    properties: [
      {
        id: '801badd2-2dcc-11ed-a261-0242ac120002',
        name: 'Status',
        type: PropertyType.SELECT,
        options: [
          { value: 'Plan to watch' },
          { value: 'Watching' },
          { value: 'Watched' },
        ],
      },
      {
        id: '801bafbc-2dcc-11ed-a261-0242ac120002',
        name: 'Score',
        type: PropertyType.SELECT,
        options: [
          { value: '1-Appaling' },
          { value: '2-Horrible' },
          { value: '3-Very Bad' },
          { value: '4-Bad' },
          { value: '5-Average' },
          { value: '6-Fine' },
          { value: '7-Good' },
          { value: '8-Very Good' },
          { value: '9-Great' },
          { value: '10-Masterpiece' },
        ],
      },
      {
        id: '801bb0b6-2dcc-11ed-a261-0242ac120002',
        name: 'Plataform',
        type: PropertyType.SELECT,
        options: [
          { value: 'Netflix' },
          { value: 'Vizer.tv' },
          { value: 'Stremio' },
        ],
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
