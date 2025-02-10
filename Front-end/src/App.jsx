import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Layout from "./components/common/Layout";
import Departments from "./pages/Departments";
import Courses from "./pages/Courses";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import HelpSupport from "./pages/HelpSupport";
import ContactUs from "./pages/ContactUs";
import DocumentsList from "./pages/DocumentsList";
import DocumentsDetail from "./pages/DocumentsDetail";
import { AuthProvider } from "./context/Authcontext";
import ProtectedRoute from "./utils/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/common/DashboardLayout";
import SavedDocuments from "./pages/SavedDocuments";
import AdminDashboard from "./pages/AdminDashboard";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import StudentDashBoard from "./pages/StudentDashBoard";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FacultyManagment from "./pages/admin/FacultyManagment";
import RoleManagment from "./pages/admin/RoleManagment";
import FacultyCourseManagement from "./pages/faculty/FacultyCourseManagment";
import FacultyDepartmentManagement from "./pages/faculty/FacultyDepartmentManagment";
import AdminCourseManagement from "./pages/admin/AdminCourseManagment";
import AdminDepartmentManagement from "./pages/admin/AdminDepartmentManagment";
import CoursesInDepartment from "./components/common/CoursesInDepartment";
import Documents from "./pages/Documents";
import FacultyRoleManagment from "./pages/faculty/FacultyRoleManagment";
import InstructorDocumentManagment from "./pages/instructor/InstructorDocumentManagment";
import FacultyDocumentManagment from "./pages/faculty/FacultyDocumentManagment";
import Services from "./pages/Services";
import ScrollToTop from "./utils/ScrollToTop";
import AboutPage from "./pages/AboutPage";
function App() {
  return (
    <>
      <ToastContainer
        className="top-16 fixed"
        hideProgressBar={true}
        autoClose={3000}
        closeOnClick
        pauseOnHover
        draggable
        position="top-right"
      />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Layout />}>
              <Route path="departments" element={<Departments />}>
                <Route index element={<CoursesInDepartment />} />
                <Route
                  path="courses/:departmentId"
                  element={<CoursesInDepartment />}
                />
              </Route>
              <Route path="courses" element={<Courses />} />
              <Route path="documents" element={<Documents />} />
              <Route path="course/:courseId" element={<DocumentsList />} />
              <Route path="document/:bookId" element={<DocumentsDetail />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/services" element={<Services />} />
              <Route path="/help" element={<HelpSupport />} />
              <Route path="/help" element={<HelpSupport />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/dashboard" element={<ProtectedRoute />}>
                <Route path="" element={<DashboardLayout />}>
                  <Route index element={<SavedDocuments />} />
                  <Route path="saved-documents" element={<SavedDocuments />} />
                  <Route path="settings" element={<Settings />} />
                  <Route
                    path="student"
                    element={<ProtectedRoute condition={"student"} />}
                  >
                    <Route index element={<StudentDashBoard />} />
                  </Route>
                  <Route
                    path="admin"
                    element={<ProtectedRoute condition={"admin"} />}
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route
                      path="department-management"
                      element={<AdminDepartmentManagement />}
                    />
                    <Route
                      path="faculty-management"
                      element={<FacultyManagment />}
                    />
                    <Route path="role-management" element={<RoleManagment />} />
                    <Route
                      path="course-management"
                      element={<AdminCourseManagement />}
                    />
                  </Route>
                  <Route
                    path="faculty"
                    element={<ProtectedRoute condition={"faculty"} />}
                  >
                    <Route index element={<FacultyDashboard />} />
                    <Route
                      path="department-management"
                      element={<FacultyDepartmentManagement />}
                    />{" "}
                    <Route
                      path="role-management"
                      element={<FacultyRoleManagment />}
                    />
                    <Route
                      path="documents-management"
                      element={<FacultyDocumentManagment />}
                    />
                    <Route
                      path="course-management"
                      element={<FacultyCourseManagement />}
                    />
                  </Route>
                  <Route
                    path="instructor"
                    element={<ProtectedRoute condition={"instructor"} />}
                  >
                    <Route index element={<FacultyDashboard />} />

                    <Route
                      path="documents-management"
                      element={<InstructorDocumentManagment />}
                    />
                    <Route
                      path="course-management"
                      element={<FacultyCourseManagement />}
                    />
                  </Route>
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
