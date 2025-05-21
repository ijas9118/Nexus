import { ContentItem } from "../VerifyContentPage";

// Mock service functions - replace with actual API calls
export const fetchPendingContent = async (): Promise<ContentItem[]> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      id: "1",
      title: "Introduction to React Hooks",
      content:
        "<p>React Hooks are a powerful feature that allows you to use state and other React features without writing a class. In this article, we'll explore the most commonly used hooks and how they can simplify your code.</p><h2>useState</h2><p>The useState hook allows you to add state to functional components...</p>",
      contentType: "article",
      thumbnailUrl: "/placeholder.svg?height=200&width=300",
      authorName: "Jane Smith",
      authorUsername: "janesmith",
      authorProfilePic: "/placeholder.svg?height=40&width=40",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      viewCount: 0,
      commentCount: 0,
      isPremium: false,
      status: "pending",
    },
    {
      id: "2",
      title: "Building Scalable APIs with Node.js",
      content:
        "<p>In this comprehensive guide, we'll explore best practices for building scalable and maintainable APIs using Node.js and Express.</p><h2>Project Structure</h2><p>A well-organized project structure is crucial for maintainability...</p>",
      contentType: "article",
      thumbnailUrl: "/placeholder.svg?height=200&width=300",
      authorName: "John Doe",
      authorUsername: "johndoe",
      authorProfilePic: "/placeholder.svg?height=40&width=40",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      viewCount: 0,
      commentCount: 0,
      isPremium: true,
      status: "pending",
    },
    {
      id: "3",
      title: "Introduction to TypeScript Generics",
      content:
        "<p>TypeScript generics provide a way to create reusable components that can work with a variety of types rather than a single one.</p><h2>Basic Syntax</h2><p>The basic syntax for generics uses angle brackets...</p>",
      contentType: "article",
      thumbnailUrl: "/placeholder.svg?height=200&width=300",
      authorName: "Alex Johnson",
      authorUsername: "alexj",
      authorProfilePic: "/placeholder.svg?height=40&width=40",
      createdAt: new Date(Date.now() - 10800000).toISOString(),
      viewCount: 0,
      commentCount: 0,
      isPremium: false,
      status: "pending",
    },
  ];
};

export const approveContent = async (): Promise<void> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return;
};

export const rejectContent = async (): Promise<void> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return;
};
