import { useEffect } from "react";
import { BlogCreationForm } from "./BlogCreationForm";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "@/store/slices/breadcrumbSlice";

const AddPost = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { title: "Home", url: "/" },
        { title: "New Post", url: "" },
      ]),
    );
  }, [dispatch]);

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Create New Content
        </h1>
        <p className="text-muted-foreground">
          Create and publish your content to share with your audience
        </p>
      </div>
      <BlogCreationForm />
    </div>
  );
};

export default AddPost;
