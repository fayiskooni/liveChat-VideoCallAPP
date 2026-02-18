import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import {
  acceptFriendRequest,
  getFriendRequests,
  rejectFriendRequest,
} from "../lib/api";
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
} from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";
import Avatar from "../components/Avatar";

const NotificationPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const { mutate: rejectRequestMutation, isPending: isRejecting } = useMutation(
    {
      mutationFn: rejectFriendRequest,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      },
    }
  );

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <header className="border-b border-base-content/5 pb-8">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-base-content uppercase">
            Notifications
          </h1>
          <p className="text-sm opacity-50 font-bold tracking-widest uppercase mt-2">
            Stay updated with your network
          </p>
        </header>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <span className="loading loading-ring loading-lg text-primary" />
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <UserCheckIcon className="size-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight">Request</h2>
                    <p className="text-xs font-bold opacity-50 uppercase tracking-widest">Pending Actions: {incomingRequests.length}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="group relative bg-base-200/50 backdrop-blur-md rounded-3xl p-5 border border-base-content/5 hover:border-primary/20 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-xl"
                    >
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div className="relative z-10 flex flex-col sm:flex-row gap-4 items-center sm:justify-between">
                        {/* User Info */}
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="relative">
                            <div className="avatar size-14 rounded-2xl overflow-hidden ring-2 ring-base-content/10 group-hover:ring-primary/40 transition-all duration-500">
                              <Avatar
                                src={request.sender.profilePic}
                                alt={request.sender.fullName}
                              />
                            </div>
                            <div className="absolute bottom-0 right-0 size-4 bg-primary border-2 border-base-100 rounded-full animate-pulse" />
                          </div>

                          <div>
                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                              {request.sender.fullName}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-1.5">
                              <span className="flex items-center px-2 py-0.5 rounded-md bg-base-300/50 border border-base-content/5 text-[10px] font-bold uppercase tracking-wider opacity-70">
                                Native: {request.sender.nativeLanguage}
                              </span>
                              <span className="flex items-center px-2 py-0.5 rounded-md bg-primary/10 border border-primary/10 text-[10px] font-bold uppercase tracking-wider text-primary">
                                Learning: {request.sender.learningLanguage}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <button
                            className="flex-1 sm:flex-none btn btn-error btn-outline btn-sm rounded-xl hover:bg-error hover:text-white transition-all duration-300"
                            onClick={() => rejectRequestMutation(request._id)}
                            disabled={isRejecting}
                          >
                            Reject
                          </button>
                          <button
                            className="flex-1 sm:flex-none btn btn-primary btn-sm rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 px-6"
                            onClick={() => acceptRequestMutation(request._id)}
                            disabled={isPending}
                          >
                            Accept Request
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {acceptedRequests.length > 0 && (
              <section className="space-y-6 pt-8 border-t border-base-content/5 mt-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <BellIcon className="size-5 text-success" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight">Updates</h2>
                    <p className="text-xs font-bold opacity-50 uppercase tracking-widest">Recent Activity</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {acceptedRequests.map((notification) => (
                    <div
                      key={notification._id}
                      className="group relative bg-base-200/50 backdrop-blur-md rounded-3xl p-5 border border-base-content/5 hover:border-success/20 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-lg cursor-default"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div className="relative z-10 flex gap-4 items-center">
                        <div className="relative">
                          <div className="avatar size-12 rounded-2xl overflow-hidden ring-2 ring-base-content/10 group-hover:ring-success/40 transition-all duration-500">
                            <Avatar
                              src={notification.recipient.profilePic}
                              alt={notification.recipient.fullName}
                            />
                          </div>
                          <div className="absolute bottom-0 right-0 flex items-center justify-center size-5 bg-success border-2 border-base-100 rounded-full">
                            <UserCheckIcon className="size-3 text-white" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-base truncate pr-2 group-hover:text-success transition-colors">
                              {notification.recipient.fullName}
                            </h3>
                            <span className="text-[10px] opacity-40 font-bold uppercase tracking-widest flex items-center gap-1 bg-base-300/30 px-2 py-0.5 rounded-full">
                              <ClockIcon className="h-2.5 w-2.5" />
                              New
                            </span>
                          </div>
                          <p className="text-sm opacity-70 leading-relaxed truncate">
                            Accepted your friend request. Start a conversation!
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
