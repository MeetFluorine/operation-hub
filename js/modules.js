/*
 * Single list of every embedded application.
 * To add another tool, copy one block, change the values and save. Nothing else needs editing.
 *
 *   id               unique short name (letters, numbers, dashes)
 *   route            page address inside the hub, for example '/mrs' (opens as #/mrs)
 *   navLabel         text in the sidebar
 *   title            full name on the dashboard card and in the module toolbar
 *   description      one or two sentences for the dashboard card
 *   quickAccessLabel short line in the Quick Access row
 *   url              the existing deployed site to show in the frame
 *   accent           'blue', 'green' or 'orange'
 *   icon             'mrs', 'issuance' or 'stock'
 */
window.OPS_MODULES = [
  {
    id: 'mrs',
    route: '/mrs',
    navLabel: 'MRS',
    title: 'MRS Pipeline',
    description: 'Upload an Excel or CSV file to see movement KPIs, filters and charts, and export a cleaned workbook.',
    quickAccessLabel: 'Open MRS Pipeline',
    url: 'https://meetfluorine.github.io/mrs_pipeline/',
    accent: 'blue',
    icon: 'mrs'
  },
  {
    id: 'issuance',
    route: '/issuance',
    navLabel: 'Issuance',
    title: 'Issuance / FE Summary',
    description: 'Filter and de-duplicate issuance recover exports, then build the engineer pivot summaries.',
    quickAccessLabel: 'Open FE Summary',
    url: 'https://meetfluorine.github.io/fe-summary/',
    accent: 'green',
    icon: 'issuance'
  },
  {
    id: 'substore-stock',
    route: '/substore-stock',
    navLabel: 'Substore Stock',
    title: 'Substore Stock',
    description: 'Clean substore aging files, apply your rename rules and download the result as Excel.',
    quickAccessLabel: 'Open Stock Aging',
    url: 'https://meetfluorine.github.io/stock-aging/',
    accent: 'orange',
    icon: 'stock'
  }
];
