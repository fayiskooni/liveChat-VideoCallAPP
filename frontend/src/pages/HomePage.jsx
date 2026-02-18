import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

import { capitialize } from "../lib/utils";

import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import Avatar from "../components/Avatar";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const [loadingId, setLoadingId] = useState(null);

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: (userId) => {
      setLoadingId(userId);
      return sendFriendRequest(userId);
    },
    onSuccess: () => {
      setLoadingId(null);
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
    },
    onError: () => {
      setLoadingId(null);
    }
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="p-6 sm:p-10 lg:p-12 relative overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto space-y-16 relative z-10">
        <header className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-6 border-b border-base-content/5 pb-8">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-base-content uppercase">
              Connections
            </h2>
            <p className="text-sm opacity-50 font-bold tracking-widest uppercase mt-2">
              Your global language network
            </p>
          </div>
          <Link to="/notifications" className="btn btn-primary btn-md shadow-xl shadow-primary/20 rounded-2xl group normal-case">
            <UsersIcon className="mr-2 size-5 group-hover:scale-110 transition-transform" />
            Manage Requests
          </Link>
        </header>

        {loadingFriends ? (
          <div className="flex justify-center py-24">
            <span className="loading loading-ring loading-lg text-primary" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="size-2 rounded-full bg-primary" />
              <h3 className="text-xl font-bold opacity-80 uppercase tracking-widest">Active Friends</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          </section>
        )}

        <section className="pt-8">
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-base-content uppercase italic">
                  Recommendations
                </h2>
                <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full mt-2" />
                <p className="opacity-60 text-lg mt-4 max-w-xl font-medium">
                  Curated language partners selected specifically for your learning journey.
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">
                No recommendations available
              </h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="group card bg-base-200/40 backdrop-blur-md border border-base-content/5 hover:border-primary/20 hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-3xl"
                  >
                    {/* GLOW EFFECT ON HOVER */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="card-body p-6 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="avatar size-16 rounded-2xl overflow-hidden ring-2 ring-base-content/5 group-hover:ring-primary/30 transition-all duration-500">
                            <Avatar src={user.profilePic} alt={user.fullName} />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-xl truncate group-hover:text-primary transition-colors">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-50 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages with flags */}
                      <div className="flex flex-wrap gap-2 py-2">
                        <div className="flex items-center bg-secondary/10 px-2.5 py-1 rounded-lg border border-secondary/10 shadow-sm">
                          {getLanguageFlag(user.nativeLanguage)}
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-secondary ml-1">Native:</span>
                          <span className="text-xs font-bold text-secondary ml-1">{capitialize(user.nativeLanguage)}</span>
                        </div>
                        <div className="flex items-center bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/10 shadow-sm">
                          {getLanguageFlag(user.learningLanguage)}
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary ml-1">Learning:</span>
                          <span className="text-xs font-bold text-primary ml-1">{capitialize(user.learningLanguage)}</span>
                        </div>
                      </div>

                      {user.bio && (
                        <p className="text-sm opacity-70 italic line-clamp-2">"{user.bio}"</p>
                      )}

                      {/* Action button */}
                      <button
                        className={`btn w-full mt-4 rounded-xl shadow-lg transition-all duration-300 ${hasRequestBeenSent
                          ? "btn-disabled opacity-50"
                          : "btn-primary shadow-primary/20 hover:shadow-primary/30"
                          } `}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || (loadingId === user._id && isPending)}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (loadingId === user._id && isPending) ? (
                          <span className="loading loading-spinner loading-sm" />
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
