import type { Locale } from './index';

export const SITE_URL: string =
  import.meta.env.PUBLIC_SITE_URL ??
  import.meta.env.SITE ??
  'https://www.trackora.web.id';

export function landingPath(locale: Locale): string {
  // Trailing slash mengikuti output build (en/index.html) dan URL di sitemap.
  return locale === 'id' ? '/' : `/${locale}/`;
}

export function landingUrl(locale: Locale): string {
  return new URL(landingPath(locale), SITE_URL).toString();
}

export type CardTone = 'overdue' | 'due-soon' | 'plain';

export interface SpineCard {
  readonly startDay: 1 | 2 | 3 | 4 | 5 | 6;
  readonly title: string;
  readonly due: string;
  readonly tone: CardTone;
}

export interface Capability {
  readonly label: string;
  readonly title: string;
  readonly body: string;
}

export interface LandingView {
  readonly id: 'board' | 'due' | 'overdue';
  readonly label: string;
  readonly title: string;
  readonly body: string;
}

export interface LandingPrinciple {
  readonly title: string;
  readonly body: string;
}

export interface LandingCopy {
  readonly htmlLang: string;
  readonly ogLocale: string;
  readonly documentTitle: string;
  readonly metaDescription: string;

  readonly eyebrow: string;
  readonly headline: string;
  readonly lede: string;
  readonly primaryCta: string;
  readonly secondaryCta: string;
  readonly signInCta: string;
  readonly themeLabel: string;
  readonly themeLight: string;
  readonly themeDark: string;
  readonly themeSystem: string;
  readonly weekEyebrow: string;
  readonly dayInitials: readonly string[];
  readonly todayLabel: string;
  readonly spineCards: readonly SpineCard[];
  readonly demoLists: readonly string[];
  readonly doneCardTitle: string;
  readonly doneLabel: string;

  readonly capabilitiesEyebrow: string;
  readonly capabilitiesHeading: string;
  readonly capabilities: readonly Capability[];

  readonly viewsEyebrow: string;
  readonly viewsHeading: string;
  readonly viewsBody: string;
  readonly views: readonly LandingView[];

  readonly principlesEyebrow: string;
  readonly principlesHeading: string;
  readonly principlesBody: string;
  readonly principles: readonly LandingPrinciple[];

  readonly ctaHeading: string;
  readonly ctaBody: string;

  readonly navOverview: string;
  readonly navHow: string;
  readonly navStart: string;
  readonly footerCardTitle: string;

  readonly localeEyebrow: string;
  readonly footerNote: string;
  readonly footerCta: string;
}

const idCopy: LandingCopy = {
  htmlLang: 'id',
  ogLocale: 'id_ID',
  documentTitle: 'Trackora · Papan Kerja Visual & Manajemen Tugas',
  metaDescription:
    'Papan kerja visual yang menyatukan alur kanban fleksibel dengan garis waktu mingguan. Pantau tenggat waktu tanpa tumpukan notifikasi yang bising.',

  eyebrow: 'Papan Kerja Visual',
  headline: 'Semua yang jatuh tempo minggu ini, terpantau jelas sejak Senin.',
  lede: 'Trackora menggabungkan fleksibilitas papan kanban dengan garis waktu mingguan yang tenang. Tanpa notifikasi yang bising, cukup fokus pada apa yang harus diselesaikan.',
  primaryCta: 'Buka papan',
  secondaryCta: 'Buat akun',
  signInCta: 'Masuk',
  themeLabel: 'Tema',
  themeLight: 'Terang',
  themeDark: 'Gelap',
  themeSystem: 'Ikuti sistem',

  weekEyebrow: 'Minggu ini',
  dayInitials: ['S', 'S', 'R', 'K', 'J', 'S', 'M'],
  todayLabel: 'Hari ini',
  spineCards: [
    {
      startDay: 1,
      title: 'Revisi brief klien',
      due: 'Telat 2 hari',
      tone: 'overdue',
    },
    { startDay: 4, title: 'Kirim invoice', due: 'Besok', tone: 'due-soon' },
    { startDay: 6, title: 'Riset kompetitor', due: 'Sabtu', tone: 'plain' },
  ],
  demoLists: ['Belum mulai', 'Sedang jalan', 'Selesai'],
  doneCardTitle: 'Rapikan papan kerja',
  doneLabel: 'Selesai',

  capabilitiesEyebrow: 'Fitur Inti',
  capabilitiesHeading: 'Dirancang untuk fokus kerja nyata, tanpa kerumitan berlebih.',
  capabilities: [
    {
      label: 'Papan Kanban',
      title: 'Daftar alur kerja dinamis',
      body: 'Susun kolom sesuai tahapan kerja Anda, lalu pindahkan kartu antar tahap dengan interaksi yang mulus dan taktil.',
    },
    {
      label: 'Jatuh Tempo',
      title: 'Indikator tenggat visual',
      body: 'Warna kartu berubah otomatis saat mendekati tenggat. Pantau prioritas mendesak seketika tanpa harus membuka satu per satu.',
    },
    {
      label: 'Label & Anggota',
      title: 'Kategori & delegasi jelas',
      body: 'Gunakan label berwarna untuk mengelompokkan urusan, lalu tugaskan rekan kerja agar pembagian tanggung jawab selalu transparan.',
    },
    {
      label: 'Komentar & Lampiran',
      title: 'Konteks tersimpan rapi',
      body: 'Catatan diskusi dan dokumen pendukung tersimpan langsung di kartu terkait, bukan tercecer di grup pesan terpisah.',
    },
  ],

  viewsEyebrow: 'Tiga Sudut Pandang',
  viewsHeading: 'Satu papan, tiga perspektif terarah.',
  viewsBody:
    'Lihat pekerjaan sebagai alur proses menyeluruh, daftar fokus hari ini, atau rangkuman tugas mendesak. Selalu sinkron tanpa duplikasi data.',
  views: [
    {
      id: 'board',
      label: 'Alur Kerja',
      title: 'Kolom berdampingan',
      body: 'Semua daftar terlihat sejajar. Geser kartu seiring kemajuan pekerjaan tanpa kehilangan gambaran besar.',
    },
    {
      id: 'due',
      label: 'Hari Ini',
      title: 'Fokus tenggat hari ini',
      body: 'Saring papan ke kartu yang harus selesai hari ini. Strip garis waktu di atas tetap memperlihatkan hari berikutnya.',
    },
    {
      id: 'overdue',
      label: 'Mendesak',
      title: 'Selesaikan yang tertunda',
      body: 'Semua tugas yang telah lewat tenggat dikumpulkan dalam satu tampilan terfokus agar segera tertangani.',
    },
  ],

  principlesEyebrow: 'Filosofi Desain',
  principlesHeading: 'Papan yang mengikuti ritme kerja, bukan tumpukan interupsi.',
  principlesBody:
    'Trackora dirancang untuk menghadirkan ketenangan kerja. Tanpa algoritma rekomendasi, tanpa umpan berita. Buka papan, tinjau rencana tujuh hari ke depan, lalu eksekusi dengan tenang.',
  principles: [
    {
      title: 'Satu ruang per konteks',
      body: 'Pisahkan urusan pekerjaan, proyek sampingan, dan kebutuhan pribadi dalam ruang kerja yang terdedikasi.',
    },
    {
      title: 'Prioritas tampak seketika',
      body: 'Indikator warna dan garis waktu mingguan langsung memberi tahu apa yang paling mendesak sebelum kartu dibuka.',
    },
    {
      title: 'Ruang kerja tetap bersih',
      body: 'Kartu yang telah selesai tersimpan aman tanpa mengacaukan pandangan tugas yang masih berjalan.',
    },
  ],

  ctaHeading: 'Mulai rapikan alur kerja Anda.',
  ctaBody:
    'Buat papan pertama dalam hitungan detik. Atur kolom, tambahkan tugas, dan rasakan ketenangan kerja yang terstruktur.',

  navOverview: 'Tampilan',
  navHow: 'Cara kerja',
  navStart: 'Mulai',
  footerCardTitle: 'Buat papan pertama',

  localeEyebrow: 'Bahasa',
  footerNote:
    'Trackora · Dirancang untuk produktivitas mandiri yang tenang, terstruktur, dan bebas distraksi.',
  footerCta: 'Buat akun',
};

const enCopy: LandingCopy = {
  htmlLang: 'en',
  ogLocale: 'en_US',
  documentTitle: 'Trackora · Visual Work Board & Task Management',
  metaDescription:
    'A tactile visual work board pairing flexible Kanban with a calm weekly timeline. Track deadlines effortlessly without notification clutter.',

  eyebrow: 'Visual Work Board',
  headline: "What's due this week, crystal clear from day one.",
  lede: 'Trackora pairs tactile Kanban boards with a quiet weekly timeline. Keep track of what matters without the notification noise.',
  primaryCta: 'Open board',
  secondaryCta: 'Create account',
  signInCta: 'Sign in',
  themeLabel: 'Theme',
  themeLight: 'Light',
  themeDark: 'Dark',
  themeSystem: 'System',

  weekEyebrow: 'This week',
  dayInitials: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  todayLabel: 'Today',
  spineCards: [
    {
      startDay: 1,
      title: 'Revise client brief',
      due: '2 days late',
      tone: 'overdue',
    },
    { startDay: 4, title: 'Send invoice', due: 'Tomorrow', tone: 'due-soon' },
    { startDay: 6, title: 'Competitor research', due: 'Saturday', tone: 'plain' },
  ],
  demoLists: ['To Do', 'In Progress', 'Done'],
  doneCardTitle: 'Tidy workspace board',
  doneLabel: 'Done',

  capabilitiesEyebrow: 'Core Capabilities',
  capabilitiesHeading: 'Everything you need to stay organized, nothing you don’t.',
  capabilities: [
    {
      label: 'Kanban Boards',
      title: 'Fluid workflow lists',
      body: 'Shape columns around how you actually work, moving cards smoothly between stages as progress happens.',
    },
    {
      label: 'Due Dates',
      title: 'Visual deadline states',
      body: 'Cards adapt their tone as deadlines approach and turn red when overdue. Spot urgency at a single glance.',
    },
    {
      label: 'Labels & People',
      title: 'Clarity on ownership',
      body: 'Categorize tasks with calibrated color labels and assign team members in one click for transparent ownership.',
    },
    {
      label: 'Comments & Files',
      title: 'Context stays in place',
      body: 'Discussions, links, and file attachments remain anchored directly to the decision itself, not scattered across chat apps.',
    },
  ],

  viewsEyebrow: 'Three Perspectives',
  viewsHeading: 'One board, three focused perspectives.',
  viewsBody:
    'Switch seamlessly between full workflow stages, today’s immediate priorities, and overdue items—all from a single source of truth.',
  views: [
    {
      id: 'board',
      label: 'Workflow',
      title: 'Columns side by side',
      body: 'Every list stays visible. Advance cards as work moves from stage to stage without losing the big picture.',
    },
    {
      id: 'due',
      label: 'Today',
      title: 'Today only',
      body: 'Filter the board down to cards due today. The week strip above keeps upcoming deadlines in steady peripheral view.',
    },
    {
      id: 'overdue',
      label: 'Urgent',
      title: 'Clear what slipped',
      body: 'All overdue cards gather in one view so nothing gets lost at the bottom of an old column.',
    },
  ],

  principlesEyebrow: 'Product Philosophy',
  principlesHeading: 'A workspace aligned with your week, not a firehose of alerts.',
  principlesBody:
    'Trackora is built to be calm. No endless feeds, no intrusive popups. Open your board, survey the seven days ahead, and make steady progress.',
  principles: [
    {
      title: 'One space per context',
      body: 'Keep client work, personal goals, and side projects cleanly separated without losing your place.',
    },
    {
      title: 'Deadlines come first',
      body: 'Tone shifts and the weekly strip show what is urgent before you even open a card.',
    },
    {
      title: 'Keep the workspace clean',
      body: 'Completed cards stay logged for reference without cluttering the tasks that are still active.',
    },
  ],

  ctaHeading: 'Bring calm to your workflow.',
  ctaBody:
    'Create your first board in seconds. Arrange your lists, add your active tasks, and work with confidence.',

  navOverview: 'Views',
  navHow: 'How it works',
  navStart: 'Get started',
  footerCardTitle: 'Create your first board',

  localeEyebrow: 'Language',
  footerNote:
    'Trackora · Crafted for focused, distraction-free personal productivity.',
  footerCta: 'Create account',
};

const zhCopy: LandingCopy = {
  htmlLang: 'zh-CN',
  ogLocale: 'zh_CN',
  documentTitle: 'Trackora · 个人视觉工作看板与任务管理',
  metaDescription:
    '将直观敏捷的看板与清晰的每周时间轴相结合的个人工作空间。掌控任务节奏，远离繁杂通知。',

  eyebrow: '视觉工作看板',
  headline: '本周的每项要务，从周一起便清晰在目。',
  lede: 'Trackora 将直观的看板流程与宁静的每周时间轴相结合。告别冗杂的提醒与清单，专心做好当下。',
  primaryCta: '进入看板',
  secondaryCta: '注册账号',
  signInCta: '登录',
  themeLabel: '主题',
  themeLight: '浅色',
  themeDark: '深色',
  themeSystem: '跟随系统',

  weekEyebrow: '本周要务',
  dayInitials: ['一', '二', '三', '四', '五', '六', '日'],
  todayLabel: '今天',
  spineCards: [
    { startDay: 1, title: '修改客户方案', due: '逾期 2 天', tone: 'overdue' },
    { startDay: 4, title: '开具发票', due: '明天', tone: 'due-soon' },
    { startDay: 6, title: '竞品调研分析', due: '周六', tone: 'plain' },
  ],
  demoLists: ['待办', '进行中', '已完成'],
  doneCardTitle: '整理工作看板',
  doneLabel: '完成',

  capabilitiesEyebrow: '核心能力',
  capabilitiesHeading: '专注真正重要的事，精简、顺手而高效。',
  capabilities: [
    {
      label: '敏捷看板',
      title: '顺手流转的任务列',
      body: '根据实际工作节奏自由编排流程阶段，随着任务推进轻松将卡片平滑拖拽。',
    },
    {
      label: '到期预警',
      title: '一目了然的时间色彩',
      body: '临近截止时卡片自动呈现琥珀色预警，逾期后转为醒目红色，无需逐个点开确认。',
    },
    {
      label: '标签与协作',
      title: '分类与责任明确可见',
      body: '运用协调色彩标签快速归类事务，一键指派协作成员，任务分工井然有序。',
    },
    {
      label: '讨论与附件',
      title: '上下文紧贴任务卡片',
      body: '讨论记录与重要文档直接附在任务内部，无需在零散的聊天应用中翻找记录。',
    },
  ],

  viewsEyebrow: '三种专注视角',
  viewsHeading: '同一块看板，三种清晰读法。',
  viewsBody:
    '在完整流程、今日重点与逾期清理之间自由切换，所有状态统一同步，告别重复整理。',
  views: [
    {
      id: 'board',
      label: '完整工作流',
      title: '任务列并排可见',
      body: '所有清单同时呈现，伴随工作推进流转卡片，全局脉络始终一清二楚。',
    },
    {
      id: 'due',
      label: '今日优先',
      title: '专注今日到期事务',
      body: '一键筛选出今日必须完成的卡片，上方时间条依然守候后续节奏。',
    },
    {
      id: 'overdue',
      label: '紧急清理',
      title: '优先处理逾期事项',
      body: '集中展现所有逾期任务，避免重要事项遗落在旧清单角落。',
    },
  ],

  principlesEyebrow: '设计哲学',
  principlesHeading: '遵循一周的工作节奏，而非被通知洪流绑架。',
  principlesBody:
    'Trackora 坚持克制与宁静。没有无谓的信息流，没有打扰思绪的弹窗。开启看板，审视未来七天，从容迈出每一步。',
  principles: [
    {
      title: '独立场景隔离',
      body: '工作业务、个人生活与副业项目分别管理，切换看板时思路依然清晰。',
    },
    {
      title: '轻重缓急先见',
      body: '直观色彩与时间条在点开卡片前即刻告知轻重缓急，优先处理关键项。',
    },
    {
      title: '工作区始终如新',
      body: '完成的任务稳妥归档，不再挤占正在进行的事项视线。',
    },
  ],

  ctaHeading: '开启井然有序的工作节奏。',
  ctaBody: '数秒内建立你的第一块看板，自由编排清单与任务，感受专注带来的从容。',

  navOverview: '视图',
  navHow: '工作方式',
  navStart: '开始使用',
  footerCardTitle: '建立第一块看板',

  localeEyebrow: '语言',
  footerNote:
    'Trackora · 专为沉浸专注、井然有序的个人工作而打造。',
  footerCta: '注册账号',
};

export const LANDING_COPY: Record<Locale, LandingCopy> = {
  id: idCopy,
  en: enCopy,
  zh: zhCopy,
};
