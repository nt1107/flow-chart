import * as type from '../type';

const data: type.node[] = [
  {
    id: 0,
    label: '0',
    type: 'container',
    children: [
      {
        id: 1,
        label: '1',
        type: 'event',
        children: [
          {
            id: 59,
            type: 'container',
            label: '受贿关系图',
            children: [
              {
                id: 60,
                label: '盛盛公司',
                type: 'event',
                children: [
                  {
                    id: 61,
                    type: 'description',
                    label: '王大仙'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

export default data;
