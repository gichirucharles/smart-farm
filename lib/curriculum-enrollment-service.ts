import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export interface StudentEnrollment {
  id: string
  student_id: string
  curriculum_type: 'CBC' | 'IGCSE' | 'KCSE' | 'IB'
  academic_year: number
  grade_level: string
  status: 'active' | 'inactive' | 'completed'
  enrolled_at: string
  created_by: string
  school_id: string
}

export interface CurriculumFeatureStatus {
  school_id: string
  curriculum_type: string
  is_active: boolean
  feature_name: string
  activated_at: string
}

// Get school's curriculum offerings
export async function getSchoolCurricula(schoolId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('curriculum_features_status')
      .select('curriculum_type')
      .eq('school_id', schoolId)
      .eq('is_active', true)

    if (error) throw error
    return data?.map((d) => d.curriculum_type) || []
  } catch (error) {
    console.error('Error fetching school curricula:', error)
    return []
  }
}

// Get student's curriculum enrollment
export async function getStudentEnrollment(
  studentId: string,
  academicYear: number,
): Promise<StudentEnrollment | null> {
  try {
    const { data, error } = await supabase
      .from('student_curriculum_enrollment')
      .select('*')
      .eq('student_id', studentId)
      .eq('academic_year', academicYear)
      .eq('status', 'active')
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data || null
  } catch (error) {
    console.error('Error fetching student enrollment:', error)
    return null
  }
}

// Get all student enrollments for a parent
export async function getParentChildrenEnrollments(parentId: string, academicYear: number) {
  try {
    const { data: children, error: childError } = await supabase
      .from('students')
      .select('id, first_name, last_name, grade_level')
      .eq('parent_id', parentId)

    if (childError) throw childError

    const enrollments = await Promise.all(
      children.map(async (child) => {
        const enrollment = await getStudentEnrollment(child.id, academicYear)
        return {
          student: child,
          enrollment,
        }
      }),
    )

    return enrollments
  } catch (error) {
    console.error('Error fetching parent children enrollments:', error)
    return []
  }
}

// Assign student to curriculum
export async function assignStudentToCurriculum(
  studentId: string,
  schoolId: string,
  curriculumType: string,
  academicYear: number,
  gradeLevel: string,
  createdBy: string,
): Promise<StudentEnrollment | null> {
  try {
    // First, deactivate any existing enrollments for this academic year
    await supabase
      .from('student_curriculum_enrollment')
      .update({ status: 'inactive' })
      .eq('student_id', studentId)
      .eq('academic_year', academicYear)

    // Create new enrollment
    const { data, error } = await supabase
      .from('student_curriculum_enrollment')
      .insert({
        student_id: studentId,
        curriculum_type: curriculumType,
        academic_year: academicYear,
        grade_level: gradeLevel,
        status: 'active',
        created_by: createdBy,
        school_id: schoolId,
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error assigning student to curriculum:', error)
    return null
  }
}

// Get students by curriculum in a school
export async function getStudentsByCurriculum(
  schoolId: string,
  curriculum: string,
  academicYear: number,
) {
  try {
    const { data, error } = await supabase
      .from('student_curriculum_enrollment')
      .select('student_id, grade_level')
      .eq('school_id', schoolId)
      .eq('curriculum_type', curriculum)
      .eq('academic_year', academicYear)
      .eq('status', 'active')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching students by curriculum:', error)
    return []
  }
}

// Get student results by curriculum
export async function getStudentResults(studentId: string, curriculum: string) {
  try {
    const { data, error } = await supabase
      .from('student_results')
      .select('*')
      .eq('student_id', studentId)
      .eq('curriculum_type', curriculum)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching student results:', error)
    return []
  }
}

// Check if school offers curriculum
export async function schoolOffersCurriculum(schoolId: string, curriculum: string): Promise<boolean> {
  try {
    const curricula = await getSchoolCurricula(schoolId)
    return curricula.includes(curriculum)
  } catch (error) {
    console.error('Error checking curriculum offering:', error)
    return false
  }
}
