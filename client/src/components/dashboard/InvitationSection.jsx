
import { useState } from "react";
import { Users, Check, XCircle, Loader2, Mail } from "lucide-react";
import { acceptInvitation, rejectInvitation } from "../../hooks/useApi";


export const InvitationCard = ({ invitation, onRefresh, onAccepted }) => {
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const handle = async (type) => {
    type === "accept" ? setAccepting(true) : setRejecting(true);
    try {
      const r =
        type === "accept"
          ? await acceptInvitation(invitation._id)
          : await rejectInvitation(invitation._id);
      if (r.data.success) {
        onRefresh(); 
        if (type === "accept") onAccepted?.();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAccepting(false);
      setRejecting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-white/[0.06] rounded-2xl border border-gray-100 dark:border-white/[0.08] shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-center gap-4 flex-1">
        {invitation.familyAvatar ? (
          <img
            src={invitation.familyAvatar}
            alt={invitation.familyName}
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-gray-100 dark:ring-white/[0.08]"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 flex items-center justify-center">
            <Users className="w-5.5 h-5.5 text-indigo-400" />
          </div>
        )}
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {invitation.familyName}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Invited by {invitation.invitedBy?.name || invitation.admin?.name}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 ml-auto">
        <button
          onClick={() => handle("reject")}
          disabled={rejecting || accepting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 border border-gray-200 dark:border-white/[0.1] hover:border-red-200 dark:hover:border-red-500/30 transition-all disabled:opacity-40 font-semibold"
        >
          {rejecting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Decline</span>
        </button>
        <button
          onClick={() => handle("accept")}
          disabled={accepting || rejecting}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white transition-colors disabled:opacity-40"
        >
          {accepting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          Accept
        </button>
      </div>
    </div>
  );
};;

// ── Full invitations view ──────────────────────────────────
const InvitationsSection = ({ invitations, loading, onRefresh,onAccepted }) => {
  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-7 h-7 text-indigo-400 animate-spin" />
      </div>
    );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invitations</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Review and respond to family invitations
        </p>
      </div>

      {invitations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/[0.1] bg-gray-50/50 dark:bg-white/[0.02]">
          <Mail className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-bold">
            No pending invitations
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
            You'll see invitations here when someone invites you
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invitations.map((inv) => (
            <InvitationCard
              key={inv._id}
              invitation={inv}
              onRefresh={onRefresh}
              onAccepted ={onAccepted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InvitationsSection;
