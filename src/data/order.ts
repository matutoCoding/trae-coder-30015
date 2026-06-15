import { Order } from '@/types';

export const orderList: Order[] = [
  {
    id: 'o001',
    orderNo: 'JX20260615001',
    customer: { id: 'c001', name: '王女士', phone: '138****8888', address: '北京市朝阳区...' },
    sketchId: 's001',
    sketchName: '富贵牡丹图',
    sketchImage: 'https://picsum.photos/id/106/600/600',
    customRequirement: '客户要求尺寸稍大，颜色偏暖色调，配雕花红木框',
    size: '70cm × 90cm',
    process: ['双面绣', '平针绣'],
    budget: 28800,
    deadline: '2026-07-20',
    status: '绣制中',
    createTime: '2026-06-15 10:30',
    embroiderers: [{ id: 'e001', name: '李秀英' }],
    progress: 45,
    currentStage: '绣制',
    stageLogs: [
      { stage: '准备', time: '2026-06-15 14:00', note: '准备丝线、布料等材料' },
      { stage: '上绷', time: '2026-06-16 09:00', note: '按照70×90cm尺寸上绷' },
      { stage: '绣制', time: '2026-06-17 08:30', note: '开始绣制主体牡丹花瓣' }
    ]
  },
  {
    id: 'o002',
    orderNo: 'JX20260614002',
    customer: { id: 'c002', name: '张先生', phone: '139****6666', address: '上海市浦东新区...' },
    sketchId: 's005',
    sketchName: '蜀绣竹林熊猫',
    sketchImage: 'https://picsum.photos/id/237/600/600',
    customRequirement: '作为外宾礼品，需配高档礼盒，附上收藏证书',
    size: '60cm × 60cm',
    process: ['双面绣', '平针绣'],
    budget: 18800,
    deadline: '2026-07-10',
    status: '待派单',
    createTime: '2026-06-14 16:45',
    progress: 0,
    currentStage: '准备',
    stageLogs: []
  },
  {
    id: 'o003',
    orderNo: 'JX20260613003',
    customer: { id: 'c003', name: '李总', phone: '186****9999', address: '深圳市南山区...' },
    sketchId: 's002',
    sketchName: '百鸟朝凤',
    sketchImage: 'https://picsum.photos/id/110/600/600',
    customRequirement: '大型厅堂装饰，要求大气磅礴，配实木雕花框',
    size: '120cm × 180cm',
    process: ['乱针绣', '打籽绣'],
    budget: 128000,
    deadline: '2026-09-30',
    status: '绣制中',
    createTime: '2026-06-13 11:20',
    embroiderers: [
      { id: 'e002', name: '王秀兰' },
      { id: 'e003', name: '张美玲' }
    ],
    progress: 25,
    currentStage: '绣制',
    stageLogs: [
      { stage: '准备', time: '2026-06-13 15:00', note: '采购特种丝线，定制大尺寸绣绷' },
      { stage: '上绷', time: '2026-06-14 10:00', note: '两人协作完成大型绷架' },
      { stage: '绣制', time: '2026-06-15 08:00', note: '开始分区域绣制，凤凰主体由王秀兰负责' }
    ]
  },
  {
    id: 'o004',
    orderNo: 'JX20260610004',
    customer: { id: 'c004', name: '陈女士', phone: '137****5555', address: '广州市天河区...' },
    customRequirement: '定制婚庆礼品，新娘礼服图案刺绣加字',
    size: '40cm × 50cm',
    process: ['盘金绣', '平针绣'],
    budget: 12800,
    deadline: '2026-06-28',
    status: '待装裱',
    createTime: '2026-06-10 09:15',
    embroiderers: [{ id: 'e004', name: '赵雅琴' }],
    progress: 92,
    currentStage: '装裱',
    stageLogs: [
      { stage: '准备', time: '2026-06-10 10:00', note: '准备真丝底料和金线' },
      { stage: '上绷', time: '2026-06-10 14:00', note: '上绷定位图案' },
      { stage: '绣制', time: '2026-06-11 08:00', note: '盘金绣勾勒轮廓' },
      { stage: '收尾', time: '2026-06-18 16:00', note: '绣制完成，线头处理' },
      { stage: '质检', time: '2026-06-19 10:00', note: '质检通过，进入装裱' },
      { stage: '装裱', time: '2026-06-20 09:00', note: '正在装裱，选择花梨木框' }
    ]
  },
  {
    id: 'o005',
    orderNo: 'JX20260601005',
    customer: { id: 'c005', name: '孙先生', phone: '135****3333', address: '杭州市西湖区...' },
    sketchId: 's003',
    sketchName: '山水清音图',
    sketchImage: 'https://picsum.photos/id/1015/600/600',
    customRequirement: '茶室装饰，追求意境悠远',
    size: '80cm × 120cm',
    process: ['乱针绣'],
    budget: 45000,
    deadline: '2026-07-15',
    status: '绣制中',
    createTime: '2026-06-01 14:30',
    embroiderers: [{ id: 'e005', name: '周文华' }],
    progress: 60,
    currentStage: '绣制',
    stageLogs: [
      { stage: '准备', time: '2026-06-01 16:00', note: '选择墨色系丝线' },
      { stage: '上绷', time: '2026-06-02 09:00', note: '上绷完成' },
      { stage: '绣制', time: '2026-06-03 08:00', note: '远景山水绣制中' }
    ]
  },
  {
    id: 'o006',
    orderNo: 'JX20260520006',
    customer: { id: 'c006', name: '刘女士', phone: '158****7777', address: '成都市锦江区...' },
    sketchId: 's010',
    sketchName: '芙蓉锦鲤',
    sketchImage: 'https://picsum.photos/id/1084/600/600',
    customRequirement: '生日礼物，年年有余寓意',
    size: '45cm × 45cm',
    process: ['平针绣', '盘金绣'],
    budget: 9800,
    deadline: '2026-06-18',
    status: '已完成',
    createTime: '2026-05-20 10:00',
    embroiderers: [{ id: 'e001', name: '李秀英' }],
    progress: 100,
    currentStage: '装裱',
    stageLogs: [
      { stage: '准备', time: '2026-05-20 11:00', note: '材料准备就绪' },
      { stage: '上绷', time: '2026-05-20 14:00', note: '上绷定位' },
      { stage: '绣制', time: '2026-05-21 08:30', note: '开始绣制' },
      { stage: '收尾', time: '2026-06-10 15:00', note: '绣制收尾' },
      { stage: '质检', time: '2026-06-12 10:00', note: '质检通过' },
      { stage: '装裱', time: '2026-06-14 09:00', note: '装裱完成，已通知客户取货' }
    ]
  }
];
