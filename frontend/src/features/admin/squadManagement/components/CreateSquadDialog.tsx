import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/organisms/dialog";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Button } from "@/components/atoms/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import SquadService from "@/services/admin/squadService";
import { uploadFiles } from "@/services/user/contentService";
import CategoryService from "@/services/admin/categoryService";
import { Category } from "@/types/category";
import { DialogProps } from "@/types/dialog";
import { toast } from "sonner";
import { Switch } from "@/components/atoms/switch";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters"),
  handle: z
    .string()
    .min(3, "Handle must be at least 3 characters")
    .max(30, "Handle must be less than 30 characters"),
  category: z.string().min(1, "Please select a category"),
  logo: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      if (file) {
        return file.size <= 5000000;
      }
      return true;
    }, "Max file size is 5MB."),
  isPremium: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

export function CreateSquadDialog({ open, onOpenChange }: DialogProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      handle: "",
      category: "",
      isPremium: false,
    },
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoryList = await CategoryService.getAllCategory();
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategory();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      let logo: string | undefined = undefined;

      if (data.logo instanceof File) {
        const uploadUrl = `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUD_NAME
        }/upload`;
        const formData = new FormData();
        formData.append("file", data.logo);
        formData.append("upload_preset", "nexus_images");

        logo = await uploadFiles(uploadUrl, formData);
        console.log("LOGO:", logo, typeof logo);
      }

      const squadData = {
        name: data.name,
        description: data.description,
        handle: data.handle,
        category: data.category,
        logo,
        isPremium: data.isPremium,
      };

      const result = await SquadService.createSquad(squadData);

      toast.success("Success", {
        description: result.message || "Squad created successfully!",
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error creating squad", error);
      toast.error("Error", {
        description: "Failed to create squad. Please try again.",
      });
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Squad</DialogTitle>
            <DialogDescription>
              Enter squad details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 mt-4 mb-6">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <div className="col-span-3">
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="name"
                        placeholder="Enter squad name"
                        {...field}
                      />
                    )}
                  />
                  {errors.name && (
                    <p className="text-sm text-pink-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <div className="col-span-3">
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="description"
                        placeholder="About squad"
                        {...field}
                      />
                    )}
                  />
                  {errors.description && (
                    <p className="text-sm text-pink-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="handle" className="text-right">
                  Handle
                </Label>
                <div className="col-span-3">
                  <Controller
                    name="handle"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="handle"
                        placeholder="Enter unique handle"
                        {...field}
                      />
                    )}
                  />
                  {errors.handle && (
                    <p className="text-sm text-pink-600">
                      {errors.handle.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <div className="col-span-3">
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category._id}
                              value={category.name}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && (
                    <p className="text-sm text-pink-600">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="logo" className="text-right">
                  Logo
                </Label>
                <div className="col-span-3">
                  <div className="flex items-center gap-4">
                    <Controller
                      name="logo"
                      control={control}
                      render={({
                        field: { value: _value, onChange, ...field },
                      }) => (
                        <Input
                          id="logo"
                          type="file"
                          accept="image/*"
                          {...field}
                          onChange={(e) => {
                            handleLogoChange(e);
                            onChange(e.target.files?.[0]);
                          }}
                        />
                      )}
                    />
                    {logoPreview && (
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={logoPreview}
                          alt="Squad Logo Preview"
                        />
                        <AvatarFallback>Logo</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  {errors.logo && (
                    <p className="text-sm text-pink-600">
                      {errors.logo.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <div className="mr-auto flex items-center space-x-2">
                <Controller
                  name="isPremium"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="isPremium"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="premium">Premium</Label>
              </div>
              <Button type="submit">Save Squad</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
