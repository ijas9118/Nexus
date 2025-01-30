import Error404 from "@/components/common/Error404";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <Error404 />
      <Link to="/myFeed" className="mt-20 px-4 py-2rounded-lg ">
        <Button>Go to Your Feeds</Button>
      </Link>
    </div>
  );
};

export default NotFound;
