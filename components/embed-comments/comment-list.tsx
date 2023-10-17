import Avatar from "../ui/avatar";
import { CommentData } from ".";
import { getRelativeTimeString } from "@/utils";

type Props = {
  comments: CommentData["comments"];
};
export default function CommentList({ comments }: Props) {
  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment._id} className="flex space-x-3">
          <div className="shrink-0">
            <Avatar user={comment.user as any} />
          </div>
          <div className="whitespace-pre-wrap">
            <div className="space-x-1">
              <span className="font-semibold">
                {(comment.user as any).name}
              </span>
              <span
                className="text-sm text-neutral-500"
                suppressHydrationWarning
              >
                {getRelativeTimeString(new Date(comment.createdAt))}
              </span>
            </div>
            <div className="whitespace-pre-wrap">{comment.comment}</div>
          </div>
        </div>
      ))}
    </div>
  );
}