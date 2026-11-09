# RTM: UC-07 Project Approval — Draft

อ้างอิง spec.md Draft v2, tasks.md, plan.md, test-cases.md
ยังไม่มีผลรัน pytest ที่ยืนยันได้; ไม่อ้างว่า Verify ผ่าน

| Requirement | AC | Implement | Test | สถานะ |
|---|---|---|---|---|
| FR-07-01..05 (ชุดแรก) | AC-07 | api/project_approval.py, services/project_approval_service.py, pages/ProjectApprovalPage.jsx | test_AC_07_Given_When_Then_records_decision_history_and_notification | รอตรวจ |
| AF-07-01 | AC-07 | project_approval_service.py:submit/review | test_AC_07_revision_allows_resubmit_but_rejection_is_terminal | รอตรวจ |
| AF-07-02 | AC-07 | project_approval_service.py:review | test_AC_07_revision_allows_resubmit_but_rejection_is_terminal | รอตรวจ |
| C-01, ASM-07-01, QR-01 | AC-07 | project_approval.py:get_actor, service:_require_member | test_AC_07_unauthorized_faculty_cannot_review_other_project | รอตรวจ UC09 |
| C-02, ASM-07-02 | AC-07 | service:submit | test_AC_07_revision_allows_resubmit_but_rejection_is_terminal | รอตรวจ |
| QR-02 | AC-07 | service:history triggers | test_AC_07_audit_log_cannot_be_edited_or_deleted | รอตรวจ |
| FR-07-01..07 (ชุดที่สอง) | AC-07 | ไม่มี mapping ชัดเพราะ ID ซ้ำ | รอ | ช่องโหว่ |

## ข้อค้นพบ

| F-ID | ชนิด | อยู่ที่ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|
| F-UC07-01 | Spec conflict | spec.md | หัวข้อ FR สองชุดใช้ ID เดิมคนละความหมาย; ต้องให้ทีมแก้โดยไม่ให้ AI ตัดสินใจแทน | |
| F-UC07-02 | Auth integration | api/project_approval.py | รอ UC-09 session middleware เติม request.state.user_id / role | |
| F-UC07-03 | Membership provisioning | service | ต้องเชื่อมผู้รับผิดชอบโครงการกับ committee/advisor โดยระบบกลาง (ห้ามมอบสิทธิ์ผ่าน request) | |
| F-UC07-04 | Project details | pages/ProjectApprovalPage.jsx | ปัจจุบันแสดงชื่อและสถานะจาก camp_projects; ยังไม่มีข้อมูลเอกสารโครงการสำหรับตรวจรายละเอียดตาม FR-07-02 | |
| F-UC07-05 | Test execution | tests | ไม่สามารถรับรอง test จนกว่าจะรันจริงใน environment ของ repo | |

ข้อค้นพบทั้งหมด AI เป็นคนตรวจ และอาจหาไม่ครบ ทีมต้องเปิดโค้ดและ spec ยืนยันทีละข้อ แล้วเขียนช่อง 'ทีมตัดสิน' เอง
