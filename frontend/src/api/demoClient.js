// รองรับ: FR-ENR-01, FR-ENR-02, FR-ENR-03, FR-ENR-04, FR-ENR-05, FR-ENR-06, FR-ENR-07
const DEMO_CAMP = {
  camp_id: 'demo-camp',
  name: 'ค่าย AI สำหรับนักศึกษา (ข้อมูลจำลอง)',
  status: 'open',
  required_fields: [
    'full_name',
    'nickname',
    'student_id',
    'year_level',
    'phone_number',
    'contact_channel',
    'food_allergy',
  ],
  required_documents: [],
};

function createResponse(data, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => data,
  };
}

function createDemoState() {
  return {
    draft: null,
    application: null,
  };
}

function currentTimestamp() {
  return new Date().toISOString();
}

function throwValidationError(errors) {
  const error = new Error('Demo submission validation failed.');
  error.status = 422;
  error.errors = errors;
  throw error;
}

function throwDemoError(status, message) {
  const error = new Error(message);
  error.status = status;
  throw error;
}

// รองรับ: FR-ENR-03, FR-ENR-04, FR-ENR-05, CON-ENR-03, CON-ENR-04
function validateForm(formData) {
  const errors = DEMO_CAMP.required_fields
    .filter((fieldName) => !['year_level', 'food_allergy'].includes(fieldName))
    .flatMap((fieldName) =>
      typeof formData[fieldName] !== 'string' || !formData[fieldName].trim()
        ? [{ field_name: fieldName, error_message: 'กรุณากรอกข้อมูลนี้' }]
        : [],
    );
  const yearLevel = formData.year_level;
  if (typeof yearLevel !== 'string' || !yearLevel.trim()) {
    errors.push({ field_name: 'year_level', error_message: 'กรุณากรอกข้อมูลนี้' });
  } else if (!['1', '2', '3', '4', '5', '6', 'other'].includes(yearLevel)) {
    errors.push({
      field_name: 'year_level',
      error_message: 'กรุณาเลือกระดับชั้นปีที่กำหนด',
    });
  }
  if (yearLevel === 'other' && !hasText(formData.year_level_other)) {
    errors.push({ field_name: 'year_level_other', error_message: 'กรุณากรอกข้อมูลนี้' });
  } else if (yearLevel !== 'other' && hasText(formData.year_level_other)) {
    errors.push({
      field_name: 'year_level_other',
      error_message: 'ไม่ต้องระบุรายละเอียดเมื่อไม่ได้เลือกอื่นๆ',
    });
  }

  const allergy = formData.food_allergy;
  if (typeof allergy !== 'string' || !allergy.trim()) {
    errors.push({ field_name: 'food_allergy', error_message: 'กรุณากรอกข้อมูลนี้' });
  } else if (!['no', 'yes'].includes(allergy)) {
    errors.push({
      field_name: 'food_allergy',
      error_message: 'กรุณาเลือกข้อมูลการแพ้อาหาร',
    });
  } else if (allergy === 'yes' && !hasText(formData.food_allergy_details)) {
    errors.push({
      field_name: 'food_allergy_details',
      error_message: 'กรุณากรอกข้อมูลนี้',
    });
  } else if (allergy === 'no' && hasText(formData.food_allergy_details)) {
    errors.push({
      field_name: 'food_allergy_details',
      error_message: 'ไม่ต้องระบุรายละเอียดเมื่อเลือกไม่มี',
    });
  }

  return errors.concat(validateFormFieldNames(formData));
}

function validateFormFieldNames(formData) {
  const allowedFields = new Set([
    ...DEMO_CAMP.required_fields,
    'year_level_other',
    'food_allergy_details',
  ]);
  return Object.keys(formData)
    .filter((fieldName) => !allowedFields.has(fieldName))
    .map((fieldName) => ({
      field_name: fieldName,
      error_message: 'ไม่รองรับข้อมูลช่องนี้',
    }));
}

function hasText(value) {
  return typeof value === 'string' && Boolean(value.trim());
}

// รองรับ: FR-ENR-01, FR-ENR-02, FR-ENR-03, FR-ENR-04, FR-ENR-05, FR-ENR-06, FR-ENR-07
export function createDemoApiClient({ onSubmitted = () => {} } = {}) {
  const state = createDemoState();

  return {
    getConfiguredCamp() {
      return Promise.resolve(createResponse({ ...DEMO_CAMP }));
    },

    getDraft() {
      if (!state.draft) {
        return Promise.resolve(createResponse({ detail: 'Draft not found.' }, 404));
      }

      return Promise.resolve(
        createResponse({
          draft_id: state.draft.draft_id,
          camp_id: DEMO_CAMP.camp_id,
          form_data: { ...state.draft.form_data },
          last_saved_at: state.draft.last_saved_at,
        }),
      );
    },

    async saveDraft(formData) {
      if (state.application) {
        throwDemoError(409, 'A submitted application already exists for this camp.');
      }
      const fieldErrors = validateFormFieldNames(formData);
      if (fieldErrors.length > 0) throwValidationError(fieldErrors);
      const lastSavedAt = currentTimestamp();
      state.draft = {
        draft_id: state.draft?.draft_id ?? 'demo-draft',
        form_data: { ...formData },
        last_saved_at: lastSavedAt,
      };
      return createResponse({
        draft_id: state.draft.draft_id,
        camp_id: DEMO_CAMP.camp_id,
        form_data: { ...state.draft.form_data },
        last_saved_at: lastSavedAt,
      });
    },

    async submitApplication() {
      if (state.application) {
        throwDemoError(409, 'An application has already been submitted for this camp.');
      }
      if (!state.draft) {
        throwDemoError(404, 'Draft not found.');
      }
      const formData = state.draft.form_data;
      const errors = validateForm(formData);
      if (errors.length > 0) throwValidationError(errors);

      state.application = {
        application_id: 'demo-application-001',
        camp_id: DEMO_CAMP.camp_id,
        form_data: { ...formData },
        status: 'submitted',
        submitted_at: currentTimestamp(),
      };
      state.draft = null;
      onSubmitted(state.application.application_id);
      return createResponse(
        {
          application_id: state.application.application_id,
          camp_id: state.application.camp_id,
          form_data: { ...state.application.form_data },
          status: state.application.status,
        },
        201,
      );
    },

    getApplication(applicationId) {
      if (!state.application || state.application.application_id !== applicationId) {
        const error = new Error('Demo application not found.');
        error.status = 404;
        return Promise.reject(error);
      }
      return Promise.resolve(createResponse({ ...state.application }));
    },
  };
}
