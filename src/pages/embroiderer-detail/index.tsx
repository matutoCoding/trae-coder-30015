import React, { useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { embroidererList } from '@/data/embroiderer';
import { workList } from '@/data/works';
import { orderList } from '@/data/order';
import { EmbroidererLevel, EmbroideryType, ProcessType } from '@/types';

const categoryNameMap: Record<EmbroideryType, string> = {
  suxiu: '苏绣',
  xiangxiu: '湘绣',
  yuexiu: '粤绣',
  shuxiu: '蜀绣',
  modern: '现代绣'
};

const levelTitleMap: Record<EmbroidererLevel, string> = {
  '初级': '初级绣娘',
  '中级': '中级绣娘',
  '高级': '高级绣娘',
  '大师级': '工艺美术大师'
};

const levelCrownMap: Record<EmbroidererLevel, string> = {
  '初级': '✦',
  '中级': '✦✦',
  '高级': '✦✦✦',
  '大师级': '♛'
};

const skillLevelMap: Record<ProcessType, number> = {
  '双面绣': 95,
  '乱针绣': 88,
  '平针绣': 92,
  '打籽绣': 85,
  '盘金绣': 82
};

const EmbroidererDetailPage: React.FC = () => {
  const router = useRouter();
  const id = router.params.id;

  const embroiderer = useMemo(
    () => embroidererList.find(e => e.id === id) || embroidererList[0],
    [id]
  );

  const representativeWorks = useMemo(
    () => workList.filter(w => w.embroiderer === embroiderer.name).slice(0, 4),
    [embroiderer.name]
  );

  const currentOrders = useMemo(
    () => orderList.filter(o =>
      o.embroiderers?.some(e => e.id === embroiderer.id) &&
      o.status !== '已完成' && o.status !== '已取消'
    ),
    [embroiderer.id]
  );

  const handleCall = () => {
    Taro.showToast({ title: `正在拨打 ${embroiderer.phone}`, icon: 'none' });
  };

  const handleDispatch = () => {
    if (embroiderer.status !== '空闲') {
      Taro.showToast({ title: '该绣娘当前无档期', icon: 'none' });
      return;
    }
    Taro.switchTab({ url: '/pages/dispatch/index' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.hero}>
        <View className={styles.heroContent}>
          <View className={styles.avatarWrap}>
            <Image className={styles.avatar} src={embroiderer.avatar} mode="aspectFill" />
            <View className={styles.levelCrown}>{levelCrownMap[embroiderer.level]}</View>
          </View>
          <View className={styles.basicInfo}>
            <View className={styles.name}>
              <Text>{embroiderer.name}</Text>
              <Text className={styles.levelBadge}>{embroiderer.level}</Text>
            </View>
            <Text className={styles.title}>{levelTitleMap[embroiderer.level]}</Text>
            <View className={styles.metaRow}>
              <View className={styles.metaItem}>📅 从业{embroiderer.yearsOfExperience}年</View>
              <View className={styles.metaItem}>📍 档期：{embroiderer.status}</View>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.statCard}>
        <View className={styles.statItem}>
          <Text className={styles.statNum}>{embroiderer.completedCount}</Text>
          <Text className={styles.statLabel}>完成作品</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={`${styles.statNum} ${styles.statNumRed}`}>{embroiderer.currentTaskCount}</Text>
          <Text className={styles.statLabel}>在制订单</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={`${styles.statNum} ${styles.statNumGold}`}>{embroiderer.rating}</Text>
          <Text className={styles.statLabel}>客户评分</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={`${styles.statNum} ${styles.statNumGreen}`}>¥{embroiderer.dailyWage}</Text>
          <Text className={styles.statLabel}>日薪</Text>
        </View>
      </View>

      <ScrollView scrollY>
        <View className={styles.content}>
          <View className={styles.card}>
            <View className={styles.sectionTitle}>
              <View className={styles.left}>
                <View className={styles.icon}></View>
                <Text>个人简介</Text>
              </View>
            </View>
            <Text className={styles.introText}>{embroiderer.introduction}</Text>
          </View>

          <View className={styles.card}>
            <View className={styles.sectionTitle}>
              <View className={styles.left}>
                <View className={styles.icon}></View>
                <Text>技艺专长</Text>
              </View>
            </View>
            <View className={styles.specialtyWrap}>
              <View className={styles.wrapTitle}>擅长针法</View>
              <View className={styles.tagRow}>
                {embroiderer.specialty.map((p, i) => (
                  <Text key={i} className={styles.skillTag}>{p}</Text>
                ))}
              </View>
            </View>
            <View className={styles.specialtyWrap}>
              <View className={styles.wrapTitle}>擅长品类</View>
              <View className={styles.tagRow}>
                {embroiderer.goodCategories.map((c, i) => (
                  <Text key={i} className={styles.goodTag}>{categoryNameMap[c]}</Text>
                ))}
              </View>
            </View>
            <View className={styles.skillBarList}>
              {embroiderer.specialty.map((p, i) => (
                <View key={i} className={styles.skillBar}>
                  <View className={styles.skillHead}>
                    <Text className={styles.skillName}>{p}</Text>
                    <Text className={styles.skillPercent}>{skillLevelMap[p]}%</Text>
                  </View>
                  <View className={styles.barTrack}>
                    <View
                      className={styles.barFill}
                      style={{ width: `${skillLevelMap[p]}%` }}
                    ></View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.card}>
            <View className={styles.sectionTitle}>
              <View className={styles.left}>
                <View className={styles.icon}></View>
                <Text>代表作品</Text>
              </View>
              <Text className={styles.more}>共{representativeWorks.length}件</Text>
            </View>
            {representativeWorks.length > 0 ? (
              <View className={styles.workGrid}>
                {representativeWorks.map(w => (
                  <View
                    key={w.id}
                    className={styles.workCard}
                    onClick={() => Taro.switchTab({ url: '/pages/works/index' })}
                  >
                    <Image className={styles.workImg} src={w.imageUrl} mode="aspectFill" />
                    <View className={styles.workInfo}>
                      <Text className={styles.workName}>{w.name}</Text>
                      <View className={styles.workMeta}>
                        <Text className={styles.workCat}>{w.categoryName}</Text>
                        <Text className={styles.workPrice}>¥{w.price.toLocaleString()}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={{ padding: '32rpx', textAlign: 'center' }}>
                <Text style={{ fontSize: '24rpx', color: '#999' }}>暂无代表作品收录</Text>
              </View>
            )}
          </View>

          <View className={styles.card}>
            <View className={styles.sectionTitle}>
              <View className={styles.left}>
                <View className={styles.icon}></View>
                <Text>当前任务</Text>
              </View>
            </View>
            {currentOrders.length > 0 ? (
              <View className={styles.scheduleWrap}>
                {currentOrders.map(o => (
                  <View
                    key={o.id}
                    className={styles.scheduleRow}
                    onClick={() => Taro.navigateTo({ url: `/pages/order-detail/index?id=${o.id}` })}
                  >
                    <View className={styles.scheduleInfo}>
                      <Text className={styles.scheduleTitle}>{o.sketchName || '定制订单'}</Text>
                      <Text className={styles.scheduleSub}>
                        {o.orderNo} · 截止{o.deadline} · 进度{o.progress}%
                      </Text>
                    </View>
                    <Text className={`${styles.scheduleStatus} ${styles.busy}`}>
                      {o.currentStage}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={{ padding: '32rpx', textAlign: 'center' }}>
                <Text style={{ fontSize: '24rpx', color: '#999' }}>当前无在制任务</Text>
              </View>
            )}
          </View>

          <View className={styles.card}>
            <View className={styles.sectionTitle}>
              <View className={styles.left}>
                <View className={styles.icon}></View>
                <Text>档案信息</Text>
              </View>
            </View>
            <View className={styles.infoGrid}>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>绣娘编号</Text>
                <Text className={styles.infoValue}>{embroiderer.id.toUpperCase()}</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>技艺等级</Text>
                <Text className={styles.valueHighlight}>{embroiderer.level}</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>从业年限</Text>
                <Text className={styles.infoValue}>{embroiderer.yearsOfExperience}年</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>日均薪资</Text>
                <Text className={styles.valueHighlight}>¥{embroiderer.dailyWage}</Text>
              </View>
              <View className={`${styles.infoItem} ${styles.fullWidth}`}>
                <Text className={styles.infoLabel}>累计完成</Text>
                <Text className={styles.infoValue}>
                  {embroiderer.completedCount}件作品 · 平均评分{embroiderer.rating}
                </Text>
              </View>
            </View>
          </View>

          <View className={styles.card}>
            <View className={styles.sectionTitle}>
              <View className={styles.left}>
                <View className={styles.icon}></View>
                <Text>联系方式</Text>
              </View>
            </View>
            <View className={styles.contactRow}>
              <View className={styles.contactIcon}>📞</View>
              <View className={styles.contactInfo}>
                <Text className={styles.contactLabel}>联系电话</Text>
                <Text className={styles.contactValue}>{embroiderer.phone}</Text>
              </View>
              <View className={styles.contactBtn} onClick={handleCall}>拨打</View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className={styles.actionBar}>
        <View
          className={`${styles.actionBtn} ${styles.secondary}`}
          onClick={handleCall}
        >
          联系绣娘
        </View>
        <View
          className={`${styles.actionBtn} ${embroiderer.status !== '空闲' ? styles.disabled : ''} ${styles.primary}`}
          onClick={handleDispatch}
        >
          {embroiderer.status === '空闲' ? '指派订单' : `档期：${embroiderer.status}`}
        </View>
      </View>
    </View>
  );
};

export default EmbroidererDetailPage;
