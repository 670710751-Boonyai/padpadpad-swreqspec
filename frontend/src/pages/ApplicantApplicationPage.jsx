import React, { useEffect, useState } from 'react';

import { apiClient } from '../api/client.js';
import { getFieldPresentation } from '../components/enrollmentLabels.js';

// รองรับ: CON-ENR-02, NFR-SEC-01
function getErrorMessage(error) {
  return error.status === 401
    ? 'กรุณาเข้าสู่ระบบก่อนตรวจสอบข้อมูลการสมัคร'
    : error.message;
}

// รองรับ: NFR-DATA-01
function formatFieldValue(value) {
  if (value === null || value === undefined) return '';
  return typeof value === 'string' ? value : JSON.stringify(value);
}

function formatApplicationField(fieldName, value) {
  if (fieldName === 'food_allergy') {
    return value === 'no' ? 'ไม่มี' : value === 'yes' ? 'มี' : formatFieldValue(value);
  }
  if (fieldName === 'year_level' && value === 'other') return 'อื่นๆ (ระบุ)';
  return formatFieldValue(value);
}

// รองรับ: FR-ENR-07, NFR-DATA-01, NFR-SEC-01, AC-ENR-05
export default function ApplicantApplicationPage({
  applicationId,
  client = apiClient,
}) {
  const [application, setApplication] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // รองรับ: FR-ENR-07, NFR-DATA-01, NFR-SEC-01, AC-ENR-05
    async function loadApplication() {
      try {
        const response = await client.getApplication(applicationId);
        const savedApplication = await response.json();
        if (active) setApplication(savedApplication);
      } catch (error) {
        if (active) setErrorMessage(getErrorMessage(error));
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadApplication();

    return () => {
      active = false;
    };
  }, [applicationId, client]);

  return (
    <section className="application-page">
      <header className="page-heading">
        <div>
          <p className="eyebrow">APPLICATION STATUS</p>
          <h1>ข้อมูลใบสมัคร</h1>
          <p>รายละเอียดใบสมัครและสถานะการตรวจสอบ</p>
        </div>
      </header>
      {errorMessage && <p className="notice notice-error" role="alert">{errorMessage}</p>}
      {isLoading ? (
        <p role="status">กำลังโหลดข้อมูลการสมัคร…</p>
      ) : application ? (
        <>
          <p className="application-status" role="status">
            {application.status === 'submitted'
              ? 'รอตรวจสอบ'
              : application.status}
          </p>
          <dl className="application-details">
            {Object.entries(application.form_data).map(([fieldName, value]) => (
              <React.Fragment key={fieldName}>
                <dt>{getFieldPresentation(fieldName).label}</dt>
                <dd>{formatApplicationField(fieldName, value)}</dd>
              </React.Fragment>
            ))}
          </dl>
        </>
      ) : null}
    </section>
  );
}
