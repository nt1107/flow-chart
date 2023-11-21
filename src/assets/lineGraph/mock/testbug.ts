import * as type from '../type';

const data: type.node[] = [
  {
    id: 0,
    label: '第一阶段抢劫',
    type: 'container',
    children: [
      {
        id: 7,
        label: '翁某甲，李某甲，翁某某，李某流窜至扶风县马某某的加油站附近',
        type: 'event',
        children: [
          {
            id: 8,
            label: '8',
            type: 'description'
          },
          {
            id: 10,
            label: '关系图',
            type: 'container',
            disallowChildrenRealignment: true,
            children: [
              {
                id: 11,
                label: '翁某甲，李某甲，翁某某，李某',
                type: 'event',
                disallowChildrenRealignment: true,
                children: [
                  {
                    id: 12,
                    label: '关系',
                    type: 'description'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 31,
    label: '第二阶段抢劫',
    type: 'container',
    children: [
      {
        id: 32,
        label: '32',
        type: 'event'
      }
    ]
  }
];

export default data;
