# Multi-Curriculum Student Enrollment System Analysis Report

## Executive Summary

This report analyzes the requirements for implementing a multi-curriculum enrollment system where schools can offer CBC, IGCSE, or both curricula simultaneously. Students are assigned to specific curricula at enrollment, and the system must reflect this throughout the platform for admins and parents.

---

## 1. CURRENT SYSTEM STATE ANALYSIS

### 1.1 Existing Infrastructure
- **Curriculum System**: Already defined in `/lib/curriculum-system.ts` (CBC, KCSE, IGCSE, IB support)
- **Database Schema**: Migration script created (`add-curriculum-system.sql`) with:
  - `curriculum_offerings` table
  - `curriculum_grade_mappings` table
  - `curriculum_features` table
  - Database functions for curriculum queries
- **Context Provider**: `CurriculumProvider` already built in `/contexts/curriculum-context.tsx`
- **Student Data Structure**: Currently uses mock data with class/grade assignment but NO curriculum assignment

### 1.2 Missing Components
- No `student_curriculum_enrollment` table linking students to specific curricula
- No curriculum selection UI during school registration
- Parent portal doesn't display curriculum information
- Admin dashboards lack curriculum-based student filtering
- No way to assign students to specific curricula paths

---

## 2. REQUIREMENTS ANALYSIS

### 2.1 System Admin (School Registration) Requirements
**During School Registration:**
- ✓ Select which curricula the school offers (CBC, IGCSE, or BOTH)
- ✓ Specify which grades/forms use which curriculum
- ✓ Set curriculum as "active" or "inactive"
- ✓ Store configuration in database for future reference

**Data Flow:**
```
Admin selects curricula → School registration form → Store in curriculum_offerings table
                      → Automatically activate/deactivate features in UI
```

### 2.2 School Admin (Teachers/Headteachers) Requirements
**Curriculum Management:**
- ✓ View list of students enrolled in THEIR curriculum only (or both if school offers both)
- ✓ Assign students to CBC or IGCSE path at enrollment/registration
- ✓ Change student's curriculum path if allowed (with audit trail)
- ✓ Perform curriculum-specific operations:
  - Send assignments (different templates/requirements per curriculum)
  - Update results (different grading scales per curriculum)
  - Generate reports (CBC uses 1-7, IGCSE uses A*-G)

**Data Flow:**
```
Student enrollment → Admin selects curriculum for student → Store in student_curriculum_enrollment
                  → Student appears in curriculum-specific views
                  → Assessments/assignments/grades use appropriate scale
```

### 2.3 Parent/Guardian Portal Requirements
**View-Only Curriculum Information:**
- ✓ No ability to select or change curriculum
- ✓ See each child's assigned curriculum clearly displayed
- ✓ View results using appropriate grading scale for that child's curriculum
- ✓ Multi-child scenario: Child 1 (CBC) shows 1-7 scale, Child 2 (IGCSE) shows A*-G
- ✓ Separate performance tabs for each curriculum path

**Data Flow:**
```
Parent logs in → System fetches their children → For each child, fetch student_curriculum_enrollment
             → Display curriculum-specific grades and reports
             → No selection/change options available
```

---

## 3. DATABASE SCHEMA DESIGN

### 3.1 New Table: `student_curriculum_enrollment`
This is the CRITICAL table linking students to curricula.

```sql
CREATE TABLE student_curriculum_enrollment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  curriculum_type TEXT NOT NULL CHECK (curriculum_type IN ('cbc', 'kcse', 'igcse', 'ib')),
  grade_level TEXT NOT NULL,  -- e.g., "Grade 7", "Year 10", "Form 1"
  academic_year INTEGER NOT NULL,
  enrollment_date TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'transferred', 'withdrawn')),
  primary_curriculum BOOLEAN DEFAULT false,  -- Indicates main curriculum
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Ensure one student can't be in two curricula in same year
  UNIQUE(student_id, school_id, curriculum_type, academic_year)
);
```

### 3.2 Modification to Existing Tables

**students table additions:**
```sql
ALTER TABLE students 
  ADD COLUMN IF NOT EXISTS current_curriculum TEXT,  -- Cached for quick access
  ADD COLUMN IF NOT EXISTS curriculum_changed_at TIMESTAMP;
```

### 3.3 Supporting Tables

**`curriculum_change_audit`** - Track curriculum transfers:
```sql
CREATE TABLE curriculum_change_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id),
  old_curriculum TEXT,
  new_curriculum TEXT,
  changed_by UUID REFERENCES users(id),
  reason TEXT,
  changed_at TIMESTAMP DEFAULT NOW()
);
```

---

## 4. IMPLEMENTATION APPROACH

### 4.1 Phase 1: School Registration Enhancement
**What to modify:** `enhanced-school-registration.tsx`

Add new section:
```
┌─────────────────────────────────────────┐
│ Curriculum Offerings Section            │
├─────────────────────────────────────────┤
│ ☑ CBC (Competency-Based Curriculum)    │
│ ☑ IGCSE (International Certificate)    │
│ ☐ IB (International Baccalaureate)     │
│ ☐ KCSE (Kenya Certificate)             │
├─────────────────────────────────────────┤
│ Grade Assignments:                      │
│ Grade 1-6  →  CBC                      │
│ Grade 7-9  →  CBC                      │
│ Year 10-11 →  IGCSE                    │
└─────────────────────────────────────────┘
```

**Validation Logic:**
- At least one curriculum must be selected
- Each grade can be assigned to only one curriculum
- If only CBC, IGCSE features automatically disable
- If only IGCSE, CBC features automatically disable
- If both, both feature sets remain active

### 4.2 Phase 2: Student Enrollment/Registration
**New Component:** `student-curriculum-selector.tsx`

Admin interface when registering a student:
```
┌──────────────────────────────┐
│ Student: John Doe            │
│ Grade: 7                      │
├──────────────────────────────┤
│ Curriculum Path:             │
│ ○ CBC (1-7 Performance)      │
│ ○ IGCSE (A*-G Grades)        │
│                              │
│ [Save Enrollment]            │
└──────────────────────────────┘
```

**Database Operation:**
1. Create record in `student_curriculum_enrollment` table
2. Update `students.current_curriculum` cache
3. Log action in audit trail

### 4.3 Phase 3: Admin Dashboard Filtering
**Modifications to teacher dashboards:**

```typescript
// Class teacher sees only students in their assigned curriculum
GET /api/students?school_id=X&curriculum=CBC
GET /api/students?school_id=X&curriculum=IGCSE

// Filter UI component shows only applicable curricula
if (schoolOfferings.includes('CBC')) render_cbc_filters()
if (schoolOfferings.includes('IGCSE')) render_igcse_filters()
```

### 4.4 Phase 4: Parent Portal Display
**Modifications to parent dashboard:**

```typescript
// Fetch child's curriculum at load
GET /api/students/{childId}/curriculum_enrollment

// Display curriculum-specific sections
if (child.curriculum === 'CBC') {
  renderCBCPerformance(1-7 scale)
  renderCBCCompetencies()
} else if (child.curriculum === 'IGCSE') {
  renderIGCSEGrades(A*-G scale)
  renderIGCSEComponents()
}
```

**Multi-child UI Layout:**
```
┌─────────────────────────────────────────────┐
│ My Children                                 │
├─────────────────────────────────────────────┤
│                                             │
│ Alice Doe (CBC) ▼                          │
│ ├─ Grade: 7A                               │
│ ├─ Curriculum: Competency-Based (1-7)      │
│ ├─ Performance: Level 5 (Developing)       │
│ └─ [View Details]                          │
│                                             │
│ Bob Doe (IGCSE) ▼                          │
│ ├─ Grade: Year 10                          │
│ ├─ Curriculum: Cambridge IGCSE (A*-G)      │
│ ├─ Performance: Grade B                    │
│ └─ [View Details]                          │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 5. CURRICULUM-SPECIFIC OPERATIONS MAPPING

### 5.1 Assignment Management
| Operation | CBC Path | IGCSE Path |
|-----------|----------|-----------|
| Format | Competency-based tasks | Subject assessments |
| Grading | 1-7 performance levels | Marks/Percentages |
| Feedback | Competency narratives | Grade & comments |
| Deadlines | Flexible, ongoing | Fixed exam dates |

### 5.2 Grades & Results
| Aspect | CBC | IGCSE |
|--------|-----|-------|
| Scale | 1-7 | A*-G |
| Components | Learning areas | Exam papers |
| Subjects | 7 learning areas | 30+ subjects |
| Report | Narrative + performance | Grade transcript |

### 5.3 Assessment Tools
| Tool | CBC Variant | IGCSE Variant |
|------|------------|--------------|
| Entry Form | Performance levels | Component marks |
| Gradebook | Competency matrix | Mark aggregator |
| Report | CBC narrative template | IGCSE transcript |
| Parent View | Level descriptions | Grade explanations |

---

## 6. DATA FLOW DIAGRAMS

### 6.1 Admin School Registration Flow
```
┌─────────────────┐
│ Admin selects   │
│ CBC, IGCSE, or  │
│ BOTH            │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ curriculum_offerings table   │
│ - school_id                 │
│ - curriculum_type (CBC/IGCSE)│
│ - is_active = true          │
└────────┬────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ curriculum_features table     │
│ - Automatically enable/disable│
│   features per curriculum    │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ System automatically activates│
│ CBC UI if selected, IGCSE UI │
│ if selected, both if selected│
└──────────────────────────────┘
```

### 6.2 Student Enrollment Flow
```
┌─────────────────────────────┐
│ Admin registers new student │
│ Selects name, class, DOB    │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ System shows available       │
│ curriculum paths for that   │
│ grade/form                  │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Admin selects curriculum    │
│ (CBC or IGCSE)             │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ student_curriculum_enrollment    │
│ - student_id                    │
│ - curriculum_type              │
│ - academic_year                │
│ - created_by (audit)           │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ students.current_curriculum │
│ cached for fast lookups     │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Student now appears in      │
│ curriculum-specific views   │
│ and receives appropriate    │
│ assignments/grading         │
└─────────────────────────────┘
```

### 6.3 Parent Portal Display Flow
```
┌─────────────────────┐
│ Parent logs in      │
└────────┬────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Query: SELECT children FROM       │
│ parent_student_relationship       │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ For each child, fetch:            │
│ - student_curriculum_enrollment   │
│ - Current grades/performance      │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Render child-specific views:      │
│ - CBC child: Show 1-7 scale      │
│ - IGCSE child: Show A*-G scale   │
│ - No curriculum selection option │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Display curriculum badge:         │
│ "Pursuing CBC" or "Pursuing IGCSE"│
│ Read-only, no changes allowed    │
└──────────────────────────────────┘
```

---

## 7. API ENDPOINTS REQUIRED

### 7.1 Admin Endpoints
```
POST /api/admin/schools/{schoolId}/curriculum
  - Set school's curriculum offerings
  - Payload: { curricula: ['cbc', 'igcse'], gradeMapping: {...} }

POST /api/admin/students/{studentId}/curriculum-enrollment
  - Assign student to curriculum
  - Payload: { curriculum: 'cbc'|'igcse', gradeLevel: 'Grade 7' }

GET /api/admin/students?school_id=X&curriculum=Y
  - Filter students by curriculum

PATCH /api/admin/students/{studentId}/curriculum
  - Transfer student between curricula (with audit)
  - Payload: { newCurriculum: 'igcse', reason: 'Student request' }
```

### 7.2 Teacher Endpoints
```
GET /api/my-students?curriculum=cbc
  - Get only students in teacher's assigned curriculum

POST /api/assignments/{assignmentId}/submit-for-{curriculum}
  - Submit assignment using curriculum-specific template

GET /api/grades/{studentId}?format=cbc|igcse
  - Fetch grades in appropriate format
```

### 7.3 Parent Endpoints
```
GET /api/my-children
  - Returns array of children with curriculum info

GET /api/my-children/{childId}/curriculum
  - Get child's curriculum path (read-only)

GET /api/my-children/{childId}/grades
  - Get grades in curriculum-appropriate format
```

---

## 8. UI COMPONENTS TO CREATE/MODIFY

### 8.1 New Components
| Component | Purpose |
|-----------|---------|
| `CurriculumSelector` | School admin selects CBC/IGCSE during registration |
| `StudentCurriculumAssigner` | Assign student to curriculum path |
| `CurriculumBadge` | Display "CBC" or "IGCSE" badge on student cards |
| `CurriculumPerformanceDisplay` | Render 1-7 or A*-G based on curriculum |
| `CurriculumFilterDropdown` | Filter students by curriculum in admin views |

### 8.2 Components to Modify
| Component | Changes |
|-----------|---------|
| `enhanced-school-registration.tsx` | Add curriculum selection section |
| `student-registration.tsx` | Add curriculum assignment UI |
| `parent-dashboard.tsx` | Add curriculum display per child |
| `teacher-dashboards.tsx` | Add curriculum filtering |
| `RoleBasedNavigation` | Show/hide features based on curricula |

---

## 9. FEATURE ACTIVATION MATRIX

### 9.1 School Offering CBC Only
| Feature | Active | Read-only | Inactive |
|---------|--------|-----------|----------|
| CBC Assessment Entry | ✓ | - | - |
| Competency Tracking | ✓ | - | - |
| 1-7 Performance Scale | ✓ | - | - |
| IGCSE Mark Entry | - | - | ✓ |
| Letter Grades (A*-G) | - | - | ✓ |
| Cambridge Components | - | - | ✓ |

### 9.2 School Offering IGCSE Only
| Feature | Active | Read-only | Inactive |
|---------|--------|-----------|----------|
| IGCSE Mark Entry | ✓ | - | - |
| Letter Grades (A*-G) | ✓ | - | - |
| Cambridge Components | ✓ | - | - |
| CBC Assessment Entry | - | - | ✓ |
| Competency Tracking | - | - | ✓ |
| 1-7 Performance Scale | - | - | ✓ |

### 9.3 School Offering BOTH
| Feature | Active | Read-only | Inactive |
|---------|--------|-----------|----------|
| CBC Features | ✓ | - | - |
| IGCSE Features | ✓ | - | - |
| Curriculum Selector | ✓ | - | - |
| Student Assignment | ✓ | - | - |
| Performance Views | ✓* | - | - |
*Shown based on individual student's curriculum

---

## 10. EDGE CASES & SOLUTIONS

### 10.1 Student Transfers Between Curricula
**Case:** Student needs to switch from CBC (Grade 9) to IGCSE (Year 10)
**Solution:**
1. Create new `student_curriculum_enrollment` record
2. Mark old record as `status='transferred'`
3. Log in `curriculum_change_audit`
4. Update cached `students.current_curriculum`
5. Migrate grades using conversion formula (if applicable)

### 10.2 Duplicate Student Records
**Case:** Parent has child in CBC and another child in IGCSE
**Solution:**
- Each child is separate `students` record
- Each has separate `student_curriculum_enrollment` entry
- Parent portal queries both, displays separately

### 10.3 Grade/Subject Differences
**Case:** CBC "Mathematics" vs IGCSE "Mathematics" are different subjects
**Solution:**
- Store curriculum_type in grades table
- Join on (grade, curriculum_type) when querying
- Use curriculum-specific subject mappings

### 10.4 Report Generation
**Case:** Generating report for student must use correct template
**Solution:**
1. Query `student_curriculum_enrollment` for curriculum type
2. Select appropriate template (CBC narrative vs IGCSE transcript)
3. Pass curriculum parameter to report generator
4. Format output accordingly

---

## 11. ROLLOUT STRATEGY

### Phase 1 (Week 1-2): Foundation
- [ ] Execute SQL migrations (student_curriculum_enrollment table)
- [ ] Create new API endpoints
- [ ] Build StudentCurriculumAssigner component

### Phase 2 (Week 2-3): Admin Features
- [ ] Add curriculum selection to school registration
- [ ] Add curriculum selection to student enrollment
- [ ] Add curriculum filtering to admin dashboards
- [ ] Test curriculum feature gating

### Phase 3 (Week 3-4): Parent Portal
- [ ] Add curriculum display to parent dashboard
- [ ] Create curriculum-specific grade views
- [ ] Multi-child curriculum display
- [ ] Parent UAT testing

### Phase 4 (Week 4-5): Teacher Features
- [ ] Curriculum-specific assignment templates
- [ ] Curriculum-based grading interfaces
- [ ] Teacher filtering and views
- [ ] Teacher UAT testing

### Phase 5 (Week 5-6): Testing & Rollout
- [ ] End-to-end testing (all user types)
- [ ] Data migration from existing system
- [ ] Staff training
- [ ] Production deployment

---

## 12. SUCCESS METRICS

- [ ] 100% of schools can specify curriculum offerings
- [ ] 100% of enrolled students have curriculum assignment
- [ ] 0 students appear in wrong curriculum views
- [ ] 100% of parents see correct curriculum for each child
- [ ] No curriculum-specific features visible for non-enrolled curricula
- [ ] Audit trail shows all curriculum changes
- [ ] System performance: curriculum queries < 100ms

---

## 13. IMPLEMENTATION PRIORITIES

### HIGH PRIORITY
1. Create `student_curriculum_enrollment` table
2. Add curriculum selection to school registration
3. Add curriculum assignment to student enrollment
4. Implement parent portal curriculum display

### MEDIUM PRIORITY
5. Add admin dashboard curriculum filtering
6. Create curriculum-specific assignment templates
7. Implement curriculum-based grading interfaces
8. Add curriculum change audit trail

### LOW PRIORITY (Phase 2)
9. Curriculum transfer workflows
10. Automated reports per curriculum
11. Advanced analytics per curriculum
12. Mobile app curriculum support

---

## 14. RISK ASSESSMENT

| Risk | Impact | Probability | Mitigation |
|------|--------|------------|-----------|
| Data migration errors | High | Medium | Test scripts, audit trail |
| Performance with large datasets | Medium | Low | Indexes, query optimization |
| Staff confusion about curriculum paths | High | High | Training, UI clarity |
| Student misassignment | High | Medium | Validation, audit trail |
| Parent confusion (multiple children) | Medium | Medium | Clear UI labeling |

---

## Conclusion

The multi-curriculum enrollment system is architecturally sound with the existing infrastructure. The main additions needed are:
1. `student_curriculum_enrollment` table to link students to curricula
2. UI components for admin/parent curriculum management
3. API endpoints for curriculum filtering and assignment
4. Curriculum-specific display logic in parent and admin portals

This creates a flexible, scalable system supporting single or multi-curriculum schools with appropriate feature gating and read-only parent views.
