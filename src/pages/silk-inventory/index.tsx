import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useWorkshopStore } from '@/store/workshop';

const SilkInventoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('丝线库存');
  const [activeCategory, setActiveCategory] = useState('全部');
  const { silkThreads, silkRecords, addSilkStock, deductSilkStock } = useWorkshopStore();

  useDidShow(() => {
  });

  const categories = useMemo(() => {
    const cats = ['全部', ...new Set(silkThreads.map(s => s.category))];
    return cats;
  }, [silkThreads]);

  const filteredSilk = useMemo(() => {
    return silkThreads.filter(s => activeCategory === '全部' || s.category === activeCategory);
  }, [activeCategory, silkThreads]);

  const totalStock = useMemo(
    () => silkThreads.reduce((sum, s) => sum + s.stock, 0),
    [silkThreads]
  );
  const lowStockCount = useMemo(
    () => silkThreads.filter(s => s.stock <= s.minStock).length,
    [silkThreads]
  );
  const categoriesCount = useMemo(
    () => new Set(silkThreads.map(s => s.category)).size,
    [silkThreads]
  );

  const handleStockIn = () => {
    const silkNames = filteredSilk.map(s => `${s.colorName}（当前${s.stock}${s.unit}）`);
    Taro.showActionSheet({
      itemList: silkNames,
      success: (res) => {
        const silk = filteredSilk[res.tapIndex];
        Taro.showModal({
          title: `${silk.colorName} - 入库`,
          editable: true,
          placeholderText: '请输入入库数量',
          confirmText: '下一步',
          confirmColor: '#C41E3A',
          success: (qtyRes) => {
            if (qtyRes.confirm) {
              const qty = Number(qtyRes.content);
              if (!qty || qty <= 0) {
                Taro.showToast({ title: '请输入有效数量', icon: 'none' });
                return;
              }
              Taro.showModal({
                title: '备注（选填）',
                editable: true,
                placeholderText: '如：采购入库、盘点补入等',
                confirmText: '确认入库',
                confirmColor: '#C41E3A',
                success: (noteRes) => {
                  if (noteRes.confirm) {
                    const note = noteRes.content?.trim() || '采购入库';
                    const success = addSilkStock(silk.id, qty, '管理员', note);
                    if (success) {
                      Taro.showToast({ title: `入库成功 +${qty}${silk.unit}`, icon: 'success' });
                    }
                  }
                }
              });
            }
          }
        });
      }
    });
  };

  const handleStockOut = () => {
    const availableSilk = filteredSilk.filter(s => s.stock > 0);
    if (availableSilk.length === 0) {
      Taro.showToast({ title: '当前分类无可用库存', icon: 'none' });
      return;
    }
    const silkNames = availableSilk.map(s => `${s.colorName}（库存${s.stock}${s.unit}）`);
    Taro.showActionSheet({
      itemList: silkNames,
      success: (res) => {
        const silk = availableSilk[res.tapIndex];
        Taro.showModal({
          title: `${silk.colorName} - 领料`,
          editable: true,
          placeholderText: `请输入领料数量（最多${silk.stock}${silk.unit}）`,
          confirmText: '下一步',
          confirmColor: '#C41E3A',
          success: (qtyRes) => {
            if (qtyRes.confirm) {
              const qty = Number(qtyRes.content);
              if (!qty || qty <= 0) {
                Taro.showToast({ title: '请输入有效数量', icon: 'none' });
                return;
              }
              if (qty > silk.stock) {
                Taro.showToast({ title: `库存不足，仅剩${silk.stock}${silk.unit}`, icon: 'none' });
                return;
              }
              const remainingAfter = silk.stock - qty;
              if (remainingAfter < silk.minStock) {
                Taro.showModal({
                  title: '⚠️ 库存预警',
                  content: `领料后库存（${remainingAfter}${silk.unit}）将低于安全线（${silk.minStock}${silk.unit}），是否继续？`,
                  confirmText: '继续领料',
                  confirmColor: '#C41E3A',
                  success: (warnRes) => {
                    if (warnRes.confirm) {
                      askForOrderNo(silk.id, qty, silk.unit);
                    }
                  }
                });
              } else {
                askForOrderNo(silk.id, qty, silk.unit);
              }
            }
          }
        });
      }
    });
  };

  const askForOrderNo = (silkId: string, qty: number, unit: string) => {
    Taro.showModal({
      title: '关联订单号（选填）',
      editable: true,
      placeholderText: '如：JX20260615001',
      confirmText: '确认领料',
      confirmColor: '#C41E3A',
      success: (orderRes) => {
        if (orderRes.confirm) {
          const orderNo = orderRes.content?.trim() || undefined;
          const note = orderNo ? '订单绣制领料' : '日常领料';
          const success = deductSilkStock(silkId, qty, '管理员', orderNo, note);
          if (success) {
            Taro.showToast({ title: `领料成功 -${qty}${unit}`, icon: 'success' });
          } else {
            Taro.showToast({ title: '库存不足，领料失败', icon: 'none' });
          }
        }
      }
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>丝线色卡库存管理</Text>
        <Text className={styles.subtitle}>色号齐全 · 库存透明 · 出入可溯</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.tabs}>
          <Text
            className={classnames(styles.tabItem, activeTab === '丝线库存' && styles.active)}
            onClick={() => setActiveTab('丝线库存')}
          >
            丝线库存
          </Text>
          <Text
            className={classnames(styles.tabItem, activeTab === '出入库记录' && styles.active)}
            onClick={() => setActiveTab('出入库记录')}
          >
            出入库记录
          </Text>
        </View>

        <View className={styles.statGrid}>
          <View className={styles.statCard}>
            <Text className={styles.statNum}>{totalStock}</Text>
            <Text className={styles.statLabel}>总库存</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statNum}>{categoriesCount}</Text>
            <Text className={styles.statLabel}>色系统数</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statNum} style={{ color: lowStockCount > 0 ? '#C0392B' : '#8B4513' }}>{lowStockCount}</Text>
            <Text className={styles.statLabel}>低于安全线</Text>
          </View>
        </View>

        {activeTab === '丝线库存' && (
          <>
            <View className={styles.categoryFilter}>
              {categories.map(c => (
                <Text
                  key={c}
                  className={classnames(styles.catChip, activeCategory === c && styles.active)}
                  onClick={() => setActiveCategory(c)}
                >
                  {c}
                </Text>
              ))}
            </View>

            <ScrollView scrollY style={{ maxHeight: 800 }}>
              <View className={styles.silkList}>
                {filteredSilk.map(silk => (
                  <View key={silk.id} className={styles.silkCard}>
                    <View className={styles.silkRow}>
                      <View className={styles.colorBox} style={{ background: silk.colorHex }} />
                      <View className={styles.silkInfo}>
                        <Text className={styles.silkName}>{silk.colorName}</Text>
                        <Text className={styles.silkCode}>{silk.colorCode} · {silk.category} · ¥{silk.price}/{silk.unit}</Text>
                        {silk.stock <= silk.minStock && (
                          <Text style={{ fontSize: 22, color: '#C0392B', marginTop: 4, display: 'block' }}>⚠️ 库存不足（安全线{silk.minStock}{silk.unit}）</Text>
                        )}
                      </View>
                      <View className={styles.stockInfo}>
                        <Text className={classnames(styles.stockNum, silk.stock <= silk.minStock && styles.low)}>
                          {silk.stock}{silk.unit}
                        </Text>
                        <Text className={styles.stockLabel}>供应商: {silk.supplier}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </>
        )}

        {activeTab === '出入库记录' && (
          <View className={styles.recordList}>
            {silkRecords.map(r => (
              <View key={r.id} className={styles.recordItem}>
                <View
                  className={styles.recordIcon}
                  style={{ background: r.type === 'in' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(192, 57, 43, 0.1)' }}
                >
                  <Text>{r.type === 'in' ? '📥' : '📤'}</Text>
                </View>
                <View className={styles.recordInfo}>
                  <Text className={styles.recordTitle}>
                    {r.silkName} · {r.type === 'in' ? '入库' : '出库'} {r.quantity}{r.note ? ` · ${r.note}` : ''}
                  </Text>
                  <Text className={styles.recordTime}>
                    {r.time} · 操作人: {r.operator}{r.orderNo ? ` · ${r.orderNo}` : ''}
                  </Text>
                </View>
                <Text className={styles.recordQty + ' ' + (r.type === 'in' ? styles.in : styles.out)}>
                  {r.type === 'in' ? '+' : '-'}{r.quantity}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {activeTab === '丝线库存' && (
        <View className={styles.actionBar}>
          <View className={styles.actionBtn + ' ' + styles.secondary} onClick={handleStockIn}>
            丝线入库
          </View>
          <View className={styles.actionBtn + ' ' + styles.primary} onClick={handleStockOut}>
            订单领料
          </View>
        </View>
      )}
    </View>
  );
};

export default SilkInventoryPage;
