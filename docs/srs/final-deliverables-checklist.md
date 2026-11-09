# Final Submission Checklist — SRS / spec.md / Prototype 6 Features / RTM

**วันที่เตรียม:** 2026-11-09
**สถานะ:** ช่วยเตรียมงานของ UC-01/07 ก่อน ไม่ยืนยันว่า Final ของทีมครบ

## 1. SRS (ทั้งระบบ)
- [x] เตรียมส่วน SRS ของ UC-01/07: `docs/srs/UC01-UC07-SRS-contribution.md`
- [x] ตารางรายชื่อผู้รับผิดชอบ 14 UC จาก `specs/README.md` (ต้องให้ทีมยืนยัน)
- [ ] รวม SRS ของทุก UC เข้าด้วยกัน
- [ ] เพิ่ม/ตรวจผังระบบและความสัมพันธ์กับ UC อื่นตามข้อกำหนดอาจารย์
- [ ] ให้ทีมตรวจความสอดคล้องกับ spec.md และอนุมัติฉบับส่ง

## 2. Feature specs
- [x] UC-01 `spec.md` Draft v2 มี FR, AF, C, QR, AC, Q
- [x] UC-07 `spec.md` Draft v2 มี FR, AF, C, QR, AC, Q
- [ ] ปิด issue FR-07-01..05 ที่ซ้ำความหมายกันใน UC-07; ต้องแก้โดยเจ้าของ spec/ทีม
- [ ] ตัดสิน Open Questions ที่ยังส่งผลกับ scope
- [ ] ตรวจสถานะ/ลายเซ็นทีมสำหรับ spec ทั้งหมด

## 3. Prototype **6** Features (งานกลุ่ม)
| Slot | ฟีเจอร์ | หลักฐาน | สถานะ |
|---|---|---|---|
| 1 | UC-01 (นายน้อย) | `/?feature=community-location` | React prototype + Mock data เมื่อ VITE_DEMO_MODE=true |
| 2 | UC-07 (นายน้อย) | `/?feature=project-approval` | React prototype + Mock data เมื่อ VITE_DEMO_MODE=true |
| 3 | ให้ทีมเลือก UC | ต้องระบุเจ้าของและ URL/screenshot | รอทีม |
| 4 | ให้ทีมเลือก UC | ต้องระบุเจ้าของและ URL/screenshot | รอทีม |
| 5 | ให้ทีมเลือก UC | ต้องระบุเจ้าของและ URL/screenshot | รอทีม |
| 6 | ให้ทีมเลือก UC | ต้องระบุเจ้าของและ URL/screenshot | รอทีม |

**หมายเหตุ:** Prototype ไม่เท่ากับระบบจริง: ข้อมูลจำลองไม่ใช้ Auth/Database; ต้องถามอาจารย์ว่า Prototype ต้องทำงานจริงระดับใด

## 4. Traceability Matrix
- [x] ร่าง RTM: `specs/001-community-location/rtm.md`
- [x] ร่าง RTM: `specs/007-project-approval/rtm.md`
- [ ] มี Traceability ครบทุก UC จากทีม
- [ ] ยืนยัน links: Requirement → AC → Task → Code → Test/Result
- [ ] บันทึกผล Build + Tests จริงของ branch/repo และรายการข้อบกพร่อง
- [ ] ลงความเห็นแก้ไข/รับความเสี่ยงในช่องทีมตัดสินก่อนส่ง

## 5. วิธีเปิดดูต้นแบบ 2 ฟีเจอร์ของนายน้อย
```bash
cd frontend
npm ci
# Windows PowerShell:
$env:VITE_DEMO_MODE="true"
npm run dev
```
เปิด `http://localhost:5173/?feature=community-location` และ `http://localhost:5173/?feature=project-approval`

บน macOS/Linux ใช้ `VITE_DEMO_MODE=true npm run dev` แทนคำสั่งกำหนดตัวแปร PowerShell

หากไม่เปิด Demo Mode หน้าทั้งสองจะเรียก Backend จริง ซึ่งยังต้องเชื่อม UC-09 Login และ provision สิทธิ์

## 6. งานที่ต้องไม่ทำโดยพลการ
- ไม่ยืนยันการแก้ FR ซ้ำแทนทีม
- ไม่เปิด Mock data ให้ดูเหมือนข้อมูลจริง
- ไม่ Merge เข้า `ploysumlees-670710743/padpadpad-swreqspec` ก่อนทีมรีวิว
- ไม่ถือว่าฟีเจอร์เพื่อนอีก 12 UC เสร็จ เพียงเพราะมีรายชื่อในดัชนี
