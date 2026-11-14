export const KENYAN_COUNTIES = [
  "Baringo",
  "Bomet",
  "Bungoma",
  "Busia",
  "Elgeyo-Marakwet",
  "Embu",
  "Garissa",
  "Homa Bay",
  "Isiolo",
  "Kajiado",
  "Kakamega",
  "Kericho",
  "Kiambu",
  "Kilifi",
  "Kirinyaga",
  "Kisii",
  "Kisumu",
  "Kitui",
  "Kwale",
  "Laikipia",
  "Lamu",
  "Machakos",
  "Makueni",
  "Mandera",
  "Marsabit",
  "Meru",
  "Migori",
  "Mombasa",
  "Murang'a",
  "Nairobi City",
  "Nakuru",
  "Nandi",
  "Narok",
  "Nyamira",
  "Nyandarua",
  "Nyeri",
  "Samburu",
  "Siaya",
  "Taita-Taveta",
  "Tana River",
  "Tharaka-Nithi",
  "Trans Nzoia",
  "Turkana",
  "Uasin Gishu",
  "Vihiga",
  "Wajir",
  "West Pokot",
] as const

export type KenyanCounty = (typeof KENYAN_COUNTIES)[number]
export type SchoolStatus = "active" | "under review"

export interface School {
  id: string
  name: string
  logo: string
  location: string
  county: KenyanCounty
  headTeacher: string
  studentsCount: number
  teachersCount: number
  performanceIndex: number
  status: SchoolStatus
  contactEmail: string
  contactPhone: string
  website: string
  establishedYear: number
}

export type NewSchoolDraft = Pick<
  School,
  "name" | "location" | "county" | "headTeacher" | "contactEmail" | "contactPhone"
>

export const INITIAL_SCHOOLS: School[] = [
  {
    id: "sch001",
    name: "Unity Primary School",
    logo: "/placeholder.svg?height=40&width=40",
    location: "Nairobi",
    county: "Nairobi City",
    headTeacher: "Dr. James Mwangi",
    studentsCount: 856,
    teachersCount: 42,
    performanceIndex: 87,
    status: "active",
    contactEmail: "info@unityprimary.example",
    contactPhone: "+254 700 000 001",
    website: "https://unityprimary.example",
    establishedYear: 2005,
  },
  {
    id: "sch002",
    name: "Excellence Academy",
    logo: "/placeholder.svg?height=40&width=40",
    location: "Mombasa",
    county: "Mombasa",
    headTeacher: "Mrs. Sarah Kimani",
    studentsCount: 1045,
    teachersCount: 56,
    performanceIndex: 92,
    status: "active",
    contactEmail: "info@excellenceacademy.example",
    contactPhone: "+254 700 000 002",
    website: "https://excellenceacademy.example",
    establishedYear: 2008,
  },
  {
    id: "sch003",
    name: "Heritage International School",
    logo: "/placeholder.svg?height=40&width=40",
    location: "Kisumu",
    county: "Kisumu",
    headTeacher: "Mr. Peter Odhiambo",
    studentsCount: 723,
    teachersCount: 38,
    performanceIndex: 85,
    status: "active",
    contactEmail: "info@heritage.example",
    contactPhone: "+254 700 000 003",
    website: "https://heritage.example",
    establishedYear: 2010,
  },
  {
    id: "sch004",
    name: "Pioneer Secondary School",
    logo: "/placeholder.svg?height=40&width=40",
    location: "Nakuru",
    county: "Nakuru",
    headTeacher: "Dr. Elizabeth Njoroge",
    studentsCount: 912,
    teachersCount: 47,
    performanceIndex: 89,
    status: "active",
    contactEmail: "info@pioneersecondary.example",
    contactPhone: "+254 700 000 004",
    website: "https://pioneersecondary.example",
    establishedYear: 2003,
  },
  {
    id: "sch005",
    name: "Greenview Primary School",
    logo: "/placeholder.svg?height=40&width=40",
    location: "Kiambu",
    county: "Kiambu",
    headTeacher: "Mr. Thomas Kamau",
    studentsCount: 678,
    teachersCount: 34,
    performanceIndex: 82,
    status: "under review",
    contactEmail: "info@greenview.example",
    contactPhone: "+254 700 000 005",
    website: "https://greenview.example",
    establishedYear: 2012,
  },
  {
    id: "sch006",
    name: "Lakeside International School",
    logo: "/placeholder.svg?height=40&width=40",
    location: "Eldoret",
    county: "Uasin Gishu",
    headTeacher: "Mrs. Hannah Wanjiku",
    studentsCount: 589,
    teachersCount: 31,
    performanceIndex: 84,
    status: "active",
    contactEmail: "info@lakeside.example",
    contactPhone: "+254 700 000 006",
    website: "https://lakeside.example",
    establishedYear: 2014,
  },
]
