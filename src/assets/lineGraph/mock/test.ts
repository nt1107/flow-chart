import * as type from '../type';

const data: type.node[] = [
  {
    id: 0,
    label: '',
    type: 'container',
    children: [
      {
        id: 1,
        label: 'a',
        type: 'event',
        children: [
          {
            id: 70,
            label: '抢劫',
            type: 'description',
            // disallowChildrenRealignment: true,
            children: [
              {
                id: 71,
                label: '1',
                type: 'description',
                children: [
                  {
                    id: 75,
                    label: '被害人1',
                    type: 'description'
                  }
                ]
              },
              {
                id: 78,
                label: '5',
                type: 'description',
                children: [
                  {
                    id: 90,
                    label: '9',
                    type: 'description',
                    children: [
                      {
                        id: 91,
                        label: '10',
                        type: 'description',
                        children: [
                          {
                            id: 92,
                            label: '11',
                            type: 'description'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    id: 92,
                    label: '11',
                    type: 'description'
                  }
                ]
              },
              {
                id: 72,
                label: '2',
                type: 'description',
                children: [
                  {
                    id: 75,
                    label: '被害人1',
                    type: 'description'
                  }
                ]
              },
              {
                id: 73,
                label: '3',
                type: 'description',
                children: [
                  {
                    id: 77,
                    label: '被害人2',
                    type: 'description'
                  }
                ]
              },
              {
                id: 79,
                label: '6',
                type: 'description',
                children: [
                  {
                    id: 80,
                    label: '7',
                    type: 'description',
                    children: [
                      {
                        id: 81,
                        label: '8',
                        type: 'description'
                      }
                    ]
                  },
                  {
                    id: 81,
                    label: '8',
                    type: 'description'
                  }
                ]
              },
              {
                id: 74,
                label: '4',
                type: 'description',
                children: [
                  {
                    id: 77,
                    label: '被害人2',
                    type: 'description'
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
