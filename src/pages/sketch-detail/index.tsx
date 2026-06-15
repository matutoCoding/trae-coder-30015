import React, { useMemo } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { sketchList } from '@/data/sketch';

const SketchDetailPage: React.FC = () => {
  const router = useRouter();
  const id = router.params.id;

  const sketch = useMemo(() => sketchList.find(s => s.id === id) || sketchList[0], [id]);

  return (
    <View className={styles.page}>
      <View className={styles.imageWrap}>
        <Image className={styles.mainImage} src={sketch.imageUrl} mode="aspectFill" />
        <View className={styles.categoryBadge}>
          <Text className={styles.categoryText}>{sketch.categoryName}</Text>
        </View>
      </View>

      <ScrollView scrollY>
        <View className={styles.content}>
          <View className={styles.card}>
            <View className={styles.nameRow}>
              <Text className={styles.name}>{sketch.name}</Text>
              <View className={styles.difficulty}>
                <Text className={styles.diffLabel}>难度</Text>
                <View className={styles.stars}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <Text key={i} className={i <= sketch.difficulty ? styles.star : styles.starOff}>★</Text>
                  ))}
                </View>
              </View>
            </View>

            <View className={styles.metaGrid}>
              <View className={styles.metaItem}>
                <Text className={styles.metaValue}>{sketch.estimatedDays}</Text>
                <Text className={styles.metaLabel}>预计工期(天)</Text>
              </View>
              <View className={styles.metaItem}>
                <Text className={styles.metaValue}>{sketch.size}</Text>
                <Text className={styles.metaLabel}>参考尺寸</Text>
              </View>
              <View className={styles.metaItem}>
                <Text className={styles.metaValue}>{sketch.silkColors.length}</Text>
                <Text className={styles.metaLabel}>丝线色数</Text>
              </View>
            </View>

            <Text className={styles.sectionTitle}>工艺类型</Text>
            <View className={styles.processRow}>
              {sketch.process.map((p, i) => (
                <Text key={i} className={styles.processTag}>{p}</Text>
              ))}
            </View>

            <Text className={styles.sectionTitle}>标签</Text>
            <View className={styles.tagRow}>
              {sketch.tags.map((t, i) => (
                <Text key={i} className={styles.tag}>{t}</Text>
              ))}
            </View>

            <Text className={styles.sectionTitle}>绣稿介绍</Text>
            <Text className={styles.desc}>{sketch.description}</Text>
          </View>

          <View className={styles.card}>
            <Text className={styles.sectionTitle}>推荐丝线色卡</Text>
            <View className={styles.colorGrid}>
              {sketch.silkColors.map((c, i) => (
                <View key={i} className={styles.colorItem}>
                  <View className={styles.colorBox} style={{ background: c }} />
                  <Text className={styles.colorName}>色号{i + 1}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className={styles.actionBar}>
        <View
          className={styles.actionBtn + ' ' + styles.secondary}
          onClick={() => Taro.showToast({ title: '已加入收藏', icon: 'success' })}
        >
          收藏绣稿
        </View>
        <View
          className={styles.actionBtn + ' ' + styles.primary}
          onClick={() => Taro.navigateTo({ url: `/pages/create-order/index?sketchId=${sketch.id}` })}
        >
          立即定制
        </View>
      </View>
    </View>
  );
};

export default SketchDetailPage;
