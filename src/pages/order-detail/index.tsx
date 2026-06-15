import React, { useMemo } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import { useWorkshopStore } from '@/store/workshop';
import { ProgressStage, ProcessType } from '@/types';

const processKnowledge: Record<ProcessType, { desc: string; steps: string[]; level: string }> = {
  '双面绣': {
    desc: '双面绣是苏绣中最精湛的技艺之一，正反两面绣出同样精美的图案，两面均光洁完美，互不影响。其针法严谨，色彩和谐，被誉为"针尖上的奇迹"。',
    level: '大师工艺',
    steps: [
      '选材：选用上等真丝底料和桑蚕丝线',
      '上绷：双层底料同时绷紧，间距精确',
      '定位：两面图案同时透光定位',
      '劈丝：将一根丝线劈成1/64细度',
      '绣制：两针交替运针，藏针于夹层',
      '收尾：两面线头分别处理无痕'
    ]
  },
  '乱针绣': {
    desc: '乱针绣由杨守玉创立，打破传统刺绣"排比其针"的法则，以长短参差的线条交叉重叠，利用丝线的光泽和色彩层次表现光影，立体感极强。',
    level: '高级工艺',
    steps: [
      '素描稿：以素描为基础绘制造型',
      '铺色：大色块铺底，确定基调',
      '造型：交叉线条塑造体积感',
      '层次：多层叠加创造光影变化',
      '细节：细针密线刻画关键部位',
      '统一：整体调整色调和笔触'
    ]
  },
  '平针绣': {
    desc: '平针绣是最基础也是最常用的针法，线条排列均匀整齐，丝路清晰，常用于表现平整光滑的色块和细腻的渐变过渡，是四大名绣的基础技法。',
    level: '基础工艺',
    steps: [
      '描稿：将图案精准描绘到底料上',
      '配色：根据图案选择丝线色系',
      '铺针：按纹样方向整齐排列针脚',
      '套针：深浅色过渡衔接自然',
      '压针：边缘处压针收束整齐',
      '修光：补针使整体光滑平整'
    ]
  },
  '打籽绣': {
    desc: '打籽绣又称打子绣，以线条绕成粒状小圈后钉缝，形成一粒粒凸起的"籽"，质感强烈，常用于表现花蕊、果实等点状装饰，古朴典雅。',
    level: '特色工艺',
    steps: [
      '出针：从纹样背面出针',
      '绕线：左手将线绕针2-3圈',
      '入针：在原出针附近入针',
      '收紧：轻轻拉线形成籽状',
      '排列：籽与籽之间紧密排列',
      '定型：整体熨烫定型'
    ]
  },
  '盘金绣': {
    desc: '盘金绣以金线或银线盘绕成纹样后钉缝固定，金线光泽华丽，常用于龙凤、吉祥图案，粤绣和苏绣中常用此技法，富贵堂皇、金碧辉煌。',
    level: '特色工艺',
    steps: [
      '备料：准备真金线和同色钉线',
      '起针：从纹样边缘起针',
      '盘线：金线按纹样轮廓盘曲',
      '钉线：每3mm钉一针固定金线',
      '转角：尖角处细密钉线加固',
      '收头：线头藏入面料背面'
    ]
  }
};

const stageOrder: ProgressStage[] = ['准备', '上绷', '绣制', '收尾', '质检', '装裱'];

const OrderDetailPage: React.FC = () => {
  const router = useRouter();
  const id = router.params.id;
  const { orders, embroiderers, advanceStage, addStageLog } = useWorkshopStore();

  useDidShow(() => {
  });

  const order = useMemo(() => orders.find(o => o.id === id) || orders[0], [id, orders]);

  const embroidererDetails = useMemo(() => {
    if (!order.embroiderers) return [];
    return order.embroiderers.map(emb => ({
      ...emb,
      ...embroiderers.find(e => e.id === emb.id)
    }));
  }, [order.embroiderers, embroiderers]);

  const getStageStatus = (stage: ProgressStage) => {
    const currentIdx = stageOrder.indexOf(order.currentStage);
    const idx = stageOrder.indexOf(stage);
    if (idx < currentIdx) return 'done';
    if (idx === currentIdx) return 'active';
    return '';
  };

  const getNextStages = (): ProgressStage[] => {
    const currentIdx = stageOrder.indexOf(order.currentStage);
    return stageOrder.slice(currentIdx + 1);
  };

  const handleUpdateProgress = () => {
    const nextStages = getNextStages();
    if (nextStages.length === 0) {
      Taro.showToast({ title: '已完成全部阶段', icon: 'none' });
      return;
    }

    Taro.showActionSheet({
      itemList: nextStages.map(s => `推进到「${s}」阶段`),
      success: (res) => {
        const targetStage = nextStages[res.tapIndex];
        Taro.showModal({
          title: `推进到${targetStage}`,
          editable: true,
          placeholderText: '请填写阶段说明（选填）',
          confirmText: '确认推进',
          confirmColor: '#C41E3A',
          success: (modalRes) => {
            if (modalRes.confirm) {
              const note = modalRes.content?.trim() || `${targetStage}阶段工作进行中`;
              const success = advanceStage(order.id, targetStage, note);
              if (success) {
                Taro.showToast({ title: '进度已更新', icon: 'success' });
              }
            }
          }
        });
      }
    });
  };

  const handleAddLog = () => {
    Taro.showModal({
      title: '添加阶段日志',
      editable: true,
      placeholderText: '记录当前阶段的工作进展...',
      confirmText: '添加',
      confirmColor: '#C41E3A',
      success: (res) => {
        if (res.confirm && res.content?.trim()) {
          addStageLog(order.id, order.currentStage, res.content.trim());
          Taro.showToast({ title: '日志已添加', icon: 'success' });
        }
      }
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.hero}>
        <View className={styles.badgeRow}>
          <Text className={styles.statusBadge}>{order.status}</Text>
          <Text className={styles.orderNo}>订单号：{order.orderNo}</Text>
        </View>
        <Text className={styles.sketchName}>{order.sketchName || '定制订单'}</Text>
        <View className={styles.metaRow}>
          <View className={styles.metaItem}>
            <View className={styles.dot}></View>
            <Text>{order.size}</Text>
          </View>
          <View className={styles.metaItem}>
            <View className={styles.dot}></View>
            <Text>截止 {order.deadline}</Text>
          </View>
          <View className={styles.metaItem}>
            <View className={styles.dot}></View>
            <Text>创建于 {order.createTime}</Text>
          </View>
        </View>
      </View>

      <ScrollView scrollY>
        <View className={styles.content}>
          <View className={styles.card}>
            <View className={styles.sectionTitle}>
              <View className={styles.icon}></View>
              <Text>绣制进度</Text>
            </View>
            <View className={styles.progressWrap}>
              <View className={styles.progressBar}>
                <View className={styles.progressFill} style={{ width: `${order.progress}%` }}></View>
              </View>
              <View className={styles.progressInfo}>
                <Text className={styles.progressText}>当前阶段：{order.currentStage}</Text>
                <Text className={styles.progressPercent}>{order.progress}%</Text>
              </View>
            </View>

            <View className={styles.stageTimeline}>
              {stageOrder.map((stage, i) => {
                const status = getStageStatus(stage);
                const log = order.stageLogs.find(l => l.stage === stage);
                return (
                  <View key={i} className={styles.stageItem}>
                    <View className={`${styles.stageDot} ${status !== '' ? styles[status] : ''}`}>
                      <View className={styles.innerDot}></View>
                    </View>
                    <Text className={styles.stageName}>{stage}</Text>
                    {log && (
                      <>
                        <Text className={styles.stageTime}>{log.time}</Text>
                        <Text className={styles.stageNote}>{log.note}</Text>
                      </>
                    )}
                    {!log && <Text className={styles.stageTime}>待进行</Text>}
                  </View>
                );
              })}
            </View>
          </View>

          <View className={styles.card}>
            <View className={styles.sectionTitle}>
              <View className={styles.icon}></View>
              <Text>工艺说明</Text>
            </View>
            <View className={styles.processRow}>
              {order.process.map((p, i) => (
                <Text key={i} className={styles.processTag}>{p}</Text>
              ))}
            </View>
            {order.process.map((p, i) => (
              <View key={i} className={styles.processCard}>
                <View className={styles.processTitle}>
                  <Text>{p}</Text>
                  <Text className={styles.processBadge}>{processKnowledge[p].level}</Text>
                </View>
                <Text className={styles.processDesc}>{processKnowledge[p].desc}</Text>
                <View className={styles.processSteps}>
                  {processKnowledge[p].steps.map((step, j) => (
                    <View key={j} className={styles.stepItem}>
                      <Text className={styles.stepNum}>{j + 1}</Text>
                      <Text className={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>

          <View className={styles.card}>
            <View className={styles.sectionTitle}>
              <View className={styles.icon}></View>
              <Text>绣娘信息</Text>
            </View>
            {embroidererDetails.length > 0 ? (
              embroidererDetails.map((emb, i) => (
                <View
                  key={i}
                  className={styles.embroidererRow}
                  onClick={() => Taro.navigateTo({ url: `/pages/embroiderer-detail/index?id=${emb.id}` })}
                >
                  <Image className={styles.avatar} src={emb.avatar} mode="aspectFill" />
                  <View className={styles.embInfo}>
                    <Text className={styles.embName}>{emb.name}</Text>
                    <Text className={styles.embMeta}>
                      {emb.yearsOfExperience}年经验 · 完成{emb.completedCount}件作品 · 评分{emb.rating}
                    </Text>
                  </View>
                  <Text className={styles.levelBadge}>{emb.level}</Text>
                </View>
              ))
            ) : (
              <View className={styles.emptyEmb}>
                <Text className={styles.emptyText}>尚未指派绣娘，请前往派单</Text>
                <View
                  className={styles.dispatchBtn}
                  onClick={() => Taro.switchTab({ url: '/pages/dispatch/index' })}
                >
                  立即派单
                </View>
              </View>
            )}
          </View>

          {order.sketchImage && (
            <View className={styles.card}>
              <View className={styles.sectionTitle}>
                <View className={styles.icon}></View>
                <Text>绣稿底样</Text>
              </View>
              <View
                className={styles.sketchPreview}
                onClick={() => Taro.navigateTo({ url: `/pages/sketch-detail/index?id=${order.sketchId}` })}
              >
                <Image className={styles.sketchImg} src={order.sketchImage} mode="aspectFill" />
                <View className={styles.sketchInfo}>
                  <Text className={styles.sketchTitle}>{order.sketchName}</Text>
                  <Text className={styles.sketchDesc}>点击查看绣稿详情，了解工艺要求与丝线色卡</Text>
                </View>
              </View>
            </View>
          )}

          <View className={styles.card}>
            <View className={styles.sectionTitle}>
              <View className={styles.icon}></View>
              <Text>客户信息</Text>
            </View>
            <View className={styles.customerCard}>
              <View className={styles.customerAvatar}>
                <Text className={styles.initial}>{order.customer.name.charAt(0)}</Text>
              </View>
              <View className={styles.customerInfo}>
                <Text className={styles.customerName}>{order.customer.name}</Text>
                <Text className={styles.customerPhone}>{order.customer.phone}</Text>
                {order.customer.address && (
                  <Text className={styles.customerAddr}>{order.customer.address}</Text>
                )}
              </View>
            </View>
          </View>

          <View className={styles.card}>
            <View className={styles.sectionTitle}>
              <View className={styles.icon}></View>
              <Text>定制要求</Text>
            </View>
            <View className={styles.requireBox}>
              <Text className={styles.requireText}>{order.customRequirement}</Text>
            </View>
          </View>

          <View className={styles.card}>
            <View className={styles.sectionTitle}>
              <View className={styles.icon}></View>
              <Text>订单详情</Text>
            </View>
            <View className={styles.infoGrid}>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>订单尺寸</Text>
                <Text className={styles.infoValue}>{order.size}</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>预算金额</Text>
                <Text className={styles.valueRed}>¥{order.budget.toLocaleString()}</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>交付日期</Text>
                <Text className={styles.infoValue}>{order.deadline}</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>订单状态</Text>
                <Text className={styles.valueGold}>{order.status}</Text>
              </View>
              <View className={`${styles.infoItem} ${styles.fullWidth}`}>
                <Text className={styles.infoLabel}>工艺类型</Text>
                <Text className={styles.infoValue}>{order.process.join(' · ')}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className={styles.actionBar}>
        <View
          className={`${styles.actionBtn} ${styles.secondary}`}
          onClick={() => Taro.showToast({ title: '联系客户功能开发中', icon: 'none' })}
        >
          联系客户
        </View>
        {order.status === '待派单' ? (
          <View
            className={`${styles.actionBtn} ${styles.primary}`}
            onClick={() => Taro.switchTab({ url: '/pages/dispatch/index' })}
          >
            前往派单
          </View>
        ) : order.status === '绣制中' ? (
          <View
            className={`${styles.actionBtn} ${styles.primary}`}
            onClick={handleUpdateProgress}
          >
            更新进度
          </View>
        ) : order.status === '待装裱' ? (
          <View
            className={`${styles.actionBtn} ${styles.primary}`}
            onClick={() => {
              advanceStage(order.id, '装裱', '装裱师开始装裱工作');
              Taro.showToast({ title: '已通知装裱师', icon: 'success' });
            }}
          >
            通知装裱
          </View>
        ) : (
          <View
            className={`${styles.actionBtn} ${styles.primary}`}
            onClick={handleAddLog}
          >
            添加日志
          </View>
        )}
      </View>
    </View>
  );
};

export default OrderDetailPage;
