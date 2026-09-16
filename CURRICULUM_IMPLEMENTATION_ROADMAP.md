# Multi-Curriculum Enrollment Implementation Roadmap

## Quick Reference Guide

### Key Decision Points

**1. System Admin (School Registration)**
- During registration, admin specifies: CBC only, IGCSE only, or BOTH
- System automatically enables/disables corresponding features
- Example: If "CBC only" selected → IGCSE features hidden/inactive

**2. School Admin (Student Enrollment)**
- When enrolling student, admin assigns to CBC or IGCSE path
- Student locked into that curriculum for the academic year
- Admin can view/filter students by curriculum
- Can perform curriculum-specific operations (assignments, grading)

**3. Parent/Guardian Portal**
- Parent sees curriculum for each child (READ-ONLY)
- No ability to change or select curriculum
- Multi-child scenario: Child 1 (CBC) → 1-7 scale, Child 2 (IGCSE) → A*-G scale
- Curriculum clearly badged on child's profile

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    SHULEVERSE SYSTEM                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ System Admin: School Registration                │   │
│  │ • Select: CBC, IGCSE, or BOTH                    │   │
│  │ • Define grade-to-curriculum mapping             │   │
│  │ • Store in curriculum_offerings table            │   │
│  └──────────────────────────────────────────────────┘   │
│                        │                                 │
│                        ▼                                 │
│  ┌──────────────────────────────────────────────────┐   │
│  │ School Admin: Student Enrollment                 │   │
│  │ • Assign student to CBC or IGCSE                 │   │
│  │ • Store in student_curriculum_enrollment table   │   │
│  │ • Student locked to curriculum for year          │   │
│  └──────────────────────────────────────────────────┘   │
│         │                              │                │
│         ▼                              ▼                │
│  ┌─────────────────┐    ┌──────────────────────┐       │
│  │ Teacher/Admin   │    │ Parent/Guardian      │       │
│  │ Dashboard       │    │ Portal               │       │
│  │ - Filter by     │    │ - View child's path  │       │
│  │   curriculum    │    │ - Read-only          │       │
│  │ - Send assign-  │    │ - No selection       │       │
│  │   ments per     │    │ - Curriculum-        │       │
│  │   curriculum    │    │   specific grades    │       │
│  │ - Update grades │    │ - Multi-child: each  │       │
│  │   with correct  │    │   with own path      │       │
│  │   scale         │    │                      │       │
│  └─────────────────┘    └──────────────────────┘       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Database Schema Summary

### New/Modified Tables

```sql
-- Table 1: Link students to curricula (CRITICAL)
student_curriculum_enrollment
├── student_id
├── curriculum_type (CBC, IGCSE)
├── academic_year
├── grade_level (Grade 7, Year 10, etc.)
├── status (active, completed, transferred)
└── created_by (audit)

-- Table 2: Track curriculum changes (audit trail)
curriculum_change_audit
├── student_id
├── old_curriculum
├── new_curriculum
├── changed_by
├── reason
└── changed_at

-- Table 3: Already exists, updated
students
├── ... existing fields ...
├── current_curriculum (cache)
└── curriculum_changed_at

-- Table 4: Already exists
curriculum_offerings
├── school_id
├── curriculum_type (CBC, IGCSE)
├── is_active
└── (enables/disables features)
```

---

## Feature Activation Logic

### School Offering CBC Only
```
✓ CBC Assessment Entry
✓ Competency Tracking
✓ 1-7 Performance Scale
✗ IGCSE Mark Entry (hidden)
✗ Letter Grades A*-G (hidden)
✗ Cambridge Components (hidden)
```

### School Offering IGCSE Only
```
✓ IGCSE Mark Entry
✓ Letter Grades A*-G
✓ Cambridge Components
✗ CBC Assessment Entry (hidden)
✗ Competency Tracking (hidden)
✗ 1-7 Performance Scale (hidden)
```

### School Offering BOTH
```
✓ CBC Assessment Entry
✓ Competency Tracking
✓ 1-7 Performance Scale
✓ IGCSE Mark Entry
✓ Letter Grades A*-G
✓ Cambridge Components
+ Curriculum Selector for students
+ Curriculum Filters for admins
```

---

## Component Changes Summary

### To CREATE
1. **CurriculumSelector.tsx** - Admin selects CBC/IGCSE during school registration
2. **StudentCurriculumAssigner.tsx** - Assign student to curriculum path
3. **CurriculumBadge.tsx** - Display badge showing student's curriculum
4. **CurriculumFilterDropdown.tsx** - Filter students/assignments by curriculum
5. **MultiChildCurriculumView.tsx** - Parent portal multi-child display

### To MODIFY
1. **enhanced-school-registration.tsx** - Add curriculum selection section
2. **student-registration.tsx** - Add curriculum assignment UI
3. **parent-dashboard.tsx** - Add curriculum display per child
4. **teacher-dashboards.tsx** - Add curriculum filtering
5. **RoleBasedNavigation.tsx** - Show/hide features by curriculum
6. **role-based-navigation.tsx** - Curriculum-specific sidebar items

---

## Data Flow Examples

### Example 1: School Registering for Both CBC and IGCSE

```
Admin Action: Select "CBC" ✓ and "IGCSE" ✓ during registration
         ↓
System stores in curriculum_offerings:
  - school_id: ABC123
  - curriculum_type: 'cbc' (is_active: true)
  - curriculum_type: 'igcse' (is_active: true)
         ↓
All CBC and IGCSE features enable automatically
Teachers see curriculum selector when enrolling students
Parents see curriculum info for their children
```

### Example 2: Enrolling Student Alice in CBC

```
Teacher Action: Register new student "Alice"
  - Grade: 7A
  - Curriculum: CBC (selected from dropdown)
         ↓
System creates record in student_curriculum_enrollment:
  - student_id: ALICE001
  - curriculum_type: 'cbc'
  - grade_level: 'Grade 7'
  - academic_year: 2024
         ↓
Updates cache in students table:
  - students.current_curriculum = 'cbc'
         ↓
Alice now appears in:
  - CBC student lists for teachers
  - CBC assessment entry screens
  - CBC gradebook
  
NOT in IGCSE screens (if school offers both)
```

### Example 3: Parent with Two Children (CBC & IGCSE)

```
Parent logs in
         ↓
System fetches children: [Alice, Bob]
         ↓
For Alice (curriculum: CBC):
  - Grade: 7A
  - Curriculum Badge: "Pursuing CBC"
  - Performance Scale: 1-7 Levels
  - Subjects: Learning Areas
  - Report Template: CBC Narrative
         ↓
For Bob (curriculum: IGCSE):
  - Grade: Year 10
  - Curriculum Badge: "Pursuing IGCSE"
  - Performance Scale: A*-G Grades
  - Subjects: Cambridge Subjects
  - Report Template: IGCSE Transcript
         ↓
Parent sees both children with appropriate formats
NO curriculum selection option available
```

---

## API Endpoints Required

### Admin Endpoints
```
POST /api/admin/schools/{schoolId}/curriculum
  Body: {
    curricula: ['cbc', 'igcse'],
    gradeMapping: {
      'Grade 1-6': 'cbc',
      'Year 10-11': 'igcse'
    }
  }

POST /api/admin/students/{studentId}/curriculum-enrollment
  Body: {
    curriculum: 'cbc'|'igcse',
    gradeLevel: 'Grade 7',
    academicYear: 2024
  }

GET /api/admin/students?school_id=X&curriculum=Y
  Returns only students in that curriculum

PATCH /api/admin/students/{studentId}/curriculum
  Body: { newCurriculum: 'igcse', reason: 'Transfer' }
```

### Parent Endpoints
```
GET /api/my-children
  Returns: [{id, name, curriculum: 'cbc'|'igcse', ...}]

GET /api/my-children/{childId}/curriculum
  Returns: {curriculum: 'cbc'|'igcse'} (read-only)

GET /api/my-children/{childId}/grades?curriculum=cbc|igcse
  Returns grades in appropriate format
```

---

## Implementation Checklist

### Week 1-2: Database & Backend
- [ ] Create `student_curriculum_enrollment` table
- [ ] Create `curriculum_change_audit` table
- [ ] Add cache column to `students` table
- [ ] Create API endpoints (admin + parent)
- [ ] Add validation logic
- [ ] Write unit tests

### Week 2-3: Admin Features
- [ ] Create CurriculumSelector component
- [ ] Add to school registration form
- [ ] Create StudentCurriculumAssigner component
- [ ] Add to student enrollment form
- [ ] Create CurriculumFilterDropdown
- [ ] Add to teacher dashboards
- [ ] Test curriculum feature gating

### Week 3-4: Parent Portal
- [ ] Create CurriculumBadge component
- [ ] Modify parent dashboard layout
- [ ] Add curriculum display per child
- [ ] Create MultiChildCurriculumView
- [ ] Add curriculum-specific grade formatting
- [ ] Ensure read-only (no selection options)
- [ ] Test with multiple children

### Week 4-5: Testing & Polish
- [ ] End-to-end testing (all user types)
- [ ] Data migration testing
- [ ] Performance testing
- [ ] UAT with staff
- [ ] Documentation
- [ ] Training materials

### Week 5-6: Deployment
- [ ] Production database migration
- [ ] Staff training
- [ ] Soft launch (pilot school)
- [ ] Monitor & support
- [ ] Full rollout

---

## Success Criteria

- [x] 100% of schools can specify curriculum offerings
- [x] 100% of enrolled students have curriculum assignment
- [x] 0% of students appear in wrong curriculum views
- [x] 100% of parents see correct curriculum for each child
- [x] 0% curriculum-specific features visible for non-enrolled curricula
- [x] All curriculum changes logged in audit trail
- [x] System performance: curriculum queries < 100ms
- [x] Staff reports understanding curriculum system after training

---

## Key Considerations

1. **Immutability**: Once student assigned to curriculum, should NOT be easy to change (requires admin + reason)
2. **Visibility**: Curriculum clearly visible on all student records
3. **Audit Trail**: All curriculum assignments/changes logged with who/when/why
4. **Scaling**: Design supports future curriculum additions (e.g., A-Level, WAEC)
5. **Flexibility**: Schools can change their curriculum offerings (affects future enrollments only, not existing students)
6. **Performance**: Curriculum queries must be fast (cache + index)
7. **User Training**: Staff must understand:
   - Why curriculum selection matters
   - How it affects student experience
   - When/how to transfer students (rarely)
   - Why parents see different grades for different children

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Data migration errors | Test scripts, validation, audit trail |
| Student misassignment | Confirmation dialogs, validation rules |
| Staff confusion | Training, clear UI labels, documentation |
| Performance issues | Indexes, caching, query optimization |
| Parent confusion (multi-child) | Clear labeling, curriculum badge |

This analysis provides the foundation for safe, scalable implementation of the multi-curriculum enrollment system.
