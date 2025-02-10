import {
  BookmarkIcon,
  ArrowLeftOnRectangleIcon,
  Squares2X2Icon,
  FolderIcon,
  AcademicCapIcon,
  CogIcon,
  DocumentPlusIcon,
  DocumentTextIcon,
  BuildingLibraryIcon,
  ShieldCheckIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

export const routes = [
  {
    path: "/dashboard/admin",
    label: "Dashboard",
    icon: Squares2X2Icon,
    roles: "admin",
  },
  {
    path: "/dashboard/faculty",
    label: "Dashboard",
    icon: Squares2X2Icon,
    roles: "faculty",
  },
  {
    path: "/dashboard/student",
    label: "Dashboard",
    icon: Squares2X2Icon,
    roles: "student",
  },
  {
    path: "/dashboard/saved-documents",
    label: "Saved Documents",
    icon: BookmarkIcon,
    roles: ["admin", "faculty", "student", "instructor"],
  },
  {
    path: "/dashboard/admin/faculty-management",
    label: "Faculty Management",
    icon: AcademicCapIcon,
    roles: "admin",
  },
  {
    path: "/dashboard/admin/department-management",
    label: "Department Management",
    icon: BuildingLibraryIcon,
    roles: ["admin"],
  },
  {
    path: "/dashboard/admin/course-management",
    label: "Course Management",
    icon: BookOpenIcon,
    roles: ["admin"],
  },
  {
    path: "/dashboard/admin/role-management",
    label: "Role Management",
    icon: ShieldCheckIcon,
    roles: ["admin"],
  },
  {
    path: "/dashboard/faculty/department-management",
    label: "Department Management",
    icon: FolderIcon,
    roles: ["faculty"],
  },
  {
    path: "/dashboard/faculty/course-management",
    label: "Course Management",
    icon: DocumentTextIcon,
    roles: ["faculty"],
  },
  {
    path: "/dashboard/faculty/documents-management",
    label: "Documents Management",
    icon: DocumentPlusIcon, // Updated icon
    roles: ["faculty"],
  },
  {
    path: "/dashboard/faculty/role-management",
    label: "Role Management",
    icon: ShieldCheckIcon,
    roles: ["faculty"],
  },
  {
    path: "/dashboard/instructor/documents-management",
    label: "Documents Management",
    icon: DocumentPlusIcon, // Updated icon
    roles: ["instructor"],
  },
  {
    path: "/dashboard/settings",
    label: "Settings",
    icon: CogIcon, // Updated icon to represent settings
    roles: ["admin", "faculty", "student", "instructor"],
  },
];
