# แผนงานเทคนิค: สมัครเข้าร่วมค่าย (Camp Enroll)

## 1. สรุปแนวทาง
- ฟีเจอร์นี้ให้นักศึกษาสามารถเลือกค่ายที่เปิดรับสมัคร กรอกข้อมูลที่จำเป็น แนบเอกสาร และส่งใบสมัครเพื่อยืนยันการเข้าร่วมตาม FR-ENR-01 ถึง FR-ENR-07
- ผู้ใช้หลักคือ นักศึกษา; ระบบตรวจข้อมูลและเอกสารก่อนสร้างใบสมัครที่ส่งแล้วตาม CON-ENR-03, CON-ENR-04, IF-ENR-01 และ IF-ENR-02 ส่วน PUT Draft ไม่ทำ submission validation
- Draft เป็นข้อมูลแยกจากใบสมัคร มีหนึ่งรายการต่อบัญชีผู้สมัครต่อค่าย และเก็บฟอร์มกับไฟล์จริงได้โดยไม่ผ่าน validation การส่ง ตาม ASM-09, CON-ENR-02 และ NFR-SEC-01
- ตรวจความครบถ้วนเฉพาะเมื่อผู้สมัครยืนยันส่ง หากไม่ผ่านให้คง Draft ไว้ หากผ่านให้ย้ายข้อมูลเป็นใบสมัคร `submitted` ที่เจ้าหน้าที่ตรวจสอบได้ และแสดง “รอตรวจสอบ” แก่ผู้สมัคร ตาม AC-ENR-02 ถึง AC-ENR-05
- การพัฒนาโดยรวมจะเน้นการ validate แบบละเอียดก่อนบันทึกข้อมูลและเอกสาร เพื่อตรงกับเงื่อนไขของค่ายที่กำหนดเองใน ASM-07

## 2. เทคโนโลยีที่ใช้

| สิ่งที่เลือก | มาจาก | หมายเหตุ |
| --- | --- | --- |
| React (Vite) สำหรับส่วนหน้า | ทีมเลือกเอง ไม่ได้มาจาก spec | ใช้แสดงรายการค่าย ฟอร์มสมัคร และหน้าแสดงสถานะใบสมัครของนักศึกษา |
| Python FastAPI สำหรับส่วนหลังบ้าน | ทีมเลือกเอง ไม่ได้มาจาก spec | ใช้จัดการ validate ข้อมูลสมัคร เอกสาร และการบันทึกใบสมัคร |
| PostgreSQL | ทีมเลือกเอง ไม่ได้มาจาก spec | ใช้เก็บตารางค่าย ใบสมัคร Draft และไฟล์เอกสารจริง |
| PostgreSQL `BYTEA` สำหรับเนื้อหาไฟล์ Draft | ทีมเลือกเอง ไม่ได้มาจาก spec | เก็บ bytes ของไฟล์แนบในฐานข้อมูล เพื่อให้เจ้าของโหลดไฟล์เดิมกลับมาได้; ไม่กำหนดชนิด/ขนาดไฟล์เพิ่มจาก ASM-08 |

## 3. โมเดลข้อมูล

| Entity | ฟิลด์หลัก | รองรับ FR |
| --- | --- | --- |
| Camp | camp_id, name, status, open_date, close_date, required_fields_json, required_documents_json, created_at | FR-ENR-01, FR-ENR-02, FR-ENR-04, CON-ENR-01, ASM-02, ASM-03 |
| Applicant | applicant_id, user_id, full_name, created_at | FR-ENR-02, CON-ENR-02, ASM-01 |
| Application | application_id, applicant_id, camp_id, status=`submitted`, submitted_at, created_at, updated_at; unique applicant_id + camp_id | FR-ENR-06, FR-ENR-07, ASM-04, ASM-05 |
| ApplicationDraft | draft_id, applicant_id, camp_id, form_data_json, last_saved_at; unique applicant_id + camp_id | FR-ENR-02, CON-ENR-02, ASM-09 |
| ApplicationDocument | document_id, draft_id (nullable), application_id (nullable), document_type, file_name, file_content BYTEA, validation_status, validated_at; ผูก Draft หรือ Application อย่างใดอย่างหนึ่ง | FR-ENR-04, FR-ENR-05, ASM-07, ASM-08, ASM-09 |
| ValidationError | error_id, draft_id, field_name, error_message, created_at | FR-ENR-03, FR-ENR-05, NFR-USE-01 |

Draft ผูกกับบัญชีและค่าย เจ้าของเท่านั้นที่อ่าน/แก้ไขได้; Draft อาจเก็บข้อมูลและไฟล์ที่ยังไม่ครบ แต่ไม่อยู่ในตารางใบสมัครที่เจ้าหน้าที่ตรวจสอบ ส่วนไฟล์ของ Draft จะย้ายไปผูกกับ Application เมื่อ submit ผ่าน validation เท่านั้น รายการตรวจสอบเจ้าหน้าที่แสดงเฉพาะ Application ที่ status=`submitted` ตาม NFR-REL-01

## 4. API / หน้าจอ

- GET /camps/open — แสดงรายการค่ายที่เปิดรับสมัคร พร้อมสถานะค่ายที่เปิดอยู่ — รองรับ FR-ENR-01, CON-ENR-01
- GET /applications/{campId}/draft — โหลด Draft ของบัญชีปัจจุบันสำหรับค่ายที่ระบุ รวมข้อมูลฟอร์มและ metadata ของไฟล์ — ตรวจเจ้าของก่อนคืนข้อมูล — รองรับ FR-ENR-02, CON-ENR-02, NFR-SEC-01, ASM-09
- GET /applications/{campId}/draft/documents/{documentId} — โหลด bytes ของไฟล์ Draft โดยตรวจเจ้าของและค่าย — รองรับ FR-ENR-04, CON-ENR-02, ASM-09
- PUT /applications/{campId}/draft — upsert ข้อมูลฟอร์มและไฟล์แนบของผู้ใช้ปัจจุบันเป็น Draft; ยอมรับข้อมูล/เอกสารไม่ครบและไม่เรียก validation สำหรับการส่ง — รองรับ FR-ENR-02, FR-ENR-04, CON-ENR-02, ASM-09
- POST /applications/{campId}/submit — เรียกเมื่อผู้สมัครกดยืนยันเท่านั้น; ตรวจข้อมูลและเอกสาร แล้วทำ transaction ย้าย Draft เป็น Application status=`submitted`; เมื่อไม่ผ่านส่ง errors กลับและคง Draft โดยไม่สร้าง Application — รองรับ FR-ENR-03, FR-ENR-05, FR-ENR-06, FR-ENR-07, CON-ENR-03, CON-ENR-04, IF-ENR-01, IF-ENR-02, NFR-USE-01, NFR-REL-01
- GET /applications/{applicationId} — แสดงข้อมูลใบสมัครและสถานะแก่เจ้าของที่เข้าสู่ระบบเท่านั้น — รองรับ NFR-DATA-01, NFR-SEC-01, AC-ENR-05
- GET /applications/review — รายการสำหรับเจ้าหน้าที่ที่มีสิทธิ์; คืนเฉพาะ Application status=`submitted` และไม่คืน Draft — รองรับ FR-ENR-07, NFR-SEC-01, NFR-REL-01

Draft API ทุกเส้นทางต้องอาศัย session ผู้สมัครและจำกัดการอ่าน/เขียนด้วย applicant_id จาก session ไม่รับ applicant_id จากผู้เรียกเพื่อเลือกเจ้าของข้อมูล สำหรับใบสมัครที่ส่งแล้ว ห้ามผู้สมัครแก้ไข Draft/ข้อมูลนั้นตาม ASM-06

## 5. ตารางตรวจ Constraints

| Constraint ID | ถูกนำไปใช้ที่ไหนใน plan | สถานะ |
| --- | --- | --- |
| CON-ENR-01 | หน้าแสดงค่ายและ API /camps/open จะเลือกเฉพาะค่ายที่เปิดรับสมัครเท่านั้น | ใช้แล้ว |
| CON-ENR-02 | Draft GET/PUT/download ใช้ session และตรวจเจ้าของบัญชีกับค่าย | ใช้แล้ว |
| CON-ENR-03 | ตรวจข้อมูลครบถ้วนเฉพาะ POST /applications/{campId}/submit; PUT Draft รับข้อมูลไม่ครบได้ | ใช้แล้ว |
| CON-ENR-04 | ตรวจรูปแบบ/ความครบถ้วนเอกสารเมื่อยืนยันส่งเท่านั้น โดยอ้างเงื่อนไขที่ค่ายกำหนด | ใช้แล้ว |
| IF-ENR-01 | submit ตรวจข้อมูลก่อนสร้าง Application; เมื่อไม่ผ่านคง Draft และไม่บันทึก Application | ใช้แล้ว |
| IF-ENR-02 | submit ตรวจเอกสารก่อนย้ายไฟล์/บันทึก Application; Draft ยังเก็บไฟล์ที่ไม่ผ่านได้ | ใช้แล้ว |

## 6. แผนทดสอบจาก Acceptance Criteria

| AC ID | ชื่อ test | ทดสอบอย่างไร |
| --- | --- | --- |
| AC-ENR-01 | test_AC_ENR_01_form_preview_before_submit | ตรวจบันทึก Draft ที่ข้อมูล/ไฟล์ยังไม่ครบ, โหลดกลับด้วยบัญชีเดิมได้ครบ, บัญชีอื่นเข้าไม่ได้ และ preview ก่อน submit |
| AC-ENR-02 | test_AC_ENR_02_incomplete_form_shows_error | กดยืนยันเมื่อข้อมูลไม่ครบแล้วต้องเห็น field errors, Draft ยังคงอยู่ และไม่มี Application ใน staff review |
| AC-ENR-03 | test_AC_ENR_03_invalid_document_requires_reupload | กดยืนยันเมื่อเอกสารไม่ครบ/ไม่ตรงเงื่อนไขค่ายแล้วต้องเห็นข้อผิดพลาด, Draft/ไฟล์ยังอยู่ และไม่มี Application ใน staff review |
| AC-ENR-04 | test_AC_ENR_04_submit_success_sets_review_status | ยืนยันข้อมูล/เอกสารครบแล้ว Draft ถูกย้ายเป็น Application status=`submitted`, อยู่ใน staff review และผู้สมัครเห็น “รอตรวจสอบ” |
| AC-ENR-05 | test_AC_ENR_05_saved_application_status_is_visible | หลัง submit นักศึกษาที่เป็นเจ้าของดูข้อมูลที่บันทึกและเห็น “รอตรวจสอบ” ได้ |

## 7. ลำดับงาน

1. สร้างโครงสร้างข้อมูล Camp, Application, ApplicationDraft และ ApplicationDocument โดยแยก Draft จาก Application, จำกัด Draft หนึ่งรายการต่อผู้สมัครต่อค่าย และเก็บไฟล์จริงใน PostgreSQL — เกี่ยวข้องกับ FR-ENR-01, FR-ENR-02, FR-ENR-04, FR-ENR-06, FR-ENR-07, CON-ENR-02, ASM-05, ASM-09
2. สร้างหน้าแสดงค่ายที่เปิดรับสมัครและจำกัดเฉพาะค่ายที่มีสถานะ “เปิดรับสมัคร” เท่านั้น — เกี่ยวข้องกับ FR-ENR-01, CON-ENR-01, ASM-02
3. สร้าง GET/PUT Draft และการโหลดไฟล์โดยผูกกับบัญชีและค่าย; PUT เก็บ partial data/file โดยไม่ validate — เกี่ยวข้องกับ FR-ENR-02, FR-ENR-04, CON-ENR-02, NFR-SEC-01, ASM-09
4. สร้างฟอร์มเลือกค่าย กรอก/แนบข้อมูล บันทึก/โหลด Draft และ preview ก่อน submit — เกี่ยวข้องกับ FR-ENR-01, FR-ENR-02, FR-ENR-04, AC-ENR-01
5. เมื่อกดยืนยันเท่านั้น ให้ validate ข้อมูลและเอกสารตามกติกาของค่าย; หากไม่ครบคง Draft และแจ้ง errors — เกี่ยวข้องกับ FR-ENR-03, FR-ENR-05, CON-ENR-03, CON-ENR-04, IF-ENR-01, IF-ENR-02, AC-ENR-02, AC-ENR-03
6. เมื่อ validation ผ่าน ให้ transaction ย้าย Draft/เอกสารเป็น Application `submitted` และให้ staff review แสดงเฉพาะรายการ submitted — เกี่ยวข้องกับ FR-ENR-06, FR-ENR-07, AC-ENR-04, NFR-REL-01
7. สร้างหน้าแสดงข้อมูลใบสมัครและสถานะ “รอตรวจสอบ” แก่เจ้าของ — เกี่ยวข้องกับ NFR-DATA-01, NFR-SEC-01, AC-ENR-05
8. ทดสอบความสอดคล้องกับทุก AC และตรวจ traceability กับ FR, NFR, CON, IF — เกี่ยวข้องกับ AC-ENR-01 ถึง AC-ENR-05

## 8. สิ่งที่ยังไม่ทำ
- Open Questions ใน spec ปัจจุบัน: ไม่มี
- ไม่สร้าง flow อนุมัติ/ปฏิเสธหรือแจ้งเตือนเมื่ออนุมัติ เพราะอยู่นอกขอบเขตการสมัครตาม Out of scope; staff review ในแผนนี้เป็นเพียงการแสดง Application ที่ส่งแล้ว
- ประเภทและขนาดไฟล์ยังไม่กำหนดใน spec ตาม ASM-08; validation ใช้เงื่อนไขของค่ายที่มีอยู่ และไม่ hard-code ข้อกำหนดเพิ่ม

## 9. คำสั่งเปิดระบบสำหรับจุดตรวจ
- Backend: `python -m uvicorn backend.main:app --reload` (รันจาก repository root)
- Frontend: `npm --prefix frontend run dev`
- คำสั่งเป็นแนวทางตามโครง FastAPI และ React (Vite) ที่ plan เลือก; ต้องมี entry point และ scripts ตามคำสั่งนี้เมื่อ implement
