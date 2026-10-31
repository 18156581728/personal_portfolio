export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  index: string;
}

export const navigationItems: NavigationItem[] = [
  { id: "projects", label: "项目", href: "/projects", index: "01" },
  { id: "about", label: "关于", href: "/about", index: "02" },
  { id: "skills", label: "技能", href: "/skills", index: "03" },
  { id: "experience", label: "经历", href: "/experience", index: "04" },
  { id: "contact", label: "联系", href: "/contact", index: "05" },
];
