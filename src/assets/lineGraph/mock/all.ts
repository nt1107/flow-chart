import * as type from '../type';

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
          },
          {
            id: 70,
            label: '抢劫',
            type: 'description',
            children: [
              {
                id: 71,
                label: '翁某甲',
                type: 'description',
                children: [
                  {
                    id: 75,
                    label: '被害人',
                    type: 'description'
                  },
                  {
                    id: 76,
                    label: '被害人2',
                    type: 'description'
                  }
                ]
              },
              {
                id: 72,
                label: '李某甲',
                type: 'description',
                children: [
                  {
                    id: 75,
                    label: '被害人',
                    type: 'description'
                  }
                ]
              },
              {
                id: 73,
                label: '翁某某',
                type: 'description',
                children: [
                  {
                    id: 75,
                    label: '被害人',
                    type: 'description'
                  }
                ]
              },
              {
                id: 74,
                label: '李某',
                type: 'description'
              }
            ]
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
                        type: 'description',
                        children: [
                          {
                            id: 13,
                            label: '李某甲',
                            type: 'description',
                            children: [
                              {
                                id: 14,
                                label: '李某',
                                type: 'description'
                              }
                            ]
                          },
                          {
                            id: 14,
                            label: '李某',
                            type: 'description'
                          },
                          {
                            id: 15,
                            label: '翁某甲',
                            type: 'description',
                            children: [
                              {
                                id: 16,
                                label: '张某某',
                                type: 'description'
                              },
                              {
                                id: 14,
                                label: '李某',
                                type: 'description'
                              }
                            ]
                          },
                          {
                            id: 16,
                            label: '张某某',
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
        ]
      },
      {
        id: 17,
        label: '李某准备了三根木棍',
        type: 'event',
        children: [
          {
            id: 18,
            label: '李某',
            type: 'description',
            children: [
              {
                id: 16,
                label: '张某某',
                type: 'description'
              }
            ]
          },
          {
            id: 19,
            label: '三根木棍',
            type: 'entity',
            children: [
              {
                id: 16,
                label: '张某某',
                type: 'description'
              }
            ]
          }
        ]
      },
      {
        id: 20,
        label:
          '翁某甲，李某甲，翁某某，李某手持凶器从加油站围墙小洞口钻进院内，打开大门',
        type: 'event',
        children: [
          {
            id: 21,
            label: '2023年12月20日，凌晨1时许',
            type: 'description'
          },
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
                    type: 'entity',
                    children: [
                      {
                        id: 58,
                        label: '上述文书上签字捺印',
                        type: 'description'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 27,
            label: '翁某甲，李某甲，翁某某',
            type: 'entity',
            children: [
              { id: 28, label: '三根木棍', type: 'entity' },
              { id: 29, label: '1', type: 'entity' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 30,
    label: '蔡英文受贿询问记录',
    type: 'container',
    children: [
      {
        id: 31,
        label: '讯问相关',
        type: 'entity',
        children: [
          {
            id: 32,
            label: '讯问时间',
            type: 'entity',
            children: [
              {
                id: 33,
                label: '2023年3月24日14时07分至24日17时50分',
                type: 'description'
              }
            ]
          },
          {
            id: 34,
            label: '讯问地点',
            type: 'entity',
            children: [
              {
                id: 35,
                label: '山北市天山苑管理中心7B审讯室（一）  ',
                type: 'description'
              }
            ]
          },
          {
            id: 36,
            label: '讯问人',
            type: 'entity',
            children: [
              {
                id: 37,
                label: '张三、李四  ',
                type: 'description'
              }
            ]
          },
          {
            id: 38,
            label: '记录人',
            type: 'entity',
            children: [
              {
                id: 39,
                label: '李四  ',
                type: 'description'
              }
            ]
          },
          {
            id: 40,
            label: '被讯问人姓名',
            type: 'entity',
            children: [
              {
                id: 41,
                label: '蔡英文  ',
                type: 'description'
              }
            ]
          }
        ]
      },
      {
        id: 42,
        label:
          '问：（出示工作证件）我们是山北市新新区监委的调查人员，现依法对你进行讯问。你应当如实回答我们的提问，有意作伪证或者隐匿证据应负相应的法律责任。下面依照法律法规我们向你送达《被调查人权利义务告知书》，同时本次讯问过程实行全程同步录音录像。以上告知事项你清楚了吗？',
        type: 'event',
        children: [
          {
            id: 43,
            label: '知情权',
            type: 'entity',
            children: [
              {
                id: 44,
                label: '《被调查人权利义务告知书》  ',
                type: 'description'
              }
            ]
          },
          {
            id: 45,
            label: '全程同步录音录像',
            type: 'description',
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
        id: 46,
        label: '问：你在何时被采取了何种监察措施？',
        type: 'event',
        children: [
          {
            id: 47,
            label:
              '答：2022年3月24日13时，山北市监委向我宣布我被立案调查，同时被采取留置措施，你们也已经向我宣读了山北市监察委员会的立案决定书、留置决定书、被调查人权利义务告知书，我也已经阅看过，并在上述文书上签字捺印，我都清楚了。',
            type: 'entity',
            children: [
              {
                id: 48,
                label: '2022年3月24日13时',
                type: 'description'
              },
              {
                id: 49,
                label: '山北市监委',
                type: 'description',
                children: [
                  {
                    id: 50,
                    label: '留置',
                    type: 'description'
                  }
                ]
              },
              {
                id: 51,
                label: '读权利告知',
                type: 'description',
                children: [
                  {
                    id: 52,
                    label: '山北市监察委员会',
                    type: 'description',
                    children: [
                      {
                        id: 53,
                        label: '立案决定书',
                        type: 'description',
                        children: [
                          {
                            id: 56,
                            label: '蔡英文',
                            type: 'description'
                          }
                        ]
                      },
                      {
                        id: 54,
                        label: '留置决定书',
                        type: 'description',
                        children: [
                          {
                            id: 56,
                            label: '蔡英文',
                            type: 'description'
                          }
                        ]
                      },
                      {
                        id: 55,
                        label: '被调查人权利义务告知书',
                        type: 'description',
                        children: [
                          {
                            id: 56,
                            label: '蔡英文',
                            type: 'description',
                            children: [
                              {
                                id: 57,
                                label: '已经阅看过',
                                type: 'description',
                                children: [
                                  {
                                    id: 58,
                                    label: '上述文书上签字捺印',
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
                ]
              }
            ]
          },
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
