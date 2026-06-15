import { Work, FinanceRecord } from '@/types';

export const workList: Work[] = [
  {
    id: 'w001',
    name: '牡丹双蝶图',
    imageUrl: 'https://picsum.photos/id/106/600/800',
    category: 'suxiu',
    categoryName: '苏绣',
    process: ['双面绣', '平针绣'],
    size: '50cm × 70cm',
    embroiderer: '王秀兰',
    finishDate: '2026-05-20',
    frameType: '花梨木框',
    description: '苏绣经典牡丹题材，蝴蝶翩跹其间，寓意富贵吉祥。采用精细丝线，花瓣层次分明，正反两面效果一致，为大师级双面绣精品。',
    status: '在售',
    price: 38800,
    tags: ['精品', '苏绣', '双面绣']
  },
  {
    id: 'w002',
    name: '江南水乡',
    imageUrl: 'https://picsum.photos/id/1015/600/800',
    category: 'xiangxiu',
    categoryName: '湘绣',
    process: ['乱针绣'],
    size: '60cm × 90cm',
    embroiderer: '周文华',
    finishDate: '2026-05-10',
    frameType: '黑檀木框',
    description: '水墨江南，小桥流水人家。乱针绣技法表现烟雨朦胧的意境，墨色浓淡相宜，如诗如画。',
    status: '展示中',
    price: 58000,
    tags: ['山水', '湘绣', '意境']
  },
  {
    id: 'w003',
    name: '熊猫戏竹',
    imageUrl: 'https://picsum.photos/id/237/600/600',
    category: 'shuxiu',
    categoryName: '蜀绣',
    process: ['双面绣', '平针绣'],
    size: '45cm × 45cm',
    embroiderer: '陈淑芬',
    finishDate: '2026-05-28',
    frameType: '鸡翅木框',
    description: '憨态可掬的熊猫母子在竹林间嬉戏，蜀绣传统题材，针法细腻，色彩清雅，是四川特色礼品首选。',
    status: '在售',
    price: 16800,
    tags: ['熊猫', '蜀绣', '礼品']
  },
  {
    id: 'w004',
    name: '百鸟朝凤大屏',
    imageUrl: 'https://picsum.photos/id/110/600/900',
    category: 'suxiu',
    categoryName: '苏绣',
    process: ['乱针绣', '打籽绣'],
    size: '120cm × 180cm',
    embroiderer: '王秀兰',
    finishDate: '2026-04-15',
    frameType: '雕花千工床框',
    description: '大型苏绣精品，百鸟围绕凤凰翱翔，象征天下太平。耗时一年绣制，为镇店之宝级作品，适合大型厅堂陈设。',
    status: '馆藏',
    price: 388000,
    tags: ['收藏级', '大型', '镇店之宝']
  },
  {
    id: 'w005',
    name: '岭南红棉',
    imageUrl: 'https://picsum.photos/id/1080/600/800',
    category: 'yuexiu',
    categoryName: '粤绣',
    process: ['平针绣', '盘金绣'],
    size: '50cm × 70cm',
    embroiderer: '赵雅琴',
    finishDate: '2026-05-18',
    frameType: '酸枝木框',
    description: '粤绣代表作品，岭南木棉花盛开，盘金绣勾勒轮廓，色彩艳丽浓烈，岭南风情浓郁。',
    status: '在售',
    price: 12800,
    tags: ['粤绣', '岭南', '盘金绣']
  },
  {
    id: 'w006',
    name: '荷花蜻蜓',
    imageUrl: 'https://picsum.photos/id/1043/600/700',
    category: 'suxiu',
    categoryName: '苏绣',
    process: ['双面绣'],
    size: '40cm × 60cm',
    embroiderer: '吴春梅',
    finishDate: '2026-05-25',
    frameType: '红木插屏框',
    description: '夏日荷塘，蜻蜓立于荷尖，双面绣正反效果一致，置于案头，雅趣盎然。',
    status: '已售',
    price: 18800,
    tags: ['小品', '双面绣', '苏绣']
  },
  {
    id: 'w007',
    name: '奔马图',
    imageUrl: 'https://picsum.photos/id/1074/600/900',
    category: 'xiangxiu',
    categoryName: '湘绣',
    process: ['乱针绣'],
    size: '80cm × 130cm',
    embroiderer: '张美玲',
    finishDate: '2026-04-28',
    frameType: '花梨木宽框',
    description: '仿徐悲鸿大师笔意，乱针绣表现骏马奔腾之势，鬃毛飘逸，气势磅礴，适合书房办公场所。',
    status: '在售',
    price: 68000,
    tags: ['奔马', '湘绣', '大气']
  },
  {
    id: 'w008',
    name: '锦鲤戏荷',
    imageUrl: 'https://picsum.photos/id/1084/600/600',
    category: 'shuxiu',
    categoryName: '蜀绣',
    process: ['平针绣', '盘金绣'],
    size: '40cm × 40cm',
    embroiderer: '陈淑芬',
    finishDate: '2026-06-01',
    frameType: '鸡翅木圆框',
    description: '蜀绣清新小品，锦鲤在荷塘中穿梭，寓意年年有余，富贵吉祥。适合送礼与家居装饰。',
    status: '在售',
    price: 8800,
    tags: ['锦鲤', '蜀绣', '小品']
  }
];

export const studyEvents = [
  { id: 'st001', title: '刺绣基础体验课', date: '2026-06-20', time: '14:00-16:00', capacity: 10, enrolled: 6, price: 198, description: '零基础体验刺绣魅力，学习基础平针绣技法，完成小幅手帕作品。', image: 'https://picsum.photos/id/20/600/400' },
  { id: 'st002', title: '苏绣大师亲授班', date: '2026-06-25', time: '09:00-17:00', capacity: 6, enrolled: 4, price: 1280, description: '王秀兰大师亲自授课，系统学习苏绣针法，一天掌握入门进阶技巧。', image: 'https://picsum.photos/id/96/600/400' },
  { id: 'st003', title: '亲子刺绣DIY', date: '2026-06-28', time: '10:00-12:00', capacity: 15, enrolled: 12, price: 298, description: '亲子共同体验传统刺绣，增进感情，寓教于乐，完成小挂件作品。', image: 'https://picsum.photos/id/1062/600/400' }
];

export const financeList: FinanceRecord[] = [
  { id: 'f001', type: 'income', category: '订单收入', amount: 28800, description: '王女士富贵牡丹图订单', orderNo: 'JX20260615001', time: '2026-06-15 10:35' },
  { id: 'f002', type: 'income', category: '订单收入', amount: 18800, description: '张先生蜀绣熊猫订单', orderNo: 'JX20260614002', time: '2026-06-14 16:50' },
  { id: 'f003', type: 'expense', category: '绣娘工资', amount: 8500, description: '5月绣娘计件工资发放', time: '2026-06-05 10:00' },
  { id: 'f004', type: 'expense', category: '材料采购', amount: 3200, description: '丝线采购入库', time: '2026-06-10 09:30' },
  { id: 'f005', type: 'income', category: '作品销售', amount: 18800, description: '荷花蜻蜓作品售出', time: '2026-06-12 15:20' },
  { id: 'f006', type: 'income', category: '研学体验', amount: 2376, description: '亲子刺绣DIY课程', time: '2026-06-13 14:00' },
  { id: 'f007', type: 'expense', category: '装裱费用', amount: 1500, description: '6月装裱配框费用', time: '2026-06-18 11:00' }
];
