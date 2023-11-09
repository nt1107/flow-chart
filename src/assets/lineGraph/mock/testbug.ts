import * as type from '../type';

const data: type.node[] = [
  {
    id: 0,
    label: '0',
    type: 'container',
    children: [
      {
        id: 20,
        label:
          '翁某甲，李某甲，翁某某，李某手持凶器从加油站围墙小洞口钻进院内，打开大门',
        type: 'event',
        children: [
          // {
          //   id: 21,
          //   label: '2023年12月20日，凌晨1时许',
          //   type: 'description'
          // },
          {
            id: 22,
            label: '翁某甲',
            type: 'entity',
            children: [
              {
                id: 23,
                label: '一把菜刀',
                type: 'entity',
                children: [{ id: 26, label: '菜刀', type: 'entity' }]
              },
              {
                id: 25,
                label: '2023年12月20日，凌晨1时许',
                type: 'entity',
                children: [
                  {
                    id: 26,
                    label: '菜刀',
                    type: 'entity'
                    // children: [
                    //   {
                    //     id: 58,
                    //     label: '上述文书上签字捺印',
                    //     type: 'description'
                    //   }
                    // ]
                  }
                ]
              }
            ]
          }
          // {
          //   id: 27,
          //   label: '翁某甲，李某甲，翁某某',
          //   type: 'entity',
          //   children: [
          //     { id: 28, label: '三根木棍', type: 'entity' },
          //     { id: 29, label: '1', type: 'entity' }
          //   ]
          // }
        ]
      }
    ]
  }
  // {
  //   id: 10,
  //   label: '10',
  //   type: 'container',
  //   children: [
  //     {
  //       id: 11,
  //       label: '11',
  //       type: 'event',
  //       children: [
  //         {
  //           id: 12,
  //           label: '12',
  //           type: 'description',
  //           children: [
  //             {
  //               id: 13,
  //               label: '13',
  //               type: 'description'
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   ]
  // }
];

export default data;
