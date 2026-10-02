/** Fictional management workspace. Never import data or configuration from a live app. */
export const DEMO_DAY = "2026-10-01";
export const teams = [
  {
    id: "a",
    name: "Group A",
    focus: "Analytical instruments",
    lead: "Alex Morgan",
    target: 1800,
    slot: 1,
  },
  {
    id: "b",
    name: "Group B",
    focus: "Process equipment",
    lead: "Sam Taylor",
    target: 1500,
    slot: 2,
  },
  {
    id: "c",
    name: "Group C",
    focus: "Laboratory supplies",
    lead: "Robin Ellis",
    target: 1200,
    slot: 3,
  },
] as const;
export const people = [
  "Alex Morgan",
  "Sam Taylor",
  "Robin Ellis",
  "Jamie Chen",
  "Casey Reed",
  "Jordan Lee",
];
export type ActionStatus = "Not started" | "In progress" | "Blocked" | "Done";
export type Task = {
  id: string;
  title: string;
  owner: string;
  team: string;
  project: string;
  due: string;
  month: string;
  status: ActionStatus;
  priority: "High" | "Normal";
  comment: string;
};
export type Deal = {
  id: string;
  client: string;
  title: string;
  team: string;
  owner: string;
  stage: "Proposal" | "Technical" | "Supply" | "Won";
  value: number;
  cost: number;
  paid: number;
  due: string;
};
export type Job = {
  id: string;
  deal: string;
  equipment: string;
  engineer: string;
  type: string;
  status:
    "Approval queue" | "Waiting installation" | "Under repair" | "Completed";
  due: string;
  note: string;
};
export type Shipment = {
  id: string;
  deal: string;
  item: string;
  vendor: string;
  owner: string;
  quantity: number;
  value: number;
  due: string;
  status: "Not ordered" | "Ordered" | "In transit" | "Delivered";
};
export type Message = {
  id: string;
  title: string;
  body: string;
  audience: string;
  date: string;
  acknowledged: boolean;
};
export type DemoState = {
  version: 1;
  tasks: Task[];
  deals: Deal[];
  jobs: Job[];
  shipments: Shipment[];
  messages: Message[];
  digestRuns: { id: string; date: string; open: number }[];
};
export const seed: DemoState = {
  version: 1,
  tasks: [
    {
      id: "AC-101",
      title: "Confirm installation window for GC system",
      owner: "Alex Morgan",
      team: "a",
      project: "Horizon lab expansion",
      due: "2026-10-02",
      month: "2026-10",
      status: "In progress",
      priority: "High",
      comment:
        "Customer asked for a two-day installation window. Coordinate with Jamie.",
    },
    {
      id: "AC-102",
      title: "Close the reactor technical clarification",
      owner: "Sam Taylor",
      team: "b",
      project: "Pilot reactor upgrade",
      due: "2026-09-28",
      month: "2026-09",
      status: "Blocked",
      priority: "High",
      comment: "Waiting for the vendor's revised utility drawing.",
    },
    {
      id: "AC-103",
      title: "Review consumables reorder quantities",
      owner: "Robin Ellis",
      team: "c",
      project: "Consumables framework",
      due: "2026-10-05",
      month: "2026-10",
      status: "Not started",
      priority: "Normal",
      comment: "Compare the forecast with the last three sample orders.",
    },
    {
      id: "AC-104",
      title: "Approve GC site readiness checklist",
      owner: "Jamie Chen",
      team: "a",
      project: "Horizon lab expansion",
      due: "2026-10-01",
      month: "2026-10",
      status: "In progress",
      priority: "High",
      comment: "Gas connections confirmed. Electrical check remains open.",
    },
    {
      id: "AC-105",
      title: "Book shipment for process skid",
      owner: "Casey Reed",
      team: "b",
      project: "Pilot reactor upgrade",
      due: "2026-10-03",
      month: "2026-10",
      status: "In progress",
      priority: "Normal",
      comment: "Freight quote received; confirm packing dimensions.",
    },
    {
      id: "AC-106",
      title: "Collect balance on reagent framework",
      owner: "Jordan Lee",
      team: "c",
      project: "Consumables framework",
      due: "2026-09-29",
      month: "2026-09",
      status: "In progress",
      priority: "High",
      comment: "Customer finance team requested a statement of account.",
    },
    {
      id: "AC-107",
      title: "Issue revised maintenance proposal",
      owner: "Alex Morgan",
      team: "a",
      project: "Service renewal",
      due: "2026-10-06",
      month: "2026-10",
      status: "Not started",
      priority: "Normal",
      comment: "Include two preventive maintenance visits.",
    },
    {
      id: "AC-108",
      title: "Complete pump acceptance report",
      owner: "Jamie Chen",
      team: "b",
      project: "Pilot reactor upgrade",
      due: "2026-09-30",
      month: "2026-09",
      status: "Done",
      priority: "Normal",
      comment: "Acceptance report reviewed and filed in the demo record.",
    },
    {
      id: "AC-109",
      title: "Verify tender compliance matrix",
      owner: "Robin Ellis",
      team: "c",
      project: "Consumables framework",
      due: "2026-10-08",
      month: "2026-10",
      status: "In progress",
      priority: "Normal",
      comment: "Check packaging and shelf-life requirements.",
    },
    {
      id: "AC-110",
      title: "Confirm service spare availability",
      owner: "Casey Reed",
      team: "a",
      project: "Service renewal",
      due: "2026-10-07",
      month: "2026-10",
      status: "Not started",
      priority: "Normal",
      comment: "Request availability before finalising the service date.",
    },
  ],
  deals: [
    {
      id: "DL-201",
      client: "Horizon Labs",
      title: "GC analysis system",
      team: "a",
      owner: "Alex Morgan",
      stage: "Won",
      value: 920,
      cost: 670,
      paid: 650,
      due: "2026-09-28",
    },
    {
      id: "DL-202",
      client: "Cedar Research",
      title: "Spectrometer package",
      team: "a",
      owner: "Alex Morgan",
      stage: "Technical",
      value: 680,
      cost: 500,
      paid: 0,
      due: "2026-10-15",
    },
    {
      id: "DL-203",
      client: "Meridian Process",
      title: "Pilot reactor skid",
      team: "b",
      owner: "Sam Taylor",
      stage: "Supply",
      value: 840,
      cost: 645,
      paid: 300,
      due: "2026-10-12",
    },
    {
      id: "DL-204",
      client: "Orion Materials",
      title: "Metering pump set",
      team: "b",
      owner: "Sam Taylor",
      stage: "Won",
      value: 480,
      cost: 350,
      paid: 480,
      due: "2026-09-30",
    },
    {
      id: "DL-205",
      client: "Northstar Testing",
      title: "Annual reagent framework",
      team: "c",
      owner: "Robin Ellis",
      stage: "Won",
      value: 360,
      cost: 245,
      paid: 160,
      due: "2026-09-29",
    },
    {
      id: "DL-206",
      client: "Horizon Labs",
      title: "Maintenance renewal",
      team: "a",
      owner: "Alex Morgan",
      stage: "Proposal",
      value: 240,
      cost: 130,
      paid: 0,
      due: "2026-10-20",
    },
    {
      id: "DL-207",
      client: "Cedar Research",
      title: "Reference standards",
      team: "c",
      owner: "Robin Ellis",
      stage: "Proposal",
      value: 280,
      cost: 190,
      paid: 0,
      due: "2026-10-21",
    },
    {
      id: "DL-208",
      client: "Meridian Process",
      title: "Reactor instrumentation",
      team: "b",
      owner: "Sam Taylor",
      stage: "Technical",
      value: 390,
      cost: 275,
      paid: 0,
      due: "2026-10-18",
    },
  ],
  jobs: [
    {
      id: "TC-301",
      deal: "DL-201",
      equipment: "GC analysis system",
      engineer: "Jamie Chen",
      type: "Installation",
      status: "Waiting installation",
      due: "2026-10-02",
      note: "Site readiness review in progress.",
    },
    {
      id: "TC-302",
      deal: "DL-202",
      equipment: "Spectrometer package",
      engineer: "Jamie Chen",
      type: "Technical review",
      status: "Approval queue",
      due: "2026-09-30",
      note: "Review detector configuration against tender specification.",
    },
    {
      id: "TC-303",
      deal: "DL-204",
      equipment: "Metering pump set",
      engineer: "Jordan Lee",
      type: "Installation",
      status: "Completed",
      due: "2026-09-30",
      note: "Acceptance test complete.",
    },
    {
      id: "TC-304",
      deal: "DL-206",
      equipment: "Autosampler module",
      engineer: "Jordan Lee",
      type: "Service",
      status: "Under repair",
      due: "2026-10-04",
      note: "Replace worn drive belt and perform repeatability test.",
    },
    {
      id: "TC-305",
      deal: "DL-208",
      equipment: "Reactor instrumentation",
      engineer: "Jamie Chen",
      type: "Technical review",
      status: "Approval queue",
      due: "2026-10-03",
      note: "Confirm pressure transmitter ranges.",
    },
  ],
  shipments: [
    {
      id: "PO-401",
      deal: "DL-201",
      item: "GC installation kit",
      vendor: "Aster Instruments",
      owner: "Casey Reed",
      quantity: 1,
      value: 65,
      due: "2026-10-01",
      status: "In transit",
    },
    {
      id: "PO-402",
      deal: "DL-203",
      item: "Process skid",
      vendor: "Summit Process",
      owner: "Casey Reed",
      quantity: 1,
      value: 490,
      due: "2026-09-29",
      status: "Ordered",
    },
    {
      id: "PO-403",
      deal: "DL-205",
      item: "Reagent packs",
      vendor: "Pine Chemicals",
      owner: "Robin Ellis",
      quantity: 24,
      value: 130,
      due: "2026-09-26",
      status: "Delivered",
    },
    {
      id: "PO-404",
      deal: "DL-206",
      item: "Service spare set",
      vendor: "Aster Instruments",
      owner: "Casey Reed",
      quantity: 2,
      value: 42,
      due: "2026-10-06",
      status: "Not ordered",
    },
    {
      id: "PO-405",
      deal: "DL-208",
      item: "Pressure transmitters",
      vendor: "Summit Process",
      owner: "Jordan Lee",
      quantity: 4,
      value: 96,
      due: "2026-10-08",
      status: "Ordered",
    },
  ],
  messages: [
    {
      id: "MSG-501",
      title: "October priorities",
      body: "Please close carried-over actions before starting new commitments. Confirm site readiness for the Horizon installation and follow up on overdue balances. Record blockers against the relevant action so they appear in the daily digest.",
      audience: "All teams",
      date: DEMO_DAY,
      acknowledged: false,
    },
  ],
  digestRuns: [],
};
export const history = [
  {
    week: "2026-09-10",
    groups: [
      { team: "a", sales: 260, offers: 8, deals: 5 },
      { team: "b", sales: 140, offers: 6, deals: 4 },
      { team: "c", sales: 90, offers: 7, deals: 3 },
    ],
  },
  {
    week: "2026-09-17",
    groups: [
      { team: "a", sales: 380, offers: 11, deals: 7 },
      { team: "b", sales: 210, offers: 8, deals: 5 },
      { team: "c", sales: 150, offers: 9, deals: 4 },
    ],
  },
  {
    week: "2026-09-24",
    groups: [
      { team: "a", sales: 310, offers: 9, deals: 6 },
      { team: "b", sales: 320, offers: 10, deals: 7 },
      { team: "c", sales: 180, offers: 8, deals: 5 },
    ],
  },
  {
    week: "2026-10-01",
    groups: [
      { team: "a", sales: 420, offers: 12, deals: 8 },
      { team: "b", sales: 280, offers: 9, deals: 6 },
      { team: "c", sales: 230, offers: 11, deals: 6 },
    ],
  },
];
export const routes = [
  [],
  ["management"],
  ["technical"],
  ["supply"],
  ["planning"],
  ["planning", "groups"],
  ["planning", "projects"],
  ["planning", "watchlist"],
  ["planning", "finance"],
  ["planning", "sales"],
  ["planning", "digest"],
  ["groups", "a"],
  ["groups", "b"],
  ["groups", "c"],
  ["weekly-history"],
  ["messages"],
];
export const teamName = (id: string) =>
  teams.find((team) => team.id === id)?.name ?? "All teams";
export const overdueTask = (task: Task) =>
  task.status !== "Done" && task.due < DEMO_DAY;
export const carriedTask = (task: Task) =>
  task.status !== "Done" && task.month < "2026-10";
export function managementMetrics(state: DemoState, team = "all") {
  const deals = state.deals.filter(
    (row) => team === "all" || row.team === team,
  );
  const won = deals.filter((row) => row.stage === "Won");
  const tasks = state.tasks.filter(
    (row) => team === "all" || row.team === team,
  );
  const revenue = won.reduce((sum, row) => sum + row.value, 0);
  return {
    deals,
    tasks,
    revenue,
    pipeline: deals
      .filter((row) => row.stage !== "Won")
      .reduce((sum, row) => sum + row.value, 0),
    overdue: won
      .filter((row) => row.due < DEMO_DAY)
      .reduce((sum, row) => sum + row.value - row.paid, 0),
    margin: revenue
      ? (won.reduce((sum, row) => sum + row.value - row.cost, 0) / revenue) *
        100
      : 0,
    open: tasks.filter((row) => row.status !== "Done").length,
  };
}
export function digestText(state: DemoState) {
  const open = state.tasks.filter((task) => task.status !== "Done");
  return [
    `NOVA INDUSTRIAL · DAILY PLANNING · ${DEMO_DAY}`,
    "Fictional demonstration. No email has been sent.",
    `${open.length} open actions · ${open.filter(carriedTask).length} carried over · ${open.filter((row) => row.status === "Blocked").length} blocked`,
    "",
    ...open.map(
      (row) =>
        `${row.id} | ${row.owner} | ${row.title} | ${row.status} | Due ${row.due}\n${row.comment}`,
    ),
  ].join("\n");
}
