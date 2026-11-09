import React, { useState } from 'react';
import { projectApprovalClient } from '../api/projectApprovalClient.js';
import { prototypeIds } from '../api/ucPrototypeClients.js';

// UC-07 AC-07, AF-07-01/02, C-01/02: actions are authorized by backend.
export default function ProjectApprovalPage({ client = projectApprovalClient, demo = false }) {
  const [projectId, setProjectId] = useState(demo ? prototypeIds.projectId : '');
  const [project, setProject] = useState(null);
  const [decision, setDecision] = useState('approved');
  const [feedback, setFeedback] = useState('');
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function load(event) {
    event?.preventDefault();
    if (!projectId.trim()) return setError('กรุณากรอกรหัสโครงการ');
    setBusy(true); setError(''); setMessage('');
    try {
      setProject(await client.status(projectId.trim()));
      // Lecturer accounts cannot fetch committee-only notifications.
      try { setNotices(await client.notifications(projectId.trim())); } catch { setNotices([]); }
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true); setError(''); setMessage('');
    try {
      const response = await client.submit(projectId.trim());
      setProject(response); setMessage('ส่งขออนุมัติโครงการสำเร็จ');
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  }

  async function review(event) {
    event.preventDefault();
    setBusy(true); setError(''); setMessage('');
    try {
      const response = await client.decide(projectId.trim(), decision, feedback);
      setProject(response); setMessage('บันทึกผลการพิจารณาสำเร็จ');
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  }

  return (
    <main className="uc-page">
      <span className="uc-tag">UC-07 · Project Approval</span>
      <h1>พิจารณาและอนุมัติโครงการค่าย</h1>
      <p className="uc-helper">ดูสถานะคำขอ บันทึกผลการพิจารณา และตรวจสอบประวัติการอนุมัติโครงการ</p>
      <form onSubmit={load}>
        <label htmlFor="uc07-project">รหัสโครงการ</label>
        <input id="uc07-project" value={projectId} required
          onChange={event => setProjectId(event.target.value)} />
        <button disabled={busy}>ดูสถานะโครงการ</button>
      </form>
      {project && (
        <section>
          <h2>{project.project_name}</h2>
          <p>สถานะล่าสุด: <strong>{project.status}</strong></p>
          <form onSubmit={submit}>
            <button disabled={busy || !['not_submitted', 'revision'].includes(project.status)}>
              ส่งขออนุมัติ / ส่งอีกครั้งหลังแก้ไข
            </button>
          </form>
          <form onSubmit={review}>
            <h3>สำหรับอาจารย์ที่ปรึกษา</h3>
            <label htmlFor="uc07-decision">ผลการพิจารณา</label>
            <select id="uc07-decision" value={decision}
              onChange={event => setDecision(event.target.value)}>
              <option value="approved">อนุมัติ</option>
              <option value="rejected">ไม่อนุมัติ</option>
              <option value="revision">ส่งกลับแก้ไข</option>
            </select>
            <label htmlFor="uc07-feedback">ข้อเสนอแนะหรือเหตุผล</label>
            <textarea id="uc07-feedback" value={feedback}
              onChange={event => setFeedback(event.target.value)}
              required={decision !== 'approved'} />
            <button disabled={busy || project.status !== 'pending'}>บันทึกผล</button>
          </form>
          <h3>ประวัติการพิจารณา</h3>
          <ul>{project.history.map(item => (
            <li key={item.history_id}>{item.action}: {item.feedback || '—'} ({item.occurred_at})</li>
          ))}</ul>
          <h3>การแจ้งเตือนถึงคณะกรรมการ</h3>
          <ul>{notices.map(item => <li key={item.notification_id}>{item.status}: {item.message}</li>)}</ul>
        </section>
      )}
      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}
    </main>
  );
}
