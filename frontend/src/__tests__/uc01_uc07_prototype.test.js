import { describe, expect, it } from 'vitest';
import {
  createCommunityPrototypeClient,
  createProjectApprovalPrototypeClient,
  prototypeIds,
} from '../api/ucPrototypeClients.js';

// These are DEMO contract tests. They intentionally do not claim to verify
// UC-09 authentication, database persistence, or production API integration.
describe('UC-01 community-location prototype (AC-01, AF-01-01, C-01)', () => {
  it('loads only the explicitly configured sample location', async () => {
    const client = createCommunityPrototypeClient();
    const rows = await client.list(prototypeIds.locationId);
    expect(rows).toHaveLength(1);
    expect(rows[0].location_id).toBe(prototypeIds.locationId);
    await expect(client.list('another-camp')).rejects.toThrow('ข้อมูลจำลอง');
  });

  it('creates and edits a community while retaining its original location', async () => {
    const client = createCommunityPrototypeClient();
    const fields = {
      location_id: prototypeIds.locationId,
      community_name: 'ชุมชนทดสอบ',
      caretaker_name: 'ผู้ดูแลทดสอบ',
      caretaker_title: 'หัวหน้าชุมชน',
      contact_phone: '0811111111',
      local_rules: 'รักษาความสะอาด',
    };
    const created = await client.create(fields);
    expect(created).toMatchObject(fields);

    const changed = await client.update(created.community_id, {
      ...fields,
      location_id: 'another-camp',
      community_name: 'ชุมชนที่แก้ไข',
    });
    expect(changed.community_name).toBe('ชุมชนที่แก้ไข');
    expect(changed.location_id).toBe(prototypeIds.locationId);
    expect(await client.list(prototypeIds.locationId)).toHaveLength(2);
  });

  it.each(['community_name', 'caretaker_name', 'contact_phone'])(
    'rejects blank required field %s without saving (AF-01-01)',
    async (field) => {
      const client = createCommunityPrototypeClient();
      const fields = {
        location_id: prototypeIds.locationId,
        community_name: 'ชุมชน',
        caretaker_name: 'ผู้ดูแล',
        contact_phone: '0811111111',
        [field]: '  ',
      };
      await expect(client.create(fields)).rejects.toThrow('กรุณาระบุ');
      expect(await client.list(prototypeIds.locationId)).toHaveLength(1);
    },
  );
});

describe('UC-07 project-approval prototype (AC-07, AF-07-01/02, C-02)', () => {
  it('starts unsubmitted and records an approved decision with a notification', async () => {
    const client = createProjectApprovalPrototypeClient();
    expect((await client.status(prototypeIds.projectId)).status).toBe('not_submitted');

    const submitted = await client.submit(prototypeIds.projectId);
    expect(submitted.status).toBe('pending');
    expect(submitted.history.map(row => row.action)).toEqual(['submitted']);

    const approved = await client.decide(prototypeIds.projectId, 'approved', '');
    expect(approved.status).toBe('approved');
    expect(approved.history.map(row => row.action)).toEqual(['submitted', 'approved']);

    const notices = await client.notifications(prototypeIds.projectId);
    expect(notices).toHaveLength(1);
    expect(notices[0].status).toBe('approved');
    await expect(client.submit(prototypeIds.projectId)).rejects.toThrow();
  });

  it.each(['rejected', 'revision'])(
    'requires a reason before %s without mutating the pending status',
    async (decision) => {
      const client = createProjectApprovalPrototypeClient();
      await client.submit(prototypeIds.projectId);
      await expect(client.decide(prototypeIds.projectId, decision, '  ')).rejects.toThrow('เหตุผล');
      expect((await client.status(prototypeIds.projectId)).status).toBe('pending');
      expect(await client.notifications(prototypeIds.projectId)).toHaveLength(0);
    },
  );

  it('allows resubmission after revision and preserves the decision history', async () => {
    const client = createProjectApprovalPrototypeClient();
    await client.submit(prototypeIds.projectId);
    await client.decide(prototypeIds.projectId, 'revision', 'กรุณาปรับเอกสาร');
    expect((await client.status(prototypeIds.projectId)).status).toBe('revision');
    await client.submit(prototypeIds.projectId);
    const result = await client.decide(prototypeIds.projectId, 'approved', 'ปรับแล้ว');
    expect(result.history.map(row => row.action)).toEqual([
      'submitted', 'revision', 'submitted', 'approved',
    ]);
    expect(await client.notifications(prototypeIds.projectId)).toHaveLength(2);
  });

  it('does not allow another submission after rejection (AF-07-02)', async () => {
    const client = createProjectApprovalPrototypeClient();
    await client.submit(prototypeIds.projectId);
    await client.decide(prototypeIds.projectId, 'rejected', 'ไม่ผ่านเงื่อนไข');
    await expect(client.submit(prototypeIds.projectId)).rejects.toThrow();
  });

  it('rejects unknown project IDs and decisions', async () => {
    const client = createProjectApprovalPrototypeClient();
    await expect(client.status('other-project')).rejects.toThrow('ข้อมูลจำลอง');
    await client.submit(prototypeIds.projectId);
    await expect(client.decide(prototypeIds.projectId, 'unknown', '')).rejects.toThrow('ผลพิจารณา');
  });
});
