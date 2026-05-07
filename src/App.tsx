import React, { useState } from 'react';
import type { PageId, Period } from './types';
import { globalCSS } from './styles';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import SettingsModal from './components/SettingsModal';
import OverviewPage from './components/pages/OverviewPage';
import {
  SalesRevenuePage,
  SalesAreaPage,
  SalesCategoryPage,
  SalesProductPage,
  SalesTrendPage,
  SalesDiscountsPage,
  SalesTipsPage,
  SalesPaymentsPage,
} from './components/pages/SalesPages';
import {
  CrmClientsPage,
  CrmLoyaltyPage,
  CrmSatisfactionPage,
  CrmServicePage,
} from './components/pages/CrmPages';
import {
  ReservationsPage,
  MktWebPage,
  MktBookingPage,
  MktPaidPage,
  LabourPage,
  LabourPerfPage,
  FbPage,
  FbStockPage,
  ReportsPage,
} from './components/pages/OtherPages';

const PAGE_COMPONENTS: Partial<Record<PageId, React.ComponentType>> = {
  'overview': OverviewPage,
  'sales-revenue': SalesRevenuePage,
  'sales-area': SalesAreaPage,
  'sales-category': SalesCategoryPage,
  'sales-product': SalesProductPage,
  'sales-trend': SalesTrendPage,
  'sales-discounts': SalesDiscountsPage,
  'sales-tips': SalesTipsPage,
  'sales-payments': SalesPaymentsPage,
  'crm-clients': CrmClientsPage,
  'crm-loyalty': CrmLoyaltyPage,
  'crm-satisfaction': CrmSatisfactionPage,
  'crm-service': CrmServicePage,
  'reservations': ReservationsPage,
  'mkt-web': MktWebPage,
  'mkt-booking': MktBookingPage,
  'mkt-paid': MktPaidPage,
  'labour': LabourPage,
  'labour-perf': LabourPerfPage,
  'fb': FbPage,
  'fb-stock': FbStockPage,
  'reports': ReportsPage,
};

// Placeholder for unimplemented pages
const Placeholder: React.FC<{ page: PageId }> = ({ page }) => (
  <div className="jbi-page">
    <div style={{ background: 'var(--white)', borderRadius: 14, border: '1px solid var(--border)', padding: '60px 40px', textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
      <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Coming Soon</div>
      <div style={{ fontSize: 14, color: 'var(--text2)' }}>The <strong>{page}</strong> page is ready to be built.</div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageId>('overview');
  const [period, setPeriod] = useState<Period>('week');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const PageComponent = PAGE_COMPONENTS[activePage];

  return (
    <>
      <style>{globalCSS}</style>
      <div className="jbi-app">
        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <Topbar
            activePage={activePage}
            period={period}
            onPeriodChange={setPeriod}
            onOpenSettings={() => setSettingsOpen(true)}
          />

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px',
            minWidth: 0,
          }}>
            {PageComponent
              ? <PageComponent />
              : <Placeholder page={activePage} />
            }
          </div>
        </main>

        <SettingsModal
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
      </div>
    </>
  );
};

export default App;
