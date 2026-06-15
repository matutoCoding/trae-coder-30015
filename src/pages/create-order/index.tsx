import React, { useState, useMemo } from 'react';
import { View, Text, Input, Textarea, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { useWorkshopStore } from '@/store/workshop';
import { ProcessType, Customer } from '@/types';
import dayjs from 'dayjs';

const allProcesses: ProcessType[] = ['双面绣', '乱针绣', '平针绣', '打籽绣', '盘金绣'];

const frameOptions = [
  { id: 'none', name: '暂不配框', price: 0, desc: '绣片交付' },
  { id: 'huari', name: '花梨木框', price: 800, desc: '典雅大气，经典之选' },
  { id: 'jichi', name: '鸡翅木框', price: 500, desc: '纹理优美，性价比高' },
  { id: 'suanzhi', name: '酸枝木框', price: 1200, desc: '色泽温润，富贵典雅' },
  { id: 'heitan', name: '黑檀木框', price: 1500, desc: '沉稳庄重，高端之选' },
  { id: 'hongmu', name: '红木雕花框', price: 2500, desc: '工艺精美，收藏级配框' }
];

const giftOptions = [
  { id: 'none', name: '无需礼品包装', icon: '📦', desc: '标准交付', price: 0 },
  { id: 'basic', name: '精美礼盒', icon: '🎁', desc: '锦盒包装+收藏证书', price: 180 },
  { id: 'premium', name: '高端礼品套装', icon: '🎊', desc: '红木礼盒+丝绸衬里+收藏证书+贺卡', price: 580 },
  { id: 'vip', name: 'VIP至尊定制', icon: '👑', desc: '定制礼盒+鎏金证书+大师签名+精美摆件', price: 1280 }
];

const sizePresets = [
  { id: 'small', name: '小品 40×50' },
  { id: 'medium', name: '中幅 60×80' },
  { id: 'large', name: '大幅 80×120' },
  { id: 'xlarge', name: '巨幅 120×180' }
];

const CreateOrderPage: React.FC = () => {
  const router = useRouter();
  const sketchIdFromParam = router.params.sketchId;
  const { sketches, addOrder } = useWorkshopStore(state => ({
    sketches: state.sketches,
    addOrder: state.addOrder
  }));

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    sketchId: sketchIdFromParam || '',
    customSize: '',
    selectedProcesses: [] as ProcessType[],
    selectedSizePreset: '',
    deadline: dayjs().add(30, 'day').format('YYYY-MM-DD'),
    frameId: 'none',
    giftId: 'none',
    budget: '',
    requirement: ''
  });

  const selectedSketch = useMemo(
    () => sketches.find(s => s.id === form.sketchId),
    [form.sketchId, sketches]
  );

  const selectedFrame = useMemo(
    () => frameOptions.find(f => f.id === form.frameId) || frameOptions[0],
    [form.frameId]
  );

  const selectedGift = useMemo(
    () => giftOptions.find(g => g.id === form.giftId) || giftOptions[0],
    [form.giftId]
  );

  const estimatedBudget = useMemo(() => {
    let total = 0;
    if (selectedSketch) {
      total = Math.round(selectedSketch.estimatedDays * 400 * selectedSketch.difficulty * 1.5);
    } else {
      total = 8000;
    }
    total += selectedFrame.price;
    total += selectedGift.price;
    return total;
  }, [selectedSketch, selectedFrame, selectedGift]);

  const estimatedDays = useMemo(() => {
    let days = selectedSketch?.estimatedDays || 20;
    if (form.selectedProcesses.includes('双面绣')) days += 10;
    if (form.selectedProcesses.includes('乱针绣')) days += 5;
    if (form.selectedProcesses.length > 2) days += 5;
    if (form.frameId !== 'none') days += 3;
    return days;
  }, [selectedSketch, form.selectedProcesses, form.frameId]);

  const updateForm = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const toggleProcess = (p: ProcessType) => {
    setForm(prev => {
      const exists = prev.selectedProcesses.includes(p);
      return {
        ...prev,
        selectedProcesses: exists
          ? prev.selectedProcesses.filter(x => x !== p)
          : [...prev.selectedProcesses, p]
      };
    });
  };

  const validateStep1 = () => {
    if (!form.customerName.trim()) {
      Taro.showToast({ title: '请输入客户姓名', icon: 'none' });
      return false;
    }
    if (!form.customerPhone.trim()) {
      Taro.showToast({ title: '请输入联系电话', icon: 'none' });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!form.sketchId) {
      Taro.showToast({ title: '请选择绣稿底样', icon: 'none' });
      return false;
    }
    if (form.selectedProcesses.length === 0) {
      Taro.showToast({ title: '请至少选择一种工艺', icon: 'none' });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!form.requirement.trim()) {
      Taro.showToast({ title: '请填写定制要求', icon: 'none' });
      return;
    }
    Taro.showModal({
      title: '确认创建订单',
      content: `订单金额约 ¥${estimatedBudget.toLocaleString()}，预计工期 ${estimatedDays} 天，确认创建？`,
      confirmText: '确认创建',
      confirmColor: '#C41E3A',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '创建中...' });

          const customer: Customer = {
            id: `c_${Date.now()}`,
            name: form.customerName.trim(),
            phone: form.customerPhone.trim(),
            address: form.customerAddress?.trim() || undefined
          };

          const sizeText = form.customSize?.trim() ||
            (form.selectedSizePreset
              ? sizePresets.find(s => s.id === form.selectedSizePreset)?.name?.replace(/小品 |中幅 |大幅 |巨幅 /, '')
              : '') ||
            (selectedSketch?.size || '定制尺寸');

          const requirementWithExtra = `装裱：${selectedFrame.name}；礼品包装：${selectedGift.name}；${form.requirement.trim()}`;

          const orderId = addOrder({
            customer,
            sketchId: form.sketchId || undefined,
            sketchName: selectedSketch?.name || undefined,
            sketchImage: selectedSketch?.imageUrl || undefined,
            customRequirement: requirementWithExtra,
            size: sizeText,
            process: form.selectedProcesses,
            budget: Number(form.budget) || estimatedBudget,
            deadline: form.deadline
          });

          Taro.hideLoading();
          Taro.showToast({ title: '订单创建成功', icon: 'success' });
          setTimeout(() => {
            Taro.redirectTo({ url: `/pages/order-detail/index?id=${orderId}` });
          }, 1000);
        }
      }
    });
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
    else Taro.navigateBack();
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>创建定制订单</Text>
        <Text className={styles.subtitle}>为客户定制专属刺绣艺术品</Text>
      </View>

      <View className={styles.steps}>
        {[
          { num: 1, name: '客户信息' },
          { num: 2, name: '绣稿工艺' },
          { num: 3, name: '装裱礼品' },
          { num: 4, name: '确认提交' }
        ].map(s => (
          <View
            key={s.num}
            className={`${styles.stepItem} ${step === s.num ? styles.active : ''} ${step > s.num ? styles.done : ''}`}
          >
            <View className={styles.stepNum}>{step > s.num ? '✓' : s.num}</View>
            <Text className={styles.stepName}>{s.name}</Text>
          </View>
        ))}
      </View>

      <View className={styles.content}>
        {step >= 1 && (
          <View className={styles.card} style={{ display: step !== 1 ? 'none' : 'block' }}>
            <View className={styles.sectionTitle}>
              <View className={styles.stepBadge}>1</View>
              <Text>客户信息</Text>
            </View>

            <View className={styles.formGroup}>
              <View className={styles.label}>
                <Text className={styles.required}>*</Text>客户姓名
              </View>
              <View className={styles.inputWrap}>
                <Input
                  className={styles.input}
                  placeholder="请输入客户姓名"
                  value={form.customerName}
                  onInput={(e) => updateForm('customerName', e.detail.value)}
                />
              </View>
            </View>

            <View className={styles.formGroup}>
              <View className={styles.label}>
                <Text className={styles.required}>*</Text>联系电话
              </View>
              <View className={styles.inputWrap}>
                <Input
                  className={`${styles.input} ${styles.prefixInput}`}
                  type="number"
                  placeholder="请输入手机号码"
                  value={form.customerPhone}
                  onInput={(e) => updateForm('customerPhone', e.detail.value)}
                />
                <View className={styles.prefix}>📞</View>
              </View>
            </View>

            <View className={styles.formGroup}>
              <View className={styles.label}>
                <Text>收货地址</Text>
                <Text className={styles.hint}>选填</Text>
              </View>
              <View className={styles.inputWrap}>
                <Input
                  className={styles.input}
                  placeholder="请输入收货地址"
                  value={form.customerAddress}
                  onInput={(e) => updateForm('customerAddress', e.detail.value)}
                />
              </View>
            </View>
          </View>
        )}

        {step >= 2 && (
          <View className={styles.card} style={{ display: step !== 2 ? 'none' : 'block' }}>
            <View className={styles.sectionTitle}>
              <View className={styles.stepBadge}>2</View>
              <Text>选择绣稿底样</Text>
            </View>
            <View className={styles.sketchList}>
              {sketches.map(s => (
                <View
                  key={s.id}
                  className={`${styles.sketchItem} ${form.sketchId === s.id ? styles.active : ''}`}
                  onClick={() => updateForm('sketchId', s.id)}
                >
                  <Image className={styles.img} src={s.imageUrl} mode="aspectFill" />
                  <View className={styles.info}>
                    <Text className={styles.name}>{s.name}</Text>
                    <View className={styles.meta}>
                      <Text className={styles.cat}>{s.categoryName}</Text>
                      <Text className={styles.days}>{s.estimatedDays}天</Text>
                    </View>
                    <View className={styles.difficulty}>
                      {'★'.repeat(s.difficulty)}{'☆'.repeat(5 - s.difficulty)}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {step >= 2 && (
          <View className={styles.card} style={{ display: step !== 2 ? 'none' : 'block' }}>
            <View className={styles.sectionTitle}>
              <View className={styles.stepBadge}>2</View>
              <Text>工艺要求</Text>
            </View>

            <View className={styles.formGroup}>
              <View className={styles.label}>
                <Text className={styles.required}>*</Text>绣制工艺
                <Text className={styles.hint}>可选多种组合</Text>
              </View>
              <View className={styles.chipGroup}>
                {allProcesses.map(p => (
                  <View
                    key={p}
                    className={`${styles.chip} ${form.selectedProcesses.includes(p) ? styles.active : ''}`}
                    onClick={() => toggleProcess(p)}
                  >
                    {p}
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.formGroup}>
              <View className={styles.label}>
                <Text>参考尺寸</Text>
              </View>
              <View className={styles.chipGroup}>
                {sizePresets.map(s => (
                  <View
                    key={s.id}
                    className={`${styles.chip} ${form.selectedSizePreset === s.id ? styles.active : ''}`}
                    onClick={() => updateForm('selectedSizePreset', s.id)}
                  >
                    {s.name}
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.formGroup}>
              <View className={styles.label}>
                <Text>自定义尺寸（cm）</Text>
                <Text className={styles.hint}>选填</Text>
              </View>
              <View className={styles.inputWrap}>
                <Input
                  className={styles.input}
                  placeholder="例如：60 × 80"
                  value={form.customSize}
                  onInput={(e) => updateForm('customSize', e.detail.value)}
                />
              </View>
            </View>

            <View className={styles.row}>
              <View className={styles.col}>
                <View className={styles.formGroup}>
                  <View className={styles.label}>
                    <Text>交付日期</Text>
                  </View>
                  <View className={styles.inputWrap}>
                    <Input
                      className={styles.input}
                      type="text"
                      value={form.deadline}
                      onInput={(e) => updateForm('deadline', e.detail.value)}
                    />
                  </View>
                </View>
              </View>
              <View className={styles.col}>
                <View className={styles.formGroup}>
                  <View className={styles.label}>
                    <Text>客户预算（元）</Text>
                  </View>
                  <View className={styles.inputWrap}>
                    <Input
                      className={`${styles.input} ${styles.prefixInput}`}
                      type="digit"
                      placeholder="客户意向预算"
                      value={form.budget}
                      onInput={(e) => updateForm('budget', e.detail.value)}
                    />
                    <View className={styles.prefix}>¥</View>
                  </View>
                </View>
              </View>
            </View>

            {selectedSketch && (
              <View className={styles.previewCard}>
                <View className={styles.previewTitle}>📋 绣稿建议</View>
                <View className={styles.previewContent}>
                  绣稿「{selectedSketch.name}」推荐工艺：{selectedSketch.process.join('、')}，预计工期 {selectedSketch.estimatedDays} 天，参考尺寸 {selectedSketch.size}
                </View>
              </View>
            )}
          </View>
        )}

        {step >= 3 && (
          <View className={styles.card} style={{ display: step !== 3 ? 'none' : 'block' }}>
            <View className={styles.sectionTitle}>
              <View className={styles.stepBadge}>3</View>
              <Text>装裱配框</Text>
            </View>
            <View className={styles.frameList}>
              {frameOptions.map(f => (
                <View
                  key={f.id}
                  className={`${styles.frameItem} ${form.frameId === f.id ? styles.active : ''}`}
                  onClick={() => updateForm('frameId', f.id)}
                >
                  <Text className={styles.name}>{f.name}</Text>
                  <Text className={styles.price}>{f.price > 0 ? `+¥${f.price}` : '免费'}</Text>
                  <Text className={styles.desc}>{f.desc}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {step >= 3 && (
          <View className={styles.card} style={{ display: step !== 3 ? 'none' : 'block' }}>
            <View className={styles.sectionTitle}>
              <View className={styles.stepBadge}>3</View>
              <Text>礼品定制</Text>
            </View>
            <View className={styles.giftList}>
              {giftOptions.map(g => (
                <View
                  key={g.id}
                  className={`${styles.giftItem} ${form.giftId === g.id ? styles.active : ''}`}
                  onClick={() => updateForm('giftId', g.id)}
                >
                  <View className={styles.icon}>{g.icon}</View>
                  <View className={styles.info}>
                    <Text className={styles.name}>{g.name}</Text>
                    <Text className={styles.desc}>{g.desc}</Text>
                  </View>
                  <Text className={styles.price}>{g.price > 0 ? `+¥${g.price}` : '包含'}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {step >= 4 && (
          <View className={styles.card} style={{ display: step !== 4 ? 'none' : 'block' }}>
            <View className={styles.sectionTitle}>
              <View className={styles.stepBadge}>4</View>
              <Text>定制要求</Text>
            </View>
            <View className={styles.formGroup}>
              <View className={styles.label}>
                <Text className={styles.required}>*</Text>详细定制要求
              </View>
              <View className={styles.inputWrap}>
                <Textarea
                  className={styles.textarea}
                  placeholder="请详细描述客户的定制要求，包括色彩偏好、特殊寓意、装裱细节、其他个性化需求等..."
                  value={form.requirement}
                  onInput={(e) => updateForm('requirement', e.detail.value)}
                  maxlength={500}
                />
              </View>
            </View>
          </View>
        )}

        {step >= 4 && (
          <View className={styles.card} style={{ display: step !== 4 ? 'none' : 'block' }}>
            <View className={styles.sectionTitle}>
              <View className={styles.stepBadge}>4</View>
              <Text>订单概览</Text>
            </View>
            <View className={styles.summary}>
              <View className={styles.summaryRow}>
                <Text className={styles.sumLabel}>客户姓名</Text>
                <Text className={styles.sumValue}>{form.customerName || '-'}</Text>
              </View>
              <View className={styles.summaryRow}>
                <Text className={styles.sumLabel}>联系电话</Text>
                <Text className={styles.sumValue}>{form.customerPhone || '-'}</Text>
              </View>
              <View className={styles.summaryRow}>
                <Text className={styles.sumLabel}>绣稿底样</Text>
                <Text className={styles.sumValue}>{selectedSketch?.name || '未选择'}</Text>
              </View>
              <View className={styles.summaryRow}>
                <Text className={styles.sumLabel}>工艺类型</Text>
                <Text className={styles.sumValue}>{form.selectedProcesses.join('、') || '-'}</Text>
              </View>
              <View className={styles.summaryRow}>
                <Text className={styles.sumLabel}>装裱配框</Text>
                <Text className={styles.sumValue}>{selectedFrame.name}</Text>
              </View>
              <View className={styles.summaryRow}>
                <Text className={styles.sumLabel}>礼品包装</Text>
                <Text className={styles.sumValue}>{selectedGift.name}</Text>
              </View>
              <View className={styles.summaryRow}>
                <Text className={styles.sumLabel}>预计工期</Text>
                <Text className={styles.sumValue}>{estimatedDays} 天</Text>
              </View>
              <View className={`${styles.summaryRow} ${styles.totalRow}`}>
                <Text className={styles.sumLabel}>预估总价</Text>
                <Text className={styles.sumValue}>¥{estimatedBudget.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      <View className={styles.actionBar}>
        <View
          className={`${styles.actionBtn} ${styles.secondary}`}
          onClick={prevStep}
        >
          {step === 1 ? '取消' : '上一步'}
        </View>
        {step < 4 ? (
          <View
            className={`${styles.actionBtn} ${styles.primary}`}
            onClick={nextStep}
          >
            下一步
          </View>
        ) : (
          <View
            className={`${styles.actionBtn} ${styles.primary}`}
            onClick={handleSubmit}
          >
            确认创建订单
          </View>
        )}
      </View>
    </View>
  );
};

export default CreateOrderPage;
