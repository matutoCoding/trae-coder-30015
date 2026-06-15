import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import EmbroidererCard from '@/components/EmbroidererCard';
import StatCard from '@/components/StatCard';
import { embroidererList } from '@/data/embroiderer';
import { orderList } from '@/data/order';
import { Order, Embroiderer, ProcessType, EmbroidererLevel } from '@/types';

const levelFilters: Array<EmbroidererLevel | '全部'> = ['全部', '大师级', '高级', '中级', '初级'];
const statusFilters = ['全部', '空闲', '忙碌', '休息'];

const DispatchPage: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState<EmbroidererLevel | '全部'>('全部');
  const [activeStatus, setActiveStatus] = useState('全部');
  const [pendingOrder, setPendingOrder] = useState<Order | null>(orderList.find(o => o.status === '待派单') || null);

  const idleCount = embroidererList.filter(e => e.status === '空闲').length;
  const busyCount = embroidererList.filter(e => e.status === '忙碌').length;
  const masterCount = embroidererList.filter(e => e.level === '大师级').length;

  const filteredEmbroiderers = useMemo(() => {
    return embroidererList.filter(e => {
      const levelMatch = activeLevel === '全部' || e.level === activeLevel;
      const statusMatch = activeStatus === '全部' || e.status === activeStatus;
      return levelMatch && statusMatch;
    });
  }, [activeLevel, activeStatus]);

  const handleDispatch = (embroiderer: Embroiderer) => {
    if (embroiderer.status !== '空闲') {
      Taro.showToast({ title: '该绣娘当前忙碌', icon: 'none' });
      return;
    }
    Taro.showModal({
      title: '确认派单',
      content: `将订单派发给 ${embroiderer.name}(${embroiderer.level})？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '派单成功', icon: 'success' });
          setPendingOrder(null);
        }
      }
    });
  };

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>绣娘技艺分级派单</Text>
        <Text className={styles.headerSubtitle}>智能匹配绣娘 · 技艺精准对接</Text>
      </View>

      <View className={styles.content}>
        <View style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          <StatCard title="空闲绣娘" value={idleCount} unit="位" accent="green" />
          <StatCard title="忙碌中" value={busyCount} unit="位" accent="red" />
          <StatCard title="大师级" value={masterCount} unit="位" accent="gold" />
        </View>

        {pendingOrder && (
          <View className={styles.section}>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>待派单订单</Text>
            </View>
            <View className={styles.pendingOrderCard}>
              <Text className={styles.orderBadge}>急单 · 待派单</Text>
              <Text className={styles.pendingTitle}>{pendingOrder.sketchName || '定制设计'}</Text>
              <View className={styles.pendingMeta}>
                <Text className={styles.metaText}>客户: {pendingOrder.customer.name}</Text>
                <Text className={styles.metaText}>预算: ¥{pendingOrder.budget.toLocaleString()}</Text>
              </View>
              <View className={styles.pendingMeta}>
                <Text className={styles.metaText}>尺寸: {pendingOrder.size}</Text>
                <Text className={styles.metaText}>截止: {pendingOrder.deadline}</Text>
              </View>
              <View className={styles.processRow}>
                {pendingOrder.process.map((p, i) => (
                  <Text key={i} className={styles.processTag}>{p}</Text>
                ))}
              </View>
              <View className={styles.dispatchBtn}>
                <Text className={styles.dispatchBtnText}>从下方选择绣娘派单</Text>
              </View>
            </View>
          </View>
        )}

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>绣娘档案</Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 24, color: '#A08060', marginBottom: 12, display: 'block' }}>技艺等级</Text>
            <View className={styles.filterRow}>
              {levelFilters.map(f => (
                <Text
                  key={f}
                  className={classnames(styles.filterChip, activeLevel === f && styles.active)}
                  onClick={() => setActiveLevel(f)}
                >
                  {f}
                </Text>
              ))}
            </View>
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 24, color: '#A08060', marginBottom: 12, display: 'block' }}>工作状态</Text>
            <View className={styles.filterRow}>
              {statusFilters.map(f => (
                <Text
                  key={f}
                  className={classnames(styles.filterChip, activeStatus === f && styles.active)}
                  onClick={() => setActiveStatus(f)}
                >
                  {f}
                </Text>
              ))}
            </View>
          </View>

          <View className={styles.embroidererList}>
            {filteredEmbroiderers.map(e => (
              <EmbroidererCard
                key={e.id}
                embroiderer={e}
                showDispatch={!!pendingOrder}
                onDispatch={() => handleDispatch(e)}
              />
            ))}
            {filteredEmbroiderers.length === 0 && (
              <View style={{ padding: 80, textAlign: 'center' }}>
                <Text style={{ fontSize: 28, color: '#A08060' }}>暂无符合条件的绣娘</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default DispatchPage;
