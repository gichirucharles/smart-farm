import { z } from "zod"

const text = (max = 300) => z.string().trim().max(max)
const emailText = z.union([z.literal(""), z.string().trim().email().max(254)])
const dateText = z.union([z.literal(""), z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/)])
const timeText = z.string().regex(/^([01]\\d|2[0-3]):[0-5]\\d$/)

export const staffMemberSchema = z.object({
  id: text(100),
  name: text(160),
  position: text(120),
  email: emailText,
  phone: text(40),
}).strict()

export const schoolProfileSchema = z.object({
  schoolName: text(180).min(1),
  schoolType: text(100),
  governmentId: text(100),
  registrationNumber: text(100),
  motto: text(300),
  logoUrl: text(2048),
  address: text(500),
  city: text(120),
  county: text(120),
  postalCode: text(30),
  phone: text(40),
  email: emailText,
  website: z.union([z.literal(""), z.string().trim().url().max(2048)]),
  establishedYear: z.union([z.number().int().min(1800).max(2200), z.literal("")]),
  studentCapacity: z.union([z.number().int().min(0).max(1000000), z.literal("")]),
  description: text(4000),
  directorName: text(160),
  directorEmail: emailText,
  directorPhone: text(40),
  headTeacherName: text(160),
  headTeacherEmail: emailText,
  headTeacherPhone: text(40),
  staff: z.array(staffMemberSchema).max(100),
}).strict()

export const termSchema = z.object({
  id: text(100),
  name: text(80),
  startDate: dateText,
  endDate: dateText,
}).strict()

export const holidaySchema = z.object({
  id: text(100),
  name: text(160),
  date: dateText,
  description: text(1000),
}).strict()

export const classStructureSchema = z.object({
  id: text(100),
  grade: text(80),
  streams: z.array(text(80)).max(20),
  subjects: z.array(text(100)).max(100),
}).strict()

export const editableSchoolSettingsSchema = z.object({
  academicYear: text(40),
  terms: z.array(termSchema).max(3),
  holidays: z.array(holidaySchema).max(100),
  classStructure: z.array(classStructureSchema).max(100),
  timetable: z.object({
    schoolStart: timeText,
    schoolEnd: timeText,
    lessonDurationMinutes: z.number().int().min(1).max(240),
    shortBreakMinutes: z.number().int().min(0).max(240),
    lunchMinutes: z.number().int().min(0).max(240),
    lessonsPerDay: z.number().int().min(1).max(20),
  }).strict(),
  assessment: z.object({
    passMark: z.number().min(0).max(100),
    gradingBands: z.array(z.object({
      label: text(40),
      min: z.number().min(0).max(100),
      max: z.number().min(0).max(100),
    }).strict()).max(20),
  }).strict(),
  policies: z.object({
    attendance: text(4000),
    uniform: text(4000),
    discipline: text(4000),
    admissions: text(4000),
  }).strict(),
  facilities: z.object({
    classrooms: z.number().int().min(0).max(10000),
    scienceLab: z.boolean(),
    computerLab: z.boolean(),
    languageLab: z.boolean(),
    library: z.boolean(),
    sportsGround: z.boolean(),
  }).strict(),
}).strict()

export type SchoolProfile = z.infer<typeof schoolProfileSchema>
export type EditableSchoolSettings = z.infer<typeof editableSchoolSettingsSchema>
export type SchoolSettings = EditableSchoolSettings & {
  feeStructure: Array<{ name: string; amount: number; currency: string; frequency: string }>
}

export const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
  schoolName: "",
  schoolType: "",
  governmentId: "",
  registrationNumber: "",
  motto: "",
  logoUrl: "",
  address: "",
  city: "",
  county: "",
  postalCode: "",
  phone: "",
  email: "",
  website: "",
  establishedYear: "",
  studentCapacity: "",
  description: "",
  directorName: "",
  directorEmail: "",
  directorPhone: "",
  headTeacherName: "",
  headTeacherEmail: "",
  headTeacherPhone: "",
  staff: [],
}

export const DEFAULT_EDITABLE_SCHOOL_SETTINGS: EditableSchoolSettings = {
  academicYear: "",
  terms: [
    { id: "term-1", name: "Term 1", startDate: "", endDate: "" },
    { id: "term-2", name: "Term 2", startDate: "", endDate: "" },
    { id: "term-3", name: "Term 3", startDate: "", endDate: "" },
  ],
  holidays: [],
  classStructure: [],
  timetable: {
    schoolStart: "08:00",
    schoolEnd: "15:30",
    lessonDurationMinutes: 40,
    shortBreakMinutes: 20,
    lunchMinutes: 40,
    lessonsPerDay: 8,
  },
  assessment: {
    passMark: 50,
    gradingBands: [
      { label: "Exceeds expectations", min: 80, max: 100 },
      { label: "Meets expectations", min: 50, max: 79 },
      { label: "Approaching expectations", min: 30, max: 49 },
      { label: "Below expectations", min: 0, max: 29 },
    ],
  },
  policies: { attendance: "", uniform: "", discipline: "", admissions: "" },
  facilities: {
    classrooms: 0,
    scienceLab: false,
    computerLab: false,
    languageLab: false,
    library: false,
    sportsGround: false,
  },
}

export const DEFAULT_SCHOOL_SETTINGS: SchoolSettings = {
  ...DEFAULT_EDITABLE_SCHOOL_SETTINGS,
  feeStructure: [],
}

export const POLICY_DOCUMENT_BUCKET = "school-policy-documents"
export const MAX_POLICY_DOCUMENT_BYTES = 12 * 1024 * 1024
export const POLICY_DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
] as const
