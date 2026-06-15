import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import styles from './index.module.scss';
import { Sketch } from '@/types';
import Taro from '@tarojs/taro';

interface SketchCardProps {
  sketch: Sketch;
}

const SketchCard: React.FC<SketchCardProps> = ({ sketch }) => {
  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/sketch-detail/index?id=${sketch.id}`
    });
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.imageWrap}>
        <Image className={styles.image} src={sketch.imageUrl} mode="aspectFill" />
        <View className={styles.categoryTag}>
          <Text className={styles.categoryText}>{sketch.categoryName}</Text>
        </View>
      </View>
      <View className={styles.content}>
        <Text className={styles.name}>{sketch.name}</Text>
        <View className={styles.processRow}>
          {sketch.process.map((p, i) => (
            <View key={i} className={styles.processTag}>
              <Text className={styles.processText}>{p}</Text>
            </View>
          ))}
        </View>
        <View className={styles.bottomRow}>
          <View className={styles.difficulty}>
            <Text className={styles.difficultyText}>难度: </Text>
            <View className={styles.stars}>
              {[1, 2, 3, 4, 5].map(i => (
                <Text key={i} className={i <= sketch.difficulty ? styles.star : styles.starOff}>★</Text>
              ))}
            </View>
          </View>
          <Text className={styles.days}>{sketch.estimatedDays}天</Text>
        </View>
      </View>
    </View>
  );
};

export default SketchCard;
