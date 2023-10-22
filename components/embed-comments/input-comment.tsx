import { Session } from "next-auth";
import Avatar from "../ui/avatar";
import { useState } from "react";
import styles from "./Comment.module.css";
import api from "@/utils/api";
import { CommentData, commentStyles } from ".";
import { Spinner } from "../ui";
import { IComment } from "@/interfaces/IComment";
import { IUser } from "@/interfaces/IUser";

export type ParentSiteData = {
  title: string;
  url: string;
} | null;

type Props = {
  commentData: CommentData;
  setCommentData: (commentData: CommentData) => void;
  user?: Session["user"];
  parentSiteData: ParentSiteData;
};

export default function InputComment({
  commentData,
  parentSiteData,
  setCommentData,
  user,
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [formProps, setFormProps] = useState<{
    comment: string;
    anonUser: null | {};
  }>({
    comment: "",
    anonUser: null,
  });
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const data = await api.post<IComment & { user: IUser }>("/api/comments", {
      appCode: commentData.appCode,
      identifier: commentData.identifier,
      comment: formProps.comment,
      pageTitle: parentSiteData?.title,
      pageUrl: parentSiteData?.url,
      anonUser: formProps.anonUser,
    });
    if (data.status === "success") {
      if (user) {
        data.data.commentUser = user as IUser;
        const newComments = [...commentData.comments];
        newComments.unshift(data.data);
        setCommentData({
          ...commentData,
          comments: newComments,
        });
      } else {
        // Show toast for pending message
        console.log("Success, your comment will be visible once it's approved");
      }
    }
    setFormProps({ ...formProps, comment: "" });
    setSubmitting(false);
  };

  const handleAnonUserInput = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormProps({
      ...formProps,
      anonUser: { ...formProps.anonUser, [name]: value },
    });
  };

  const redirectToLoginIfUserNotLoggedIn = () => {
    // if (user || !parentSiteData) return;
    // setIsInputFocused(true);
    // if (window.top)
    //   window.top.location.href = `${process.env.NEXT_PUBLIC_SITE_URL}/signin?callbackUrl=${parentSiteData.url}`;
  };

  if (submitting)
    return (
      <div className="h-[32px] w-[32px] mb-6">
        <Spinner styles={{ backgroundColor: commentStyles.primary.color }} />
      </div>
    );

  return (
    <div className="flex space-x-3 mb-6">
      <div className="shrink-0">
        <Avatar user={user} />
      </div>
      <form onSubmit={handleSubmit} className="w-full">
        <div className={styles.growWrap}>
          <textarea
            style={commentStyles.primary}
            name="comment"
            onChange={(e) =>
              setFormProps({ ...formProps, comment: e.target.value })
            }
            placeholder="Add a comment..."
            onInput={(e) => {
              if (e.currentTarget.parentNode)
                (e.currentTarget.parentNode as any).dataset.replicatedValue =
                  e.currentTarget.value;
            }}
            onFocus={() => {
              setIsInputFocused(true);
              redirectToLoginIfUserNotLoggedIn();
            }}
            className={`w-full border border-neutral-300 rounded-lg p-3`}
          />
        </div>
        {isInputFocused && (
          <div className="mt-4">
            {!user && (
              <div className="max-w-xs space-y-4 mb-4">
                <input
                  placeholder="Name"
                  className="border border-neutral-300 w-full rounded-lg p-2"
                  name="name"
                  type="text"
                  onChange={handleAnonUserInput}
                  required
                />
                <input
                  placeholder="Email"
                  className="border border-neutral-300 w-full rounded-lg p-2"
                  name="email"
                  type="email"
                  onChange={handleAnonUserInput}
                  required
                />
              </div>
            )}
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setIsInputFocused(false);
                }}
                style={commentStyles.primary}
                className="text-sm py-2 px-4 block rounded-lg hover:opacity-60"
              >
                Cancel
              </button>
              <button
                style={commentStyles.accent}
                className="text-sm py-2 px-5 block rounded-lg hover:opacity-75"
              >
                Comment
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
