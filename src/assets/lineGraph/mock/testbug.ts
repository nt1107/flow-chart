import * as type from '../type';

const data: type.node[] = [
  {
    id: 30,
    label: '蔡英文受贿询问记录',
    type: 'container',
    children: [
      {
        id: 42,
        label: '问：（出示工作证件）我们是山北市新新区监委的调查人员，',
        type: 'event',
        children: [
          {
            id: 43,
            label: '知情权',
            type: 'entity'
          },
          {
            id: 45,
            label: '全程同步录音录像',
            type: 'description',
            children: [
              {
                id: 65,
                type: 'container',
                label: '22',
                children: [
                  {
                    id: 46,
                    label:
                      '蔡英文从2022年3月24日开始被留置了， 蔡英文从2022年3月24日开始被留置了，蔡英文从2022年3月24日开始被留置了， 蔡英文从2022年3月24日开始被留置了',
                    type: 'event'
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
