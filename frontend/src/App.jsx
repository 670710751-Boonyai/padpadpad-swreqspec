import React, { createContext, useMemo, useState } from 'react';

import { apiClient } from './api/client.js';
import { createDemoApiClient } from './api/demoClient.js';
import CampEnrollmentPage from './pages/CampEnrollmentPage.jsx';
import ApplicantApplicationPage from './pages/ApplicantApplicationPage.jsx';

export const ApiClientContext = createContext(apiClient);

// รองรับ: FR-ENR-01, FR-ENR-02, FR-ENR-04, FR-ENR-07
function DemoApp() {
  const [applicationId, setApplicationId] = useState(null);
  const [showApplication, setShowApplication] = useState(false);
  const client = useMemo(
    () => createDemoApiClient({ onSubmitted: setApplicationId }),
    [],
  );

  return (
    <div className="app-shell demo-app">
      <header className="site-header">
        <a className="brand" href="/" aria-label="หน้าสมัครเข้าร่วมค่าย">
          <span className="brand-mark" aria-hidden="true">ค</span>
          <span>
            <strong>ค่ายกิจกรรม</strong>
            <small>ระบบรับสมัครนักศึกษา</small>
          </span>
        </a>
        <span className="header-label">CAMP APPLICATION</span>
      </header>
      <main className="site-content">
        <p className="demo-banner" role="note">
          <span className="demo-indicator" aria-hidden="true" />
          <strong>Demo Mode — ข้อมูลจำลอง</strong>
          <span>ไม่เชื่อมต่อ Backend และไม่บันทึกใน PostgreSQL</span>
        </p>
        {applicationId && !showApplication && (
          <div className="status-navigation">
            <button
              className="button button-primary"
              type="button"
              onClick={() => setShowApplication(true)}
            >
              ดูสถานะใบสมัคร
            </button>
          </div>
        )}
        {showApplication && applicationId ? (
          <ApplicantApplicationPage applicationId={applicationId} client={client} />
        ) : (
          <CampEnrollmentPage client={client} />
        )}
      </main>
      <footer className="site-footer">
        ตัวอย่างสำหรับการสาธิตเท่านั้น · ข้อมูลทั้งหมดเป็นข้อมูลจำลอง
      </footer>
    </div>
  );
}

// รองรับ: FR-ENR-01, FR-ENR-02, FR-ENR-04
export default function App({ client = apiClient, children }) {
  if (import.meta.env.DEV && import.meta.env.VITE_DEMO_MODE === 'true') {
    return <DemoApp />;
  }

  return (
    <ApiClientContext.Provider value={client}>
      <main>{children ?? <CampEnrollmentPage client={client} />}</main>
    </ApiClientContext.Provider>
  );
}
