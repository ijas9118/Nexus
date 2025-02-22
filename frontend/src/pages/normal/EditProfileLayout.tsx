import ProfileForm from "@/components/normal/editProfile/ProfileForm";
import SecurityForm from "@/components/normal/editProfile/SecurityForm";
import Sidebar from "@/components/normal/editProfile/Sidebar";
import { useState } from "react";

const EditProfileLayout = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  return (
    <div className="container mx-auto max-w-4xl h-full border-x-[1px]">
      <div className="md:flex md:min-h-screen ">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "Profile" && <ProfileForm />}
        {activeTab === "Security" && <SecurityForm />}
        {/* Add other sections for "Account" and "Your Blogs" later */}
      </div>
    </div>
  );
};

export default EditProfileLayout;
