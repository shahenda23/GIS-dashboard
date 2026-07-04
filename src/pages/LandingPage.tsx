import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import logoUrl from '../assets/logo.svg'
import { useTheme } from '../context/ThemeContext'

/* ── Translations ──────────────────────────────────────────── */
const T = {
  en: {
    dir: 'ltr' as const,
    nav: { signin: 'Sign in', start: 'Start Free', features: 'Features', useCases: 'Use Cases', pricing: 'Pricing' },
    hero: {
      badge: 'NOW IN PUBLIC BETA',
      h1a: 'Build GIS', h1b: 'Dashboards', h1c: 'In Minutes',
      sub: 'Drag-and-drop geospatial intelligence. Build interactive maps, live analytics, and publishable dashboards — no code required.',
      cta1: 'Start Building Free', cta2: 'Watch Demo',
      t1: 'SOC 2 Compliant', t2: 'Deploy in < 5 min', t3: 'Multi-language',
      tagline: 'Build · Visualize · Share',
    },
    stats: {
      trust: 'TRUSTED BY TEAMS WORLDWIDE',
      s1l: 'Dashboards Created', s2l: 'Organizations', s3l: 'Uptime SLA', s4l: 'Avg Deploy Time', s5l: 'Widget Types',
    },
    problem: {
      label: 'THE PROBLEM',
      h2: 'Why traditional GIS\ndashboards fail teams',
      sub: 'The status quo demands expert developers, massive budgets, and endless iteration cycles. There has to be a better way.',
      cards: [
        { icon: '', title: 'Extreme Complexity',  body: 'Traditional GIS tools require months of specialized training and deep technical expertise just to get started.' },
        { icon: '', title: 'Prohibitive Cost',    body: 'Enterprise licenses cost tens of thousands per year — before you even factor in development and maintenance.' },
        { icon: '', title: 'Slow Deployment',     body: 'A single GIS dashboard can take 6–12 months from concept to production with traditional pipelines.' },
        { icon: '', title: 'Technical Barriers',  body: 'Your data scientists spend more time fighting tooling than analyzing geospatial patterns that drive decisions.' },
      ],
    },
    solution: {
      label: 'THE SOLUTION',
      h2a: 'GIS intelligence,', h2b: 'simplified',
      sub: 'DashBuilder gives your team a professional geospatial analytics platform that would take years to build in-house — ready in an afternoon.',
      points: [
        { icon: '', title: 'Instant Setup',     body: 'Connect your data, pick a template, and publish — in under 5 minutes. No dev team required.' },
        { icon: '', title: 'Powerful Maps',    body: 'MapLibre GL-powered rendering with GeoJSON, WMS, vector tiles, heatmaps, and custom layers.' },
        { icon: '', title: 'No-Code Builder',   body: 'Visual drag-and-drop interface anyone can master. Configure every widget without writing a line of code.' },
        { icon: '', title: 'One-Click Share',   body: 'Publish dashboards publicly or privately with a single click. Embed anywhere with our iframe API.' },
      ],
      flow: [
        { step: '01', label: 'Connect Data',      sub: 'GeoJSON · WMS · CSV · API' },
        { step: '02', label: 'Design Dashboard',  sub: 'Drag, drop, configure widgets' },
        { step: '03', label: 'Add Map Layers',    sub: 'Heatmaps · Clusters · Polygons' },
        { step: '04', label: 'Publish & Share',   sub: 'Public link · Embed · API access' },
      ],
      timeLabel: 'Time to first dashboard', timeValue: '< 5 minutes',
      cta: 'Start Building for Free →',
    },
    features: {
      label: 'FEATURES', h2: 'Everything your team needs',
      sub: 'From raw geospatial data to a polished, published dashboard — every tool in one platform.',
      cards: [
        { icon: '🗺️', title: 'Interactive Maps',      body: 'MapLibre GL-powered maps with full zoom, pan, rotate, and 3D extrusion. Layer anything.' },
        { icon: '🧱', title: 'Widget Library',         body: '40+ ready-made widgets: charts, KPIs, tables, filters, gauges, and more.' },
        { icon: '↔️', title: 'Drag-&-Drop Builder',  body: 'Intuitive visual editor. Resize, reorder, and configure every widget in real-time.' },
        { icon: '📑', title: 'Layer Management',       body: 'Toggle, style, and filter GeoJSON, WMS, raster, vector tile, and heatmap layers.' },
        { icon: '🔗', title: 'Data Integration',       body: 'Connect REST APIs, upload GeoJSON/CSV, or link live Supabase tables with zero code.' },
        { icon: '📤', title: 'Dashboard Publishing',   body: 'Share via public link, password-protect, embed with iframe, or export as PDF.' },
        { icon: '🎨', title: 'Custom Themes',          body: 'Brand your dashboards with custom colors, fonts, logos, and dark/light mode.' },
        { icon: '📡', title: 'Real-Time Analytics',    body: 'Live data subscriptions push updates to every widget the moment your data changes.' },
      ],
    },
    screens: {
      label: 'PRODUCT SHOWCASE', h2: 'See it in action',
      sub: 'Professional GIS dashboards that look stunning and perform at scale.',
      s1: 'Dashboard Builder', s2: 'Layer Management', s3: 'Analytics View',
    },
    useCases: {
      label: 'USE CASES', h2: 'Built for every industry',
      sub: 'From municipal governments to private enterprises — DashBuilder powers geospatial decisions at scale.',
      cards: [
        { icon: '', title: 'Smart Cities',       body: 'Monitor traffic, utilities, and public services across urban infrastructure in real time.', cta: 'See example' },
        { icon: '', title: 'Transportation',      body: 'Fleet tracking, route optimization, and passenger flow analytics on live geospatial maps.', cta: 'See example' },
        { icon: '', title: 'Utilities',           body: 'Grid monitoring, outage detection, and infrastructure asset management at city scale.', cta: 'See example' },
        { icon: '', title: 'Environmental',       body: 'Track air quality, water levels, deforestation, and climate change indicators spatially.', cta: 'See example' },
        { icon: '', title: 'Urban Planning',     body: 'Zoning analysis, population density mapping, and development impact assessment tools.', cta: 'See example' },
        { icon: '', title: 'Emergency Response',  body: 'Real-time incident tracking, resource dispatch, and situational awareness dashboards.', cta: 'See example' },
      ],
    },
    whyUs: {
      label: 'WHY CHOOSE US', h2: 'The competitive advantage\nyour team deserves',
      pillars: [
        { icon: '', title: 'Faster Deployment', body: '10× faster than building in-house. Go from data to dashboard in under an hour.' },
        { icon: '', title: 'Lower Total Cost',   body: 'Fraction of enterprise GIS licensing. Scale freely without per-seat surprises.' },
        { icon: '', title: 'No-Code First',  body: 'Business users build dashboards. Developers extend via API. Everyone wins.' },
        { icon: '', title: 'Enterprise Ready',  body: 'SOC 2, SSO, RBAC, audit logs, and 99.9% SLA — built for mission-critical use.' },
        { icon: '', title: 'Modern Architecture', body: 'MapLibre GL, React 19, real-time subscriptions. Cutting-edge under the hood.' },
      ],
    },
    testimonials: {
      label: 'TESTIMONIALS', h2: 'Loved by GIS teams worldwide',
      cards: [
        { quote: 'DashBuilder reduced our dashboard development cycle from 6 months to 2 days. The map layer system is exactly what our city GIS team needed.', name: 'Sarah Chen', role: 'GIS Director, City of Austin', avatar: 'SC' },
        { quote: "We replaced a $80k/year ESRI license with DashBuilder. Our team was up and running in a day, and the dashboards look better than anything we had before.", name: 'Marcus Williams', role: 'CTO, TranspoTech Inc.', avatar: 'MW' },
        { quote: 'The drag-and-drop builder is genuinely impressive. Non-technical staff in our environmental team now build their own monitoring dashboards independently.', name: 'Layla Hassan', role: 'Head of Data, EcoMonitor', avatar: 'LH' },
      ],
    },
    pricing: {
      label: 'PRICING', h2: 'Simple, transparent pricing',
      sub: 'Start free, scale as you grow. No hidden fees, no surprise bills.',
      popular: 'MOST POPULAR',
      plans: [
        { name: 'Starter', price: 'Free',   period: 'forever',     desc: 'Perfect for small teams and personal projects.',    features: ['3 dashboards','5 map layers','GeoJSON & CSV upload','Public sharing','Community support'], cta: 'Get Started Free', featured: false },
        { name: 'Pro',     price: '$29',    period: 'per month',   desc: 'For growing teams that need full power.',          features: ['Unlimited dashboards','All layer types','Real-time data','Custom themes','API access','Priority support','Password-protected shares','Analytics export'], cta: 'Start Pro Trial', featured: true },
        { name: 'Enterprise', price: 'Custom', period: 'contact us', desc: 'Mission-critical deployments with SLA guarantees.', features: ['Everything in Pro','SSO & SAML','RBAC & audit logs','On-premise option','Dedicated SLA','Custom integrations','Onboarding support'], cta: 'Contact Sales', featured: false },
      ],
    },
    faq: {
      label: 'FAQ', h2: 'Common questions',
      items: [
        { q: 'Do I need coding skills to use DashBuilder?', a: 'No. The visual drag-and-drop builder is designed for non-technical users. Connect your data, choose widgets, and publish — no code required. Developers can also use our API for advanced integrations.' },
        { q: 'What data formats are supported?', a: 'We support GeoJSON, CSV, WMS, vector tiles, raster layers, heatmaps, and live REST API connections. More integrations are added regularly based on community requests.' },
        { q: 'Can I embed dashboards on my website?', a: 'Yes. Every published dashboard can be embedded with a simple iframe snippet. You can also password-protect embedded dashboards or restrict them by domain.' },
        { q: 'Is there a self-hosted option?', a: 'Self-hosted (on-premise) deployment is available on the Enterprise plan. Contact our sales team for more details about deployment requirements and licensing.' },
        { q: 'How does real-time data work?', a: 'DashBuilder uses live data subscriptions. When your underlying dataset changes, all connected dashboards update automatically — no manual refresh required.' },
        { q: 'What kind of support is included?', a: 'Starter plans include community support. Pro plans include priority email support with a 24-hour SLA. Enterprise plans include a dedicated support engineer and 4-hour response SLA.' },
      ],
    },
    cta: {
      badge: 'No credit card required',
      h2a: 'Start building your', h2b: 'GIS dashboard today',
      sub: 'Join thousands of teams using DashBuilder to make geospatial data beautiful, accessible, and actionable.',
      cta1: 'Start Building Free', cta2: 'Talk to Sales',
      note: 'Free forever on Starter · No setup fee · Cancel anytime',
    },
    footer: {
      desc: 'Professional geospatial visualization tools for data-driven decisions. Build · Visualize · Share.',
      cols: [
        { title: 'Product',   links: [{ l: 'Features', p: '#' }, { l: 'Templates', p: '/templates' }, { l: 'API', p: '/api' }, { l: 'Changelog', p: '#' }] },
        { title: 'Solutions', links: [{ l: 'Smart Cities', p: '#' }, { l: 'Transportation', p: '#' }, { l: 'Environmental', p: '#' }, { l: 'Emergency', p: '#' }] },
        { title: 'Resources', links: [{ l: 'Documentation', p: '/docs' }, { l: 'Community', p: '/community' }, { l: 'Help Center', p: '/help-center' }, { l: 'Blog', p: '#' }] },
        { title: 'Company',   links: [{ l: 'About', p: '#' }, { l: 'Careers', p: '#' }, { l: 'Privacy', p: '#' }, { l: 'Terms', p: '#' }] },
      ],
      rights: '© 2025 GIS Dashboard Builder. All rights reserved.',
      legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
    },
  },
  ar: {
    dir: 'rtl' as const,
    nav: { signin: 'تسجيل الدخول', start: 'ابدأ مجاناً', features: 'المميزات', useCases: 'حالات الاستخدام', pricing: 'الأسعار' },
    hero: {
      badge: 'النسخة التجريبية متاحة الآن',
      h1a: 'ابنِ لوحات', h1b: 'GIS التحكم', h1c: 'في دقائق',
      sub: 'ذكاء جغرافي مكاني بالسحب والإفلات. أنشئ خرائط تفاعلية وتحليلات حية ولوحات قابلة للنشر — بدون كود.',
      cta1: 'ابدأ البناء مجاناً', cta2: 'شاهد العرض',
      t1: 'متوافق مع SOC 2', t2: 'نشر أقل من 5 د', t3: 'متعدد اللغات',
      tagline: 'ابنِ · صوِّر · شارك',
    },
    stats: {
      trust: 'موثوق به من فرق حول العالم',
      s1l: 'لوحة تحكم منشأة', s2l: 'مؤسسة', s3l: 'ضمان التشغيل', s4l: 'متوسط وقت النشر', s5l: 'نوع عنصر',
    },
    problem: {
      label: 'المشكلة',
      h2: 'لماذا تفشل لوحات GIS\nالتقليدية مع الفرق؟',
      sub: 'الوضع الراهن يتطلب مطورين متخصصين وميزانيات ضخمة ودورات تطوير لا تنتهي. لا بد من طريقة أفضل.',
      cards: [
        { icon: '🧩', title: 'تعقيد مفرط',          body: 'تتطلب أدوات GIS التقليدية أشهراً من التدريب المتخصص والخبرة التقنية العميقة لمجرد البدء.' },
        { icon: '💸', title: 'تكلفة باهظة',           body: 'تكلف تراخيص المؤسسات عشرات الآلاف سنوياً — قبل احتساب التطوير والصيانة.' },
        { icon: '⏳', title: 'نشر بطيء',             body: 'قد تستغرق لوحة GIS واحدة من 6 إلى 12 شهراً من الفكرة إلى الإنتاج.' },
        { icon: '🔒', title: 'عقبات تقنية',           body: 'يقضي علماء البيانات وقتاً أطول في محاربة الأدوات بدلاً من تحليل الأنماط الجغرافية.' },
      ],
    },
    solution: {
      label: 'الحل',
      h2a: 'ذكاء GIS،', h2b: 'بكل بساطة',
      sub: 'يمنح DashBuilder فريقك منصة تحليل جغرافي احترافية كان بناؤها يستغرق سنوات — جاهزة في ساعات.',
      points: [
        { icon: '⚡', title: 'إعداد فوري',          body: 'اربط بياناتك واختر قالباً وانشر — في أقل من 5 دقائق. دون الحاجة لفريق تطوير.' },
        { icon: '🗺️', title: 'خرائط قوية',         body: 'عرض مدعوم بـ MapLibre GL مع GeoJSON وWMS والبلاطات المتجهة والخرائط الحرارية.' },
        { icon: '🔧', title: 'بناء بدون كود',       body: 'واجهة سحب وإفلات بصرية يتقنها الجميع. اضبط كل عنصر بدون سطر كود واحد.' },
        { icon: '🚀', title: 'مشاركة بنقرة واحدة',  body: 'انشر لوحات التحكم عاماً أو خاصاً بنقرة واحدة. ضمِّنها أينما تريد.' },
      ],
      flow: [
        { step: '01', label: 'ربط البيانات',       sub: 'GeoJSON · WMS · CSV · API' },
        { step: '02', label: 'تصميم اللوحة',       sub: 'اسحب وأفلت واضبط العناصر' },
        { step: '03', label: 'إضافة طبقات الخريطة', sub: 'حرارية · مجموعات · مضلعات' },
        { step: '04', label: 'النشر والمشاركة',    sub: 'رابط عام · تضمين · وصول API' },
      ],
      timeLabel: 'الوقت اللازم لأول لوحة', timeValue: 'أقل من 5 دقائق',
      cta: 'ابدأ البناء مجاناً →',
    },
    features: {
      label: 'المميزات', h2: 'كل ما يحتاجه فريقك',
      sub: 'من البيانات الجغرافية الخام إلى لوحة تحكم منشورة ومصقولة — كل أداة في منصة واحدة.',
      cards: [
        { icon: '🗺️', title: 'خرائط تفاعلية',       body: 'خرائط MapLibre GL بتكبير وتدوير كامل وبثلاثية الأبعاد. أضف أي شيء كطبقة.' },
        { icon: '🧱', title: 'مكتبة العناصر',         body: '+40 عنصراً جاهزاً: مخططات، KPIs، جداول، فلاتر، ومزيد.' },
        { icon: '↔️', title: 'بناء بالسحب والإفلات', body: 'محرر بصري سهل. أعد الترتيب والضبط لكل عنصر في الوقت الفعلي.' },
        { icon: '📑', title: 'إدارة الطبقات',         body: 'تفعيل وتصميم وتصفية طبقات GeoJSON وWMS والبيانات الحرارية.' },
        { icon: '🔗', title: 'تكامل البيانات',        body: 'اربط REST APIs أو ارفع GeoJSON/CSV أو اربط جداول Supabase مباشرة.' },
        { icon: '📤', title: 'نشر اللوحات',           body: 'شارك برابط عام أو بكلمة مرور أو ضمِّن بـ iframe أو صدِّر كـ PDF.' },
        { icon: '🎨', title: 'سمات مخصصة',            body: 'عرِّف لوحاتك بألوان وخطوط وشعارات مخصصة ووضع داكن/فاتح.' },
        { icon: '📡', title: 'تحليلات فورية',         body: 'اشتراكات البيانات الحية تحدِّث كل عنصر فور تغيُّر بياناتك.' },
      ],
    },
    screens: {
      label: 'عرض المنتج', h2: 'شاهده في العمل',
      sub: 'لوحات GIS احترافية تبدو رائعة وتعمل على نطاق واسع.',
      s1: 'منشئ اللوحات', s2: 'إدارة الطبقات', s3: 'عرض التحليلات',
    },
    useCases: {
      label: 'حالات الاستخدام', h2: 'مبني لكل صناعة',
      sub: 'من الحكومات البلدية إلى الشركات الخاصة — DashBuilder يدعم القرارات الجغرافية على نطاق واسع.',
      cards: [
        { icon: '🏙️', title: 'المدن الذكية',          body: 'رصد المرور والمرافق والخدمات العامة عبر البنية التحتية الحضرية في الوقت الفعلي.', cta: 'شاهد مثالاً' },
        { icon: '🚌', title: 'النقل والمواصلات',       body: 'تتبع الأسطول وتحسين المسارات وتحليلات تدفق الركاب على الخرائط الحية.', cta: 'شاهد مثالاً' },
        { icon: '⚡', title: 'المرافق العامة',          body: 'مراقبة الشبكة واكتشاف الانقطاعات وإدارة أصول البنية التحتية على مستوى المدينة.', cta: 'شاهد مثالاً' },
        { icon: '🌿', title: 'البيئة',                  body: 'تتبع جودة الهواء ومستويات المياه وإزالة الغابات ومؤشرات التغير المناخي مكانياً.', cta: 'شاهد مثالاً' },
        { icon: '🏗️', title: 'التخطيط العمراني',       body: 'تحليل التخطيط وخرائط الكثافة السكانية وأدوات تقييم أثر التطوير.', cta: 'شاهد مثالاً' },
        { icon: '🚨', title: 'الاستجابة للطوارئ',      body: 'تتبع الحوادث في الوقت الفعلي وإرسال الموارد ولوحات الوعي الظرفي.', cta: 'شاهد مثالاً' },
      ],
    },
    whyUs: {
      label: 'لماذا نحن؟', h2: 'الميزة التنافسية\nالتي يستحقها فريقك',
      pillars: [
        { icon: '🚀', title: 'نشر أسرع',           body: 'أسرع 10 مرات من البناء الداخلي. انتقل من البيانات إلى اللوحة في أقل من ساعة.' },
        { icon: '💰', title: 'تكلفة أقل',          body: 'جزء بسيط من تراخيص GIS المؤسسية. توسَّع بحرية بدون مفاجآت.' },
        { icon: '🧑‍💻', title: 'بدون كود أولاً',  body: 'يبني مستخدمو الأعمال اللوحات. يوسِّع المطورون عبر API. الجميع يستفيد.' },
        { icon: '🏢', title: 'جاهز للمؤسسات',     body: 'SOC 2 وSSO وRBAC وسجلات التدقيق وضمان 99.9% — مبني للاستخدام الحرج.' },
        { icon: '🔮', title: 'هندسة حديثة',       body: 'MapLibre GL وReact 19 واشتراكات فورية. متقدم تحت الغطاء.' },
      ],
    },
    testimonials: {
      label: 'شهادات العملاء', h2: 'محبوب من فرق GIS حول العالم',
      cards: [
        { quote: 'قلَّص DashBuilder دورة تطوير لوحاتنا من 6 أشهر إلى يومين. نظام طبقات الخريطة هو بالضبط ما احتاجته فريق GIS المدينة.', name: 'سارة تشين', role: 'مديرة GIS، مدينة أوستن', avatar: 'SC' },
        { quote: 'استبدلنا ترخيص ESRI بـ 80 ألف دولار سنوياً بـ DashBuilder. كان فريقنا جاهزاً في يوم واحد، وتبدو اللوحات أفضل مما كان لدينا.', name: 'ماركوس ويليامز', role: 'CTO، TranspoTech Inc.', avatar: 'MW' },
        { quote: 'منشئ السحب والإفلات رائع بصدق. يبني موظفو البيئة غير التقنيون لوحات مراقبتهم الخاصة باستقلالية تامة.', name: 'ليلى حسن', role: 'رئيسة البيانات، EcoMonitor', avatar: 'LH' },
      ],
    },
    pricing: {
      label: 'الأسعار', h2: 'أسعار بسيطة وشفافة',
      sub: 'ابدأ مجاناً، وتوسَّع مع نموك. بدون رسوم خفية أو فواتير مفاجئة.',
      popular: 'الأكثر شعبية',
      plans: [
        { name: 'المبتدئ',    price: 'مجاني', period: 'إلى الأبد',      desc: 'مثالي للفرق الصغيرة والمشاريع الشخصية.',    features: ['3 لوحات تحكم','5 طبقات خريطة','رفع GeoJSON وCSV','مشاركة عامة','دعم المجتمع'], cta: 'ابدأ مجاناً', featured: false },
        { name: 'الاحترافي',  price: '29$',   period: 'شهرياً',          desc: 'للفرق النامية التي تحتاج كامل القوة.',       features: ['لوحات غير محدودة','جميع أنواع الطبقات','بيانات فورية','سمات مخصصة','وصول API','دعم ذو أولوية','مشاركة بكلمة مرور','تصدير التحليلات'], cta: 'ابدأ تجربة Pro', featured: true },
        { name: 'المؤسسات',   price: 'مخصص', period: 'تواصل معنا',      desc: 'نشر للمهام الحرجة مع ضمانات الخدمة.',        features: ['كل ما في Pro','SSO وSAML','RBAC وسجلات التدقيق','خيار محلي','SLA مخصص','تكاملات مخصصة','دعم التأهيل'], cta: 'تواصل مع المبيعات', featured: false },
      ],
    },
    faq: {
      label: 'الأسئلة الشائعة', h2: 'أسئلة متكررة',
      items: [
        { q: 'هل أحتاج مهارات برمجية لاستخدام DashBuilder؟', a: 'لا. منشئ السحب والإفلات مصمم للمستخدمين غير التقنيين. اربط بياناتك واختر العناصر وانشر — بدون كود. يمكن للمطورين أيضاً استخدام API لتكاملات متقدمة.' },
        { q: 'ما هي صيغ البيانات المدعومة؟', a: 'ندعم GeoJSON وCSV وWMS والبلاطات المتجهة والطبقات النقطية والحرارية واتصالات REST API الحية. تُضاف تكاملات جديدة بانتظام.' },
        { q: 'هل يمكنني تضمين اللوحات في موقعي؟', a: 'نعم. يمكن تضمين كل لوحة منشورة بمقتطف iframe بسيط. يمكنك أيضاً حمايتها بكلمة مرور أو تقييدها بنطاق معين.' },
        { q: 'هل هناك خيار للاستضافة الذاتية؟', a: 'النشر الذاتي (على مقر) متاح في خطة المؤسسات. تواصل مع فريق المبيعات لمزيد من التفاصيل.' },
        { q: 'كيف تعمل البيانات الفورية؟', a: 'يستخدم DashBuilder اشتراكات البيانات الحية. عندما تتغير بياناتك، تتحدث جميع اللوحات المتصلة تلقائياً بدون تحديث يدوي.' },
        { q: 'ما نوع الدعم المتضمن؟', a: 'تتضمن خطة المبتدئ دعم المجتمع. خطة Pro تتضمن دعماً بالبريد ذو أولوية بـ SLA 24 ساعة. خطة المؤسسات تتضمن مهندس دعم مخصص وSLA 4 ساعات.' },
      ],
    },
    cta: {
      badge: 'لا تتطلب بطاقة ائتمانية',
      h2a: 'ابدأ بناء لوحة', h2b: 'GIS الخاصة بك اليوم',
      sub: 'انضم إلى آلاف الفرق التي تستخدم DashBuilder لجعل البيانات الجغرافية جميلة وسهلة الوصول وقابلة للتنفيذ.',
      cta1: 'ابدأ البناء مجاناً', cta2: 'تحدث مع المبيعات',
      note: 'مجاني إلى الأبد على المبتدئ · بدون رسوم إعداد · إلغاء في أي وقت',
    },
    footer: {
      desc: 'أدوات احترافية للتصور الجغرافي لاتخاذ قرارات مبنية على البيانات. ابنِ · صوِّر · شارك.',
      cols: [
        { title: 'المنتج',    links: [{ l: 'المميزات', p: '#' }, { l: 'القوالب', p: '/templates' }, { l: 'API', p: '/api' }, { l: 'سجل التغييرات', p: '#' }] },
        { title: 'الحلول',   links: [{ l: 'المدن الذكية', p: '#' }, { l: 'النقل', p: '#' }, { l: 'البيئة', p: '#' }, { l: 'الطوارئ', p: '#' }] },
        { title: 'الموارد',  links: [{ l: 'التوثيق', p: '/docs' }, { l: 'المجتمع', p: '/community' }, { l: 'مركز المساعدة', p: '/help-center' }, { l: 'المدونة', p: '#' }] },
        { title: 'الشركة',   links: [{ l: 'من نحن', p: '#' }, { l: 'الوظائف', p: '#' }, { l: 'الخصوصية', p: '#' }, { l: 'الشروط', p: '#' }] },
      ],
      rights: '© 2025 GIS Dashboard Builder. جميع الحقوق محفوظة.',
      legal: ['سياسة الخصوصية', 'شروط الخدمة', 'سياسة الكوكيز'],
    },
  },
}

/* ── Scroll-reveal ─────────────────────────────────────────── */
function useInView() {
  const ref = useRef<HTMLDivElement>(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return { ref, v }
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, v } = useInView()
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0,
      transform: v ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity .65s cubic-bezier(.4,0,.2,1) ${delay}ms, transform .65s cubic-bezier(.4,0,.2,1) ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

/* ── Shared lang hook ──────────────────────────────────────── */
function useLang() {
  const { lang, toggleLang } = useTheme()
  return { t: T[lang], lang, toggleLang }
}

/* ── Shared tokens ─────────────────────────────────────────── */
const C = {
  accent:    '#0ea5e9',
  accentD:   '#0284c7',
  accentGlow:'rgba(14,165,233,0.18)',
  dark:      '#0f172a',
  darkSurf:  '#1e293b',
  darkBord:  'rgba(255,255,255,0.08)',
  light:     '#f8fafc',
  white:     '#ffffff',
  txt:       '#111827',
  sub:       '#6b7280',
  muted:     '#94a3b8',
  green:     '#22c55e',
  amber:     '#f59e0b',
  purple:    '#8b5cf6',
}

/* ── Animations keyframes string ───────────────────────────── */
const STYLES = `
  @keyframes lp-float-a { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes lp-float-b { 0%,100%{transform:translateY(-6px)} 50%{transform:translateY(8px)} }
  @keyframes lp-float-c { 0%,100%{transform:translateY(4px)} 50%{transform:translateY(-8px)} }
  @keyframes lp-shimmer  { 0%,100%{opacity:.8} 50%{opacity:1} }
  @keyframes lp-pulse    { 0%,100%{opacity:.5} 50%{opacity:.85} }
  @keyframes lp-spin     { to{transform:rotate(360deg)} }
  @keyframes lp-ping     { 0%{transform:scale(1);opacity:.8} 100%{transform:scale(2.2);opacity:0} }
  @keyframes lp-bar      { 0%,100%{opacity:.75} 50%{opacity:1} }
  @keyframes lp-cursor {
    0%{transform:translate(120px,60px);opacity:0}
    5%{transform:translate(120px,60px);opacity:1}
    20%{transform:translate(310px,95px)}
    25%{transform:translate(310px,95px)}
    40%{transform:translate(180px,195px)}
    44%{transform:translate(180px,195px)}
    58%{transform:translate(72px,310px)}
    62%{transform:translate(72px,310px)}
    76%{transform:translate(240px,268px)}
    80%{transform:translate(240px,268px)}
    92%{transform:translate(120px,60px);opacity:1}
    98%{transform:translate(120px,60px);opacity:0}
    100%{transform:translate(120px,60px);opacity:0}
  }
  @keyframes lp-drag {
    0%,19%{transform:translate(0,0) scale(1);box-shadow:0 4px 18px rgba(0,0,0,.07)}
    20%{transform:translate(0,0) scale(1.05);box-shadow:0 0 0 2px rgba(14,165,233,.45),0 14px 36px rgba(14,165,233,.2)}
    37%{transform:translate(-138px,100px) scale(1.05);box-shadow:0 0 0 2px rgba(14,165,233,.45),0 18px 44px rgba(14,165,233,.25)}
    42%{transform:translate(-138px,100px) scale(1);box-shadow:0 4px 18px rgba(0,0,0,.07)}
    88%{transform:translate(-138px,100px) scale(1)}
    94%{transform:translate(0,0) scale(1)}
    100%{transform:translate(0,0) scale(1)}
  }
  @keyframes lp-glow-orb {
    0%,100%{transform:scale(1) translate(0,0);opacity:.35}
    50%{transform:scale(1.15) translate(10px,-10px);opacity:.55}
  }
  @keyframes lp-grid-fade { 0%,100%{opacity:.45} 50%{opacity:.65} }
  @keyframes lp-gradient-move {
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
  }
  .lp-btn-primary {
    display:inline-flex; align-items:center; gap:8px;
    background:linear-gradient(135deg,${C.accent} 0%,${C.accentD} 100%);
    color:#fff; border:none; border-radius:12px;
    padding:14px 28px; font-size:15px; font-weight:700;
    cursor:pointer; text-decoration:none;
    box-shadow:0 4px 24px rgba(14,165,233,.35);
    transition:transform .18s, box-shadow .18s, background .18s;
    white-space:nowrap;
  }
  .lp-btn-primary:hover {
    transform:translateY(-2px);
    box-shadow:0 8px 32px rgba(14,165,233,.45);
    background:linear-gradient(135deg,#38bdf8 0%,${C.accent} 100%);
  }
  .lp-btn-ghost {
    display:inline-flex; align-items:center; gap:8px;
    background:rgba(255,255,255,0.08); color:#f1f5f9;
    border:1.5px solid rgba(255,255,255,0.15); border-radius:12px;
    padding:13px 26px; font-size:15px; font-weight:600;
    cursor:pointer; text-decoration:none;
    transition:background .18s, border-color .18s, transform .18s;
    white-space:nowrap; backdrop-filter:blur(8px);
  }
  .lp-btn-ghost:hover {
    background:rgba(255,255,255,0.14);
    border-color:rgba(255,255,255,0.28);
    transform:translateY(-2px);
  }
  .lp-feature-card:hover { transform:translateY(-4px)!important; box-shadow:0 16px 40px rgba(0,0,0,.10)!important; }
  .lp-usecase-card:hover { border-color:${C.accent}!important; transform:translateY(-3px)!important; }
  .lp-pricing-card:hover { transform:translateY(-4px)!important; }
  .lp-testimonial:hover  { transform:translateY(-3px)!important; }
  .lp-stat-item:hover span.lp-stat-num { color:${C.accent}!important; }
  .lp-faq-item { border-bottom:1px solid #e5e7eb; }
  .lp-faq-item:last-child { border-bottom:none; }
  @media (max-width:768px) {
    .lp-hero-inner  { flex-direction:column!important; }
    .lp-hero-left   { max-width:100%!important; }
    .lp-hero-right  { display:none!important; }
    .lp-features-grid { grid-template-columns:1fr 1fr!important; }
    .lp-why-grid    { grid-template-columns:1fr!important; }
    .lp-pricing-grid{ grid-template-columns:1fr!important; }
    .lp-footer-grid { grid-template-columns:1fr 1fr!important; }
    .lp-usecase-grid{ grid-template-columns:1fr 1fr!important; }
    .lp-screens-grid{ grid-template-columns:1fr!important; }
    .lp-stats-row   { flex-direction:column!important; gap:24px!important; }
    .lp-problem-grid{ grid-template-columns:1fr!important; }
    .lp-testi-grid  { grid-template-columns:1fr!important; }
  }
`

/* ════════════════════════════════════════════════════════════
   LANDING PAGE
════════════════════════════════════════════════════════════ */
function LandingPage() {
  const nav = useNavigate()
  const { t, lang } = useLang()
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  return (
    <div style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif', overflowX: 'hidden', background: C.white, direction: t.dir }}>
      <style>{STYLES}</style>

      {/* ── 1. NAV ──────────────────────────────────────────── */}
      <LandingNav nav={nav} lang={lang} />

      {/* ── 2. HERO ─────────────────────────────────────────── */}
      <HeroSection nav={nav} />

      {/* ── 3. SOCIAL PROOF / STATS ─────────────────────────── */}
      <StatsSection />

      {/* ── 4. PROBLEM ──────────────────────────────────────── */}
      <ProblemSection />

      {/* ── 5. SOLUTION ─────────────────────────────────────── */}
      <SolutionSection nav={nav} />

      {/* ── 6. FEATURES ─────────────────────────────────────── */}
      <FeaturesSection />

      {/* ── 7. PRODUCT SCREENS ──────────────────────────────── */}
      <ScreensSection />

      {/* ── 8. USE CASES ────────────────────────────────────── */}
      <UseCasesSection />

      {/* ── 9. WHY US ───────────────────────────────────────── */}
      <WhyUsSection />

      {/* ── 10. TESTIMONIALS ────────────────────────────────── */}
      <TestimonialsSection />

      {/* ── 11. PRICING ─────────────────────────────────────── */}
      <PricingSection nav={nav} />

      {/* ── 12. FAQ ─────────────────────────────────────────── */}
      <FAQSection faqOpen={faqOpen} setFaqOpen={setFaqOpen} />

      {/* ── 13. FINAL CTA ───────────────────────────────────── */}
      <FinalCTA nav={nav} />

      {/* ── 14. FOOTER ──────────────────────────────────────── */}
      <LandingFooter nav={nav} />
    </div>
  )
}

/* ════════════ NAV ════════════════════════════════════════════ */
function LandingNav({ nav, lang }: { nav: ReturnType<typeof useNavigate>; lang: 'en' | 'ar' }) {
  const { t, toggleLang } = useLang()
  const isRTL = lang === 'ar'
  const navLinks = [t.nav.features, t.nav.useCases, t.nav.pricing]

  return (
    <nav style={{
      position:      'fixed',
      top:           0,
      left:          0,
      right:         0,
      zIndex:        200,
      display:       'flex',
      alignItems:    'stretch',
      direction:     isRTL ? 'rtl' : 'ltr',
      padding:       '8px 16px',
      gap:           '10px',
      pointerEvents: 'none',
    }}>

      {/* ── Left pill: brand ── */}
      <div
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          alignSelf:            'center',
          display:              'flex',
          alignItems:           'center',
          gap:                  '18px',
          background:           'rgba(255,255,255,0.88)',
          backdropFilter:       'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border:               '1.5px solid rgba(255,255,255,0.92)',
          borderRadius:         '999px',
          padding:              '8px 20px 8px 8px',
          boxShadow:            '0 4px 18px rgba(0,0,0,0.12)',
          cursor:               'pointer',
          pointerEvents:        'auto',
          transition:           'box-shadow .15s',
          whiteSpace:           'nowrap',
        } as React.CSSProperties}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.18)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.12)')}
      >
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
          <img src={logoUrl} alt="logo" style={{ width: 28, height: 28, borderRadius: 6 }} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.2px', lineHeight: 1.3 }}>
          <span style={{ color: '#0f172a' }}>Dash</span>
          <span style={{ color: C.accent }}>Builder</span>
        </span>
      </div>

      {/* ── Right pill: links + actions ── */}
      <div style={{
        flex:                 3,
        alignSelf:            'center',
        position:             'relative',
        display:              'flex',
        alignItems:           'center',
        justifyContent:       'flex-end',
        background:           'rgba(255,255,255,0.88)',
        backdropFilter:       'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border:               '1.5px solid rgba(255,255,255,0.92)',
        borderRadius:         '999px',
        padding:              '8px 14px',
        boxShadow:            '0 4px 18px rgba(0,0,0,0.12)',
        pointerEvents:        'auto',
        margin:               '8px 0',
      } as React.CSSProperties}>

        {/* Nav links — centered */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 2 }}>
          {navLinks.map(label => (
            <button key={label} style={{ padding: '8px 18px', background: 'transparent', border: 'none', borderRadius: 20, fontSize: 14, fontWeight: 500, color: '#64748b', cursor: 'pointer', transition: 'color .15s, background .15s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, zIndex: 1 }}>
          <div style={{ width: 1, height: 18, background: '#e2e8f0', margin: '0 4px', flexShrink: 0 }} />

          {/* Language toggle — same globe icon as Navbar */}
          <button
            onClick={toggleLang}
            title={lang === 'en' ? 'عربي' : 'English'}
            style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', borderRadius: '50%', cursor: 'pointer', color: '#64748b', transition: 'background .15s, color .15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = '#0f172a' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </button>

          <div style={{ width: 1, height: 18, background: '#e2e8f0', margin: '0 4px', flexShrink: 0 }} />

          <button onClick={() => nav('/login')} style={{ padding: '8px 14px', background: 'transparent', border: 'none', fontSize: 14, fontWeight: 600, color: '#64748b', cursor: 'pointer', borderRadius: 20, transition: 'color .15s, background .15s', whiteSpace: 'nowrap' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent' }}>
            {t.nav.signin}
          </button>

          <button onClick={() => nav('/login')} style={{ padding: '8px 18px', background: `linear-gradient(135deg,${C.accent},${C.accentD})`, border: 'none', borderRadius: 20, fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer', boxShadow: '0 2px 12px rgba(14,165,233,.3)', transition: 'transform .15s, box-shadow .15s', whiteSpace: 'nowrap' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(14,165,233,.4)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(14,165,233,.3)' }}>
            {t.nav.start}
          </button>
        </div>
      </div>
    </nav>
  )
}

/* ════════════ HERO ═══════════════════════════════════════════ */
function HeroSection({ nav }: { nav: ReturnType<typeof useNavigate> }) {
  const { t } = useLang()
  const h = t.hero
  return (
    <section style={{
      minHeight: '100vh', position: 'relative', overflow: 'hidden',
      background: `linear-gradient(135deg, ${C.dark} 0%, #162032 55%, #0c1a2e 100%)`,
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
    }}>
      {/* Grid background */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(200,212,224,0.12) 1px, transparent 1px)', backgroundSize: '28px 28px', animation: 'lp-grid-fade 5s ease-in-out infinite', pointerEvents: 'none' }} />

      {/* Glow orbs */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,.22) 0%, transparent 70%)', animation: 'lp-glow-orb 8s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '8%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,.18) 0%, transparent 70%)', animation: 'lp-glow-orb 10s ease-in-out infinite 3s', pointerEvents: 'none' }} />

      {/* Content */}
      <div className="lp-hero-inner" style={{ position: 'relative', zIndex: 10, maxWidth: 1280, margin: '0 auto', padding: '120px 48px 80px', display: 'flex', alignItems: 'center', gap: 64, width: '100%', boxSizing: 'border-box' }}>

        {/* Left */}
        <div className="lp-hero-left" style={{ flex: 1, maxWidth: 560 }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(14,165,233,.12)', border: '1px solid rgba(14,165,233,.3)', borderRadius: 100, padding: '6px 14px', marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, animation: 'lp-ping 1.4s ease-out infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: '0.4px' }}>{h.badge}</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 68, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-1.5px', color: '#f1f5f9', margin: '0 0 24px' }}>
            {h.h1a}<br />
            {h.h1b}<br />
            <span style={{ background: `linear-gradient(135deg, ${C.accent} 0%, #38bdf8 50%, #818cf8 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', backgroundSize: '200% 200%', animation: 'lp-gradient-move 4s ease infinite' }}>
              {h.h1c}
            </span>
          </h1>

          {/* Sub */}
          <p style={{ fontSize: 18, lineHeight: 1.75, color: '#94a3b8', margin: '0 0 40px', maxWidth: 480 }}>
            {h.sub}
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button className="lp-btn-primary" onClick={() => nav('/login')} style={{ fontSize: 16, padding: '15px 32px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 3l14 9-14 9V3z" /></svg>
              {h.cta1}
            </button>
            <button className="lp-btn-ghost" style={{ fontSize: 16, padding: '14px 28px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16"/></svg>
              {h.cta2}
            </button>
          </div>

          {/* Trust signals */}
          <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            {[
              { icon: '', text: h.t1 },
              { icon: '', text: h.t2 },
              { icon: '', text: h.t3 },
            ].map(i => (
              <div key={i.text} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14 }}>{i.icon}</span>
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{i.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Animated Dashboard Mockup */}
        <div className="lp-hero-right" style={{ flex: 1, position: 'relative', height: 520, maxWidth: 620 }}>
          {/* Browser chrome */}
          <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.08)', background: '#1e293b' }}>
            {/* Title bar */}
            <div style={{ padding: '12px 16px', background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />)}
              </div>
              <div style={{ flex: 1, height: 22, background: 'rgba(255,255,255,.06)', borderRadius: 6, margin: '0 8px' }} />
              <div style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(255,255,255,.04)' }} />
            </div>

            {/* App toolbar */}
            <div style={{ padding: '8px 14px', background: '#1e293b', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {['Map','Chart','KPI','Table','Filter'].map((t, i) => (
                  <div key={t} style={{ padding: '4px 10px', background: i === 0 ? 'rgba(14,165,233,.18)' : 'transparent', border: i === 0 ? '1px solid rgba(14,165,233,.35)' : '1px solid transparent', borderRadius: 6, fontSize: 10, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? C.accent : '#64748b', cursor: 'pointer' }}>{t}</div>
                ))}
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <div style={{ padding: '4px 12px', background: 'rgba(34,197,94,.15)', border: '1px solid rgba(34,197,94,.3)', borderRadius: 6, fontSize: 10, fontWeight: 700, color: C.green }}>● Live</div>
                <div style={{ padding: '4px 12px', background: `rgba(14,165,233,.15)`, border: `1px solid rgba(14,165,233,.3)`, borderRadius: 6, fontSize: 10, fontWeight: 700, color: C.accent }}>Publish</div>
              </div>
            </div>

            {/* Canvas */}
            <div style={{ position: 'relative', background: '#f1f5f9', height: 400, overflow: 'hidden', backgroundImage: 'radial-gradient(circle, rgba(148,163,184,.3) 1px, transparent 1px)', backgroundSize: '22px 22px' }}>
              {/* Left sidebar */}
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 44, background: 'rgba(255,255,255,0.9)', borderRight: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', gap: 6 }}>
                {[C.accent, '#64748b', '#64748b', '#64748b', '#64748b'].map((c, i) => (
                  <div key={i} style={{ width: 28, height: 28, borderRadius: 7, background: i === 0 ? 'rgba(14,165,233,.12)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, background: c, opacity: i === 0 ? 1 : 0.3 }} />
                  </div>
                ))}
              </div>

              {/* Map widget */}
              <div style={{ position: 'absolute', left: 52, top: 8, width: '50%', height: '52%', background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.9)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 18px rgba(0,0,0,.07)', animation: 'lp-float-a 7s ease-in-out infinite', zIndex: 3 }}>
                <div style={{ padding: '7px 11px', borderBottom: '1px solid rgba(0,0,0,.06)', background: 'rgba(248,250,252,.9)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke={C.accent} strokeWidth="1.6"><circle cx="6" cy="5" r="2.2"/><path d="M6 1C4 1 2 2.7 2 5c0 2.4 4 6 4 6s4-3.6 4-6c0-2.3-2-4-4-4z"/></svg>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#374151' }}>Interactive Map</span>
                  <span style={{ marginLeft: 'auto', fontSize: 9, color: C.green, fontWeight: 700 }}>● Live</span>
                </div>
                <svg width="100%" height="calc(100% - 28px)" viewBox="0 0 260 140" preserveAspectRatio="xMidYMid slice">
                  <rect width="260" height="140" fill="#d8ecd4"/>
                  <ellipse cx="195" cy="42" rx="55" ry="32" fill="#a8c8d8" opacity=".75"/>
                  <ellipse cx="68" cy="78" rx="50" ry="30" fill="#b8d4a0" opacity=".8"/>
                  <ellipse cx="152" cy="108" rx="60" ry="24" fill="#c4d9a8" opacity=".7"/>
                  <path d="M0 70 Q75 58 130 75 Q185 92 260 66" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  <path d="M105 0 Q110 70 108 140" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  <g transform="translate(120,70)"><circle r="7" fill={C.accent} opacity=".25"/><circle r="5" fill={C.accent}/><circle r="2" fill="white"/></g>
                  <g transform="translate(62,68)"><circle r="5.5" fill={C.green} opacity=".25"/><circle r="4" fill={C.green}/><circle r="1.7" fill="white"/></g>
                  <g transform="translate(178,38)"><circle r="5.5" fill={C.amber} opacity=".25"/><circle r="4" fill={C.amber}/><circle r="1.7" fill="white"/></g>
                  <g transform="translate(92,110)"><circle r="5" fill={C.purple} opacity=".25"/><circle r="3.5" fill={C.purple}/><circle r="1.5" fill="white"/></g>
                </svg>
              </div>

              {/* Bar chart widget — drag animated */}
              <div style={{ position: 'absolute', right: 8, top: 8, width: '38%', height: '44%', background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.9)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 18px rgba(0,0,0,.07)', animation: 'lp-drag 24s ease-in-out infinite', zIndex: 4 }}>
                <div style={{ padding: '7px 11px', borderBottom: '1px solid rgba(0,0,0,.06)', background: 'rgba(248,250,252,.9)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke={C.green} strokeWidth="1.6"><rect x="1" y="6" width="2" height="5"/><rect x="5" y="3" width="2" height="8"/><rect x="9" y="1" width="2" height="10"/></svg>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#374151' }}>Analytics</span>
                </div>
                <div style={{ padding: '8px 12px 10px', height: 'calc(100% - 28px)', display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                  {[55,78,48,92,65,88,42,76].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '3px 3px 0 0', background: ['#93c5fd','#6ee7b7','#fcd34d','#93c5fd','#a5b4fc','#6ee7b7','#93c5fd','#fcd34d'][i], animation: `lp-bar ${2.5 + i * 0.2}s ease-in-out infinite ${i * 0.12}s` }} />
                  ))}
                </div>
              </div>

              {/* KPI 1 */}
              <div style={{ position: 'absolute', left: 52, bottom: 56, width: '26%', height: '26%', background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.9)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 18px rgba(0,0,0,.07)', animation: 'lp-float-b 8s ease-in-out infinite 1s', zIndex: 3 }}>
                <div style={{ padding: '12px 14px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Total Events</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#111827', lineHeight: 1 }}>24,891</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ fontSize: 11, color: C.green, fontWeight: 700 }}>↑ 18.2%</span>
                    <span style={{ fontSize: 9, color: '#9ca3af' }}>this month</span>
                  </div>
                </div>
              </div>

              {/* KPI 2 */}
              <div style={{ position: 'absolute', left: '32%', bottom: 56, width: '22%', height: '26%', background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.9)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 18px rgba(0,0,0,.07)', animation: 'lp-float-c 6s ease-in-out infinite .5s', zIndex: 3 }}>
                <div style={{ padding: '12px 14px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Layers</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#111827', lineHeight: 1 }}>48</div>
                  <div style={{ fontSize: 9, color: C.accent, fontWeight: 700 }}>active</div>
                </div>
              </div>

              {/* Table widget */}
              <div style={{ position: 'absolute', right: 8, bottom: 8, width: '38%', height: '34%', background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.9)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 18px rgba(0,0,0,.07)', animation: 'lp-float-a 9s ease-in-out infinite 2s', zIndex: 3 }}>
                <div style={{ padding: '7px 11px', borderBottom: '1px solid rgba(0,0,0,.06)', background: 'rgba(248,250,252,.9)' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#374151' }}>Data Table</span>
                </div>
                {[['Zone A', '1.2M', C.green], ['Zone B', '890K', C.accent], ['Zone C', '670K', C.amber]].map(([z, v, c], i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '5px 11px', borderBottom: i < 2 ? '1px solid rgba(0,0,0,.04)' : 'none', gap: 6 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: c as string }} />
                    <span style={{ flex: 1, fontSize: 10, color: '#374151', fontWeight: 500 }}>{z}</span>
                    <span style={{ fontSize: 10, color: '#6b7280' }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Animated cursor */}
              <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 20, animation: 'lp-cursor 24s ease-in-out infinite' }}>
                <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
                  <path d="M3 2L3 21L7 17L11 26L14 24.5L10 16L17 16Z" fill="white" stroke="#1e293b" strokeWidth="1.6" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div style={{ position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)', background: 'rgba(14,165,233,.12)', border: '1px solid rgba(14,165,233,.3)', borderRadius: 100, padding: '8px 20px', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.accent }}>{h.tagline}</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.5 }}>
        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Scroll</span>
        <div style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, #94a3b8, transparent)' }} />
      </div>
    </section>
  )
}

/* ════════════ STATS ══════════════════════════════════════════ */
function StatsSection() {
  const { t } = useLang()
  const s = t.stats
  const stats = [
    { num: '10,000+', label: s.s1l, color: C.accent },
    { num: '500+',    label: s.s2l, color: C.green  },
    { num: '99.9%',   label: s.s3l, color: C.amber  },
    { num: '< 5 min', label: s.s4l, color: C.purple },
    { num: '40+',     label: s.s5l, color: C.accent },
  ]

  return (
    <section style={{ background: C.white, padding: '60px 48px', borderBottom: '1px solid #f1f5f9' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 36 }}>
            {s.trust}
          </p>
        </Reveal>
        <Reveal delay={100}>
          <div className="lp-stats-row" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 40 }}>
            {stats.map(s => (
              <div key={s.num} className="lp-stat-item" style={{ textAlign: 'center', cursor: 'default' }}>
                <div className="lp-stat-num" style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-1.5px', color: C.txt, lineHeight: 1, transition: 'color .2s' }}>{s.num}</div>
                <div style={{ fontSize: 13, color: C.sub, fontWeight: 600, marginTop: 6 }}>{s.label}</div>
                <div style={{ width: 32, height: 3, background: s.color, borderRadius: 99, margin: '8px auto 0', opacity: 0.7 }} />
              </div>
            ))}
          </div>
        </Reveal>

        {/* Logo placeholders */}
        <Reveal delay={200}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40, marginTop: 48, flexWrap: 'wrap' }}>
            {['CityGov', 'UrbanTech', 'GeoData Pro', 'SmartMaps', 'EcoSystems', 'FlowMetrics'].map(name => (
              <div key={name} style={{ padding: '8px 20px', background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.5px' }}>{name}</div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ════════════ PROBLEM ════════════════════════════════════════ */
function ProblemSection() {
  const { t } = useLang()
  const p = t.problem

  return (
    <section style={{ background: C.dark, padding: '100px 48px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(200,212,224,.07) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>{p.label}</p>
            <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-1px', color: '#f1f5f9', margin: '0 0 20px', lineHeight: 1.1 }}>
              {p.h2.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
            </h2>
            <p style={{ fontSize: 18, color: '#64748b', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
              {p.sub}
            </p>
          </div>
        </Reveal>

        <div className="lp-problem-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {p.cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 80}>
              <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: 28, height: '100%', boxSizing: 'border-box', transition: 'background .2s, border-color .2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,.07)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(239,68,68,.25)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,.04)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,.07)' }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{card.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', margin: '0 0 10px', letterSpacing: '-0.3px' }}>{card.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: 0 }}>{card.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════ SOLUTION ═══════════════════════════════════════ */
function SolutionSection({ nav }: { nav: ReturnType<typeof useNavigate> }) {
  const { t } = useLang()
  const s = t.solution
  const flowColors = [C.accent, C.green, C.purple, C.amber]

  return (
    <section style={{ background: C.light, padding: '100px 48px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 80, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Left content */}
          <div style={{ flex: 1, minWidth: 320 }}>
            <Reveal>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>{s.label}</p>
              <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-1px', color: C.txt, margin: '0 0 20px', lineHeight: 1.1 }}>
                {s.h2a}<br />
                <span style={{ color: C.accent }}>{s.h2b}</span>
              </h2>
              <p style={{ fontSize: 17, color: C.sub, lineHeight: 1.75, marginBottom: 40 }}>{s.sub}</p>
            </Reveal>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {s.points.map((pt, i) => (
                <Reveal key={pt.title} delay={i * 80}>
                  <div style={{ background: C.white, borderRadius: 14, padding: 22, border: '1px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,.04)', transition: 'box-shadow .2s, transform .2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 28px rgba(14,165,233,.12)`; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,.04)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}>
                    <div style={{ fontSize: 24, marginBottom: 10 }}>{pt.icon}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: C.txt, marginBottom: 6 }}>{pt.title}</div>
                    <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.65 }}>{pt.body}</div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={400}>
              <div style={{ marginTop: 36 }}>
                <button className="lp-btn-primary" onClick={() => nav('/login')} style={{ fontSize: 15 }}>
                  {s.cta}
                </button>
              </div>
            </Reveal>
          </div>

          {/* Right — flow diagram */}
          <div style={{ flex: 1, minWidth: 320, position: 'relative' }}>
            <Reveal delay={200}>
              <div style={{ background: C.white, borderRadius: 20, border: '1px solid #e5e7eb', boxShadow: '0 20px 60px rgba(0,0,0,.08)', overflow: 'hidden' }}>
                <div style={{ padding: 32 }}>
                  {s.flow.map((row, i) => (
                    <div key={row.step} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: i < 3 ? 20 : 0 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: flowColors[i], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 13, fontWeight: 900, color: 'white' }}>{row.step}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: C.txt }}>{row.label}</div>
                        <div style={{ fontSize: 12, color: C.sub }}>{row.sub}</div>
                      </div>
                      <div style={{ marginLeft: 'auto' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round"><polyline points="20,6 9,17 4,12"/></svg>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: `linear-gradient(135deg, ${C.accent}10, ${C.green}10)`, borderTop: '1px solid #f0f9ff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.txt }}>{s.timeLabel}</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: C.accent }}>{s.timeValue}</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ════════════ FEATURES ═══════════════════════════════════════ */
const FEATURE_COLORS = [C.accent, C.green, C.purple, C.amber, '#ec4899', C.accent, C.green, C.purple]

function FeaturesSection() {
  const { t } = useLang()
  const f = t.features

  return (
    <section style={{ background: C.white, padding: '100px 48px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>{f.label}</p>
            <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-1px', color: C.txt, margin: '0 0 20px', lineHeight: 1.1 }}>
              {f.h2}
            </h2>
            <p style={{ fontSize: 18, color: C.sub, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              {f.sub}
            </p>
          </div>
        </Reveal>

        <div className="lp-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {f.cards.map((card, i) => {
            const color = FEATURE_COLORS[i]
            return (
              <Reveal key={card.title} delay={i * 60}>
                <div className="lp-feature-card" style={{ background: C.light, border: '1px solid #e5e7eb', borderRadius: 16, padding: 28, transition: 'transform .22s, box-shadow .22s, border-color .22s', cursor: 'default', height: '100%', boxSizing: 'border-box' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = color }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e7eb' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 18 }}>
                    {card.icon}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: C.txt, margin: '0 0 8px', letterSpacing: '-0.2px' }}>{card.title}</h3>
                  <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.7, margin: 0 }}>{card.body}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ════════════ SCREENS ════════════════════════════════════════ */
function ScreensSection() {
  const { t } = useLang()
  const sc = t.screens
  return (
    <section style={{ background: C.dark, padding: '100px 48px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(200,212,224,.06) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, ${C.accentGlow} 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>{sc.label}</p>
            <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-1px', color: '#f1f5f9', margin: '0 0 20px', lineHeight: 1.1 }}>
              {sc.h2}
            </h2>
            <p style={{ fontSize: 18, color: '#64748b', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              {sc.sub}
            </p>
          </div>
        </Reveal>

        <div className="lp-screens-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
          {/* Screen 1: Dashboard Builder */}
          <Reveal delay={0}>
            <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,.08)', boxShadow: '0 24px 64px rgba(0,0,0,.5)', animation: 'lp-float-a 8s ease-in-out infinite' }}>
              <div style={{ background: '#1e293b', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
                <div style={{ flex: 1, height: 16, background: 'rgba(255,255,255,.06)', borderRadius: 4, margin: '0 6px' }} />
              </div>
              <div style={{ background: '#f1f5f9', padding: 12, display: 'flex', gap: 8, flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1, height: 120, background: C.white, borderRadius: 10, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                    <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="xMidYMid slice">
                      <rect width="200" height="100" fill="#d8ecd4"/>
                      <ellipse cx="150" cy="35" rx="45" ry="28" fill="#a8c8d8" opacity=".7"/>
                      <ellipse cx="55" cy="62" rx="40" ry="24" fill="#b8d4a0" opacity=".75"/>
                      <path d="M0 55 Q60 44 100 58 Q140 72 200 48" stroke="white" strokeWidth="2.5" fill="none"/>
                      <g transform="translate(95,55)"><circle r="6" fill={C.accent} opacity=".3"/><circle r="4" fill={C.accent}/><circle r="1.8" fill="white"/></g>
                      <g transform="translate(48,55)"><circle r="5" fill={C.green} opacity=".3"/><circle r="3.5" fill={C.green}/><circle r="1.4" fill="white"/></g>
                    </svg>
                  </div>
                  <div style={{ width: 80, background: C.white, borderRadius: 10, border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', padding: 10, gap: 6 }}>
                    <div style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Total</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: C.txt }}>8,491</div>
                    <div style={{ fontSize: 9, color: C.green, fontWeight: 700 }}>↑ 12%</div>
                  </div>
                </div>
                <div style={{ height: 60, background: C.white, borderRadius: 10, border: '1px solid #e5e7eb', padding: '8px 12px', display: 'flex', alignItems: 'flex-end', gap: 3 }}>
                  {[40,65,50,80,55,75,42,68].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '2px 2px 0 0', background: i % 2 === 0 ? '#93c5fd' : '#6ee7b7' }} />
                  ))}
                </div>
              </div>
              <div style={{ background: '#1e293b', padding: '8px 14px' }}>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{sc.s1}</span>
              </div>
            </div>
          </Reveal>

          {/* Screen 2: Layer Panel (tall center) */}
          <Reveal delay={120}>
            <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.accent}30`, boxShadow: `0 32px 80px rgba(0,0,0,.5), 0 0 0 1px ${C.accent}20`, animation: 'lp-float-b 9s ease-in-out infinite 1s' }}>
              <div style={{ background: '#1e293b', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
                <div style={{ flex: 1, height: 16, background: 'rgba(255,255,255,.06)', borderRadius: 4, margin: '0 6px' }} />
                <div style={{ fontSize: 9, color: C.accent, fontWeight: 700, background: `${C.accent}15`, padding: '2px 8px', borderRadius: 99 }}>● Live</div>
              </div>
              <div style={{ background: '#f1f5f9', padding: 12, display: 'flex', gap: 8 }}>
                {/* Layers panel */}
                <div style={{ width: 110, background: C.white, borderRadius: 10, border: '1px solid #e5e7eb', padding: 10 }}>
                  <div style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 8 }}>Layers</div>
                  {[
                    { name: 'Heatmap', color: '#ef4444', on: true },
                    { name: 'Polygons', color: C.accent, on: true },
                    { name: 'Points', color: C.green, on: true },
                    { name: 'Routes', color: C.amber, on: false },
                    { name: 'Labels', color: C.purple, on: true },
                  ].map(l => (
                    <div key={l.name} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: l.on ? l.color : '#e5e7eb' }} />
                      <span style={{ fontSize: 9, color: l.on ? '#374151' : '#9ca3af', fontWeight: 600, flex: 1 }}>{l.name}</span>
                      <div style={{ width: 22, height: 12, borderRadius: 99, background: l.on ? C.accent : '#e5e7eb', position: 'relative' }}>
                        <div style={{ position: 'absolute', right: l.on ? 2 : undefined, left: l.on ? undefined : 2, top: 2, width: 8, height: 8, borderRadius: '50%', background: 'white' }} />
                      </div>
                    </div>
                  ))}
                </div>
                {/* Map */}
                <div style={{ flex: 1, height: 200, background: C.white, borderRadius: 10, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                  <svg width="100%" height="100%" viewBox="0 0 180 200" preserveAspectRatio="xMidYMid slice">
                    <rect width="180" height="200" fill="#d8ecd4"/>
                    <ellipse cx="130" cy="60" rx="50" ry="38" fill="#a8c8d8" opacity=".7"/>
                    <ellipse cx="45" cy="110" rx="42" ry="32" fill="#b8d4a0" opacity=".75"/>
                    {/* Heatmap-like blur */}
                    <circle cx="90" cy="95" r="45" fill="rgba(239,68,68,.15)"/>
                    <circle cx="90" cy="95" r="28" fill="rgba(239,68,68,.22)"/>
                    <circle cx="90" cy="95" r="15" fill="rgba(239,68,68,.32)"/>
                    <path d="M0 80 Q55 68 90 82 Q125 96 180 72" stroke="white" strokeWidth="2.5" fill="none"/>
                    <path d="M80 0 Q85 100 83 200" stroke="white" strokeWidth="1.8" fill="none" opacity=".6"/>
                    {[{x:88,y:93,c:C.accent},{x:42,y:96,c:C.green},{x:138,y:48,c:C.amber},{x:52,y:148,c:C.purple}].map((p,i)=>(
                      <g key={i} transform={`translate(${p.x},${p.y})`}><circle r="5.5" fill={p.c} opacity=".3"/><circle r="4" fill={p.c}/><circle r="1.6" fill="white"/></g>
                    ))}
                  </svg>
                </div>
              </div>
              <div style={{ background: '#1e293b', padding: '8px 14px' }}>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{sc.s2}</span>
              </div>
            </div>
          </Reveal>

          {/* Screen 3: Analytics */}
          <Reveal delay={240}>
            <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,.08)', boxShadow: '0 24px 64px rgba(0,0,0,.5)', animation: 'lp-float-c 7s ease-in-out infinite .5s' }}>
              <div style={{ background: '#1e293b', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
                <div style={{ flex: 1, height: 16, background: 'rgba(255,255,255,.06)', borderRadius: 4, margin: '0 6px' }} />
              </div>
              <div style={{ background: '#f1f5f9', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* KPI row */}
                <div style={{ display: 'flex', gap: 8 }}>
                  {[{n:'12.4K',l:'Sensors',c:C.accent,t:'+8%'},{n:'98.7%',l:'Uptime',c:C.green,t:'+0.2%'},{n:'4.2s',l:'Response',c:C.amber,t:'-1.1s'}].map(k=>(
                    <div key={k.l} style={{ flex: 1, background: C.white, borderRadius: 10, border: '1px solid #e5e7eb', padding: '8px 10px' }}>
                      <div style={{ fontSize: 8, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>{k.l}</div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: C.txt }}>{k.n}</div>
                      <div style={{ fontSize: 9, color: k.c, fontWeight: 700 }}>{k.t}</div>
                    </div>
                  ))}
                </div>
                {/* Line chart */}
                <div style={{ background: C.white, borderRadius: 10, border: '1px solid #e5e7eb', padding: '8px 10px' }}>
                  <div style={{ fontSize: 8, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Real-time Activity</div>
                  <svg width="100%" height="55" viewBox="0 0 220 55" preserveAspectRatio="none">
                    <defs><linearGradient id="lp-lg-sc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.accent} stopOpacity=".25"/><stop offset="100%" stopColor={C.accent} stopOpacity="0"/></linearGradient></defs>
                    <path d="M0 42 Q28 32 55 36 Q82 40 110 24 Q138 10 165 16 Q193 22 220 8 L220 55 L0 55 Z" fill="url(#lp-lg-sc)"/>
                    <path d="M0 42 Q28 32 55 36 Q82 40 110 24 Q138 10 165 16 Q193 22 220 8" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                {/* Table */}
                <div style={{ background: C.white, borderRadius: 10, border: '1px solid #e5e7eb' }}>
                  {[['District A','342','High'],['District B','218','Med'],['District C','119','Low']].map(([d,n,r],i)=>(
                    <div key={d} style={{ display: 'flex', alignItems: 'center', padding: '6px 10px', borderBottom: i<2?'1px solid #f1f5f9':'none', gap: 6 }}>
                      <span style={{ fontSize: 9, flex: 1, fontWeight: 600, color: '#374151' }}>{d}</span>
                      <span style={{ fontSize: 9, color: '#6b7280' }}>{n}</span>
                      <span style={{ fontSize: 8, padding: '2px 6px', borderRadius: 99, background: r==='High'?'#fef2f2':r==='Med'?'#fefce8':'#f0fdf4', color: r==='High'?'#ef4444':r==='Med'?C.amber:C.green, fontWeight: 700 }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: '#1e293b', padding: '8px 14px' }}>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{sc.s3}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ════════════ USE CASES ══════════════════════════════════════ */
function UseCasesSection() {
  const { t } = useLang()
  const uc = t.useCases
  return (
    <section style={{ background: C.light, padding: '100px 48px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>{uc.label}</p>
            <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-1px', color: C.txt, margin: '0 0 20px', lineHeight: 1.1 }}>{uc.h2}</h2>
            <p style={{ fontSize: 18, color: C.sub, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>{uc.sub}</p>
          </div>
        </Reveal>
        <div className="lp-usecase-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {uc.cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 70}>
              <div className="lp-usecase-card" style={{ background: C.white, border: '1.5px solid #e5e7eb', borderRadius: 16, padding: 28, transition: 'border-color .2s, transform .22s', cursor: 'default' }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{c.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: C.txt, margin: '0 0 10px', letterSpacing: '-0.2px' }}>{c.title}</h3>
                <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.7, margin: 0 }}>{c.body}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>{c.cta}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════ WHY US ═════════════════════════════════════════ */
function WhyUsSection() {
  const { t } = useLang()
  const w = t.whyUs
  return (
    <section style={{ background: `linear-gradient(135deg, ${C.accent} 0%, ${C.accentD} 100%)`, padding: '100px 48px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.08) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.6)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>{w.label}</p>
            <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-1px', color: C.white, margin: '0 0 20px', lineHeight: 1.1 }}>
              {w.h2.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
            </h2>
          </div>
        </Reveal>
        <div className="lp-why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20 }}>
          {w.pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <div style={{ background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 16, padding: 28, backdropFilter: 'blur(8px)', transition: 'background .2s, transform .22s', cursor: 'default' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,.2)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,.12)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}>
                <div style={{ fontSize: 28, marginBottom: 16 }}>{p.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: C.white, margin: '0 0 8px' }}>{p.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', lineHeight: 1.65, margin: 0 }}>{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

const TESTI_COLORS = [C.accent, C.green, C.purple]

/* ════════════ TESTIMONIALS ═══════════════════════════════════ */
function TestimonialsSection() {
  const { t } = useLang()
  const tm = t.testimonials
  return (
    <section style={{ background: C.white, padding: '100px 48px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>{tm.label}</p>
            <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-1px', color: C.txt, margin: 0, lineHeight: 1.1 }}>{tm.h2}</h2>
          </div>
        </Reveal>

        <div className="lp-testi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {tm.cards.map((card, i) => (
            <Reveal key={card.name} delay={i * 100}>
              <div className="lp-testimonial" style={{ background: C.light, border: '1px solid #e5e7eb', borderRadius: 20, padding: 32, transition: 'transform .22s, box-shadow .22s', cursor: 'default', height: '100%', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 20 }}>
                  {[0,1,2,3,4].map(s => <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill={C.amber}><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>)}
                </div>
                <p style={{ fontSize: 15, color: C.txt, lineHeight: 1.75, margin: '0 0 24px', fontStyle: 'italic' }}>"{card.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: TESTI_COLORS[i], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: 'white' }}>{card.avatar}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: C.txt }}>{card.name}</div>
                    <div style={{ fontSize: 12, color: C.sub }}>{card.role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════ PRICING ════════════════════════════════════════ */
function PricingSection({ nav }: { nav: ReturnType<typeof useNavigate> }) {
  const { t } = useLang()
  const pr = t.pricing
  return (
    <section style={{ background: C.light, padding: '100px 48px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>{pr.label}</p>
            <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-1px', color: C.txt, margin: '0 0 20px', lineHeight: 1.1 }}>{pr.h2}</h2>
            <p style={{ fontSize: 18, color: C.sub, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>{pr.sub}</p>
          </div>
        </Reveal>
        <div className="lp-pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'start' }}>
          {pr.plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 100}>
              <div className="lp-pricing-card" style={{
                background: plan.featured ? C.dark : C.white,
                border: plan.featured ? `2px solid ${C.accent}` : '1.5px solid #e5e7eb',
                borderRadius: 20, padding: 32, position: 'relative', overflow: 'hidden',
                boxShadow: plan.featured ? `0 24px 64px rgba(14,165,233,.2)` : '0 4px 16px rgba(0,0,0,.04)',
                transition: 'transform .22s', cursor: 'default',
              }}>
                {plan.featured && (
                  <div style={{ position: 'absolute', top: 16, right: 16, background: C.accent, color: 'white', fontSize: 10, fontWeight: 800, padding: '4px 12px', borderRadius: 99, letterSpacing: '0.5px' }}>
                    {pr.popular}
                  </div>
                )}
                <div style={{ fontSize: 14, fontWeight: 800, color: plan.featured ? '#94a3b8' : C.sub, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-1.5px', color: plan.featured ? '#f1f5f9' : C.txt }}>{plan.price}</span>
                  <span style={{ fontSize: 14, color: plan.featured ? '#64748b' : C.muted, fontWeight: 500 }}>/{plan.period}</span>
                </div>
                <p style={{ fontSize: 13, color: plan.featured ? '#64748b' : C.sub, lineHeight: 1.65, marginBottom: 28 }}>{plan.desc}</p>
                <button
                  className={plan.featured ? 'lp-btn-primary' : ''}
                  onClick={() => nav('/login')}
                  style={plan.featured ? { width: '100%', justifyContent: 'center', marginBottom: 28, fontSize: 14, padding: '12px' } : {
                    width: '100%', padding: '12px', borderRadius: 10, border: '1.5px solid #e5e7eb', background: 'transparent', fontSize: 14, fontWeight: 700, color: C.txt, cursor: 'pointer', marginBottom: 28, transition: 'background .15s',
                  }}
                  onMouseEnter={e => { if (!plan.featured) (e.currentTarget.style.background = C.light) }}
                  onMouseLeave={e => { if (!plan.featured) (e.currentTarget.style.background = 'transparent') }}
                >
                  {plan.cta}
                </button>
                <div style={{ borderTop: `1px solid ${plan.featured ? 'rgba(255,255,255,.08)' : '#f1f5f9'}`, paddingTop: 24 }}>
                  {plan.features.map(feat => (
                    <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round"><polyline points="20,6 9,17 4,12"/></svg>
                      <span style={{ fontSize: 13, color: plan.featured ? '#94a3b8' : C.sub, fontWeight: 500 }}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════ FAQ ════════════════════════════════════════════ */
interface FAQProps { faqOpen: number | null; setFaqOpen: (n: number | null) => void }
function FAQSection({ faqOpen, setFaqOpen }: FAQProps) {
  const { t } = useLang()
  const fq = t.faq
  return (
    <section style={{ background: C.white, padding: '100px 48px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>{fq.label}</p>
            <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-1px', color: C.txt, margin: 0, lineHeight: 1.1 }}>{fq.h2}</h2>
          </div>
        </Reveal>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden' }}>
          {fq.items.map((faq, i) => (
            <Reveal key={i} delay={i * 50}>
              <div className="lp-faq-item">
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  style={{ width: '100%', padding: '22px 24px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, textAlign: 'left' }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: C.txt, lineHeight: 1.4 }}>{faq.q}</span>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: faqOpen === i ? C.accent : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background .2s' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={faqOpen === i ? 'white' : '#6b7280'} strokeWidth="2.5" strokeLinecap="round" style={{ transform: faqOpen === i ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .25s' }}>
                      <polyline points="6,9 12,15 18,9"/>
                    </svg>
                  </div>
                </button>
                {faqOpen === i && (
                  <div style={{ padding: '0 24px 22px' }}>
                    <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.75, margin: 0 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════ FINAL CTA ══════════════════════════════════════ */
function FinalCTA({ nav }: { nav: ReturnType<typeof useNavigate> }) {
  const { t } = useLang()
  const ct = t.cta
  return (
    <section style={{ background: C.dark, padding: '120px 48px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${C.accentGlow} 0%, transparent 65%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(200,212,224,.07) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Reveal>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(14,165,233,.12)', border: '1px solid rgba(14,165,233,.3)', borderRadius: 100, padding: '6px 16px', marginBottom: 32 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.accent }}>{ct.badge}</span>
          </div>
          <h2 style={{ fontSize: 60, fontWeight: 900, letterSpacing: '-1.5px', color: '#f1f5f9', margin: '0 0 24px', lineHeight: 1.05 }}>
            {ct.h2a}<br />
            <span style={{ background: `linear-gradient(135deg, ${C.accent}, #38bdf8)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{ct.h2b}</span>
          </h2>
          <p style={{ fontSize: 18, color: '#64748b', lineHeight: 1.75, marginBottom: 48, maxWidth: 540, margin: '0 auto 48px' }}>
            {ct.sub}
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="lp-btn-primary" onClick={() => nav('/login')} style={{ fontSize: 17, padding: '16px 36px' }}>
              {ct.cta1}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            <button className="lp-btn-ghost" style={{ fontSize: 17, padding: '15px 32px' }}>
              {ct.cta2}
            </button>
          </div>
          <p style={{ fontSize: 13, color: '#475569', marginTop: 28 }}>
            {ct.note}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ════════════ FOOTER ═════════════════════════════════════════ */
function LandingFooter({ nav }: { nav: ReturnType<typeof useNavigate> }) {
  const { t } = useLang()
  const ft = t.footer

  return (
    <footer style={{ background: '#080f1c', padding: '64px 48px 32px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="lp-footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 40, marginBottom: 56 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={logoUrl} alt="logo" style={{ width: 26, height: 26 }} />
              </div>
              <span style={{ fontSize: 15, fontWeight: 800 }}>
                <span style={{ color: '#f1f5f9' }}>Dash</span>
                <span style={{ color: C.accent }}>Builder</span>
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, maxWidth: 240, margin: '0 0 24px' }}>
              {ft.desc}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {['Twitter', 'GitHub', 'LinkedIn'].map(s => (
                <div key={s} style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background .15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.12)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.06)')}>
                  <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>{s[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {ft.cols.map(col => (
            <div key={col.title}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 16px' }}>{col.title}</p>
              {col.links.map(lk => (
                <p key={lk.l} onClick={() => lk.p !== '#' && nav(lk.p)} style={{ fontSize: 13, color: '#475569', margin: '0 0 10px', cursor: 'pointer', transition: 'color .15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>
                  {lk.l}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ fontSize: 12, color: '#334155', margin: 0 }}>{ft.rights}</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {ft.legal.map(label => (
              <span key={label} style={{ fontSize: 12, color: '#334155', cursor: 'pointer', transition: 'color .15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#64748b')}
                onMouseLeave={e => (e.currentTarget.style.color = '#334155')}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default LandingPage
