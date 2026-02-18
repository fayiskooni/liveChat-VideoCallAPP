import { BellIcon } from "lucide-react";
import React from "react";

const NoNotificationsFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="size-24 rounded-3xl bg-base-200/50 backdrop-blur-md flex items-center justify-center mb-6 shadow-xl ring-1 ring-white/10 animate-pulse">
        <BellIcon className="size-10 text-primary opacity-50" />
      </div>
      <h3 className="text-2xl font-bold tracking-tight mb-2">All Caught Up!</h3>
      <p className="text-base-content/60 max-w-md text-lg">
        No new notifications at the moment. We'll let you know when something important happens!
      </p>
    </div>
  );
};

export default NoNotificationsFound;
