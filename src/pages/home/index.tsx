import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import StatCard from '@/components/StatCard';
import SketchCard from '@/components/SketchCard';
import OrderCard from '@/components/OrderCard';
import WorkCard from '@/components/WorkCard';
import { sketchList, categoryList } from '@/data/sketch';
import { orderList } from '@/data/order';
import { workList, studyEvents } from '@/data/works';

const quickActions = [
  { id: 'newOrder', name: '新建订单', icon: '📝', bg: 'rgba(196, 30, 58, 0.1)' },
  { id: 'inventory', name: '丝线库存', icon: '🧵', bg: 'rgba(212, 165, 116, 0.15)' },
  { id: 'dispatch', name: '智能派单', icon: '👩‍🎨', bg: 'rgba(46, 125, 50, 0.1)' },
  { id: 'finance', name: '收支结算', icon: '💰', bg: 'rgba(21, 101, 192, 0.1)' }
];

const HomePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('绣制中');

  const handleAction = (id: string) => {
    switch (id) {
      case 'newOrder':
        Taro.navigateTo({ url: '/pages/create-order/index' });
        break;
      case 'inventory':
        Taro.navigateTo({ url: '/pages/silk-inventory/index' });
        break;
      case 'dispatch':
        Taro.switchTab({ url: '/pages/dispatch/index' });
        break;
      case 'finance':
        Taro.switchTab({ url: '/pages/mine/index' });
        break;
    }
  };

  const filteredSketches = activeCategory === 'all'
    ? sketchList.slice(0, 4)
    : sketchList.filter(s => s.category === activeCategory).slice(0, 4);

  const filteredOrders = orderList.filter(o => o.status === activeTab).slice(0, 2);

  return (
    <ScrollView scrollY className={styles.page} enableBackToTop>
      <View className={styles.heroSection}>
        <Text className={styles.heroTitle}>锦绣坊</Text>
        <Text className={styles.heroSubtitle}>非遗匠心 · 一针一线 · 传承千年</Text>
        <View className={styles.statGrid}>
          <StatCard title="进行中订单" value={orderList.filter(o => o.status === '绣制中').length} unit="单" accent="red" />
          <StatCard title="本月营收" value="5.8" unit="万" accent="gold" />
          <StatCard title="在线绣娘" value={orderList.filter(o => o.status === '绣制中').length + 4} unit="位" accent="brown" />
          <StatCard title="作品总数" value={workList.length} unit="件" accent="green" />
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.quickActions}>
          {quickActions.map(action => (
            <View key={action.id} className={styles.actionItem} onClick={() => handleAction(action.id)}>
              <View className={styles.actionIcon} style={{ background: action.bg }}>
                <Text>{action.icon}</Text>
              </View>
              <Text className={styles.actionText}>{action.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>绣稿底样库</Text>
          <Text className={styles.sectionMore} onClick={() => Taro.switchTab({ url: '/pages/works/index' })}>查看全部 ›</Text>
        </View>

        <ScrollView scrollX className={styles.categoryScroll}>
          {categoryList.map(cat => (
            <View
              key={cat.id}
              className={classnames(styles.categoryItem, activeCategory === cat.id && styles.active)}
              onClick={() => setActiveCategory(cat.id)}
            >
              <Text className={styles.categoryName}>{cat.name}</Text>
              <Text className={styles.categoryCount}>{cat.count}</Text>
            </View>
          ))}
        </ScrollView>

        <View className={styles.sketchGrid}>
          {filteredSketches.map(sketch => (
            <SketchCard key={sketch.id} sketch={sketch} />
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.orderSection}>
          <View className={styles.orderTopBar}>
            <View className={styles.tabBar}>
              {['待派单', '绣制中', '待装裱', '已完成'].map(tab => (
                <Text
                  key={tab}
                  className={classnames(styles.tabItem, activeTab === tab && styles.active)}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </Text>
              ))}
            </View>
            <Text className={styles.showAllBtn} onClick={() => Taro.switchTab({ url: '/pages/order/index' })}>全部订单</Text>
          </View>

          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => <OrderCard key={order.id} order={order} />)
          ) : (
            <View style={{ padding: '48rpx 0', textAlign: 'center' }}>
              <Text style={{ color: '#A08060', fontSize: '28rpx' }}>暂无{activeTab}的订单</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>精品作品展销</Text>
          <Text className={styles.sectionMore} onClick={() => Taro.switchTab({ url: '/pages/works/index' })}>查看全部 ›</Text>
        </View>

        <ScrollView scrollX className={styles.workScroll}>
          {workList.filter(w => w.status === '在售').slice(0, 4).map(work => (
            <View key={work.id} className={styles.workScrollItem}>
              <WorkCard work={work} />
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>研学体验活动</Text>
        </View>

        {studyEvents.map(event => (
          <View key={event.id} className={styles.studyCard}>
            <Image className={styles.studyImage} src={event.image} mode="aspectFill" />
            <View className={styles.studyContent}>
              <Text className={styles.studyTitle}>{event.title}</Text>
              <View className={styles.studyMeta}>
                <Text className={styles.studyInfo}>{event.date} {event.time}</Text>
                <Text className={styles.studyPrice}>¥{event.price}</Text>
              </View>
              <View className={styles.studyFooter}>
                <Text className={styles.studyCapacity}>已报名 {event.enrolled}/{event.capacity}人</Text>
                <View className={styles.joinBtn}>
                  <Text>立即报名</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
};

export default HomePage;
