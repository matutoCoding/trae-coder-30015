import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import styles from './index.module.scss';
import { Embroiderer } from '@/types';
import StatusTag from '@/components/StatusTag';
import Taro from '@tarojs/taro';

interface EmbroidererCardProps {
  embroiderer: Embroiderer;
  showDispatch?: boolean;
  onDispatch?: () => void;
}

const EmbroidererCard: React.FC<EmbroidererCardProps> = ({ embroiderer, showDispatch = false, onDispatch }) => {
  const handleClick = () => {
    if (showDispatch && onDispatch) {
      onDispatch();
    } else {
      Taro.navigateTo({
        url: `/pages/embroiderer-detail/index?id=${embroiderer.id}`
      });
    }
  };

  const getLevelColor = (level: string) => {
    const map: Record<string, string> = {
      '初级': 'info',
      '中级': 'success',
      '高级': 'warning',
      '大师级': 'error'
    };
    return map[level] || 'info';
  };

  const getStatusType = (status: string) => {
    const map: Record<string, 'idle' | 'busy' | 'rest'> = {
      '空闲': 'idle',
      '忙碌': 'busy',
      '休息': 'rest'
    };
    return map[status] || 'rest';
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.header}>
        <Image className={styles.avatar} src={embroiderer.avatar} mode="aspectFill" />
        <View className={styles.basicInfo}>
          <View className={styles.nameRow}>
            <Text className={styles.name}>{embroiderer.name}</Text>
            <StatusTag type={getLevelColor(embroiderer.level) as any} text={embroiderer.level} size="sm" />
          </View>
          <View className={styles.metaRow}>
            <Text className={styles.experience}>{embroiderer.yearsOfExperience}年经验</Text>
            <StatusTag type={getStatusType(embroiderer.status)} text={embroiderer.status} size="sm" />
          </View>
        </View>
      </View>

      <View className={styles.specialty}>
        <Text className={styles.label}>擅长工艺:</Text>
        <View className={styles.tags}>
          {embroiderer.specialty.map((s, i) => (
            <Text key={i} className={styles.tag}>{s}</Text>
          ))}
        </View>
      </View>

      <View className={styles.stats}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{embroiderer.completedCount}</Text>
          <Text className={styles.statLabel}>完成作品</Text>
        </View>
        <View className={styles.statDivider} />
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{embroiderer.rating}</Text>
          <Text className={styles.statLabel}>评分</Text>
        </View>
        <View className={styles.statDivider} />
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{embroiderer.currentTaskCount}</Text>
          <Text className={styles.statLabel}>在做</Text>
        </View>
        <View className={styles.statDivider} />
        <View className={styles.statItem}>
          <Text className={styles.statValue}>¥{embroiderer.dailyWage}</Text>
          <Text className={styles.statLabel}>日薪</Text>
        </View>
      </View>

      {showDispatch && (
        <View className={styles.dispatchBtn}>
          <Text className={styles.dispatchText}>
            {embroiderer.status === '空闲' ? '立即派单' : '排期满'}
          </Text>
        </View>
      )}
    </View>
  );
};

export default EmbroidererCard;
