import { lazy, Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "@/store/slices/breadcrumbSlice";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/atoms/skeleton";
const BlogCreationForm = lazy(() => import("./components/BlogCreationForm"));

const AddPost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm  text-muted-foreground hover:font-medium transition-all duration-300 mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </button>
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Create New Content
        </h1>
        <p className="text-muted-foreground">
          Create and publish your content to share with your audience
        </p>
      </div>
      <Suspense fallback={<Skeleton />}>
        <BlogCreationForm />
      </Suspense>
    </div>
  );
};

export default AddPost;
