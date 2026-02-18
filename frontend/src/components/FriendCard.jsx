import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquareIcon, UserMinusIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";
import { removeFriend } from "../lib/api";

const FriendCard = ({ friend }) => {
  const queryClient = useQueryClient();

  const { mutate: removeFriendMutation, isPending } = useMutation({
    mutationFn: removeFriend,
    onSuccess: () => {
      toast.success("Friend removed");
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to remove friend");
    }
  });

  return (
    <div className="group card bg-base-200/40 backdrop-blur-md border border-base-content/5 hover:border-primary/20 hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-3xl">
      {/* GLOW EFFECT ON HOVER */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="card-body p-5 relative z-10">
        {/* USER INFO */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="avatar size-14 rounded-2xl overflow-hidden ring-2 ring-base-content/5 group-hover:ring-primary/30 transition-all duration-500">
              <img src={friend.profilePic} alt={friend.fullName} className="object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 size-4 bg-success border-2 border-base-100 rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">{friend.fullName}</h3>
            <p className="text-xs opacity-50 flex items-center gap-1">
              Active recently
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          <div className="flex items-center bg-base-300/50 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-base-content/5 shadow-sm">
            {getLanguageFlag(friend.nativeLanguage)}
            <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70 ml-1">Native:</span>
            <span className="text-xs font-bold ml-1">{friend.nativeLanguage}</span>
          </div>

          <div className="flex items-center bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/10 shadow-sm">
            {getLanguageFlag(friend.learningLanguage)}
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary ml-1">Learning:</span>
            <span className="text-xs font-bold text-primary ml-1">{friend.learningLanguage}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/chat/${friend._id}`}
            className="btn btn-primary btn-sm flex-1 shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-300 rounded-xl"
          >
            <MessageSquareIcon className="size-4 mr-2" />
            Message
          </Link>
          <button
            className="btn btn-error btn-outline btn-sm rounded-xl"
            onClick={() => {
              if (window.confirm("Are you sure you want to remove this friend?")) {
                removeFriendMutation(friend._id);
              }
            }}
            disabled={isPending}
            title="Remove Friend"
          >
            {isPending ? <span className="loading loading-spinner loading-xs" /> : <UserMinusIcon className="size-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}

