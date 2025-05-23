import type { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/organisms/dropdown-menu";
import { Button } from "@/components/atoms/button";
import { UserPlus, MessageCircle, Twitter } from "lucide-react";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaTelegram,
  FaReddit,
} from "react-icons/fa";
import { toast } from "sonner";

interface InvitationShareMenuProps {
  inviteLink: string;
  squadName: string;
}

export const InvitationShareMenu: FC<InvitationShareMenuProps> = ({
  inviteLink,
  squadName,
}) => {
  const inviteMessage = `Join me in the ${squadName} squad!`;

  const shareViaWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${inviteMessage} ${inviteLink}`)}`,
      "_blank",
    );
  };

  const shareViaTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${inviteMessage} ${inviteLink}`)}`,
      "_blank",
    );
  };

  const shareViaFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteLink)}`,
      "_blank",
    );
  };

  const shareViaLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(inviteLink)}`,
      "_blank",
    );
  };

  const shareViaTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(inviteMessage)}`,
      "_blank",
    );
  };

  const shareViaReddit = () => {
    window.open(
      `https://www.reddit.com/submit?url=${encodeURIComponent(inviteLink)}&title=${encodeURIComponent(inviteMessage)}`,
      "_blank",
    );
  };

  const shareViaInstagram = () => {
    // Instagram doesn't have a direct sharing API for web
    navigator.clipboard.writeText(inviteLink);
    toast.info("Link copied", {
      description:
        "Open Instagram and paste the link in your story or message.",
    });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast("Invite link copied", {
      description: "The invite link has been copied to your clipboard.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Invite
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={shareViaWhatsApp} className="cursor-pointer">
          <FaWhatsapp className="mr-2 h-4 w-4 text-green-500" />
          <span>WhatsApp</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareViaTwitter} className="cursor-pointer">
          <Twitter className="mr-2 h-4 w-4 text-blue-400" />
          <span>Twitter (X)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareViaFacebook} className="cursor-pointer">
          <FaFacebook className="mr-2 h-4 w-4 text-blue-600" />
          <span>Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareViaLinkedIn} className="cursor-pointer">
          <FaLinkedin className="mr-2 h-4 w-4 text-blue-700" />
          <span>LinkedIn</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareViaTelegram} className="cursor-pointer">
          <FaTelegram className="mr-2 h-4 w-4 text-blue-500" />
          <span>Telegram</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareViaReddit} className="cursor-pointer">
          <FaReddit className="mr-2 h-4 w-4 text-orange-600" />
          <span>Reddit</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={shareViaInstagram}
          className="cursor-pointer"
        >
          <FaInstagram className="mr-2 h-4 w-4 text-pink-500" />
          <span>Instagram</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyLink} className="cursor-pointer">
          <MessageCircle className="mr-2 h-4 w-4" />
          <span>Copy Link</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
