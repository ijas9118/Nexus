import { setBreadcrumbs } from "@/store/slices/breadcrumbSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Sidebar from "./components/Sidebar";
import ProfileForm from "./components/ProfileForm";
import SecurityForm from "./components/SecurityForm";

const EditProfileLayout = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { title: "Home", url: "/" },
        { title: "Profile", url: "/profile" },
        { title: "Edit", url: "/profile/edit" },
      ]),
    );
  }, [dispatch]);

  return (
    <div className="container mx-auto max-w-4xl h-[calc(100vh-64px)] border-x-[1px] overflow-hidden">
      <div className="flex h-full">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === "Profile" && <ProfileForm />}
          {activeTab === "Security" && <SecurityForm />}
          {/* Add other sections for "Account" and "Your Blogs" later */}
        </div>
      </div>
    </div>
  );
};

export default EditProfileLayout;
