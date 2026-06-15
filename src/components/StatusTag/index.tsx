import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';

interface StatusTagProps {
  type: 'pending' | 'processing' | 'framing' | 'done' | 'cancelled' | 'success' | 'warning' | 'error' | 'info' | 'idle' | 'busy' | 'rest';
  text: string;
  size?: 'sm' | 'md';
}

const StatusTag: React.FC<StatusTagProps> = ({ type, text, size = 'sm' }) => {
  return (
    <View className={classnames(styles.statusTag, styles[type], styles[size])}>
      <Text className={styles.tagText}>{text}</Text>
    </View>
  );
};

export default StatusTag;
