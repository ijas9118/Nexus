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
import React from "react";

const AddPost: React.FC = () => {
  return (
    <div className="container mx-4 p-6 w-full">
      <h1 className="text-4xl text-center font-bold mb-6">Post New Content</h1>
      <form className="space-y-6">
        <div>
          <Label>Content Type</Label>
          <RadioGroup defaultValue="blog" className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="blog" id="blog" />
              <Label htmlFor="blog">Blog</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="video" id="video" />
              <Label htmlFor="video">Video</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="squad">Squad</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select squad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alpha">Alpha Squad</SelectItem>
              <SelectItem value="beta">Beta Squad</SelectItem>
              <SelectItem value="gamma">Gamma Squad</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="thumbnail">Thumbnail</Label>
          <Input id="thumbnail" type="file" accept="image/*" className="mb-2" />
          {true && <div className="mt-2"></div>}
        </div>

        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="Enter post title" />
        </div>

        <div>
          <Label>Content</Label>
          <Tabs defaultValue="write">
            <TabsList>
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="write">
              <Textarea placeholder="Write your content in markdown" rows={10} />
            </TabsContent>
            <TabsContent
              value="preview"
              className="prose dark:prose-invert max-w-none"
            ></TabsContent>
          </Tabs>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="premium" />
          <Label htmlFor="premium">Upload as premium?</Label>
        </div>

        <Button type="submit">Post Content</Button>
      </form>
    </div>
  );
};

export default AddPost;
