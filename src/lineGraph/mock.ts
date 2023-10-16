import * as type from './type'

const data: type.node[] = [
  {
    id: 0,
    label: '第一阶段抢劫',
    type: 'container',
    children: [
      {
        id: 1,
        label: '翁某甲，李某甲，翁某某，李某',
        type: 'entity',
        children: [
          {
            id: 2,
            label: '犯罪嫌疑人',
            type: 'description'
          }
        ]
      },
      {
        id: 3,
        label: '翁某甲，李某甲，翁某某，李某从安康市平利县流窜至兴平县预谋抢劫',
        type: 'event',
        children: [
          {
            id: 4,
            label: '1999年12月23日',
            type: 'description'
          }
        ]
      },
      {
        id: 5,
        label:
          '翁某甲指派翁某某和李某甲到宝鸡附近踩点，后返回兴平，并购买了一把菜刀',
        type: 'event',
        children: [
          {
            id: 6,
            label: '翁某甲，李某甲，翁某某',
            type: 'entity'
          }
        ]
      },
      {
        id: 7,
        label: '翁某甲，李某甲，翁某某，李某流窜至扶风县马某某的加油站附近',
        type: 'event',
        children: [
          {
            id: 8,
            label: '12月23日晚',
            type: 'description'
          },
          {
            id: 9,
            label: '翁某甲，李某甲，翁某某，李某',
            type: 'entity',
            children: [
              {
                id: 100,
                label: '人物关系',
                type: 'container',
                children: [
                  {
                    id: 101,
                    label: '翁某甲',
                    type: 'event',
                    children: [
                      { id: 105, label: '首领', type: 'entity' },
                      { id: 106, label: '指挥', type: 'description' }
                    ]
                  },
                  {
                    id: 102,
                    label: '李某甲',
                    type: 'event'
                  },
                  {
                    id: 103,
                    label: '翁某某',
                    type: 'event'
                  },
                  {
                    id: 104,
                    label: '李某',
                    type: 'event'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 10,
        label: '李某准备了三根木棍',
        type: 'event',
        children: [
          {
            id: 11,
            label: '李某',
            type: 'description'
          },
          {
            id: 12,
            label: '三根木棍',
            type: 'entity'
          }
        ]
      },
      {
        id: 13,
        label:
          '翁某甲，李某甲，翁某某，李某手持凶器从加油站围墙小洞口钻进院内，打开大门',
        type: 'event',
        children: [
          {
            id: 14,
            label: '2023年12月20日，凌晨1时许',
            type: 'description'
          },
          {
            id: 15,
            label: '翁某甲',
            type: 'entity',
            children: [
              {
                id: 16,
                label: '一把菜刀',
                type: 'entity',
                children: [{ id: 20, label: '菜刀', type: 'entity' }]
              },
              {
                id: 19,
                label: '2023年12月20日，凌晨1时许',
                type: 'entity',
                children: [{ id: 20, label: '菜刀', type: 'entity' }]
              }
            ]
          },
          {
            id: 17,
            label: '翁某甲，李某甲，翁某某',
            type: 'entity',
            children: [
              { id: 18, label: '三根木棍', type: 'entity' },
              { id: 21, label: '1', type: 'entity' }
            ]
          }
        ]
      }
    ]
  }
]

export default data
