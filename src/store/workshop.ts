import { create } from 'zustand';
import { Order, Embroiderer, SilkThread, SilkRecord, Sketch, Work, ProgressStage, ProcessType, Customer } from '@/types';
import { orderList } from '@/data/order';
import { embroidererList } from '@/data/embroiderer';
import { silkList, silkRecords } from '@/data/silk';
import { sketchList } from '@/data/sketch';
import { workList } from '@/data/works';
import dayjs from 'dayjs';

interface WorkshopState {
  orders: Order[];
  embroiderers: Embroiderer[];
  silkThreads: SilkThread[];
  silkRecords: SilkRecord[];
  sketches: Sketch[];
  works: Work[];

  addOrder: (order: Omit<Order, 'id' | 'orderNo' | 'createTime' | 'status' | 'progress' | 'currentStage' | 'stageLogs'> & { customer: Customer }) => string;
  getOrderById: (id: string) => Order | undefined;

  dispatchOrder: (orderId: string, embroidererIds: string[]) => boolean;

  advanceStage: (orderId: string, stage: ProgressStage, note: string) => boolean;

  addStageLog: (orderId: string, stage: ProgressStage, note: string) => void;

  addSilkStock: (silkId: string, quantity: number, operator: string, note?: string) => boolean;
  deductSilkStock: (silkId: string, quantity: number, operator: string, orderNo?: string, note?: string) => boolean;
  getSilkById: (id: string) => SilkThread | undefined;
}

let orderCounter = 100;

export const useWorkshopStore = create<WorkshopState>((set, get) => ({
  orders: [...orderList],
  embroiderers: [...embroidererList],
  silkThreads: [...silkList],
  silkRecords: [...silkRecords],
  sketches: [...sketchList],
  works: [...workList],

  addOrder: (orderData) => {
    orderCounter++;
    const newOrder: Order = {
      id: `order_${Date.now()}`,
      orderNo: `JX${dayjs().format('YYYYMMDD')}${String(orderCounter).padStart(3, '0')}`,
      status: '待派单',
      progress: 0,
      currentStage: '准备',
      stageLogs: [
        { stage: '准备', time: dayjs().format('YYYY-MM-DD HH:mm'), note: '订单已创建，等待派单' }
      ],
      createTime: dayjs().format('YYYY-MM-DD HH:mm'),
      ...orderData
    };
    set(state => ({ orders: [newOrder, ...state.orders] }));
    return newOrder.id;
  },

  getOrderById: (id) => {
    return get().orders.find(o => o.id === id);
  },

  dispatchOrder: (orderId, embroidererIds) => {
    const { orders, embroiderers } = get();
    const order = orders.find(o => o.id === orderId);
    if (!order || order.status !== '待派单') return false;

    const selectedEmbroiderers = embroiderers.filter(e => embroidererIds.includes(e.id));
    if (selectedEmbroiderers.length === 0) return false;

    const embroidererData = selectedEmbroiderers.map(e => ({ id: e.id, name: e.name }));

    set(state => ({
      orders: state.orders.map(o =>
        o.id === orderId
          ? {
              ...o,
              status: '绣制中',
              embroiderers: embroidererData,
              currentStage: '上绷',
              progress: 15,
              stageLogs: [
                ...o.stageLogs,
                { stage: '上绷', time: dayjs().format('YYYY-MM-DD HH:mm'), note: `已派单给${selectedEmbroiderers.map(e => e.name).join('、')}，开始上绷准备` }
              ]
            }
          : o
      ),
      embroiderers: state.embroiderers.map(e =>
        embroidererIds.includes(e.id)
          ? { ...e, status: '忙碌', currentTaskCount: e.currentTaskCount + 1 }
          : e
      )
    }));
    return true;
  },

  advanceStage: (orderId, stage, note) => {
    const { orders } = get();
    const order = orders.find(o => o.id === orderId);
    if (!order) return false;

    const stageOrder: ProgressStage[] = ['准备', '上绷', '绣制', '收尾', '质检', '装裱'];
    const stageProgressMap: Record<ProgressStage, number> = {
      '准备': 0,
      '上绷': 15,
      '绣制': 45,
      '收尾': 70,
      '质检': 85,
      '装裱': 100
    };

    const currentIdx = stageOrder.indexOf(order.currentStage);
    const targetIdx = stageOrder.indexOf(stage);
    if (targetIdx <= currentIdx) return false;

    let newStatus = order.status;
    if (stage === '装裱') {
      newStatus = '待装裱';
    }
    if (targetIdx >= 5) {
      newStatus = '已完成';
    }

    const newLog = {
      stage,
      time: dayjs().format('YYYY-MM-DD HH:mm'),
      note
    };

    set(state => ({
      orders: state.orders.map(o =>
        o.id === orderId
          ? {
              ...o,
              currentStage: stage,
              progress: stageProgressMap[stage],
              status: newStatus,
              stageLogs: [...o.stageLogs, newLog]
            }
          : o
      )
    }));

    return true;
  },

  addStageLog: (orderId, stage, note) => {
    set(state => ({
      orders: state.orders.map(o =>
        o.id === orderId
          ? {
              ...o,
              stageLogs: [
                ...o.stageLogs,
                { stage, time: dayjs().format('YYYY-MM-DD HH:mm'), note }
              ]
            }
          : o
      )
    }));
  },

  addSilkStock: (silkId, quantity, operator, note = '采购入库') => {
    const { silkThreads, silkRecords } = get();
    const silk = silkThreads.find(s => s.id === silkId);
    if (!silk || quantity <= 0) return false;

    const newRecord: SilkRecord = {
      id: `sr_${Date.now()}`,
      silkId,
      silkName: silk.colorName,
      type: 'in',
      quantity,
      operator,
      time: dayjs().format('YYYY-MM-DD HH:mm'),
      note
    };

    set(state => ({
      silkThreads: state.silkThreads.map(s =>
        s.id === silkId ? { ...s, stock: s.stock + quantity } : s
      ),
      silkRecords: [newRecord, ...state.silkRecords]
    }));
    return true;
  },

  deductSilkStock: (silkId, quantity, operator, orderNo, note = '订单领料') => {
    const { silkThreads, silkRecords } = get();
    const silk = silkThreads.find(s => s.id === silkId);
    if (!silk || quantity <= 0) return false;
    if (silk.stock < quantity) {
      return false;
    }

    const newRecord: SilkRecord = {
      id: `sr_${Date.now()}`,
      silkId,
      silkName: silk.colorName,
      type: 'out',
      quantity,
      operator,
      time: dayjs().format('YYYY-MM-DD HH:mm'),
      orderNo,
      note
    };

    set(state => ({
      silkThreads: state.silkThreads.map(s =>
        s.id === silkId ? { ...s, stock: s.stock - quantity } : s
      ),
      silkRecords: [newRecord, ...state.silkRecords]
    }));
    return true;
  },

  getSilkById: (id) => {
    return get().silkThreads.find(s => s.id === id);
  }
}));
