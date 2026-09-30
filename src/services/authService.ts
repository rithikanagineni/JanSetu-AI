import { UserAccount } from '../types';

export const DEMO_CITIZENS: UserAccount[] = [
  {
    id: 'CIT-TS-001',
    name: 'Ramesh Kumar',
    emailOrPhone: '9848022334',
    role: 'citizen',
    villageOrCity: 'Bhoothpur Village',
    district: 'Mahabubnagar',
    state: 'Telangana',
    preferredLanguage: 'Telugu',
  },
  {
    id: 'CIT-UP-001',
    name: 'Sunita Devi',
    emailOrPhone: '9415011223',
    role: 'citizen',
    villageOrCity: 'Chopan Locality',
    district: 'Sonbhadra',
    state: 'Uttar Pradesh',
    preferredLanguage: 'Hindi',
  },
  {
    id: 'CIT-KA-001',
    name: 'Priya R.',
    emailOrPhone: '9886033445',
    role: 'citizen',
    villageOrCity: 'Manvi Rural',
    district: 'Raichur',
    state: 'Karnataka',
    preferredLanguage: 'English',
  },
];

export const DEMO_OFFICERS: UserAccount[] = [
  {
    id: 'GOV-TS-DM01',
    name: 'Dr. V. Rao, IAS',
    emailOrPhone: 'v.rao@telangana.gov.in',
    role: 'governance',
    department: 'District Collectorate & Planning',
    designation: 'District Magistrate & Collector',
    jurisdiction: 'Mahabubnagar District',
    district: 'Mahabubnagar',
    state: 'Telangana',
  },
  {
    id: 'GOV-UP-DIR01',
    name: 'Dr. S. Verma, IAS',
    emailOrPhone: 's.verma@mohfw.gov.in',
    role: 'governance',
    department: 'Dept of Health & Family Welfare',
    designation: 'State Mission Director (NHM)',
    jurisdiction: 'Uttar Pradesh & Inter-State Health',
    district: 'Sonbhadra',
    state: 'Uttar Pradesh',
  },
  {
    id: 'GOV-MH-PWD01',
    name: 'A. Nair, CE',
    emailOrPhone: 'a.nair@pwd.maharashtra.gov.in',
    role: 'governance',
    department: 'Public Works & Infrastructure',
    designation: 'Chief Executive Engineer',
    jurisdiction: 'Gadchiroli & Tribal Belt',
    district: 'Gadchiroli',
    state: 'Maharashtra',
  },
];

const AUTH_STORAGE_KEY = 'jansetu_active_user';

export const authService = {
  getCurrentUser(): UserAccount | null {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored user:', e);
    }
    return null;
  },

  setCurrentUser(user: UserAccount | null): void {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  },

  loginCitizen(emailOrPhone: string): UserAccount {
    // Check against pre-seeded or generate custom citizen
    const match = DEMO_CITIZENS.find(
      c => c.emailOrPhone.toLowerCase() === emailOrPhone.toLowerCase().trim()
    );
    if (match) {
      this.setCurrentUser(match);
      return match;
    }
    // New citizen login
    const newCitizen: UserAccount = {
      id: `CIT-${Date.now().toString().slice(-6)}`,
      name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : `Citizen (${emailOrPhone.slice(-4)})`,
      emailOrPhone,
      role: 'citizen',
      district: 'Mahabubnagar',
      state: 'Telangana',
      preferredLanguage: 'English',
    };
    this.setCurrentUser(newCitizen);
    return newCitizen;
  },

  registerCitizen(details: {
    name: string;
    emailOrPhone: string;
    villageOrCity: string;
    district: string;
    state: string;
    preferredLanguage: string;
  }): UserAccount {
    const newCitizen: UserAccount = {
      id: `CIT-${Date.now().toString().slice(-6)}`,
      name: details.name,
      emailOrPhone: details.emailOrPhone,
      role: 'citizen',
      villageOrCity: details.villageOrCity,
      district: details.district,
      state: details.state,
      preferredLanguage: details.preferredLanguage || 'English',
    };
    this.setCurrentUser(newCitizen);
    return newCitizen;
  },

  loginOfficer(emailOrPhone: string): UserAccount {
    const match = DEMO_OFFICERS.find(
      o => o.emailOrPhone.toLowerCase() === emailOrPhone.toLowerCase().trim()
    );
    if (match) {
      this.setCurrentUser(match);
      return match;
    }
    const newOfficer: UserAccount = {
      id: `GOV-${Date.now().toString().slice(-6)}`,
      name: emailOrPhone.includes('@') ? `Officer ${emailOrPhone.split('@')[0]}` : 'Governance Officer',
      emailOrPhone,
      role: 'governance',
      department: 'Planning & Administration',
      designation: 'Public Planning Authority',
      jurisdiction: 'District Level',
      district: 'Mahabubnagar',
      state: 'Telangana',
    };
    this.setCurrentUser(newOfficer);
    return newOfficer;
  },

  registerOfficer(details: {
    name: string;
    emailOrPhone: string;
    department: string;
    designation: string;
    jurisdiction: string;
    district: string;
    state: string;
  }): UserAccount {
    const newOfficer: UserAccount = {
      id: `GOV-${Date.now().toString().slice(-6)}`,
      name: details.name,
      emailOrPhone: details.emailOrPhone,
      role: 'governance',
      department: details.department,
      designation: details.designation,
      jurisdiction: details.jurisdiction,
      district: details.district,
      state: details.state,
    };
    this.setCurrentUser(newOfficer);
    return newOfficer;
  },

  logout(): void {
    this.setCurrentUser(null);
  },
};
