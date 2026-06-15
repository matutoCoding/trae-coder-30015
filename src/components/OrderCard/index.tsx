import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import styles from './index.module.scss';
import { Order, OrderStatus } from '@/types';
import StatusTag from '@/components/StatusTag';
import Taro from '@tarojs/taro';

interface OrderCardProps {
  order: Order;
}

const getStatusType = (status: OrderStatus) => {
  const map: Record<OrderStatus, 'pending' | 'processing' | 'framing' | 'done' | 'cancelled'> = {
    '待派单': 'pending',
    '绣制中': 'processing',
    '待装裱': 'framing',
    '已完成': 'done',
    '已取消': 'cancelled'
  };
  return map[status];
};

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/order-detail/index?id=${order.id}`
    });
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.header}>
        <Text className={styles.orderNo}>{order.orderNo}</Text>
        <StatusTag type={getStatusType(order.status)} text={order.status} size="sm" />
      </View>

      <View className={styles.body}>
        {order.sketchImage && (
          <Image className={styles.sketchImage} src={order.sketchImage} mode="aspectFill" />
        )}
        <View className={styles.info}>
          <Text className={styles.sketchName}>{order.sketchName || '定制设计'}</Text>
          <Text className={styles.customer}>客户: {order.customer.name}</Text>
          <Text className={styles.size}>尺寸: {order.size}</Text>
          <View className={styles.processRow}>
            {order.process.map((p, i) => (
              <Text key={i} className={styles.processTag}>{p}</Text>
            ))}
          </View>
        </View>
      </View>

      {order.progress > 0 && (
        <View className={styles.progressWrap}>
          <View className={styles.progressHeader}>
            <Text className={styles.stageText}>当前: {order.currentStage}</Text>
            <Text className={styles.progressNum}>{order.progress}%</Text>
          </View>
          <View className={styles.progressBar}>
            <View className={styles.progressFill} style={{ width: `${order.progress}%` }} />
          </View>
        </View>
      )}

      <View className={styles.footer}>
        <View className={styles.footerLeft}>
          <Text className={styles.budget}>¥{order.budget.toLocaleString()}</Text>
          <Text className={styles.deadline}>截止: {order.deadline}</Text>
        </View>
        <View className={styles.embroiderers}>
          {order.embroiderers?.map((e, i) => (
            <Text key={i} className={styles.embroiderer}>{e.name}</Text>
          ))}
          {!order.embroiderers?.length && order.status === '待派单' && (
            <Text className={styles.noDispatch}>待派单</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default OrderCard;
