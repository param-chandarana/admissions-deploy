import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import CourseDetails from "./pages/CourseDetails";
import StudentForm from "./pages/StudentForm";
import CourseForm from "./pages/CourseForm";
import StudentDetails from "./pages/StudentDetails";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { Profile, AddUser } from "./pages/UserForm";
import Private from "./components/Private";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}

function MainApp() {
  const location = useLocation();
  const hideNavbarPaths = ["/login"];
  const hideFooterPaths = ["/login"];

  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  return (
    <div>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="" element={<Private />}>
          <Route exact="true" path="/" element={<StudentForm isEditMode={false} />} />
          <Route exact="true" path="/students" element={<StudentDetails />} />
          <Route exact="true" path="/courses" element={<CourseDetails />} />
          <Route path="/courses/add" element={<CourseForm isEditMode={false} />} />
          <Route
            path="/students/edit/:studentId"
            element={<StudentForm studentId={""} isEditMode={true} />}
          />
          <Route
            path="/courses/edit/:courseId"
            element={<CourseForm courseId={""} isEditMode={true} />}
          />
          <Route path="/users/add" element={<AddUser />} />
          <Route path="/users/profile" element={<Profile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

export default App;
