import React from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { financeList } from '@/data/works';
import { orderList } from '@/data/order';
import { embroidererList } from '@/data/embroiderer';

const managementMenus = [
  { id: 'silk', name: '丝线色卡库存', desc: '丝线色卡管理、出入库记录', icon: '🧵', bg: 'rgba(139, 69, 19, 0.1)', url: '/pages/silk-inventory/index' },
  { id: 'study', name: '研学体验活动', desc: '体验课、大师班报名管理', icon: '📚', bg: 'rgba(46, 125, 50, 0.1)', url: '' },
  { id: 'embroiderer', name: '绣娘档案管理', desc: '技艺等级、档期、工资', icon: '👩‍🎨', bg: 'rgba(21, 101, 192, 0.1)', url: '' }
];

const settingsMenus = [
  { id: 'profile', name: '店铺资料', desc: '锦绣坊信息与介绍', icon: '🏛️', bg: 'rgba(196, 30, 58, 0.08)' },
  { id: 'print', name: '打印标签', desc: '作品标签、收藏证书', icon: '🏷️', bg: 'rgba(212, 165, 116, 0.15)' },
  { id: 'backup', name: '数据备份', desc: '订单、作品云端备份', icon: '☁️', bg: 'rgba(74, 85, 104, 0.08)' }
];

const MinePage: React.FC = () => {
  const totalIncome = financeList.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0);
  const totalExpense = financeList.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0);
  const balance = totalIncome - totalExpense;

  const handleMenuClick = (url: string) => {
    if (url) {
      Taro.navigateTo({ url });
    } else {
      Taro.showToast({ title: '功能开发中', icon: 'none' });
    }
  };

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.profileHeader}>
        <View className={styles.profileRow}>
          <View className={styles.avatar}>
            <Text style={{ fontSize: 64, textAlign: 'center', lineHeight: '140rpx', color: '#C41E3A' }}>🏮</Text>
          </View>
          <View className={styles.profileInfo}>
            <Text className={styles.userName}>锦绣坊 · 管理端</Text>
            <Text className={styles.userRole}>传统刺绣非遗工坊 · 创立于1985年</Text>
          </View>
        </View>
      </View>

      <View className={styles.statRow}>
        {[
          { value: orderList.length, label: '总订单' },
          { value: embroidererList?.length || 8, label: '在册绣娘' },
          { value: orderList.filter(o => o.status === '绣制中').length, label: '进行中' },
          { value: orderList.filter(o => o.status === '已完成').length, label: '已完成' }
        ].map(s => (
          <View key={s.label} className={styles.statItem}>
            <Text className={styles.statNum}>{s.value}</Text>
            <Text className={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.content}>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>收支结算</Text>
          <View className={styles.financeSummary}>
            <Text className={styles.summaryTitle}>本月概览</Text>
            <View className={styles.summaryGrid}>
              <View className={styles.summaryItem}>
                <Text className={styles.summaryNum + ' ' + styles.income}>+¥{totalIncome.toLocaleString()}</Text>
                <Text className={styles.summaryLabel}>总收入</Text>
              </View>
              <View className={styles.summaryItem}>
                <Text className={styles.summaryNum + ' ' + styles.expense}>-¥{totalExpense.toLocaleString()}</Text>
                <Text className={styles.summaryLabel}>总支出</Text>
              </View>
              <View className={styles.summaryItem}>
                <Text className={styles.summaryNum + ' ' + styles.balance}>¥{balance.toLocaleString()}</Text>
                <Text className={styles.summaryLabel}>净收入</Text>
              </View>
            </View>
          </View>
          <View className={styles.financeList}>
            {financeList.slice(0, 5).map(f => (
              <View key={f.id} className={styles.financeItem}>
                <View
                  className={styles.financeIcon}
                  style={{ background: f.type === 'income' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(192, 57, 43, 0.1)' }}
                >
                  <Text>{f.type === 'income' ? '📥' : '📤'}</Text>
                </View>
                <View className={styles.financeInfo}>
                  <Text className={styles.financeTitle}>{f.category}</Text>
                  <Text className={styles.financeTime}>{f.time} · {f.description}</Text>
                </View>
                <Text className={styles.financeAmount + ' ' + (f.type === 'income' ? styles.income : styles.expense)}>
                  {f.type === 'income' ? '+' : '-'}¥{f.amount.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>工坊管理</Text>
          <View className={styles.menuGroup}>
            {managementMenus.map(m => (
              <View key={m.id} className={styles.menuItem} onClick={() => handleMenuClick(m.url)}>
                <View className={styles.menuIcon} style={{ background: m.bg }}>
                  <Text>{m.icon}</Text>
                </View>
                <View className={styles.menuInfo}>
                  <Text className={styles.menuName}>{m.name}</Text>
                  <Text className={styles.menuDesc}>{m.desc}</Text>
                </View>
                <Text className={styles.menuArrow}>›</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>设置与工具</Text>
          <View className={styles.menuGroup}>
            {settingsMenus.map(m => (
              <View key={m.id} className={styles.menuItem} onClick={() => handleMenuClick('')}>
                <View className={styles.menuIcon} style={{ background: m.bg }}>
                  <Text>{m.icon}</Text>
                </View>
                <View className={styles.menuInfo}>
                  <Text className={styles.menuName}>{m.name}</Text>
                  <Text className={styles.menuDesc}>{m.desc}</Text>
                </View>
                <Text className={styles.menuArrow}>›</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ padding: 32, textAlign: 'center' }}>
          <Text style={{ fontSize: 22, color: '#A08060' }}>锦绣坊 · 非遗匠心 · 传承千年</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default MinePage;
