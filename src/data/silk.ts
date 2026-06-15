import { SilkThread, SilkRecord } from '@/types';

export const silkList: SilkThread[] = [
  { id: 'silk001', colorCode: 'R001', colorName: '大红', colorHex: '#DC143C', category: '红色系', stock: 50, unit: '绞', minStock: 10, supplier: '苏州绣线厂', price: 28 },
  { id: 'silk002', colorCode: 'R002', colorName: '朱红', colorHex: '#FF4500', category: '红色系', stock: 42, unit: '绞', minStock: 10, supplier: '苏州绣线厂', price: 28 },
  { id: 'silk003', colorCode: 'R003', colorName: '粉红', colorHex: '#FFB6C1', category: '红色系', stock: 8, unit: '绞', minStock: 10, supplier: '苏州绣线厂', price: 28 },
  { id: 'silk004', colorCode: 'Y001', colorName: '金黄', colorHex: '#FFD700', category: '黄色系', stock: 35, unit: '绞', minStock: 10, supplier: '杭州真丝线厂', price: 32 },
  { id: 'silk005', colorCode: 'Y002', colorName: '橙黄', colorHex: '#FFA500', category: '黄色系', stock: 28, unit: '绞', minStock: 10, supplier: '杭州真丝线厂', price: 32 },
  { id: 'silk006', colorCode: 'G001', colorName: '翠绿', colorHex: '#00FA9A', category: '绿色系', stock: 3, unit: '绞', minStock: 10, supplier: '成都蜀绣线厂', price: 30 },
  { id: 'silk007', colorCode: 'G002', colorName: '草绿', colorHex: '#7CFC00', category: '绿色系', stock: 22, unit: '绞', minStock: 10, supplier: '成都蜀绣线厂', price: 30 },
  { id: 'silk008', colorCode: 'G003', colorName: '墨绿', colorHex: '#006400', category: '绿色系', stock: 18, unit: '绞', minStock: 8, supplier: '成都蜀绣线厂', price: 30 },
  { id: 'silk009', colorCode: 'B001', colorName: '宝蓝', colorHex: '#1E90FF', category: '蓝色系', stock: 30, unit: '绞', minStock: 10, supplier: '苏州绣线厂', price: 28 },
  { id: 'silk010', colorCode: 'B002', colorName: '湖蓝', colorHex: '#87CEEB', category: '蓝色系', stock: 25, unit: '绞', minStock: 10, supplier: '苏州绣线厂', price: 28 },
  { id: 'silk011', colorCode: 'N001', colorName: '纯白', colorHex: '#FFFFFF', category: '中性色', stock: 55, unit: '绞', minStock: 15, supplier: '杭州真丝线厂', price: 25 },
  { id: 'silk012', colorCode: 'N002', colorName: '米白', colorHex: '#FAEBD7', category: '中性色', stock: 38, unit: '绞', minStock: 10, supplier: '杭州真丝线厂', price: 25 },
  { id: 'silk013', colorCode: 'N003', colorName: '深灰', colorHex: '#696969', category: '中性色', stock: 15, unit: '绞', minStock: 8, supplier: '苏州绣线厂', price: 26 },
  { id: 'silk014', colorCode: 'BR001', colorName: '赭石', colorHex: '#8B4513', category: '棕色系', stock: 20, unit: '绞', minStock: 10, supplier: '成都蜀绣线厂', price: 28 },
  { id: 'silk015', colorCode: 'BR002', colorName: '土黄', colorHex: '#D2B48C', category: '棕色系', stock: 12, unit: '绞', minStock: 8, supplier: '成都蜀绣线厂', price: 28 },
  { id: 'silk016', colorCode: 'GL001', colorName: '赤金', colorHex: '#DAA520', category: '金属线', stock: 5, unit: '轴', minStock: 5, supplier: '苏州金箔厂', price: 88 },
  { id: 'silk017', colorCode: 'GL002', colorName: '白银', colorHex: '#C0C0C0', category: '金属线', stock: 3, unit: '轴', minStock: 5, supplier: '苏州金箔厂', price: 88 }
];

export const silkRecords: SilkRecord[] = [
  { id: 'sr001', silkId: 'silk001', silkName: '大红', type: 'out', quantity: 5, operator: '管理员', time: '2026-06-17 10:00', orderNo: 'JX20260615001', note: '王秀兰花鸟绣制' },
  { id: 'sr002', silkId: 'silk004', silkName: '金黄', type: 'in', quantity: 20, operator: '管理员', time: '2026-06-16 14:30', note: '采购入库' },
  { id: 'sr003', silkId: 'silk007', silkName: '草绿', type: 'out', quantity: 8, operator: '管理员', time: '2026-06-15 09:15', orderNo: 'JX20260613003', note: '百鸟朝凤绣制' },
  { id: 'sr004', silkId: 'silk016', silkName: '赤金', type: 'out', quantity: 1, operator: '管理员', time: '2026-06-14 16:20', orderNo: 'JX20260610004', note: '盘金绣用' },
  { id: 'sr005', silkId: 'silk003', silkName: '粉红', type: 'out', quantity: 6, operator: '管理员', time: '2026-06-12 11:00', orderNo: 'JX20260601005', note: '山水点缀' },
  { id: 'sr006', silkId: 'silk011', silkName: '纯白', type: 'in', quantity: 30, operator: '管理员', time: '2026-06-10 09:00', note: '月初采购' }
];
