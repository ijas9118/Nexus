import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import SquadService from "@/services/user/squadService";
import type { RootState } from "@/store/store";

import { ContentList } from "./components/content-list";
import { SquadActions } from "./components/squad-actions";
import { SquadAdmin } from "./components/squad-admin";
import { SquadDescription } from "./components/squad-description";
import { SquadHeader } from "./components/squad-header";

export default function SquadDetailPage() {
  const { handle } = useParams<{ handle: string }>();
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    data: squad,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["squad-details", handle],
    queryFn: () => SquadService.getSquadDetailsByHandle(handle!),
    enabled: !!handle,
  });

  const isAdmin = user?._id === squad?.admin;

  if (isLoading) return <div>Loading squad details...</div>;
  if (isError || !squad) return <div>Error loading squad details</div>;

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-24 py-8 space-y-8">
      <div className="space-y-8">
        <SquadHeader
          name={squad.name}
          tag={`@${squad.handle}`}
          logo={squad.logo}
          createdDate={dayjs(squad.createdAt).format("MMM D, YYYY")}
          category={squad.category}
          postsCount={squad.postCount || 0}
          viewsCount={squad.viewCount || 0}
          upvotesCount={squad.upvoteCount || 0}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <SquadDescription description={squad.description} />

            <ContentList squadId={squad._id} />
          </div>

          <div className="space-y-6">
            <SquadAdmin
              name={squad.adminName}
              username={squad.adminUsername}
              profilePic={squad.adminProfilePic}
            />

            <SquadActions
              squad={squad}
              isAdmin={isAdmin}
              isJoined={squad.isJoined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
