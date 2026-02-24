import { KnowledgeCard, Question } from '../types';

export const QUESTIONS: Question[] = [
  // Step 1: Economic Base
  {
    id: 'age_stage',
    text: '你的年龄处于哪个阶段？',
    type: 'single',
    category: 'economic_base',
    explanation: 'Modigliani的生命周期理论指出，人在一生中的消费和储蓄行为随年龄变化。',
    options: [
      { value: '18-22', label: '18-22岁（求学期）' },
      { value: '23-28', label: '23-28岁（初入职场）' },
      { value: '29-35', label: '29-35岁（职业发展/家庭组建期）' },
      { value: '36-50', label: '36-50岁（事业成熟期）' },
      { value: '51-60', label: '51-60岁（退休准备期）' },
      { value: '60+', label: '60岁以上（退休期）' },
    ]
  },
  {
    id: 'income_stability',
    text: '你的收入稳定性如何？',
    type: 'single',
    category: 'economic_base',
    explanation: '持久收入应作为消费的主要依据，暂时收入建议大部分用于储蓄。',
    options: [
      { value: 'very_stable', label: '非常稳定（铁饭碗/体制内）' },
      { value: 'stable', label: '比较稳定（大企业）' },
      { value: 'normal', label: '一般稳定（中小企业）' },
      { value: 'unstable', label: '不太稳定（创业/新兴行业）' },
      { value: 'volatile', label: '经常波动（自由职业/项目制）' },
    ]
  },
  {
    id: 'liquid_assets',
    text: '目前的流动资产（现金、存款、余额宝等）大约有多少？',
    type: 'number',
    category: 'economic_base',
  },
  {
    id: 'debt_status',
    text: '目前的负债情况如何？',
    type: 'single',
    category: 'economic_base',
    options: [
      { value: 'none', label: '无负债' },
      { value: 'manageable', label: '有少量负债（如信用卡，可按时还）' },
      { value: 'heavy', label: '负债较重（房贷/车贷占收入30%以上）' },
      { value: 'crisis', label: '资不抵债' },
    ]
  },
  // ... More Step 1 questions omitted for brevity in prototype, focusing on logic
  
  // Step 2: Financial Literacy
  {
    id: 'knowledge_compound',
    text: '你理解“复利”的概念吗？',
    type: 'single',
    category: 'financial_literacy',
    options: [
      { value: 'full', label: '完全理解，能计算' },
      { value: 'basic', label: '听说过，知道大概意思' },
      { value: 'none', label: '没听说过' },
    ]
  },
  {
    id: 'risk_reaction',
    text: '如果你的投资暂时亏损了20%，你会怎么做？',
    type: 'single',
    category: 'financial_literacy',
    options: [
      { value: 'sell', label: '立刻止损卖出' },
      { value: 'hold', label: '观望不动' },
      { value: 'buy', label: '加仓摊低成本' },
    ]
  },
  {
    id: 'consumption_style',
    text: '看到喜欢的商品打折，但目前不需要，你会买吗？',
    type: 'single',
    category: 'psychology',
    options: [
      { value: 'buy_now', label: '买！此时不买更待何时' },
      { value: 'think', label: '先放购物车冷静一下' },
      { value: 'ignore', label: '不需要就不买' },
    ]
  },
];

export const DAILY_KNOWLEDGE: KnowledgeCard[] = [
  {
    id: 'k1',
    title: '边际效用递减',
    concept: '边际效用',
    content: '第一杯奶茶很香，第二杯就没那么好喝了。消费带来的满足感会随着数量增加而降低。',
    action: '下次买第二件半价时，问问自己真的需要第二件吗？不如把钱存进“增值金”。',
    tags: ['消费', '心理学']
  },
  {
    id: 'k2',
    title: '拿铁因子',
    concept: '积少成多',
    content: '每天一杯咖啡看似不多，一年下来可能就是一部新手机的钱。',
    action: '尝试自己冲泡咖啡，每周省下的钱可以定投一只指数基金。',
    tags: ['储蓄', '习惯']
  },
  {
    id: 'k3',
    title: '机会成本',
    concept: '选择的代价',
    content: '你花时间刷短视频，付出的代价是这段时间本可以用来学习或休息的价值。',
    action: '在做决定前，想一想你放弃了什么？',
    tags: ['时间管理', '决策']
  }
];
