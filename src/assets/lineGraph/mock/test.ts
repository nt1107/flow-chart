import * as type from '../type';

const data: type.node[] = [
  {
    id: 0,
    label: '11',
    type: 'container',
    children: [
      {
        id: 1,
        label: 'a',
        type: 'event',
        children: [
          {
            id: 2,
            label: 'b',
            type: 'entity',
            style: {
              'background-image': "url('/img/cat.jpg')",
              'background-repeat': 'no-repeat',
              'background-fit': 'cover',
              'text-valign': 'bottom'
            }
          },
          {
            id: 3,
            label: 'c',
            type: 'description',
            style: {
              'background-color': 'pink',
              'text-valign': 'center'
            }
          }
        ]
      },
      {
        id: 4,
        label: 'd',
        type: 'event',
        children: [
          {
            id: 5,
            label: 'd',
            type: 'entity',
            style: {
              'border-color': 'pink',
              'text-valign': 'center'
            }
          },
          {
            id: 6,
            label: 'f',
            type: 'description',
            style: {
              'background-image': "url('/svg/upload.svg')",
              'background-repeat': 'no-repeat',
              'background-fit': 'cover',
              'text-valign': 'bottom'
            }
          }
        ]
      }
    ]
  }
];

export default data;
