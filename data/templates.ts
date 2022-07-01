import { ITemplate } from '../interfaces';

export const templates: ITemplate[] = [
  {
    _id: 1,
    name: 'Events',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    properties: [
      { _id: 1, name: 'Date', type: 'date', values: [''], color: '#dc2626' },
      {
        _id: 2,
        name: 'Notes',
        type: 'textarea',
        values: [''],
        color: '#facc15',
      },
    ],
    items: [
      {
        name: 'Apple WWDC',
        properties: [
          { _id: 1, value: '2022-06-24' },
          { _id: 2, value: '06:00 PM' },
        ],
      },
      {
        name: 'S birthdate',
        properties: [
          { _id: 1, value: '2022-08-25' },
          { _id: 2, value: 'I need to buy a chocolate cake' },
        ],
      },
    ],
  },
  {
    _id: 2,
    name: 'Tasks',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    properties: [
      {
        _id: 1,
        name: 'Done',
        type: 'checkbox',
        values: [''],
        color: '#dc2626',
      },
      {
        _id: 2,
        name: 'Conclusion date',
        type: 'date',
        values: [''],
        color: '#facc15',
      },
      {
        _id: 3,
        name: 'Notes',
        type: 'textarea',
        values: [''],
        color: '#facc15',
      },
    ],
    items: [
      {
        name: 'Organize the agenda',
        properties: [
          { _id: 1, value: 'true' },
          { _id: 2, value: '2022-06-24' },
          { _id: 3, value: 'Start from september' },
        ],
      },
      {
        name: 'Change battery of smoke detecter',
        properties: [
          { _id: 1, value: '' },
          { _id: 2, value: '2022-08-25' },
          { _id: 3, value: 'I John for help' },
        ],
      },
    ],
  },
  {
    _id: 3,
    name: 'Links',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    properties: [
      { _id: 1, name: 'URL', type: 'url', values: [''], color: '#dc2626' },
    ],
    items: [
      {
        name: 'Static data forum',
        properties: [
          {
            _id: 1,
            value:
              'https://laracasts.com/discuss/channels/general-discussion/is-it-best-to-use-json-or-db-for-static-data?page=1',
          },
        ],
      },
      {
        name: 'Headless ui',
        properties: [
          {
            _id: 1,
            value: 'https://headlessui.dev',
          },
        ],
      },
    ],
  },

  {
    _id: 5,
    name: 'Movies',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    properties: [
      {
        _id: 1,
        name: 'Status',
        type: 'select',
        values: ['Plan to watch', 'Watching', 'Watched'],
        color: '#dc2626',
      },
      {
        _id: 2,
        name: 'Score',
        type: 'select',
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
        color: '#facc15',
      },
      {
        _id: 3,
        name: 'Plataform',
        type: 'select',
        values: ['Netflix', 'Vizer.tv', 'Stremio'],
        color: '#facc15',
      },
    ],
    items: [
      {
        name: 'Taken',
        properties: [
          { _id: 1, value: 'Plan to watch' },
          { _id: 2, value: '' },
          { _id: 3, value: 'Vizer.tv' },
        ],
      },
      {
        name: 'The accountant',
        properties: [
          { _id: 1, value: 'Watched' },
          { _id: 2, value: '7-Good' },
          { _id: 3, value: 'Stremio' },
        ],
      },
    ],
  },
];
