// 刺绣类型
export type EmbroideryType = 'suxiu' | 'xiangxiu' | 'yuexiu' | 'shuxiu' | 'modern';

// 工艺类型
export type ProcessType = '双面绣' | '乱针绣' | '平针绣' | '打籽绣' | '盘金绣';

// 绣娘等级
export type EmbroidererLevel = '初级' | '中级' | '高级' | '大师级';

// 订单状态
export type OrderStatus = '待派单' | '绣制中' | '待装裱' | '已完成' | '已取消';

// 进度阶段
export type ProgressStage = '准备' | '上绷' | '绣制' | '收尾' | '质检' | '装裱';

// 作品状态
export type WorkStatus = '在售' | '已售' | '展示中' | '馆藏';

// 绣稿
export interface Sketch {
  id: string;
  name: string;
  category: EmbroideryType;
  categoryName: string;
  process: ProcessType[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedDays: number;
  description: string;
  imageUrl: string;
  tags: string[];
  silkColors: string[];
  size: string;
}

// 客户
export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
}

// 订单
export interface Order {
  id: string;
  orderNo: string;
  customer: Customer;
  sketchId?: string;
  sketchName?: string;
  sketchImage?: string;
  customRequirement: string;
  size: string;
  process: ProcessType[];
  budget: number;
  deadline: string;
  status: OrderStatus;
  createTime: string;
  embroiderers?: { id: string; name: string }[];
  progress: number;
  currentStage: ProgressStage;
  stageLogs: { stage: ProgressStage; time: string; note: string }[];
}

// 绣娘
export interface Embroiderer {
  id: string;
  name: string;
  avatar: string;
  level: EmbroidererLevel;
  yearsOfExperience: number;
  specialty: ProcessType[];
  goodCategories: EmbroideryType[];
  phone: string;
  status: '空闲' | '忙碌' | '休息';
  currentTaskCount: number;
  completedCount: number;
  rating: number;
  dailyWage: number;
  introduction: string;
}

// 丝线
export interface SilkThread {
  id: string;
  colorCode: string;
  colorName: string;
  colorHex: string;
  category: string;
  stock: number;
  unit: string;
  minStock: number;
  supplier: string;
  price: number;
}

// 作品
export interface Work {
  id: string;
  name: string;
  imageUrl: string;
  category: EmbroideryType;
  categoryName: string;
  process: ProcessType[];
  size: string;
  embroiderer: string;
  finishDate: string;
  frameType?: string;
  description: string;
  status: WorkStatus;
  price: number;
  tags: string[];
}

// 丝线出入库记录
export interface SilkRecord {
  id: string;
  silkId: string;
  silkName: string;
  type: 'in' | 'out';
  quantity: number;
  operator: string;
  time: string;
  orderNo?: string;
  note?: string;
}

// 收支记录
export interface FinanceRecord {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  orderNo?: string;
  time: string;
}
