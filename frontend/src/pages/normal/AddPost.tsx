import type React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { setBreadcrumbs } from "@/store/slices/breadcrumbSlice";
import { addContent, uploadFiles } from "@/services/user/contentService";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useNavigate } from "react-router-dom";

interface FormData {
  contentType: "Blog" | "Video";
  squad: string;
  thumbnail: FileList;
  video: FileList;
  title: string;
  content: string;
  isPremium: boolean;
}

const AddPost: React.FC = () => {
  const dispatch = useDispatch();
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const squads = useSelector((state: any) => state.userSquads.squads);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { title: "Home", url: "/" },
        { title: "New Post", url: "" },
      ])
    );
  }, [dispatch]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      contentType: "Blog",
      squad: "",
      title: "",
      content: "",
      isPremium: false,
    },
  });

  const contentType = watch("contentType");

  const uploadToCloudinary = async (data: FormData) => {
    const uploadUrl = `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUD_NAME
    }/upload`;
    const imagePreset = "nexus_images";
    const videoPreset = "nexus_videos";

    const uploadFile = async (file: File, preset: string) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", preset);

      const response = await uploadFiles(uploadUrl, formData);
      return response;
    };

    try {
      const thumbnailUrl = data.thumbnail[0]
        ? await uploadFile(data.thumbnail[0], imagePreset)
        : null;

      const videoUrl =
        data.contentType === "Video" && data.video[0]
          ? await uploadFile(data.video[0], videoPreset)
          : null;

      return { thumbnailUrl, videoUrl };
    } catch (error) {
      console.error("Cloudinary upload failed", error);
      throw new Error("Failed to upload files to Cloudinary");
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const uploadedFiles = await uploadToCloudinary(data);

      const requestData = {
        contentType: data.contentType,
        squad: data.squad,
        title: data.title,
        content: data.content,
        isPremium: data.isPremium,
        thumbnailUrl: uploadedFiles.thumbnailUrl,
        videoUrl: uploadedFiles.videoUrl,
      };

      const result = await addContent(requestData);
      if (result) {
        toast({
          variant: "default",
          title: "Wohoo!",
          description: result.message,
          duration: 3000,
        });
        setTimeout(() => navigate("/myFeed"), 3000);
      }
    } catch (error) {
      console.error("Error submitting form", error);
      setSubmitError("An error occurred while submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview(null);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
    } else {
      setVideoPreview(null);
    }
  };

  return (
    <div className="flex justify-center min-h-screen px-4 pt-4 pb-8">
      <div className="container max-w-2xl p-8 shadow-lg border-[0.5px]  rounded-2xl">
        <h1 className="text-4xl text-center font-bold mb-6">Post New Content</h1>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <Label>Content Type</Label>
            <Controller
              name="contentType"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  className="flex space-x-4"
                  onValueChange={(value) => field.onChange(value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Blog" id="blog" />
                    <Label htmlFor="blog">Blog</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Video" id="video" />
                    <Label htmlFor="video">Video</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          <div>
            <Label htmlFor="squad">Squad</Label>
            <Controller
              name="squad"
              control={control}
              rules={{ required: "Squad selection is required" }}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select squad" />
                  </SelectTrigger>
                  <SelectContent>
                    {squads.map((squad: any) => (
                      <SelectItem key={squad._id} value={squad._id}>
                        {squad.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.squad && (
              <p className="text-rose-500 text-sm mt-1">{errors.squad.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="thumbnail">Thumbnail</Label>
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              className="mb-2"
              {...register("thumbnail", { required: "Thumbnail is required" })}
              onChange={handleThumbnailChange}
            />
            {errors.thumbnail && (
              <p className="text-rose-500 text-sm mt-1">{errors.thumbnail.message}</p>
            )}
            {thumbnailPreview && (
              <div className="mt-2">
                <img
                  src={thumbnailPreview || "/placeholder.svg"}
                  alt="Thumbnail preview"
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter post title"
              {...register("title", {
                required: "Title for the content is required",
              })}
            />
            {errors.title && (
              <p className="text-rose-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {contentType === "Blog" ? (
            <div>
              <Label>Content</Label>
              <Tabs defaultValue="write">
                <TabsList>
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="write">
                  <Textarea
                    placeholder="Write your content in markdown"
                    rows={10}
                    {...register("content", {
                      required: "Content is required for blog posts",
                    })}
                  />
                  {errors.content && (
                    <p className="text-rose-500 text-sm mt-1">{errors.content.message}</p>
                  )}
                </TabsContent>
                <TabsContent
                  value="preview"
                  className="prose dark:prose-invert max-w-none"
                >
                  {/* Here you would render the markdown preview */}
                  <div dangerouslySetInnerHTML={{ __html: watch("content") }} />
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div>
              <Label htmlFor="video">Video</Label>
              <Input
                id="video"
                type="file"
                accept="video/*"
                className="mb-2"
                {...register("video", { required: "Video file is required" })}
                onChange={handleVideoChange}
              />
              {errors.video && (
                <p className="text-rose-500 text-sm mt-1">{errors.video.message}</p>
              )}
              {videoPreview && (
                <div className="mt-2">
                  <video
                    src={videoPreview}
                    controls
                    className="max-w-full h-auto rounded-lg"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Controller
              name="isPremium"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="premium"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="premium">Upload as premium?</Label>
          </div>

          {submitError && <p className="text-rose-500 text-sm mt-1">{submitError}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Content"}
          </Button>
        </form>
        <DevTool control={control} />
      </div>
      <Toaster />
    </div>
  );
};

export default AddPost;
