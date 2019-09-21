export interface common {
  label: string;
  text: string;
}

export interface title {
  level: number;
  href: string;
  title: string;
  children: any[];
}

export interface education {
  school: string;
  professional: string;
  record: string;
  time: string;
}

export interface personal {
  title: string;
  content: common[];
}

export interface work {
  company: string;
  time: string;
  job: string;
  mainContent: common[];
}

export interface project {
  projectName: string;
  time: string;
  role: string;
  projectDesc: common[];
  responsibility: common[];
  technology: string;
}
