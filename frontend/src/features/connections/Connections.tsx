import FollowService from "@/services/followService";
import { RootState } from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

const Connections = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userId = user?._id as string;

  const { data: followers = [] } = useQuery({
    queryKey: ["Followers"],
    queryFn: () => FollowService.getFollowers(userId),
  });

  const { data: following = [] } = useQuery({
    queryKey: ["Followings"],
    queryFn: () => FollowService.getFollowings(userId),
  });

  const { data: connections = [] } = useQuery({
    queryKey: ["Connections"],
    queryFn: () => FollowService.getAllConnections(),
  });

  console.log(followers, following, connections);
  return <div>Connections</div>;
};

export default Connections;
