import * as type from '../type';

const data: type.node[] = [
  {
    id: 0,
    label: '',
    type: 'container',
    children: [
      {
        id: 1,
        label:
          '西北石化设备总公司(以下简称“西北石化”)的前身是陕西石化设备总公司，原属集体经济性质。1993年2月改组为有限责任公司，王某才占股份58%，并担任法定代表人。',
        type: 'event',
        left: [
          {
            id: 2,
            label: '1993年2月',
            type: 'property'
          }
        ],
        right: [
          {
            id: 3,
            label: '西北石化设备总公司',
            type: 'property',
            children: [
              {
                id: 4,
                label: '西北石化',
                type: 'property'
              },
              {
                id: 5,
                label: '陕西石化设备总公司',
                type: 'property',
                children: [
                  {
                    id: 6,
                    label: '集体经济',
                    type: 'property',
                    children: [
                      {
                        id: 7,
                        label: '有限责任公司',
                        type: 'property'
                      }
                    ]
                  }
                ]
              },
              {
                id: 8,
                label: '王某才',
                type: 'property'
              }
            ]
          }
        ]
      }
    ]
  }
];

export default data;
