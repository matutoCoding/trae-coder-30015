import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  accent?: 'red' | 'gold' | 'brown' | 'green' | 'blue';
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, unit, accent = 'red', description }) => {
  return (
    <View className={styles.statCard}>
      <View className={styles.header}>
        <Text className={styles.title}>{title}</Text>
      </View>
      <View className={styles.valueRow}>
        <Text className={styles[`value${accent.charAt(0).toUpperCase() + accent.slice(1)}`]}>{value}</Text>
        {unit && <Text className={styles.unit}>{unit}</Text>}
      </View>
      {description && <Text className={styles.description}>{description}</Text>}
    </View>
  );
};

export default StatCard;
