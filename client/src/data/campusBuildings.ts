// Real building directory for the Dayananda Sagar Institutions campus,
// transcribed from the physical KEYMAP signboard (client/public/images/map.jpeg).
// Each block number on the map can house multiple departments/facilities.
//
// A handful of legend rows were too worn/blurred on the physical sign to read
// reliably (no block number was assigned in those cases) — see UNPLACED_DEPARTMENTS.
// If you have the real numbers for these, add them to BUILDINGS below.

export interface CampusBuilding {
  number: number;
  departments: string[];
}

export const BUILDINGS: CampusBuilding[] = [
  { number: 1, departments: ['English & Foreign Languages', 'Heritage Block'] },
  { number: 2, departments: ['Library'] },
  { number: 3, departments: ['Automobile Engineering'] },
  { number: 4, departments: ['Civil Engineering', 'Construction Technology & Management'] },
  { number: 5, departments: ['Mechanical Lab Complex'] },
  { number: 6, departments: ['Medical Electronics'] },
  { number: 7, departments: ['Biological Science', 'Electrical Engineering'] },
  { number: 9, departments: ['Chemical Engineering', 'Chemistry'] },
  { number: 10, departments: ['Biotechnology', 'Dr. C.D. Sagar Auditorium', 'Pharmacy'] },
  { number: 11, departments: ['Nursing'] },
  { number: 12, departments: ['Evening College', 'Performing Arts'] },
  { number: 13, departments: ['Fine Arts', 'Journalism', 'Junior Business School (DSJBS)', 'Mechanical Engineering'] },
  { number: 14, departments: ['Arts, Science & Commerce'] },
  { number: 15, departments: ['PGDM (DSBS)'] },
  { number: 16, departments: ['Innovation & Leadership', 'International School'] },
  { number: 17, departments: ['BCA (BU)', 'Electronics & Communication', 'MCA (VTU)'] },
  { number: 18, departments: ['Ladies Hostel — 1'] },
  { number: 19, departments: ['Computer Science & Engineering', 'Information Science & Engineering', 'Physiotherapy'] },
  { number: 20, departments: ['Ladies Hostel — 2 (Sharada Working Women)'] },
  { number: 21, departments: ['Ladies Hostel — 3 (Nelson Mandela)'] },
  { number: 22, departments: ['Electronics & Instrumentation', 'NRI Hostel'] },
  { number: 23, departments: ['Boys Hostel (Sardar Patel Hostel)'] },
  { number: 24, departments: ['Diploma'] },
  { number: 25, departments: ['Dental College', 'DSU'] },
  { number: 26, departments: ['Convention Hall', 'Facilities'] },
  { number: 27, departments: ['Canteen'] },
];

// Legend entries visible on the sign but whose block number was too
// worn/cropped to transcribe reliably — flagged rather than guessed.
export const UNPLACED_DEPARTMENTS: string[] = [
  'Industrial Engineering & Management',
  'Mathematics',
  'Physics',
  'PU College',
  'RIIC',
  'Sports',
  'Telecommunication Engineering',
];
