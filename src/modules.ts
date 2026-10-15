// Single source of truth for every embedded application.
// To add another tool, add one entry here (see README, "Adding another application").

export type ModuleId = 'mrs' | 'issuance' | 'substore-stock';
export type Accent = 'blue' | 'green' | 'orange';
export type IconName = 'mrs' | 'issuance' | 'stock';

export interface ModuleConfig {
  /** Stable identifier. */
  id: ModuleId;
  /** Route inside the hub, for example /mrs */
  route: string;
  /** Label in the sidebar. */
  navLabel: string;
  /** Full name shown on the dashboard card and in the module toolbar. */
  title: string;
  /** One or two sentences for the dashboard card. */
  description: string;
  /** Short line for the Quick Access row. */
  quickAccessLabel: string;
  /** Existing deployed site that is loaded in the frame. */
  url: string;
  accent: Accent;
  icon: IconName;
}

export const MODULES: ModuleConfig[] = [
  {
    id: 'mrs',
    route: '/mrs',
    navLabel: 'MRS',
    title: 'MRS Pipeline',
    description:
      'Upload an Excel or CSV file to see movement KPIs, filters and charts, and export a cleaned workbook.',
    quickAccessLabel: 'Open MRS Pipeline',
    url: 'https://meetfluorine.github.io/mrs_pipeline/',
    accent: 'blue',
    icon: 'mrs',
  },
  {
    id: 'issuance',
    route: '/issuance',
    navLabel: 'Issuance',
    title: 'Issuance / FE Summary',
    description:
      'Filter and de-duplicate issuance recover exports, then build the engineer pivot summaries.',
    quickAccessLabel: 'Open FE Summary',
    url: 'https://meetfluorine.github.io/fe-summary/',
    accent: 'green',
    icon: 'issuance',
  },
  {
    id: 'substore-stock',
    route: '/substore-stock',
    navLabel: 'Substore Stock',
    title: 'Substore Stock',
    description:
      'Clean substore aging files, apply your rename rules and download the result as Excel.',
    quickAccessLabel: 'Open Stock Aging',
    url: 'https://meetfluorine.github.io/stock-aging/',
    accent: 'orange',
    icon: 'stock',
  },
];

export function findModuleByRoute(path: string): ModuleConfig | undefined {
  return MODULES.find((m) => m.route === path);
}
