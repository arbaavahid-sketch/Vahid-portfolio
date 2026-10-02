import type { Dict } from "./index";

/** Laboratory Dashboard — interface copy only. Names live with the data. */
export const laboratory = {
  // --------------------------------------------------------------- navigation
  labNavOverview: { fa: "نمای کلی", en: "Overview" },
  labNavSamples: { fa: "نمونه‌ها", en: "Samples" },
  labNavInstruments: { fa: "دستگاه‌ها", en: "Instruments" },
  labNavQc: { fa: "کنترل کیفیت", en: "Quality control" },
  labNavTurnaround: { fa: "زمان پاسخ", en: "Turnaround" },

  // ----------------------------------------------------------------- overview
  labOverviewTitle: { fa: "نمای کلی", en: "Overview" },
  labOverviewSub: {
    fa: "آزمایشگاه امروز صبح کجا ایستاده، و اگر کسی کاری نکند چه چیزی خراب می‌شود.",
    en: "Where the bench stands this morning, and what will go wrong if nobody acts.",
  },
  labKpiMedianTat: { fa: "میانهٔ زمان پاسخ امروز", en: "Median turnaround today" },
  labKpiVs30dMedian: { fa: "نسبت به میانهٔ ۳۰ روز", en: "vs 30-day median" },
  labKpiCommitmentIs: { fa: "تعهد {v} است.", en: "Commitment is {v}." },
  labKpiOnTime: { fa: "تحویل به‌موقع امروز", en: "On-time delivery today" },
  labKpiVs30dAvg: { fa: "نسبت به میانگین ۳۰ روز", en: "vs 30-day average" },
  labKpiReportsIssued: { fa: "{v} گزارش صادر شد.", en: "{v} reports issued." },
  labKpiInstruments: { fa: "دستگاه‌های در سرویس", en: "Instruments operational" },
  labKpiOf: { fa: "از {v}", en: "of {v}" },
  labKpiMeanUptime: { fa: "میانگین در دسترس بودن، ۳۰ روز", en: "mean uptime, 30 days" },
  labKpiCalDue: {
    fa: "{a} کالیبراسیون ظرف ۷ روز، {b} منقضی.",
    en: "{a} calibrations due within 7 days, {b} lapsed.",
  },
  labKpiQcPass: { fa: "نرخ قبولی کنترل کیفیت", en: "QC pass rate" },
  labKpiRejected: { fa: "{v} رد شده", en: "{v} rejected" },
  labKpiOfRuns: { fa: "از {v} ران کنترل", en: "of {v} control runs" },
  labKpiLast30All: {
    fa: "۳۰ روز گذشته، همهٔ دپارتمان‌ها.",
    en: "Last 30 days, all departments.",
  },

  labTatCardTitle: {
    fa: "میانهٔ زمان پاسخ در برابر تعهد",
    en: "Median turnaround against the commitment",
  },
  labTatCardSub: {
    fa: "ساعت از ثبت نمونه تا صدور گزارش، ۳۰ روز گذشته",
    en: "Hours from sample login to report issue, last 30 days",
  },
  labTatNote: {
    fa: "میانه در {date} به {peak} رسید، بعد از آنکه دستگاه نقطهٔ اشتعال از کار افتاد. انتقال آن کار به FP-02 دوباره آن را زیر تعهد آورد و از {since} هر روز زیر تعهد مانده است.",
    en: "The median peaked at {peak} on {date}, after the flash point tester went down. Routing that work to FP-02 pulled it back under the commitment, and it has stayed under on every day since {since}.",
  },
  labTatTableCaption: {
    fa: "میانهٔ زمان پاسخ هر روز، ۳۰ روز گذشته",
    en: "Median turnaround time per day, last 30 days",
  },
  labColDate: { fa: "تاریخ", en: "Date" },
  labColMedianTat: { fa: "میانهٔ زمان پاسخ", en: "Median TAT" },
  labColReports: { fa: "گزارش‌ها", en: "Reports" },
  labColOnTime: { fa: "به‌موقع", en: "On time" },

  labBacklogTitle: { fa: "نمونه‌های داخل آزمایشگاه", en: "Samples in the lab" },
  labBacklogSub: { fa: "صف زنده بر اساس مرحله", en: "Live backlog by custody stage" },
  labBacklogHero: {
    fa: "نمونهٔ فعال، {v} تای آن متوقف",
    en: "active samples, {v} of them on hold",
  },
  labBacklogNote: {
    fa: "تا این ساعت {a} نمونه ثبت شده در برابر {b} گزارش صادرشده، پس دفتر هنوز در حال رشد است.",
    en: "{a} registered so far today against {b} reports issued, so the book is still growing at this hour.",
  },

  labIntakeTitle: { fa: "ورودی در برابر خروجی", en: "Intake against output" },
  labIntakeSub: {
    fa: "نمونه‌های ثبت‌شده و گزارش‌های صادرشده، ۳۰ روز گذشته",
    en: "Samples registered and reports issued, last 30 days",
  },
  labRegistered: { fa: "ثبت‌شده", en: "Registered" },
  labReported: { fa: "گزارش‌شده", en: "Reported" },
  labIntakeNote: {
    fa: "{a} ثبت در برابر {b} گزارش در این دوره — خروجی دارد ورودی را دنبال می‌کند، پس صف ثابت است نه در حال انباشت.",
    en: "{a} registered against {b} reported over the period — output is tracking intake, so the backlog is steady rather than accumulating.",
  },

  labWorkloadTitle: { fa: "بار کاری فعال هر دپارتمان", en: "Active workload by department" },
  labWorkloadSub: { fa: "{v} نمونه هم‌اکنون روی میز", en: "{v} samples currently on the bench" },
  labWorkloadNote: {
    fa: "{dept} با {n} نمونه بیشترین سهم را دارد — پنل فلزات سایشی روی ICP-01 پرحجم‌ترین روش آزمایشگاه است.",
    en: "{dept} is carrying the largest share at {n} samples — the wear-metals panel on ICP-01 is the lab's highest-volume method.",
  },
  labColDept: { fa: "دپارتمان", en: "Department" },
  labColActiveSamples: { fa: "نمونهٔ فعال", en: "Active samples" },
  labSamplesUnit: { fa: "نمونه", en: "samples" },
  labWorkloadAria: {
    fa: "سهم هر دپارتمان از نمونه‌های فعال.",
    en: "Share of active samples held by each department.",
  },

  labMethodTitle: { fa: "زمان پاسخ به تفکیک روش", en: "Turnaround by method" },
  labMethodSub: {
    fa: "سهم مصرف‌شده از تعهد قراردادی توسط میانه، ۳۰ روز گذشته",
    en: "Share of the contractual target consumed by the median, last 30 days",
  },
  labMethodsOver: { fa: "{a} روش از {b} فراتر از هدف", en: "{a} of {b} methods over target" },
  labMethodNote: {
    fa: "شش روشی که بیشترین فشار را دارند، مرتب‌شده بر اساس نزدیکی میانه به هدف خودشان. فقط نقطهٔ اشتعال فراتر رفته — {a} در برابر {b} — و همان روشی است که FP-01 رویش از کار افتاد.",
    en: "The six methods under the most pressure, ranked by how close the median sits to its own target. Only flash point is over — {a} against {b} — and it is the method FP-01 went down on.",
  },

  // ------------------------------------------------------------------ samples
  labSamplesTitle: { fa: "نمونه‌ها", en: "Samples" },
  labSamplesSub: {
    fa: "زنجیرهٔ نگهداری از ثبت تا گزارش، و اینکه کدام کار دارد از هدفش می‌گذرد.",
    en: "Custody from login to report, and which jobs are running out of their target.",
  },
  labKpiActive: { fa: "نمونهٔ فعال", en: "Active samples" },
  labKpiActiveHint: {
    fa: "هر چه ثبت شده و هنوز گزارش نشده.",
    en: "Everything logged in and not yet reported.",
  },
  labKpiUnderTest: { fa: "در حال آزمون", en: "Under test" },
  labKpiOfActiveBook: { fa: "از دفتر فعال", en: "of the active book" },
  labKpiOnBenchNow: { fa: "همین حالا روی میز.", en: "On the bench right now." },
  labKpiOnHold: { fa: "متوقف", en: "On hold" },
  labKpiOnHoldHint: {
    fa: "منتظر مشتری، نه منتظر آزمایشگاه.",
    en: "Waiting on the client, not on the lab.",
  },
  labKpiRegisteredToday: { fa: "ثبت‌شدهٔ امروز", en: "Registered today" },
  labKpiReportedSoFar: { fa: "{v} گزارش‌شده", en: "{v} reported" },
  labKpiSoFarToday: { fa: "تا این ساعت امروز", en: "so far today" },
  labKpiIntakeOpen: {
    fa: "ورودی در این ساعت هنوز باز است.",
    en: "Intake is still open at this hour.",
  },

  labPipelineTitle: { fa: "دفتر کجا ایستاده", en: "Where the book sits" },
  labPipelineSub: { fa: "نمونه‌های فعال بر اساس مرحله", en: "Active samples by custody stage" },
  labPipelineNote: {
    fa: "{v} نمونهٔ دیگر متوقف‌اند و بیرون از این خط لوله می‌نشینند — ساعت آن‌ها دست مشتری است نه آزمایشگاه، پس جدا گزارش می‌شوند.",
    en: "{v} further samples are on hold and sit outside this pipeline — the clock on those is the client's, not the lab's, so they are reported separately.",
  },
  labColStage: { fa: "مرحله", en: "Stage" },
  labCarryTitle: { fa: "چه کسی آن را می‌برد", en: "Who is carrying it" },
  labCarrySub: {
    fa: "{v} نمونهٔ فعال در پنج دپارتمان",
    en: "{v} active samples across five departments",
  },
  labCarryNote: {
    fa: "رنگ هر دپارتمان در تمام صفحه‌های این داشبورد ثابت است — فیلتر کردن یکی هرگز بقیه را دوباره رنگ نمی‌کند، پس خواننده‌ای که یک رنگ را یاد گرفته آن را نگه می‌دارد.",
    en: "Colour is fixed per department across every page of this dashboard — filtering one out never repaints the others, so a reader who has learned a colour keeps it.",
  },
  labRegisterTitle: { fa: "دفتر نمونه", en: "Sample register" },
  labRegisterSub: { fa: "۱۸ ثبت اخیر", en: "The 18 most recent registrations" },
  labPast85: { fa: "{v} فراتر از ۸۵٪ هدف", en: "{v} past 85% of target" },
  labRegisterNote: {
    fa: "نوار هر ردیف، زمان سپری‌شده در برابر هدف خودِ آن نمونه است، پس یک کار بحرانی ۲۴ ساعته و یک کار میکروبیولوژی ۱۲۰ ساعته روی یک مقیاس خوانده می‌شوند. از ۸۵٪ هدف کهربایی، و پس از مصرف کامل قرمز.",
    en: "The bar in each row is elapsed time against that sample's own target, so a 24-hour critical job and a 120-hour microbiology job are read on the same scale. Amber from 85% of the target, red once it is spent.",
  },
  labColSample: { fa: "نمونه", en: "Sample" },
  labColClient: { fa: "مشتری", en: "Client" },
  labColMatrix: { fa: "ماتریس", en: "Matrix" },
  labColTests: { fa: "آزمون", en: "Tests" },
  labColElapsed: { fa: "سپری‌شده از هدف", en: "Elapsed vs target" },
  labColDue: { fa: "سررسید", en: "Due" },
  labColAnalyst: { fa: "کارشناس", en: "Analyst" },
  labRegisterCaption: {
    fa: "ثبت‌های اخیر نمونه، با وضعیت نگهداری و زمان سپری‌شده در برابر هدف هر نمونه.",
    en: "Most recent sample registrations, with custody status and elapsed time against each sample's turnaround target.",
  },
  labSearchPlaceholder: {
    fa: "نمونه، مشتری یا کارشناس",
    en: "Sample, client or analyst",
  },
  labActiveOnly: { fa: "فقط فعال", en: "Active only" },
  labPctOfTargetElapsed: { fa: "{v} از هدف سپری شده", en: "{v} of the target elapsed" },

  // -------------------------------------------------------------- instruments
  labInstrumentsTitle: { fa: "دستگاه‌ها", en: "Instruments" },
  labInstrumentsSub: {
    fa: "چه چیزی کار می‌کند، چه چیزی کالیبره است، و آزمایشگاه روی چه چیزی بیش از حد تکیه کرده.",
    en: "What is running, what is calibrated, and what the lab is leaning on too hard.",
  },
  labKpiOperational: { fa: "در سرویس", en: "Operational" },
  labKpiOffBench: { fa: "{v} خارج از میز: {ids}.", en: "{v} off the bench: {ids}." },
  labKpiMeanUptimeLabel: { fa: "میانگین در دسترس بودن", en: "Mean uptime" },
  labKpiAcrossAll: {
    fa: "در همهٔ دستگاه‌ها، ۳۰ روز گذشته.",
    en: "Across all instruments, last 30 days.",
  },
  labKpiCalibrationsDue: { fa: "کالیبراسیون سررسید", en: "Calibrations due" },
  labKpiIn7Days: { fa: "ظرف ۷ روز", en: "in 7 days" },
  labKpiLapsed: { fa: "{v} منقضی", en: "{v} lapsed" },
  labKpiAlreadyPastDue: { fa: "از سررسید گذشته", en: "already past due" },
  labKpiHighestUtil: { fa: "بیشترین بهره‌برداری", en: "Highest utilisation" },

  labCalTitle: { fa: "برنامهٔ کالیبراسیون", en: "Calibration schedule" },
  labCalSub: {
    fa: "سررسید بعدی هر دستگاه، نزدیک‌ترین اول",
    en: "Next due date per instrument, soonest first",
  },
  labAsAt: { fa: "تا تاریخ {v}", en: "as at {v}" },
  labCalNote: {
    fa: "کالیبراسیون FP-01 در {v} منقضی شد، ولی دستگاه در هر صورت خارج از سرویس است — گلوگاه قطعه است نه کالیبراسیون. BAL-01 یک کنترل هفتگی داخلی با وزنه‌های E2 است نه کالیبراسیون بیرونی، و برای همین این‌قدر تکرار می‌شود.",
    en: "FP-01's calibration lapsed on {v}, but it is out of service anyway — the part is the blocker, not the calibration. BAL-01 is a weekly in-house check against E2 weights, not an external calibration, which is why it recurs so often.",
  },
  labDaysOverdue: { fa: "{v} روز تأخیر", en: "{v} days overdue" },
  labDueToday: { fa: "امروز سررسید", en: "Due today" },
  labInDays: { fa: "{v} روز دیگر", en: "in {v} days" },
  labColInstrument: { fa: "دستگاه", en: "Instrument" },
  labColModel: { fa: "مدل", en: "Model" },
  labColLastCal: { fa: "آخرین کالیبراسیون", en: "Last calibrated" },
  labColNextCal: { fa: "سررسید بعدی", en: "Next due" },
  labColDays: { fa: "روز", en: "Days" },
  labCalTableCaption: {
    fa: "برنامهٔ کالیبراسیون همهٔ دستگاه‌ها",
    en: "Calibration schedule for every instrument",
  },

  labUtilTitle: { fa: "بهره‌برداری", en: "Utilisation" },
  labUtilSub: {
    fa: "سهم رزروشدهٔ ساعات شیفت در دسترس، ۳۰ روز گذشته",
    en: "Share of available shift hours booked, last 30 days",
  },
  labUtilCeiling: { fa: "سقف عملی ۹۰٪", en: "90% practical ceiling" },
  labUtilAria: {
    fa: "بهره‌برداری هر دستگاه در ۳۰ روز گذشته، به‌عنوان سهمی از ساعات شیفت در دسترس.",
    en: "Utilisation per instrument over the last 30 days, as a share of available shift hours.",
  },
  labUtilNote: {
    fa: "FP-02 و BAL-01 هر دو بالای ۹۵٪اند — دستگاهی در آن سطح هیچ حاشیه‌ای برای خرابی ندارد، و FP-02 فقط به این دلیل آنجاست که کار FP-01 را جذب کرده. دستگاه‌های خارج از سرویس کنار گذاشته شده‌اند نه اینکه صفر کشیده شوند، چون صفر یعنی بیکار.",
    en: "FP-02 and BAL-01 are both above 95% — an instrument at that level has no slack for a breakdown, and FP-02 is only there because it absorbed FP-01's work. Out-of-service instruments are left out rather than drawn at zero, which would read as idle.",
  },
  labColUtil: { fa: "بهره‌برداری", en: "Utilisation" },
  labColUptime: { fa: "در دسترس بودن", en: "Uptime" },
  labUtilTableCaption: {
    fa: "بهره‌برداری و در دسترس بودن هر دستگاه",
    en: "Utilisation and uptime per instrument",
  },
  labUtilMeasure: { fa: "بهره‌برداری", en: "utilisation" },

  labFleetTitle: { fa: "ناوگان", en: "The fleet" },
  labFleetSub: {
    fa: "{v} دستگاه در پنج دپارتمان",
    en: "{v} instruments across five departments",
  },
  labCalLapsedBadge: { fa: "کالیبراسیون منقضی", en: "Calibration lapsed" },
  labCalDueBadge: { fa: "کالیبراسیون {v} روز دیگر", en: "Calibration due in {v} d" },

  // ---------------------------------------------------------- quality control
  labQcTitle: { fa: "کنترل کیفیت", en: "Quality control" },
  labQcSub: {
    fa: "اینکه آیا می‌شود از اعدادی که از این آزمایشگاه بیرون می‌رود دفاع کرد.",
    en: "Whether the numbers leaving this lab can be defended.",
  },
  labQcPassRate: { fa: "نرخ قبولی", en: "Pass rate" },
  labQcPassHint: {
    fa: "{a} از {b} ران کنترل، ۳۰ روز گذشته.",
    en: "{a} of {b} control runs, last 30 days.",
  },
  labQcWarnings: { fa: "هشدارها", en: "Warnings" },
  labQcWarningsHint: {
    fa: "پرچم‌های 1₂s — بررسی شد، رد نشد.",
    en: "1₂s flags — inspected, not rejected.",
  },
  labQcRejections: { fa: "رد شده‌ها", en: "Rejections" },
  labQcOfAllRuns: { fa: "از همهٔ ران‌ها", en: "of all runs" },
  labQcRejectHint: {
    fa: "بچ‌هایی که پیش از انتشار هر نتیجه تکرار شدند.",
    en: "Batches repeated before any result was released.",
  },
  labQcCv: { fa: "ضریب تغییرات", en: "Coefficient of variation" },
  labQcCvHint: {
    fa: "مشاهده‌شده روی {control} در {n} ران.",
    en: "Observed on {control} over {n} runs.",
  },

  labQcChartTitle: { fa: "نمودار کنترل", en: "Control chart" },
  qcMean: { fa: "میانگین", en: "Mean" },
  qcRun: { fa: "ران", en: "Run" },
  qcFromMean: { fa: "از میانگین", en: "from the mean" },
  qcChartAria: {
    fa: "نمودار کنترل لوی-جنینگز: {n} نتیجهٔ کنترل در برابر میانگین {mean} {unit} و انحراف معیار {sd}.",
    en: "Levey-Jennings control chart: {n} control results against a mean of {mean} {unit} and a standard deviation of {sd}.",
  },
  labQcInControl: { fa: "تحت کنترل", en: "In control" },
  labQcWarnInspect: { fa: "هشدار — بررسی شود", en: "Warning — inspect" },
  labQcRejected: { fa: "رد شد — بچ تکرار شد", en: "Rejected — batch repeated" },
  labQcChartNote: {
    fa: "میانگین و انحراف معیار همان‌هایی‌اند که در دورهٔ تعیین مشخصات {n} رانی ثابت شدند، نه محاسبه‌شده از نقاط روی صفحه — نمودار کنترلی که روی دادهٔ خودش دوباره مرکزگیری کند نمی‌تواند جابه‌جایی را تشخیص دهد. پراکندگی مشاهده‌شده در این {p} ران {sd} در برابر {csd} تعیین‌شده است.",
    en: "The mean and SD are the ones fixed during the {n}-run characterisation period, not recalculated from the points on screen — a control chart that re-centres on its own data cannot detect a shift. Observed scatter over these {p} runs is {sd} against a characterised {csd}.",
  },
  labQcTableCaption: {
    fa: "هر نتیجهٔ کنترل روی این نمودار، با فاصله‌اش از میانگین",
    en: "Every control result on this chart, with its distance from the mean",
  },
  labColRun: { fa: "ران", en: "Run" },
  labColResult: { fa: "نتیجه ({v})", en: "Result ({v})" },
  labColFromMean: { fa: "از میانگین", en: "From mean" },
  labColRule: { fa: "قاعده", en: "Rule" },

  labFlaggedTitle: { fa: "ران‌های پرچم‌خورده", en: "Flagged runs" },
  labFlaggedSub: {
    fa: "چه چیزی فعال شد، و چه کاری درباره‌اش انجام شد",
    en: "What tripped, and what was done about it",
  },
  labFlagRejected: { fa: "رد شد", en: "Rejected" },
  labFlagWarning: { fa: "هشدار", en: "Warning" },
  labFlagRead: {
    fa: "{v} خوانده شد — {z} انحراف معیار {dir} میانگین.",
    en: "Read {v} — {z} SD {dir} the mean.",
  },
  labAbove: { fa: "بالای", en: "above" },
  labBelow: { fa: "زیر", en: "below" },
  labFlaggedNote: {
    fa: "ران ۱۳ تنها رد شدن روی این کنترل بود. نبولایزر تعویض شد، بچ تکرار شد و ران ۱۴ با {v} برگشت — هیچ نتیجهٔ مشتری از بچ ردشده منتشر نشد.",
    en: "Run 13 was the only rejection on this control. The nebuliser was replaced, the batch repeated, and run 14 came back at {v} — no client result was released from the rejected batch.",
  },

  labWestgardTitle: { fa: "قواعد وستگارد در اجرا", en: "Westgard rules in force" },
  labWestgardSub: {
    fa: "مجموعهٔ چندقاعده‌ای که این کنترل با آن ارزیابی می‌شود",
    en: "The multirule set this control is evaluated against",
  },
  labReject: { fa: "رد", en: "Reject" },
  labWarn: { fa: "هشدار", en: "Warn" },

  labQcDeptTitle: { fa: "ران‌های کنترل به تفکیک دپارتمان", en: "Control runs by department" },
  labQcDeptSub: {
    fa: "۳۰ روز گذشته — قبولی، هشدار و رد شدن هر دپارتمان",
    en: "Last 30 days — pass, warning and rejection per department",
  },
  labQcDeptAria: {
    fa: "{dept}: {p} قبول، {w} هشدار، {r} رد از {n} ران.",
    en: "{dept}: {p} passed, {w} warnings, {r} rejected out of {n} runs.",
  },
  labQcPassWord: { fa: "قبولی", en: "pass" },
  labQcRunsWord: { fa: "{v} ران", en: "{v} runs" },
  labQcDeptLine: {
    fa: "{p} قبول · {w} هشدار · {r} رد",
    en: "{p} passed · {w} warnings · {r} rejected",
  },
  labQcDeptNote: {
    fa: "این نوارها از رنگ‌های رزروشدهٔ وضعیت استفاده می‌کنند، نه رنگ دپارتمان‌ها که جای دیگر به کار رفته — اینجا رنگ یعنی قبول، هشدار یا رد، و هر بخش زیرش به حروف هم نوشته شده.",
    en: "These bars use the reserved status colours, not the department colours used elsewhere — here the colour means good, warning or rejected, and every segment is also written out in words beneath.",
  },
  labColRuns: { fa: "ران", en: "Runs" },
  labColPassed: { fa: "قبول", en: "Passed" },
  labColWarnings: { fa: "هشدار", en: "Warnings" },
  labColRejectedCol: { fa: "رد", en: "Rejected" },
  labColPassRate: { fa: "نرخ قبولی", en: "Pass rate" },
  labQcDeptTableCaption: {
    fa: "ران‌های کنترل، هشدارها و رد شدن‌ها به تفکیک دپارتمان",
    en: "Control runs, warnings and rejections per department",
  },

  // --------------------------------------------------------------- turnaround
  labTurnaroundTitle: { fa: "زمان پاسخ", en: "Turnaround" },
  labTurnaroundSub: {
    fa: "زمان از ثبت نمونه تا گزارش صادرشده، در برابر آنچه آزمایشگاه قول داده.",
    en: "Time from sample login to issued report, against what the lab has promised.",
  },
  labKpiMedianTat30: { fa: "میانهٔ زمان پاسخ", en: "Median turnaround" },
  labAgainstCommitment: { fa: "در برابر تعهد", en: "against the commitment" },
  labAcross30Days: { fa: "در ۳۰ روز گذشته.", en: "Across the last 30 days." },
  labKpiOnTime30: { fa: "تحویل به‌موقع", en: "On-time delivery" },
  labAgainstGoal: { fa: "در برابر هدف {v}", en: "against a {v} goal" },
  labKpiDaysWithin: { fa: "روزهای داخل هدف", en: "Days within target" },
  labDaysWithinHint: {
    fa: "{a} از {b} روز در یا زیر {c}.",
    en: "{a} of {b} days at or under {c}.",
  },
  labKpiMethodsOver: { fa: "روش‌های فراتر از هدف", en: "Methods over target" },
  labIsTheWorst: { fa: "بدترین است", en: "is the worst" },

  labTatOnlyTitle: { fa: "میانهٔ زمان پاسخ", en: "Median turnaround" },
  labTatOnlySub: {
    fa: "ساعت از ثبت تا گزارش، در برابر تعهد {v}",
    en: "Hours from login to report, against a {v} commitment",
  },
  labUnderSince: {
    fa: "از {v} هر روز زیر تعهد.",
    en: "Under the commitment on every day since {v}.",
  },
  labOnTimeTitle: { fa: "تحویل به‌موقع", en: "On-time delivery" },
  labOnTimeSub: {
    fa: "سهم گزارش‌هایی که تا تاریخ قراردادی صادر شدند، در برابر هدف {v}",
    en: "Share of reports issued by the contractual date, against a {v} goal",
  },
  labOnTimeNote: {
    fa: "روزهای ۱۰۰٪ همان تعطیلی پنج‌شنبه و جمعه‌اند، که فقط چند گزارش بیرون می‌رود — مخرج کوچک است، نه هفتهٔ بهتر. آن‌ها را کنار نمودار ورودی بخوانید، نه تنها.",
    en: "The 100% days are the Thursday–Friday weekend, when only a handful of reports go out — a small denominator, not a better week. Read them beside the intake chart, not alone.",
  },

  labEveryMethodTitle: { fa: "هر روش در برابر هدف خودش", en: "Every method against its own target" },
  labEveryMethodSub: {
    fa: "طول نوار سهم مصرف‌شده از تعهد قراردادی است، پس روش‌هایی با هدف‌های متفاوت روی یک مقیاس مقایسه می‌شوند",
    en: "Bar length is the share of the contractual target consumed, so methods with different targets compare on one scale",
  },
  labP90: { fa: "صدک ۹۰", en: "90th percentile" },
  labEveryMethodNote: {
    fa: "تیک روی هر ردیف هدف خودِ آن روش است، و برای همین همه روی یک خط می‌افتند. نوار کم‌رنگ پشت هرکدام صدک ۹۰ است: چهار روش میانه‌ای داخل هدف دارند ولی دُمی که از آن می‌گذرد، و همان دُم است که مشتری واقعاً از آن شکایت می‌کند.",
    en: "The tick on every row is that method's own target, which is why they all line up. The faint bar behind each is the 90th percentile: four methods have a median inside target but a tail that runs past it, and that tail is what a client actually complains about.",
  },
  labMethodTableCaption: {
    fa: "میانه و صدک ۹۰ زمان پاسخ هر روش در برابر هدفش",
    en: "Median and 90th percentile turnaround per method against its target",
  },
  labColMethod: { fa: "روش", en: "Method" },
  labColStandard: { fa: "استاندارد", en: "Standard" },
  labColVolume: { fa: "گزارش", en: "Reports" },
  labColP90: { fa: "صدک ۹۰", en: "90th pct" },
  labColOfTarget: { fa: "از هدف", en: "Of target" },
  labReportsIn30d: {
    fa: "{v} گزارش در ۳۰ روز گذشته",
    en: "{v} reports in the last 30 days",
  },

  labTailTitle: { fa: "جایی که دُم قول را می‌شکند", en: "Where the tail breaks the promise" },
  labTailSub: {
    fa: "روش‌هایی که میانه‌شان داخل هدف است ولی صدک ۹۰ آن‌ها نه",
    en: "Methods whose median is inside target but whose 90th percentile is not",
  },
  labTailOverAtP90: { fa: "{v} فراتر در صدک ۹۰", en: "{v} over at p90" },
  labTailNote: {
    fa: "میانهٔ داخل هدف یعنی قول نگه‌داشته‌شده نیست. در هر کدام از این روش‌ها تقریباً یک گزارش از هر ده تا دیر می‌رسد، و همان‌هاست که مشتری یادش می‌ماند — میانه آن‌ها را پنهان می‌کند، و برای همین صدک ۹۰ روی نمودار بالاست.",
    en: "A median inside target is not a kept promise. On each of these methods roughly one report in ten lands late, and those are the ones a client remembers — the median hides them, which is why the 90th percentile is on the chart above.",
  },
  labMedianWord: { fa: "میانه {v}", en: "median {v}" },
  labP90Word: { fa: "صدک۹۰ {v}", en: "p90 {v}" },
  labReportsWord: { fa: "{v} گزارش", en: "{v} reports" },

  // ------------------------------------------------------------ chart phrases
  ofTimeAllowed: { fa: "{v} از زمان مجاز", en: "{v} of the time allowed" },
  overTargetBy: { fa: "{v} فراتر از هدف", en: "Over target by {v}" },
  labTatChartAria: {
    fa: "میانهٔ زمان پاسخ در ۳۰ روز گذشته، در برابر تعهد {v}.",
    en: "Median turnaround time over the last 30 days, against a {v} commitment.",
  },
  labIntakeChartAria: {
    fa: "نمونه‌های ثبت‌شده و گزارش‌های صادرشده در هر روز طی ۳۰ روز گذشته.",
    en: "Samples registered and reports issued per day over the last 30 days.",
  },
  labOnTimeChartAria: {
    fa: "سهم گزارش‌های به‌موقع در هر روز طی ۳۰ روز، در برابر هدف {v}.",
    en: "Share of reports issued on time per day over 30 days, against a {v} goal.",
  },
} satisfies Dict;
