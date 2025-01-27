import FilterComponent from "@/components/normal/myFeed/FilterComponent";
import ContentTypeTab from "@/components/normal/myFeed/ContentTypeTab";
import ContentCard from "@/components/normal/myFeed/ContentCard";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "@/store/slices/breadcrumbSlice";

export default function MyFeed() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { title: "Home", url: "/" },
        { title: "My Feed", url: "/myFeed" },
      ])
    );
  }, []);

  return (
    <div className="container mx-auto px-8 py-8">
      <FilterComponent />

      <ContentTypeTab />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ContentCard
          avatarFallback={"IA"}
          userName={"Ijas Ahammed"}
          contentType="Blog"
          heading={"How to host your project in AWS EC2"}
          date={"Jan 20, 2025"}
          likes={102}
          comments={65}
          tags={["nodejs", "aws"]}
          isPremium={true}
          image={
            "https://digitalcloud.training/wp-content/uploads/2022/01/Amazon-EC2.jpg?update_image_id_1737073222"
          }
        />

        <ContentCard
          avatarFallback="UA"
          userName="Usman Ali"
          contentType="Blog"
          heading="12 React Projects to Practice Core Features"
          date="Dec 10, 2024"
          likes={129}
          comments={25}
          tags={["webdev", "react"]}
          isPremium={false}
          image={
            "https://media.geeksforgeeks.org/wp-content/uploads/20240307175325/React-Projects-with-Source-Code-[2024].webp"
          }
        />

        <ContentCard
          avatarFallback="AM"
          userName="Afsal M"
          contentType="Blog"
          heading="Secure JWT Storage: Best Practices"
          date="Nov 23, 2024"
          likes={154}
          comments={15}
          tags={["webdev", "jwt"]}
          isPremium={false}
          image={
            "https://www.syncfusion.com/blogs/wp-content/uploads/2024/11/Secure-JWT-Storage-Best-Practices.png"
          }
        />

        <ContentCard
          avatarFallback="C"
          userName="Catherine"
          contentType="Video"
          heading="The Senior Shortcut"
          date="Oct 12, 2024"
          likes={234}
          comments={32}
          tags={["startup", "career"]}
          isPremium={false}
          image={
            "https://digitalcloud.training/wp-content/uploads/2022/01/Amazon-EC2.jpg?update_image_id_1737073222"
          }
        />
      </div>
    </div>
  );
}
