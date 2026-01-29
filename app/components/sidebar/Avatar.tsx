import { User } from "@carbon/icons-react";

export default function Avatar() {
    return (
      <div className="bg-black relative rounded-full shrink-0 size-8">
        <div className="flex items-center justify-center size-8">
          <User size={16} className="text-neutral-50" />
        </div>
        <div className="absolute border border-neutral-800 inset-0 pointer-events-none rounded-full" />
      </div>
    );
  }