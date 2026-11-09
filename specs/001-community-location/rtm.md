# RTM: UC-01 Community Location (เบื้องต้น)

อ้างอิง spec.md Draft v2, plan.md, tasks.md, test-cases.md
ผลการทดสอบใน Repo: ยังไม่บันทึกผลการรันจริง — ห้ามนับว่า "ครบ" จนกว่าจะรัน pytest และตรวจ UI

| Requirement | AC | จุด Implement | จุด Test | สถานะ |
|---|---|---|---|---|
| FR-01-01, FR-01-02 | AC-01 | frontend/src/pages/CommunityLocationPage.jsx, api/communities.py:get_communities | test_AC_01_Given_When_Then_persists_community_linked_to_camp | รอตรวจ |
| FR-01-03, FR-01-04, FR-01-05 | AC-01 | api/communities.py:create_community, services/community_location_service.py:create | test_AC_01_Given_When_Then_persists_community_linked_to_camp | รอตรวจ |
| AF-01-01 | AC-01 | api/communities.py:CommunityFields | test_AC_01_AF_01_01_rejects_required_field_without_saving | รอตรวจ |
| C-01 / ASM-01-01 | AC-01 | api/communities.py:get_committee_user_id, services/...:require_assignment | test_AC_01_C_01_cross_camp_denied_for_create_read_update | รอตรวจ UC09 Integration |
| C-02 | AC-01 | community_location_service.py:local_rules TEXT | test_AC_01_Given_When_Then_persists_community_linked_to_camp | รอตรวจ |
| QR-01 | AC-01 | API | TC-UC01-06 | ยังไม่ถึง |
| QR-02 | AC-01 | CommunityLocationPage.jsx | ตรวจ UI ด้วยคน | ยังไม่ถึง |

## ข้อค้นพบ
| F-ID | ชนิด | อยู่ที่ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|
| F-UC01-01 | Integration pending | authentication | ยังไม่มี middleware ของ UC-09 ที่เติม request.state.user_id และ request.state.role; API ปฏิเสธทุกคำขอจนกว่าเชื่อม Auth | |
| F-UC01-02 | Dependency pending | uc01_community_assignments | ต้องมีขั้นตอนปลอดภัยในการกำหนดผู้รับผิดชอบ location โดยทีม / UC ที่เกี่ยวข้อง ไม่เปิด API ให้ผู้ใช้กำหนดสิทธิ์ตัวเอง | |
| F-UC01-03 | Performance unverified | QR-01 | ยังไม่ได้วัด response ภายใน 2 วินาทีในสภาพแวดล้อมจริง | |
| F-UC01-04 | Open Questions | Q-01-01, Q-01-02 | ไม่เดารูปแบบเบอร์โทร ชื่อซ้ำ หรือการแนบไฟล์ | |

ข้อค้นพบทั้งหมด AI เป็นคนตรวจ และอาจหาไม่ครบ ทีมต้องเปิดโค้ดและ spec ยืนยันทีละข้อ แล้วเขียนช่อง 'ทีมตัดสิน' เอง
