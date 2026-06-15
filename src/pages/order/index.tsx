import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import OrderCard from '@/components/OrderCard';
import { orderList } from '@/data/order';

const tabs = ['全部', '待派单', '绣制中', '待装裱', '已完成'];

const OrderPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('全部');
  const [searchText, setSearchText] = useState('');

  const filteredOrders = useMemo(() => {
    return orderList.filter(o => {
      const tabMatch = activeTab === '全部' || o.status === activeTab;
      const searchMatch = !searchText ||
        o.orderNo.toLowerCase().includes(searchText.toLowerCase()) ||
        o.customer.name.includes(searchText) ||
        (o.sketchName && o.sketchName.includes(searchText));
      return tabMatch && searchMatch;
    });
  }, [activeTab, searchText]);

  const stats = [
    { label: '总订单', value: orderList.length },
    { label: '待派单', value: orderList.filter(o => o.status === '待派单').length },
    { label: '绣制中', value: orderList.filter(o => o.status === '绣制中').length },
    { label: '已完成', value: orderList.filter(o => o.status === '已完成').length }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.tabBar}>
        {tabs.map(tab => (
          <Text
            key={tab}
            className={classnames(styles.tabItem, activeTab === tab && styles.active)}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Text>
        ))}
      </View>

      <ScrollView scrollY>
        <View className={styles.content}>
          <View className={styles.searchWrap}>
            <Text className={styles.searchIcon}>🔍</Text>
            <Input
              className={styles.searchInput}
              placeholder="搜索订单号/客户/绣稿名称"
              placeholderClass="inputPlacehold"
              value={searchText}
              onInput={e => setSearchText(e.detail.value)}
            />
          </View>

          <View className={styles.statRow}>
            {stats.map(s => (
              <View key={s.label} className={styles.statItem}>
                <Text className={styles.statNum}>{s.value}</Text>
                <Text className={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => <OrderCard key={order.id} order={order} />)
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📋</Text>
              <Text className={styles.emptyText}>暂无相关订单</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View className={styles.createBtn} onClick={() => Taro.navigateTo({ url: '/pages/create-order/index' })}>
        <Text className={styles.createBtnText}>+</Text>
      </View>
    </View>
  );
};

export default OrderPage;
