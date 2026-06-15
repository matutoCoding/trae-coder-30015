import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { silkList, silkRecords } from '@/data/silk';

const SilkInventoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('丝线库存');
  const [activeCategory, setActiveCategory] = useState('全部');

  const categories = useMemo(() => {
    const cats = ['全部', ...new Set(silkList.map(s => s.category))];
    return cats;
  }, []);

  const filteredSilk = useMemo(() => {
    return silkList.filter(s => activeCategory === '全部' || s.category === activeCategory);
  }, [activeCategory]);

  const totalStock = silkList.reduce((sum, s) => sum + s.stock, 0);
  const lowStockCount = silkList.filter(s => s.stock <= s.minStock).length;
  const categoriesCount = new Set(silkList.map(s => s.category)).size;

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
          <View className={styles.actionBtn + ' ' + styles.secondary} onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}>
            丝线入库
          </View>
          <View className={styles.actionBtn + ' ' + styles.primary} onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}>
            订单领料
          </View>
        </View>
      )}
    </View>
  );
};

export default SilkInventoryPage;
