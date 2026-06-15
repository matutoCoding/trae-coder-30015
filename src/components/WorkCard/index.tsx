import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import styles from './index.module.scss';
import { Work } from '@/types';
import StatusTag from '@/components/StatusTag';

interface WorkCardProps {
  work: Work;
  layout?: 'vertical' | 'horizontal';
  onClick?: () => void;
}

const getStatusType = (status: string) => {
  const map: Record<string, 'done' | 'info' | 'pending' | 'success'> = {
    '在售': 'done',
    '已售': 'info',
    '展示中': 'pending',
    '馆藏': 'success'
  };
  return map[status] || 'info';
};

const WorkCard: React.FC<WorkCardProps> = ({ work, layout = 'vertical', onClick }) => {
  if (layout === 'horizontal') {
    return (
      <View className={styles.cardHorizontal} onClick={onClick}>
        <Image className={styles.imageHorizontal} src={work.imageUrl} mode="aspectFill" />
        <View className={styles.contentHorizontal}>
          <View className={styles.headerRow}>
            <Text className={styles.name}>{work.name}</Text>
            <StatusTag type={getStatusType(work.status) as any} text={work.status} size="sm" />
          </View>
          <Text className={styles.category}>{work.categoryName} · {work.size}</Text>
          <Text className={styles.embroiderer}>绣娘: {work.embroiderer}</Text>
          <View className={styles.footerRow}>
            <Text className={styles.price}>¥{work.price.toLocaleString()}</Text>
            {work.frameType && <Text className={styles.frame}>{work.frameType}</Text>}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.card} onClick={onClick}>
      <View className={styles.imageWrap}>
        <Image className={styles.image} src={work.imageUrl} mode="aspectFill" />
        <View className={styles.statusWrap}>
          <StatusTag type={getStatusType(work.status) as any} text={work.status} size="sm" />
        </View>
      </View>
      <View className={styles.content}>
        <Text className={styles.name}>{work.name}</Text>
        <View className={styles.tagRow}>
          <Text className={styles.categoryTag}>{work.categoryName}</Text>
          {work.process.slice(0, 1).map((p, i) => (
            <Text key={i} className={styles.processTag}>{p}</Text>
          ))}
        </View>
        <Text className={styles.size}>{work.size}</Text>
        <View className={styles.footer}>
          <Text className={styles.price}>¥{work.price.toLocaleString()}</Text>
          <Text className={styles.embroiderer}>{work.embroiderer}</Text>
        </View>
      </View>
    </View>
  );
};

export default WorkCard;
