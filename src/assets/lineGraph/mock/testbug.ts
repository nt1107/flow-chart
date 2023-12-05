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
                    label: '王大仙',
                    children: [
                      {
                        id: 65,
                        type: 'description',
                        label: '蔡英文'
                      }
                    ]
                  }
                ]
              },
              {
                id: 62,
                label: '江海有限公司山北分公司',
                type: 'event',
                children: [
                  {
                    id: 63,
                    type: 'description',
                    label: '王二仙',
                    children: [
                      {
                        id: 65,
                        type: 'description',
                        label: '蔡英文'
                      }
                    ]
                  }
                ]
              },
              {
                id: 64,
                label: '山北市三绿市政设施建设工程有限公司第八十工程公司',
                type: 'event',
                children: [
                  {
                    id: 65,
                    type: 'description',
                    label: '蔡英文'
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
