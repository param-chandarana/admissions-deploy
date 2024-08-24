import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";
import { useUpdateUserMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";

const UserForm = ({ isEditMode, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading }] = useUpdateUserMutation();

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        ...formData,
        name: initialData?.name || userInfo.name,
        email: initialData?.email || userInfo.email,
      });
    }
  }, [initialData, userInfo, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (isEditMode) {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials(res));
        toast.success("Profile updated successfully");
        resetForm();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    } else {
      try {
        await axios.post(`/api/users/add`, {
          name,
          email,
          password,
        });
        toast.success("User added successfully");
        resetForm();
      } catch (error) {
        toast.error(error.response.data.message || "An error occurred");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <>
      <ToastContainer />
      <div className="container mt-4">
        <h1 className="h2 mb-4">{isEditMode ? "Update Profile" : "Add User"}</h1>
        <form onSubmit={handleSubmit}>
          <div className="card p-4 mb-md-4 mb-3">
            <div className="mb-3">
              <label htmlFor="name" className="form-label mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required={!isEditMode}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required={!isEditMode}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn">
            {isEditMode ? "Update User" : "Add User"}
          </button>
          {isLoading && <Loader />}
        </form>
      </div>
    </>
  );
};

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return <UserForm isEditMode={true} initialData={userInfo} />;
};

const AddUser = () => {
  return <UserForm isEditMode={false} />;
};

export { Profile, AddUser };
