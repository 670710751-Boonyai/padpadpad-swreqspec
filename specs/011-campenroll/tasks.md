# Tasks: สมัครเข้าร่วมค่าย (Camp Enroll)

- Feature: สมัครเข้าร่วมค่าย (Camp Enroll)
- Spec ID: SPEC-ENR-011
- อ้างอิง: [plan.md](./plan.md)
- วันที่: 2569-10-21

สรุป 3 บรรทัด:
- เฟสทั้งหมด: 6 เฟส (เฟส 0 ถึงเฟส 5)
- งานย่อย: 17 tasks, 0 task รอ Open Questions
- เฟสแรกที่ลองใช้งานได้จริง: เฟส 1 (เลือกค่าย กรอก/แนบข้อมูล บันทึกและโหลด Draft พร้อม preview)

## เฟส 0: ฐานรากสำหรับสมัครเข้าร่วมค่าย

### T-01 สร้างโมเดลและตารางข้อมูลสมัครกับ Draft
- รองรับ: FR-ENR-02, FR-ENR-04, FR-ENR-07, CON-ENR-02, NFR-DATA-01, ASM-05, ASM-09
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-04, T-05, T-07, T-08
- ไฟล์ที่แตะ: `backend/app/models/camp.py`, `backend/app/models/application.py`, `backend/app/models/application_draft.py`, `backend/app/models/application_document.py`, `backend/db/schema.sql`, `backend/db/seed_campenroll.sql`, `backend/tests/test_enrollment_schema_foundation.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: ตารางรองรับค่ายและข้อกำหนดฟอร์ม/เอกสาร, Draft หนึ่งรายการต่อผู้สมัครต่อค่าย, ใบสมัครที่ส่งแล้ว และไฟล์ Draft ที่เก็บเป็น PostgreSQL `BYTEA` พร้อมข้อมูลตัวอย่างค่ายเปิดรับสมัคร
- สถานะ: พร้อมทำ

### T-02 ตั้งค่า FastAPI และตรวจ session ผู้สมัคร
- รองรับ: CON-ENR-02, NFR-SEC-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-04, T-05, T-07, T-08, T-09, T-10, T-12
- ไฟล์ที่แตะ: `backend/main.py`, `backend/app/db/database.py`, `backend/app/middleware/auth.py`, `backend/tests/test_enrollment_session_guard.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: FastAPI เปิดใช้ฐานข้อมูลได้ และ route สมัครสามารถระบุบัญชีจาก session โดยไม่รับตัวระบุเจ้าของจาก request พร้อมให้ `test_enrollment_session_guard` ผ่าน
- สถานะ: พร้อมทำ

### T-03 ตั้งค่า React (Vite) และ API client
- รองรับ: FR-ENR-01, FR-ENR-02, FR-ENR-04
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-06, T-11, T-13, T-15, T-17
- ไฟล์ที่แตะ: `frontend/package.json`, `frontend/src/main.jsx`, `frontend/src/App.jsx`, `frontend/src/api/client.js`, `frontend/src/__tests__/frontend_bootstrap.test.jsx`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: React (Vite) เปิดได้และ `frontend/src/api/client.js` เรียก API ได้ โดยหน้าจอทดสอบสามารถแทน client ด้วย mock ได้ และ `test_frontend_bootstrap` ผ่าน
- สถานะ: พร้อมทำ

## เฟส 1: เลือกค่ายและบันทึก/โหลด Draft ก่อนยืนยัน (AC-ENR-01)

### T-04 สร้าง API แสดงค่ายที่เปิดรับสมัคร
- รองรับ: FR-ENR-01, CON-ENR-01
- ตรวจด้วย: AC-ENR-01
- ไฟล์ที่แตะ: `backend/app/api/camp_enrollment.py`, `backend/app/services/camp_enrollment_service.py`, `backend/tests/test_enrollment_open_camps.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01, T-02
- เสร็จเมื่อ: `GET /camps/open` คืนเฉพาะค่ายที่เปิดรับสมัครพร้อมข้อกำหนดข้อมูลและเอกสารของค่าย และ `test_open_camps_api_AC_ENR_01` ผ่าน
- สถานะ: พร้อมทำ

### T-05 สร้าง API บันทึกและโหลด Draft พร้อมไฟล์
- รองรับ: FR-ENR-02, FR-ENR-04, CON-ENR-02, NFR-SEC-01, ASM-09
- ตรวจด้วย: AC-ENR-01
- ไฟล์ที่แตะ: `backend/app/api/camp_enrollment.py`, `backend/app/services/enrollment_draft_service.py`, `backend/app/models/application_draft.py`, `backend/app/models/application_document.py`, `backend/tests/test_enrollment_draft.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01, T-02
- เสร็จเมื่อ: `PUT /applications/{campId}/draft` บันทึกข้อมูล/ไฟล์ที่ยังไม่ครบโดยไม่เรียก validation สำหรับการส่ง, GET Draft และ GET ไฟล์คืนได้เฉพาะเจ้าของของค่ายนั้น, ปฏิเสธการแก้ Draft หลังส่งแล้ว และ `test_draft_owner_save_load_AC_ENR_01` ผ่าน
- สถานะ: พร้อมทำ

### T-06 สร้างหน้าฟอร์มสมัครและ preview Draft
- รองรับ: FR-ENR-01, FR-ENR-02, FR-ENR-04, CON-ENR-02, NFR-SEC-01
- ตรวจด้วย: AC-ENR-01
- ไฟล์ที่แตะ: `frontend/src/pages/CampEnrollmentPage.jsx`, `frontend/src/components/EnrollmentForm.jsx`, `frontend/src/components/EnrollmentPreview.jsx`, `frontend/src/api/client.js`, `frontend/src/__tests__/AC_ENR_01.test.jsx`
- แบบหน้าจอ: ไม่มี (spec ไม่มี UI ID หรือ mockup)
- ต้องทำหลัง: T-03, T-04, T-05
- เสร็จเมื่อ: ผู้สมัครเลือกค่าย กรอก/แนบข้อมูล บันทึก Draft โหลดข้อมูลและไฟล์เดิมด้วยบัญชีเดิม และเห็น preview ก่อนยืนยัน โดย `test_AC_ENR_01_form_preview_before_submit` ผ่านด้วย mock client
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 1
- test ที่ต้องผ่านทั้งหมด: `test_enrollment_schema_foundation`, `test_enrollment_session_guard`, `test_frontend_bootstrap`, `test_open_camps_api_AC_ENR_01`, `test_draft_owner_save_load_AC_ENR_01`, `test_AC_ENR_01_form_preview_before_submit`
- เปิดระบบ: Backend `python -m uvicorn backend.main:app --reload` และ frontend `npm --prefix frontend run dev` จาก repository root ตาม [plan.md](./plan.md)
- คนลองเองตาม AC-ENR-01:
  Given ผู้สมัครเข้าสู่ระบบแล้วและมีค่ายตัวอย่างที่เปิดรับสมัครพร้อมข้อกำหนดข้อมูล/เอกสาร
  When เลือกค่าย กรอกข้อมูลบางส่วน แนบไฟล์ บันทึก Draft แล้วออกจากและกลับเข้าสู่ระบบด้วยบัญชีเดิม
  Then ระบบโหลดข้อมูลกับไฟล์ Draft ให้เจ้าของได้และแสดง preview ก่อนยืนยัน โดยบัญชีอื่นเข้า Draft นี้ไม่ได้และ Draft ยังไม่ถือเป็นใบสมัครที่ส่งแล้ว
- ยังขาด: ไม่มี

## เฟส 2: ส่งใบสมัครที่ข้อมูลและเอกสารครบถ้วน (AC-ENR-04)

### T-07 สร้าง validation ข้อมูลฟอร์มก่อนส่ง
- รองรับ: FR-ENR-03, CON-ENR-03, IF-ENR-01, NFR-USE-01
- ตรวจด้วย: AC-ENR-04
- ไฟล์ที่แตะ: `backend/app/validators/enrollment_validator.py`, `backend/app/services/enrollment_submission_service.py`, `backend/tests/test_enrollment_data_validation.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01, T-02, T-05
- เสร็จเมื่อ: ตรวจข้อมูลตามฟิลด์ที่ค่ายกำหนดได้และคืนผลผ่านสำหรับข้อมูลครบ โดย validation นี้ถูกเรียกเฉพาะตอนยืนยันส่ง และ `test_application_fields_valid_for_AC_ENR_04` ผ่าน
- สถานะ: พร้อมทำ

### T-08 สร้าง validation เอกสารก่อนส่ง
- รองรับ: FR-ENR-05, CON-ENR-04, IF-ENR-02, NFR-REL-01, ASM-07, ASM-08
- ตรวจด้วย: AC-ENR-04
- ไฟล์ที่แตะ: `backend/app/validators/document_validator.py`, `backend/app/services/enrollment_submission_service.py`, `backend/tests/test_enrollment_document_validation.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01, T-02, T-05
- เสร็จเมื่อ: ตรวจความครบถ้วนและรูปแบบเอกสารตามข้อกำหนดของค่ายได้โดยไม่ hard-code ชนิด/ขนาดที่ spec ยังไม่กำหนด และ `test_documents_valid_for_AC_ENR_04` ผ่าน
- สถานะ: พร้อมทำ

### T-09 สร้าง API ส่งใบสมัครจาก Draft
- รองรับ: FR-ENR-06, FR-ENR-07, CON-ENR-03, CON-ENR-04, IF-ENR-01, IF-ENR-02, NFR-REL-01
- ตรวจด้วย: AC-ENR-04
- ไฟล์ที่แตะ: `backend/app/api/camp_enrollment.py`, `backend/app/services/enrollment_submission_service.py`, `backend/tests/test_AC_ENR_04.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-05, T-07, T-08
- เสร็จเมื่อ: `POST /applications/{campId}/submit` ตรวจซ้ำและย้าย Draft/ไฟล์เป็น Application ใน transaction สถานะ `submitted` เมื่อผ่าน และ `test_AC_ENR_04_submit_success_sets_review_status` ผ่าน
- สถานะ: พร้อมทำ

### T-10 สร้างรายการตรวจสอบเฉพาะใบสมัครที่ส่งแล้ว
- รองรับ: FR-ENR-07, NFR-SEC-01, NFR-REL-01
- ตรวจด้วย: AC-ENR-04
- ไฟล์ที่แตะ: `backend/app/api/application_review.py`, `backend/app/services/enrollment_submission_service.py`, `backend/tests/test_application_review_list.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-02, T-09
- เสร็จเมื่อ: `GET /applications/review` สำหรับเจ้าหน้าที่ที่มีสิทธิ์คืนเฉพาะ Application สถานะ `submitted` และไม่คืน Draft โดย `test_staff_review_lists_submitted_only_AC_ENR_04` ผ่าน
- สถานะ: พร้อมทำ

### T-11 เพิ่มการยืนยันส่งในหน้าฟอร์ม
- รองรับ: FR-ENR-06, FR-ENR-07
- ตรวจด้วย: AC-ENR-04
- ไฟล์ที่แตะ: `frontend/src/pages/CampEnrollmentPage.jsx`, `frontend/src/components/EnrollmentPreview.jsx`, `frontend/src/api/client.js`, `frontend/src/__tests__/AC_ENR_04.test.jsx`
- แบบหน้าจอ: ไม่มี (spec ไม่มี UI ID หรือ mockup)
- ต้องทำหลัง: T-06, T-09, T-10
- เสร็จเมื่อ: ปุ่มยืนยันเรียก submit หลังผู้สมัครตรวจ preview และเมื่อสำเร็จแสดงผลสถานะ “รอตรวจสอบ” โดย `test_AC_ENR_04_submit_ui` ผ่านด้วย mock client
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 2
- test ที่ต้องผ่านทั้งหมด: `test_enrollment_schema_foundation`, `test_enrollment_session_guard`, `test_frontend_bootstrap`, `test_open_camps_api_AC_ENR_01`, `test_draft_owner_save_load_AC_ENR_01`, `test_AC_ENR_01_form_preview_before_submit`, `test_application_fields_valid_for_AC_ENR_04`, `test_documents_valid_for_AC_ENR_04`, `test_AC_ENR_04_submit_success_sets_review_status`, `test_staff_review_lists_submitted_only_AC_ENR_04`, `test_AC_ENR_04_submit_ui`
- เปิดระบบ: Backend `python -m uvicorn backend.main:app --reload` และ frontend `npm --prefix frontend run dev` จาก repository root ตาม [plan.md](./plan.md)
- คนลองเองตาม AC-ENR-04:
  Given ผู้สมัครมี Draft ที่กรอกข้อมูลและแนบเอกสารครบตามข้อกำหนดของค่าย
  When ตรวจ preview แล้วกดยืนยันส่ง
  Then ระบบตรวจสอบ ย้าย Draft เป็นใบสมัคร `submitted` ในรายการเจ้าหน้าที่ และแสดง “รอตรวจสอบ” แก่ผู้สมัคร
- ยังขาด: ไม่มี

## เฟส 3: เรียกดูใบสมัครที่ส่งแล้ว (AC-ENR-05)

### T-12 สร้าง API เรียกดูใบสมัครของเจ้าของ
- รองรับ: FR-ENR-07, NFR-DATA-01, NFR-SEC-01
- ตรวจด้วย: AC-ENR-05
- ไฟล์ที่แตะ: `backend/app/api/camp_enrollment.py`, `backend/app/services/enrollment_submission_service.py`, `backend/tests/test_AC_ENR_05.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-02, T-09
- เสร็จเมื่อ: `GET /applications/{applicationId}` คืนข้อมูล/สถานะให้เจ้าของที่เข้าสู่ระบบเท่านั้นและ `test_AC_ENR_05_saved_application_status_is_visible` ผ่าน
- สถานะ: พร้อมทำ

### T-13 สร้างหน้าดูข้อมูลและสถานะใบสมัคร
- รองรับ: FR-ENR-07, NFR-DATA-01, NFR-SEC-01
- ตรวจด้วย: AC-ENR-05
- ไฟล์ที่แตะ: `frontend/src/pages/ApplicantApplicationPage.jsx`, `frontend/src/api/client.js`, `frontend/src/__tests__/AC_ENR_05.test.jsx`
- แบบหน้าจอ: ไม่มี (spec ไม่มี UI ID หรือ mockup)
- ต้องทำหลัง: T-03, T-11, T-12
- เสร็จเมื่อ: ผู้สมัครเรียกดูข้อมูลที่ส่งแล้วและเห็นสถานะ “รอตรวจสอบ” โดย `test_AC_ENR_05_application_view` ผ่านด้วย mock client
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 3
- test ที่ต้องผ่านทั้งหมด: `test_enrollment_schema_foundation`, `test_enrollment_session_guard`, `test_frontend_bootstrap`, `test_open_camps_api_AC_ENR_01`, `test_draft_owner_save_load_AC_ENR_01`, `test_AC_ENR_01_form_preview_before_submit`, `test_application_fields_valid_for_AC_ENR_04`, `test_documents_valid_for_AC_ENR_04`, `test_AC_ENR_04_submit_success_sets_review_status`, `test_staff_review_lists_submitted_only_AC_ENR_04`, `test_AC_ENR_04_submit_ui`, `test_AC_ENR_05_saved_application_status_is_visible`, `test_AC_ENR_05_application_view`
- เปิดระบบ: Backend `python -m uvicorn backend.main:app --reload` และ frontend `npm --prefix frontend run dev` จาก repository root ตาม [plan.md](./plan.md)
- คนลองเองตาม AC-ENR-05:
  Given ผู้สมัครส่งใบสมัครสำเร็จและเป็นเจ้าของใบสมัคร
  When เปิดหน้าข้อมูลใบสมัคร
  Then ระบบแสดงข้อมูลที่บันทึกไว้และสถานะ “รอตรวจสอบ”
- ยังขาด: ไม่มี

## เฟส 4: แจ้งและคง Draft เมื่อข้อมูลสมัครไม่ครบ (AC-ENR-02)

### T-14 ทดสอบการปฏิเสธข้อมูลฟอร์มที่ไม่ครบ
- รองรับ: FR-ENR-03, CON-ENR-03, IF-ENR-01, NFR-USE-01, NFR-REL-01
- ตรวจด้วย: AC-ENR-02
- ไฟล์ที่แตะ: `backend/tests/test_AC_ENR_02.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-07, T-08, T-09, T-10
- เสร็จเมื่อ: `test_AC_ENR_02_incomplete_form_shows_error` ยืนยันว่าคำขอส่งที่ข้อมูลไม่ครบคืนรายการฟิลด์ผิดพลาด คง Draft เดิม และไม่มี Application ในรายการตรวจสอบ
- สถานะ: พร้อมทำ

### T-15 แสดงข้อผิดพลาดรายฟิลด์และเก็บ Draft ไว้
- รองรับ: FR-ENR-03, NFR-USE-01, NFR-REL-01
- ตรวจด้วย: AC-ENR-02
- ไฟล์ที่แตะ: `frontend/src/pages/CampEnrollmentPage.jsx`, `frontend/src/components/EnrollmentForm.jsx`, `frontend/src/api/client.js`, `frontend/src/__tests__/AC_ENR_02.test.jsx`
- แบบหน้าจอ: ไม่มี (spec ไม่มี UI ID หรือ mockup)
- ต้องทำหลัง: T-06, T-11, T-14
- เสร็จเมื่อ: หน้าจอระบุช่องข้อมูลที่ต้องแก้ ไม่แสดงว่าส่งสำเร็จ และยังโหลด Draft เดิมกลับมาแก้ได้ โดย `test_AC_ENR_02_form_error_ui` ผ่านด้วย mock client
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 4
- test ที่ต้องผ่านทั้งหมด: `test_enrollment_schema_foundation`, `test_enrollment_session_guard`, `test_frontend_bootstrap`, `test_open_camps_api_AC_ENR_01`, `test_draft_owner_save_load_AC_ENR_01`, `test_AC_ENR_01_form_preview_before_submit`, `test_application_fields_valid_for_AC_ENR_04`, `test_documents_valid_for_AC_ENR_04`, `test_AC_ENR_04_submit_success_sets_review_status`, `test_staff_review_lists_submitted_only_AC_ENR_04`, `test_AC_ENR_04_submit_ui`, `test_AC_ENR_05_saved_application_status_is_visible`, `test_AC_ENR_05_application_view`, `test_AC_ENR_02_incomplete_form_shows_error`, `test_AC_ENR_02_form_error_ui`
- เปิดระบบ: Backend `python -m uvicorn backend.main:app --reload` และ frontend `npm --prefix frontend run dev` จาก repository root ตาม [plan.md](./plan.md)
- คนลองเองตาม AC-ENR-02:
  Given ผู้สมัครมี Draft ที่เว้นข้อมูลบังคับไว้อย่างน้อยหนึ่งช่อง
  When กดยืนยันส่งใบสมัคร
  Then ระบบระบุช่องที่ต้องแก้ คงข้อมูลไว้เป็น Draft และไม่สร้างรายการให้เจ้าหน้าที่ตรวจสอบ
- ยังขาด: ไม่มี

## เฟส 5: แจ้งและคง Draft เมื่อเอกสารไม่ครบหรือไม่ตรงรูปแบบ (AC-ENR-03)

### T-16 ทดสอบการปฏิเสธเอกสารที่ไม่ผ่านข้อกำหนด
- รองรับ: FR-ENR-05, CON-ENR-04, IF-ENR-02, NFR-REL-01, ASM-07, ASM-08
- ตรวจด้วย: AC-ENR-03
- ไฟล์ที่แตะ: `backend/tests/test_AC_ENR_03.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-08, T-09, T-10
- เสร็จเมื่อ: `test_AC_ENR_03_invalid_document_requires_reupload` ยืนยันว่าเอกสารที่ขาดหรือไม่ตรงข้อกำหนดค่ายแจ้งข้อผิดพลาด คง Draft/ไฟล์ไว้ และไม่มี Application ในรายการตรวจสอบ
- สถานะ: พร้อมทำ

### T-17 แสดงข้อผิดพลาดเอกสารและให้แนบใหม่
- รองรับ: FR-ENR-05, CON-ENR-04, NFR-REL-01
- ตรวจด้วย: AC-ENR-03
- ไฟล์ที่แตะ: `frontend/src/pages/CampEnrollmentPage.jsx`, `frontend/src/components/EnrollmentForm.jsx`, `frontend/src/api/client.js`, `frontend/src/__tests__/AC_ENR_03.test.jsx`
- แบบหน้าจอ: ไม่มี (spec ไม่มี UI ID หรือ mockup)
- ต้องทำหลัง: T-06, T-11, T-16
- เสร็จเมื่อ: หน้าจอแจ้งเอกสารที่ต้องแก้/แนบใหม่ คง Draft ไว้ และรับไฟล์ใหม่ได้ โดย `test_AC_ENR_03_document_error_ui` ผ่านด้วย mock client
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 5
- test ที่ต้องผ่านทั้งหมด: `test_enrollment_schema_foundation`, `test_enrollment_session_guard`, `test_frontend_bootstrap`, `test_open_camps_api_AC_ENR_01`, `test_draft_owner_save_load_AC_ENR_01`, `test_AC_ENR_01_form_preview_before_submit`, `test_application_fields_valid_for_AC_ENR_04`, `test_documents_valid_for_AC_ENR_04`, `test_AC_ENR_04_submit_success_sets_review_status`, `test_staff_review_lists_submitted_only_AC_ENR_04`, `test_AC_ENR_04_submit_ui`, `test_AC_ENR_05_saved_application_status_is_visible`, `test_AC_ENR_05_application_view`, `test_AC_ENR_02_incomplete_form_shows_error`, `test_AC_ENR_02_form_error_ui`, `test_AC_ENR_03_invalid_document_requires_reupload`, `test_AC_ENR_03_document_error_ui`
- เปิดระบบ: Backend `python -m uvicorn backend.main:app --reload` และ frontend `npm --prefix frontend run dev` จาก repository root ตาม [plan.md](./plan.md)
- คนลองเองตาม AC-ENR-03:
  Given ผู้สมัครมี Draft ที่เอกสารขาดหรือไม่ตรงตามข้อกำหนดของค่าย
  When กดยืนยันส่งใบสมัคร
  Then ระบบแจ้งเอกสารที่ต้องแนบใหม่ คง Draft และไฟล์เดิมไว้ และไม่แสดงใบสมัครในรายการเจ้าหน้าที่
- ยังขาด: ไม่มี

## ตารางตรวจความครบ

### 1) AC ID | task ที่ตรวจ AC นี้

| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-ENR-01 | T-04, T-05, T-06 |
| AC-ENR-02 | T-14, T-15 |
| AC-ENR-03 | T-16, T-17 |
| AC-ENR-04 | T-07, T-08, T-09, T-10, T-11 |
| AC-ENR-05 | T-12, T-13 |

### 2) Constraint/Quality ID | task ที่ทำให้เป็นจริง

| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| CON-ENR-01 | T-04 |
| CON-ENR-02 | T-02, T-05, T-06, T-12 |
| CON-ENR-03 | T-07, T-09, T-14 |
| CON-ENR-04 | T-08, T-09, T-16, T-17 |
| IF-ENR-01 | T-07, T-09, T-14 |
| IF-ENR-02 | T-08, T-09, T-16 |
| NFR-USE-01 | T-07, T-09, T-14, T-15 |
| NFR-DATA-01 | T-01, T-05, T-12, T-13 |
| NFR-SEC-01 | T-02, T-05, T-06, T-10, T-12, T-13 |
| NFR-REL-01 | T-07, T-08, T-09, T-10, T-14, T-15, T-16, T-17 |

### 3) FR ID | AC ที่ตรวจ FR นี้ | เฟส

| FR ID | AC ที่ตรวจ FR นี้ | เฟส |
|---|---|---|
| FR-ENR-01 | AC-ENR-01 | เฟส 1 |
| FR-ENR-02 | AC-ENR-01 | เฟส 1 |
| FR-ENR-03 | AC-ENR-02 | เฟส 4 |
| FR-ENR-04 | AC-ENR-01 | เฟส 1 |
| FR-ENR-05 | AC-ENR-03 | เฟส 5 |
| FR-ENR-06 | AC-ENR-04 | เฟส 2 |
| FR-ENR-07 | AC-ENR-04, AC-ENR-05 | เฟส 2, เฟส 3 |

## สิ่งที่ยังไม่ทำ
- Open Questions ใน spec: ไม่มี; ไม่มี task ที่รอ Q-xx
- ASM-08 ยังไม่ระบุประเภท/ขนาดไฟล์ จึงไม่กำหนดค่าเพิ่มใน task; การตรวจรูปแบบใช้ข้อกำหนดของค่ายที่มีอยู่
- ไม่สร้าง workflow อนุมัติ/ปฏิเสธหรือแจ้งเตือนเมื่ออนุมัติ เพราะอยู่นอกขอบเขตของ spec; เฟสส่งใบสมัครทำเพียงให้รายการ `submitted` ปรากฏแก่เจ้าหน้าที่ตรวจสอบ
