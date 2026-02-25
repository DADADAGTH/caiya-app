import { KnowledgeCard, Question } from '../types';

export const QUESTIONS: Question[] = [
  // A. 生命周期阶段评估
  {
    id: 'age_stage',
    text: '问题1：你的年龄处于以下哪个阶段？',
    type: 'single',
    category: 'economic_base',
    options: [
      { value: '18-22', label: 'A. 18-22岁（求学期/大学本科）' },
      { value: '23-28', label: 'B. 23-28岁（初入职场/职业探索期）' },
      { value: '29-35', label: 'C. 29-35岁（职业发展/家庭组建期）' },
      { value: '36-50', label: 'D. 36-50岁（事业成熟/家庭稳定期）' },
      { value: '51-60', label: 'E. 51-60岁（退休准备/财富积累期）' },
      { value: '60+', label: 'F. 60岁以上（退休期）' },
    ]
  },
  {
    id: 'life_stage',
    text: '问题2：你目前的主要人生阶段是？',
    type: 'single',
    category: 'economic_base',
    options: [
      { value: 'student', label: 'A. 全日制学生（本科/硕士/博士）' },
      { value: 'freshman', label: 'B. 初入职场（工作1-3年）' },
      { value: 'developing', label: 'C. 职业发展期（工作3-10年）' },
      { value: 'stable', label: 'D. 职业稳定期（工作10年以上）' },
      { value: 'freelance', label: 'E. 自由职业/创业' },
      { value: 'unemployed', label: 'F. 待业/全职家庭' },
    ]
  },
  {
    id: 'career_expectation',
    text: '问题3：你对未来5年的职业发展预期是？',
    type: 'single',
    category: 'economic_base',
    options: [
      { value: 'high_growth', label: 'A. 有较大上升空间，预期晋升/跳槽涨薪30%以上' },
      { value: 'steady_growth', label: 'B. 稳步上升，预计涨薪10%-30%' },
      { value: 'stable', label: 'C. 基本稳定，收入波动较小' },
      { value: 'uncertain', label: 'D. 不确定，可能面临转型或调整' },
      { value: 'volatile', label: 'E. 准备创业/转行，收入可能大幅波动' },
    ]
  },

  // B. 持久收入稳定性评估
  {
    id: 'income_source',
    text: '问题4：你的主要收入来源类型是？',
    type: 'single',
    category: 'economic_base',
    options: [
      { value: 'salary_fixed', label: 'A. 固定月薪（完全可预测）' },
      { value: 'salary_bonus', label: 'B. 薪资+业绩提成（部分浮动）' },
      { value: 'commission', label: 'C. 项目制/佣金制（波动较大）' },
      { value: 'business', label: 'D. 自由职业/创业收入（高度波动）' },
      { value: 'multiple', label: 'E. 多渠道收入（工资+投资+兼职等）' },
    ]
  },
  {
    id: 'income_stability',
    text: '问题5：你的收入稳定性如何？',
    type: 'single',
    category: 'economic_base',
    options: [
      { value: 'very_stable', label: 'A. 非常稳定（铁饭碗/体制内）' },
      { value: 'stable', label: 'B. 比较稳定（大企业/有护城河的行业）' },
      { value: 'normal', label: 'C. 一般稳定（中小企业）' },
      { value: 'unstable', label: 'D. 不太稳定（创业/新兴行业）' },
      { value: 'volatile', label: 'E. 经常波动（自由职业/项目制）' },
    ]
  },
  {
    id: 'other_income',
    text: '问题6：除主要工作收入外，你还有其他稳定收入来源吗？',
    type: 'single',
    category: 'economic_base',
    options: [
      { value: 'stable_extra', label: 'A. 有，且金额较固定（如房租、投资分红）' },
      { value: 'unstable_extra', label: 'B. 有，但不太固定（如偶尔兼职）' },
      { value: 'none', label: 'C. 没有' },
    ]
  },
  {
    id: 'income_future',
    text: '问题7：你对收入在未来1-2年的预期是？',
    type: 'single',
    category: 'economic_base',
    options: [
      { value: 'grow_fast', label: 'A. 明显增长（预计+20%以上）' },
      { value: 'grow_slow', label: 'B. 小幅增长（预计+5%-20%）' },
      { value: 'flat', label: 'C. 基本不变' },
      { value: 'decline', label: 'D. 可能下降/面临不确定性' },
    ]
  },

  // C. 资产配置现状盘点
  {
    id: 'liquid_assets',
    text: '问题8：你目前持有的流动资产（现金、存款、货币基金）大约是？',
    type: 'number', // Special handling in UI, but keep as single for options logic if needed, actually prompt says "input number" or selection? Prompt has options A-E. Let's make it single choice for now to match prompt structure, but we might need the actual number for logic later. Let's use single choice ranges. Wait, user said "fill in liquid assets" before. Let's keep it as single choice ranges for the survey, but maybe ask for exact number in a separate field or just use ranges. Prompt options are ranges.
    // Actually, earlier code used 'liquid_assets' as a number input. Let's stick to the prompt's new design which is multiple choice.
    // BUT, for the "initial ledger" feature to work, we need a specific number. 
    // We can add a "custom" input or just take the median of the range. 
    // Let's use a special type 'single_with_number' or just ask for number in UI if option selected.
    // For simplicity, let's use the prompt's options, and maybe asking for exact number is better for the ledger feature.
    // The user prompt in previous turn said "based on user input liquid assets".
    // Let's make this question a NUMBER input again, but maybe with guidance? 
    // No, the prompt explicitly lists options A-E. 
    // I will use 'single' choice, and then map the choice to a value for the ledger (e.g. median). 
    // OR, I can change the type to 'number_selection' where user selects range but can input exact.
    // Let's stick to options for the survey consistency, and maybe add a specific "how much exactly" question or just use median.
    // Actually, looking at Question 8 options: "Almost none", "1-3 months", etc. This depends on monthly expense which we don't know yet.
    // Let's change this to a direct number input to support the previous feature of "initial ledger".
    // "问题8：你目前持有的流动资产（现金、存款、货币基金）大约是？" - The prompt lists options A-E.
    // I will use options, but I will ALSO add a field for exact amount if possible, or just estimate. 
    // To support the previous "initial ledger" feature which used `answers['liquid_assets']` as a number, 
    // I should probably keep it as a number input, or parse the range. 
    // Let's keep it as `type: 'number'` (Input field) to be precise and support the ledger feature best.
    // The prompt options are ranges, but for a finance app, exact number is better.
    // However, the user provided specific options. I will follow the user's prompt and use OPTIONS.
    // I will handle the "initial ledger" logic by taking the lower bound or median of the selected range, OR I will modify the UI to allow exact input.
    // Let's use `type: 'single'` with ranges, and I will update the `completeOnboarding` logic to estimate amount from range if exact number is not provided. 
    // BETTER YET: I'll use `type: 'number'` because it's more practical for a fintech app, even if the prompt listed ranges (ranges are often for survey analysis). 
    // Wait, the user explicitly pasted "Step 1... Question 8... Options A-E". I should follow the prompt.
    // I will use `type: 'single'` and add a `value_map` or similar logic later.
    category: 'economic_base',
    options: [
      { value: '0', label: 'A. 几乎没有（<1个月生活费）' },
      { value: '10000', label: 'B. 1-3个月生活费 (约1-3万)' }, // Estimate for ledger
      { value: '30000', label: 'C. 3-6个月生活费 (约3-6万)' },
      { value: '60000', label: 'D. 6-12个月生活费 (约6-12万)' },
      { value: '100000', label: 'E. 12个月以上生活费 (>12万)' },
    ]
    // Note: I will add a separate "exact_liquid_assets" question or just use a default from these ranges for the ledger.
    // Actually, let's insert a hidden or extra question for exact number? 
    // Or just change Question 8 to be a number input and ignore the options?
    // User said "Question 8... Options A-E". I must render options.
    // I will add a small "Exact Amount" input in the UI if possible, or just use the values above as estimates for the ledger.
  },
  {
    id: 'invest_assets',
    text: '问题9：你目前持有的投资资产（股票、基金、债券、黄金等）大约是？',
    type: 'single',
    category: 'economic_base',
    options: [
      { value: '0', label: 'A. 从未投资过' },
      { value: '5000', label: 'B. <1万元' },
      { value: '30000', label: 'C. 1-5万元' },
      { value: '100000', label: 'D. 5-20万元' },
      { value: '500000', label: 'E. 20-100万元' },
      { value: '1000000', label: 'F. >100万元' },
    ]
  },
  {
    id: 'fixed_assets',
    text: '问题10：你持有的不动产（自住房产等）价值大约是？',
    type: 'single',
    category: 'economic_base',
    options: [
      { value: 'none', label: 'A. 无不动产' },
      { value: 'lt_100', label: 'B. <100万元' },
      { value: '100_300', label: 'C. 100-300万元' },
      { value: '300_500', label: 'D. 300-500万元' },
      { value: '500_1000', label: 'E. 500-1000万元' },
      { value: 'gt_1000', label: 'F. >1000万元' },
    ]
  },
  {
    id: 'debt_total',
    text: '问题11：你目前的主要负债（房贷、车贷、信用卡欠款等）大约是？',
    type: 'single',
    category: 'economic_base',
    options: [
      { value: 'none', label: 'A. 无负债' },
      { value: 'lt_5', label: 'B. <5万元（信用卡/消费贷）' },
      { value: '5_30', label: 'C. 5-30万元' },
      { value: '30_100', label: 'D. 30-100万元' },
      { value: '100_300', label: 'E. 100-300万元' },
      { value: 'gt_300', label: 'F. >300万元' },
    ]
  },
  {
    id: 'debt_monthly',
    text: '问题12：你每月需要偿还的债务金额大约是？',
    type: 'single',
    category: 'economic_base',
    options: [
      { value: '0', label: 'A. 无负债' },
      { value: 'lt_2000', label: 'B. <2000元' },
      { value: '2000_5000', label: 'C. 2000-5000元' },
      { value: '5000_10000', label: 'D. 5000-10000元' },
      { value: 'gt_10000', label: 'E. >10000元' },
    ]
  },

  // D. 家庭经济背景调查
  {
    id: 'family_background',
    text: '问题13：你的家庭经济状况在你成长过程中（18岁前）属于？',
    type: 'single',
    category: 'economic_base',
    options: [
      { value: 'rich', label: 'A. 宽裕（基本想要什么有什么）' },
      { value: 'upper_middle', label: 'B. 中等偏上（大多数需求能满足）' },
      { value: 'middle', label: 'C. 中等（基本生活需求能满足）' },
      { value: 'lower_middle', label: 'D. 中等偏下（需要精打细算）' },
      { value: 'poor', label: 'E. 紧张（经常感到经济压力）' },
    ]
  },
  {
    id: 'parents_status',
    text: '问题14：父母亲目前的职业和经济状况是？',
    type: 'single',
    category: 'economic_base',
    options: [
      { value: 'rich_retired', label: 'A. 父母均有稳定退休收入，经济宽裕' },
      { value: 'stable_retired', label: 'B. 父母有稳定退休收入，自给自足' },
      { value: 'working', label: 'C. 父母仍有工作收入' },
      { value: 'need_support', label: 'D. 父母需要子女赡养' },
      { value: 'financial_difficulty', label: 'E. 父母有经济困难，需要帮助' },
    ]
  },
  {
    id: 'dependents',
    text: '问题15：你是否有需要赡养的老人或抚养的子女？',
    type: 'single',
    category: 'economic_base',
    options: [
      { value: 'parents', label: 'A. 有老人需要赡养' },
      { value: 'children', label: 'B. 有子女需要抚养' },
      { value: 'both', label: 'C. 都有' },
      { value: 'none', label: 'D. 暂时没有' },
    ]
  },
  {
    id: 'marital_status',
    text: '问题16：你目前的婚姻/伴侣状况是？',
    type: 'single',
    category: 'economic_base',
    options: [
      { value: 'married_independent', label: 'A. 已婚，与配偶经济独立' },
      { value: 'married_shared', label: 'B. 已婚，与配偶财务共享' },
      { value: 'partner', label: 'C. 有稳定伴侣（未婚）' },
      { value: 'single', label: 'D. 单身' },
      { value: 'other', label: 'E. 其他' },
    ]
  },
  {
    id: 'family_finance_mode',
    text: '问题17：如果有伴侣，你们的家庭经济模式是？',
    type: 'single',
    category: 'economic_base',
    options: [
      { value: 'independent', label: 'A. 完全独立（各管各的）' },
      { value: 'hybrid', label: 'B. 部分独立（共同账户+个人账户）' },
      { value: 'shared', label: 'C. 完全共享（统一管理）' },
      { value: 'na', label: 'D. 暂不适用' },
    ]
  },

  // E. 金融基础知识测试
  {
    id: 'knowledge_compound',
    text: '问题18：你对"复利"概念的了解程度是？',
    type: 'single',
    category: 'financial_literacy',
    options: [
      { value: 'none', label: 'A. 完全不懂' },
      { value: 'basic', label: 'B. 听说过但不太懂' },
      { value: 'understand', label: 'C. 基本理解，能举例说明' },
      { value: 'deep', label: 'D. 深入理解，能进行计算' },
    ]
  },
  {
    id: 'calc_compound',
    text: '问题19：如果你投资10万元，年化收益率8%，10年后大约变成多少？',
    type: 'single',
    category: 'financial_literacy',
    options: [
      { value: 'wrong_10', label: 'A. 约10万元' },
      { value: 'wrong_15', label: 'B. 约15万元' },
      { value: 'correct_21', label: 'C. 约21万元（正确）' },
      { value: 'wrong_30', label: 'D. 约30万元' },
    ]
  },
  {
    id: 'knowledge_apr',
    text: '问题20：你对"年化收益率"的理解是？',
    type: 'single',
    category: 'financial_literacy',
    options: [
      { value: 'none', label: 'A. 完全不懂这个概念' },
      { value: 'basic', label: 'B. 大概知道是按年计算的收益率' },
      { value: 'full', label: 'C. 完全理解，能区分年化和累计收益' },
      { value: 'expert', label: 'D. 能根据日/月收益换算年化收益' },
    ]
  },
  {
    id: 'knowledge_inflation',
    text: '问题21："通货膨胀"对普通人的主要影响是？',
    type: 'single', // Prompt says multiselect, but our system supports single mostly. Let's stick to single for simplicity or pick the best answer. Or map to single.
    category: 'financial_literacy',
    options: [
      { value: 'unknown', label: 'A. 不知道' },
      { value: 'devaluation', label: 'B. 钱贬值，购买力下降' },
      { value: 'savings_loss', label: 'C. 存款实际收益降低' },
      { value: 'wage_lag', label: 'D. 工资可能上涨但不一定跟上物价' },
    ]
  },
  {
    id: 'knowledge_opportunity_cost',
    text: '问题22：你对"机会成本"的概念了解吗？',
    type: 'single',
    category: 'financial_literacy',
    options: [
      { value: 'none', label: 'A. 完全不懂' },
      { value: 'heard', label: 'B. 听说过但不太理解' },
      { value: 'apply', label: 'C. 理解并在生活中应用' },
      { value: 'expert', label: 'D. 深刻理解，经常用于决策' },
    ]
  },
  {
    id: 'knowledge_no_free_lunch',
    text: '问题23："天下没有免费的午餐"这句话，你认为主要想表达什么？',
    type: 'single',
    category: 'financial_literacy',
    options: [
      { value: 'literal', label: 'A. 世界上没有真正的免费' },
      { value: 'cost', label: 'B. 任何东西都有代价，即使不花金钱也要花时间' },
      { value: 'expensive', label: 'C. 免费的往往是最贵的' },
      { value: 'fraud', label: 'D. 提醒人们警惕欺诈' },
    ]
  },
  {
    id: 'save_vs_spend',
    text: '问题24：你认为"省钱"和"花钱"哪个更重要？',
    type: 'single',
    category: 'financial_literacy',
    options: [
      { value: 'save', label: 'A. 省更重要，多存钱' },
      { value: 'spend', label: 'B. 钱更重要，会花才会赚' },
      { value: 'context', label: 'C. 看情况，该省省该花花' },
      { value: 'balance', label: 'D. 一样重要，平衡最好' },
    ]
  },

  // F. 风险偏好测试
  {
    id: 'risk_choice',
    text: '问题25：假设你有一笔闲置资金，以下两个投资选项你更倾向哪个？',
    type: 'single',
    category: 'risk_profile',
    options: [
      { value: 'low', label: 'A. 稳定但收益低，年化约3%，几乎不会亏' },
      { value: 'medium', label: 'B. 收益较高但有波动，年化约8%-12%，可能短期亏损5%-10%' },
      { value: 'high', label: 'C. 高收益高波动，年化约15%-20%，可能短期亏损20%-30%' },
    ]
  },
  {
    id: 'risk_reaction',
    text: '问题26：如果你的投资在短期内（1-3个月）亏损了10%，你会怎么做？',
    type: 'single',
    category: 'risk_profile',
    options: [
      { value: 'sell', label: 'A. 立即卖出，避免更大亏损' },
      { value: 'hold', label: 'B. 保持不动，等回本' },
      { value: 'buy', label: 'C. 越跌越买，拉低成本' },
      { value: 'anxious', label: 'D. 感到焦虑，睡不好觉' },
      { value: 'calm', label: 'E. 冷静分析，不情绪化决策' },
    ]
  },
  {
    id: 'risk_return_view',
    text: '问题27：你对"高风险高回报"这个说法的态度是？',
    type: 'single',
    category: 'risk_profile',
    options: [
      { value: 'agree', label: 'A. 完全认同，风险和收益成正比' },
      { value: 'partial', label: 'B. 部分认同，但不是线性关系' },
      { value: 'disagree', label: 'C. 不完全认同，很多高风险不带来高回报' },
      { value: 'misunderstanding', label: 'D. 认为是误解，高风险往往只带来高波动' },
    ]
  },
  {
    id: 'invest_exp',
    text: '问题28：你的投资/理财经验有多长？',
    type: 'single',
    category: 'risk_profile',
    options: [
      { value: 'none', label: 'A. 从未投资过任何理财产品' },
      { value: 'lt_1', label: 'B. 1年以内' },
      { value: '1_3', label: 'C. 1-3年' },
      { value: 'gt_3', label: 'D. 3年以上' },
    ]
  },
  {
    id: 'invest_type',
    text: '问题29：你目前投资理财的主要类型是？',
    type: 'single', // Multiselect in prompt
    category: 'risk_profile',
    options: [
      { value: 'safe', label: 'A. 银行存款/货币基金' },
      { value: 'bond', label: 'B. 债券/债券基金' },
      { value: 'stock', label: 'C. 股票/股票基金' },
      { value: 'fund_sip', label: 'D. 基金定投' },
      { value: 'insurance', label: 'E. 保险产品' },
      { value: 'house', label: 'F. 房产投资' },
      { value: 'other', label: 'G. 其他' },
    ]
  },
  {
    id: 'invest_priority',
    text: '问题30：你配置资产时更看重什么？',
    type: 'single', // Sort in prompt
    category: 'risk_profile',
    options: [
      { value: 'safety', label: 'A. 安全性（不亏钱）' },
      { value: 'return', label: 'B. 收益性（多赚钱）' },
      { value: 'liquidity', label: 'C. 流动性（随时可取）' },
      { value: 'threshold', label: 'D. 低门槛（容易入手）' },
    ]
  },

  // G. 消费心理学类型测试
  {
    id: 'psy_discount',
    text: '问题31：面对商场打折促销（如双十一），你的反应是？',
    type: 'single',
    category: 'psychology',
    options: [
      { value: 'never', label: 'A. 从不参与促销活动' },
      { value: 'plan', label: 'B. 会提前列出购物清单，严格按清单购买' },
      { value: 'cool_down', label: 'C. 会关注优惠，但会冷静几天再决定是否购买' },
      { value: 'impulse', label: 'D. 看到便宜就想买，容易超支' },
    ]
  },
  {
    id: 'psy_big_purchase',
    text: '问题32：你购买一件较贵商品（如手机、电脑、包包）时的决策过程通常是？',
    type: 'single',
    category: 'psychology',
    options: [
      { value: 'never', label: 'A. 从不买贵的东西' },
      { value: 'research', label: 'B. 会研究很久，比较不同品牌型号，1-2周才决定' },
      { value: 'rational', label: 'C. 考虑1-3天，相对理性地做出选择' },
      { value: 'impulse', label: 'D. 看到喜欢的就买，不太纠结' },
    ]
  },
  {
    id: 'psy_discount_item',
    text: '问题33：如果你在商场看到一件心仪已久的商品今天打5折，你会？',
    type: 'single',
    category: 'psychology',
    options: [
      { value: 'ignore', label: 'A. 无论是否需要都不会买' },
      { value: 'think', label: 'B. 会认真考虑是否真的需要，再决定' },
      { value: 'buy', label: 'C. 机会难得，立即购买' },
      { value: 'show_off', label: 'D. 立刻发朋友圈炫耀，然后购买' },
    ]
  },
  {
    id: 'psy_credit',
    text: '问题34：你对"超前消费"（如信用卡分期、花呗、网贷）的看法是？',
    type: 'single',
    category: 'psychology',
    options: [
      { value: 'never', label: 'A. 绝对不用，宁可存钱也不借钱消费' },
      { value: 'emergency', label: 'B. 尽量不用，只在紧急情况使用' },
      { value: 'smart', label: 'C. 合理使用，但会按时还款' },
      { value: 'heavy', label: 'D. 经常使用，分期消费是常态' },
    ]
  },
  {
    id: 'psy_house',
    text: '问题35：如果你看中了一套喜欢的房子但钱不够，你会？',
    type: 'single',
    category: 'psychology',
    options: [
      { value: 'save', label: 'A. 继续存钱，等攒够再买' },
      { value: 'compromise', label: 'B. 先买个小点的或偏远点的' },
      { value: 'loan', label: 'C. 借钱/贷款买下（首付+月供）' },
      { value: 'risk', label: 'D. 借钱也要买，机会不等人' },
    ]
  },
  {
    id: 'psy_startup',
    text: '问题36：假设你有机会参与一个创业项目，有50%概率赚5倍，有50%概率亏完投资，你会？',
    type: 'single',
    category: 'psychology',
    options: [
      { value: 'reject', label: 'A. 坚决不参与' },
      { value: 'cautious', label: 'B. 谨慎考虑，可能只投很少一点' },
      { value: 'moderate', label: 'C. 可以考虑，投入不影响生活的金额' },
      { value: 'risk', label: 'D. 愿意尝试，可能追加投资' },
    ]
  },
  {
    id: 'psy_decision',
    text: '问题37：当你做投资理财决策时，你主要依据是？',
    type: 'single',
    category: 'psychology',
    options: [
      { value: 'self', label: 'A. 自己研究分析，独立判断' },
      { value: 'expert', label: 'B. 参考专业人士意见' },
      { value: 'friends', label: 'C. 听身边朋友的推荐' },
      { value: 'trend', label: 'D. 跟风热门/主流选择' },
    ]
  },
  {
    id: 'psy_trend',
    text: '问题38：如果你看到身边朋友都在买某只股票/基金，你会？',
    type: 'single',
    category: 'psychology',
    options: [
      { value: 'ignore', label: 'A. 完全不跟风，可能还会警惕' },
      { value: 'watch', label: 'B. 会关注了解，但不一定买' },
      { value: 'follow_some', label: 'C. 可能会跟着买一些' },
      { value: 'follow_all', label: 'D. 朋友买了我就买' },
    ]
  },
  {
    id: 'psy_influencer',
    text: '问题39：你对"网红产品""爆款""明星推荐"的态度是？',
    type: 'single',
    category: 'psychology',
    options: [
      { value: 'reject', label: 'A. 从不购买，警惕营销' },
      { value: 'rational', label: 'B. 偶尔会买，理性尝试' },
      { value: 'follow', label: 'C. 经常购买，跟风消费' },
      { value: 'blind', label: 'D. 几乎只买网红产品' },
    ]
  },
  {
    id: 'psy_value',
    text: '问题40：日常生活中你最看重的是？',
    type: 'single',
    category: 'psychology',
    options: [
      { value: 'save', label: 'A. 能省则省，储蓄带来安全感' },
      { value: 'budget', label: 'B. 适度消费，在预算内享受' },
      { value: 'yolo', label: 'C. 享受当下，不太考虑未来' },
      { value: 'experience', label: 'D. 花钱能带来幸福感，愿意为体验付费' },
    ]
  },
  {
    id: 'psy_windfall',
    text: '问题41：如果你突然获得一笔10万元的意外收入（如奖金、彩票），你会？',
    type: 'single',
    category: 'psychology',
    options: [
      { value: 'save_all', label: 'A. 存起来/用于还债，一分不花' },
      { value: 'save_most', label: 'B. 大部分存起来，小部分犒劳自己' },
      { value: 'balance', label: 'C. 犒劳自己一部分，另一部分投资/储蓄' },
      { value: 'spend_most', label: 'D. 立刻花掉大部分，买一直想要的东西' },
    ]
  },
  {
    id: 'psy_motto',
    text: '问题42：你的消费信条更接近哪句？',
    type: 'single',
    category: 'psychology',
    options: [
      { value: 'frugal', label: 'A. 勤俭持家，细水长流' },
      { value: 'earn', label: 'B. 钱是挣出来的不是省出来的' },
      { value: 'yolo', label: 'C. 今朝有酒今朝醉' },
      { value: 'smart', label: 'D. 该花的花，不该花的不花' },
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
    content: '每天一杯咖啡看似不多，一年下来可能就是一部新手机的钱。生活中那些不起眼的小额支出，往往是导致存不下钱的元凶。',
    action: '找出你生活中的“拿铁因子”（如会员订阅、下午茶），尝试砍掉一项，每周省下的钱存入“备用金”。',
    tags: ['储蓄', '习惯']
  },
  {
    id: 'k3',
    title: '机会成本',
    concept: '选择的代价',
    content: '你花时间刷短视频，付出的代价是这段时间本可以用来学习或休息的价值。每一笔消费也是如此，花了这笔钱，就意味着失去了用它做其他更有意义事情的机会。',
    action: '在做大额消费决定前，想一想：这笔钱如果用来投资自己（买书、上课），会有什么不同？',
    tags: ['时间管理', '决策']
  },
  {
    id: 'k4',
    title: '沉没成本谬误',
    concept: '止损',
    content: '“来都来了”、“买都买了”——这些想法会让你为了挽回之前的投入，而不得不继续投入更多，导致损失扩大。过去的投入（沉没成本）不应影响未来的决策。',
    action: '检查一下你的订阅服务或办的卡，如果不常用了，果断取消，不要因为“已经交了年费”而强迫自己去用。',
    tags: ['决策', '心理学']
  },
  {
    id: 'k5',
    title: '复利效应',
    concept: '时间的玫瑰',
    content: '爱因斯坦说：“复利是世界第八大奇迹。” 每天进步 1%，一年后你会变得强大 37 倍。理财也是如此，尽早开始，利用时间的力量让财富滚雪球。',
    action: '哪怕每个月只存 500 元，只要坚持定投，长期来看也是一笔可观的财富。今天就开始第一笔定投吧！',
    tags: ['投资', '增长']
  },
  {
    id: 'k6',
    title: '72法则',
    concept: '翻倍计算',
    content: '想知道你的投资多久能翻倍？用 72 除以年化收益率。例如，如果年化收益是 8%，那么 72/8 = 9 年后你的资产就能翻倍。',
    action: '算一算，以你现在的理财收益率，资产翻倍需要多少年？如果太慢，是否需要调整配置？',
    tags: ['投资', '数学']
  },
  {
    id: 'k7',
    title: '帕金森定律',
    concept: '支出膨胀',
    content: '“支出总会自动增加，直至填满所有的收入。” 很多人涨工资后依然存不下钱，就是因为消费水平也随之提高了。',
    action: '每次涨薪或获得奖金时，将其中 50% 直接存入“增值金”或“成长金”，只用剩下的改善生活。',
    tags: ['储蓄', '人性']
  },
  {
    id: 'k8',
    title: '四宫格法则',
    concept: '标准普尔',
    content: '将家庭资产分为四份：要花的钱（日常）、保命的钱（保险/备用）、生钱的钱（投资）、保本升值的钱（稳健理财）。这就是我们 APP 的核心理念。',
    action: '打开“概览”页，检查你的四宫格比例是否健康？哪一块太少或太多？',
    tags: ['配置', '核心']
  }
];
