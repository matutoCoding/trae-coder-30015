import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';
import WorkCard from '@/components/WorkCard';
import { workList } from '@/data/works';

const tabs = ['全部作品', '作品展销', '装裱配框', '礼品定制'];
const categories = ['全部', '苏绣', '湘绣', '粤绣', '蜀绣', '现代刺绣'];
const statusFilters = ['全部', '在售', '展示中', '已售', '馆藏'];

const frameOptions = [
  { name: '花梨木框', price: '¥680起' },
  { name: '黑檀木框', price: '¥1,280起' },
  { name: '鸡翅木框', price: '¥480起' },
  { name: '红木雕花', price: '¥2,580起' },
  { name: '酸枝木框', price: '¥880起' },
  { name: '榉木简约', price: '¥280起' }
];

const giftProducts = [
  {
    id: 'g001',
    name: '婚庆定制套件',
    image: 'https://picsum.photos/id/106/480/480',
    desc: '龙凤呈祥双面绣 + 高档礼盒 + 收藏证书，可加新人姓名与日期',
    tags: ['婚庆', '定制', '礼盒'],
    price: 38800
  },
  {
    id: 'g002',
    name: '商务礼品套装',
    image: 'https://picsum.photos/id/1080/480/480',
    desc: '小型刺绣屏风摆件 + 刺绣书签/手帕 + 品牌定制',
    tags: ['商务', '套装', '企业'],
    price: 5880
  },
  {
    id: 'g003',
    name: '生肖主题定制',
    image: 'https://picsum.photos/id/237/480/480',
    desc: '十二生系列刺绣，可定制客户属相与祝福语',
    tags: ['生肖', '生日', '纪念'],
    price: 3280
  }
];

const WorksPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [activeStatus, setActiveStatus] = useState('全部');

  const categoryMap: Record<string, string> = {
    '苏绣': 'suxiu',
    '湘绣': 'xiangxiu',
    '粤绣': 'yuexiu',
    '蜀绣': 'shuxiu',
    '现代刺绣': 'modern'
  };

  const filteredWorks = useMemo(() => {
    return workList.filter(w => {
      const categoryMatch = activeCategory === '全部' || w.category === categoryMap[activeCategory];
      const statusMatch = activeStatus === '全部' || w.status === activeStatus;
      const tabMatch = activeTab === '作品展销' ? ['在售', '展示中'].includes(w.status) : true;
      return categoryMatch && statusMatch && tabMatch;
    });
  }, [activeCategory, activeStatus, activeTab]);

  return (
    <View className={styles.page}>
      <View className={styles.tabs}>
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
          {(activeTab === '全部作品' || activeTab === '作品展销') && (
            <>
              <View>
                <Text style={{ fontSize: 24, color: '#A08060', marginBottom: 12, display: 'block' }}>刺绣类别</Text>
                <View className={styles.filterRow}>
                  {categories.map(c => (
                    <Text
                      key={c}
                      className={classnames(styles.filterChip, activeCategory === c && styles.active)}
                      onClick={() => setActiveCategory(c)}
                    >
                      {c}
                    </Text>
                  ))}
                </View>
              </View>
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 24, color: '#A08060', marginBottom: 12, display: 'block' }}>作品状态</Text>
                <View className={styles.filterRow}>
                  {statusFilters.map(s => (
                    <Text
                      key={s}
                      className={classnames(styles.filterChip, activeStatus === s && styles.active)}
                      onClick={() => setActiveStatus(s)}
                    >
                      {s}
                    </Text>
                  ))}
                </View>
              </View>

              {filteredWorks.length > 0 ? (
                <View className={styles.workGrid}>
                  {filteredWorks.map(work => (
                    <WorkCard key={work.id} work={work} />
                  ))}
                </View>
              ) : (
                <View style={{ padding: 80, textAlign: 'center' }}>
                  <Text style={{ fontSize: 28, color: '#A08060' }}>暂无符合条件的作品</Text>
                </View>
              )}
            </>
          )}

          {activeTab === '装裱配框' && (
            <View className={styles.frameSection}>
              <Text className={styles.frameTitle}>
                <Text className={styles.frameTitleIcon}>🖼️</Text>
                专业装裱配框服务
              </Text>
              <View className={styles.frameList}>
                {frameOptions.map((f, i) => (
                  <View key={i} className={styles.frameItem}>
                    <Text className={styles.frameName}>{f.name}</Text>
                    <Text className={styles.framePrice}>{f.price}</Text>
                  </View>
                ))}
              </View>
              <View style={{ marginTop: 24, padding: 16, background: '#fff', borderRadius: 12 }}>
                <Text style={{ fontSize: 26, color: '#6B4423', lineHeight: 1.6 }}>
                  【装裱说明】所有装裱采用传统工艺，使用进口防紫外线玻璃，配合防潮背板，确保刺绣作品长久保存。根据作品尺寸与材质，提供专业建议。
                </Text>
              </View>
            </View>
          )}

          {activeTab === '礼品定制' && (
            <View className={styles.giftSection}>
              <View className={styles.sectionHeader}>
                <Text className={styles.sectionTitle}>精选礼品方案</Text>
              </View>
              <View className={styles.giftCards}>
                {giftProducts.map(gift => (
                  <View key={gift.id} className={styles.giftCard}>
                    <Image className={styles.giftImage} src={gift.image} mode="aspectFill" />
                    <View className={styles.giftContent}>
                      <Text className={styles.giftName}>{gift.name}</Text>
                      <Text className={styles.giftDesc}>{gift.desc}</Text>
                      <View className={styles.giftTags}>
                        {gift.tags.map((t, i) => (
                          <Text key={i} className={styles.giftTag}>{t}</Text>
                        ))}
                      </View>
                      <Text className={styles.giftPrice}>¥{gift.price.toLocaleString()}</Text>
                    </View>
                  </View>
                ))}
              </View>
              <View style={{ marginTop: 32, padding: 24, background: 'linear-gradient(135deg, rgba(196,30,58,0.05), rgba(212,165,116,0.1))', borderRadius: 16 }}>
                <Text style={{ fontSize: 28, fontWeight: 600, color: '#8B4513', marginBottom: 12, display: 'block' }}>🎁 专属定制服务</Text>
                <Text style={{ fontSize: 26, color: '#6B4423', lineHeight: 1.8 }}>
                  · 企业礼品定制：LOGO刺绣、批量生产{'\n'}
                  · 个人纪念定制：肖像、照片转刺绣{'\n'}
                  · 婚庆礼品定制：龙凤、鸳鸯等吉祥图案{'\n'}
                  · 节庆礼品定制：春节、中秋、端午主题
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default WorksPage;
