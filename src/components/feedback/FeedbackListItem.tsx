import { Feedback } from "@models/feedback.models";
import { twMerge } from "tailwind-merge";
import { Button } from "../shared/Button";
import { votePost } from "@/server/actions/feedbackActions";

export async function FeedbackListItem({ feedback, className }: { className?: string, feedback: Feedback }) {
  return (
    <div className={twMerge('flex gap-x-5 lg:gap-x-10 border border-white/[6%] hover:bg-white/[8%] rounded-lg p-4 w-full', className)}>
      <div className="flex flex-col flex-1 shrink-1 items-start justify-evenly">
        <h4 className="text-medium font-medium">{feedback.title}</h4>
        <p className="pb-3 text-light-gray text-base">{feedback.details}</p>
        <span className="text-light-gray inline-flex items-center justify-center gap-x-1"><i className="cbi-message text-base"></i>{feedback.commentCount}</span>
      </div>
      <form action={votePost.bind(null, feedback)} className="shrink-0 self-center">
        <Button
          variant="solid"
          color="transparent"
          className={twMerge("font-normal min-w-10 text-base md:min-w-14 justify-between items-center gap-y-1 md:gap-y-2 text-light-gray inline-flex flex-col py-3", feedback.votedByUser && 'text-white bg-dark-aquamarine')}
          type="submit">
          <span className="cbi-arrow-up text-lg md:text-xl "></span>
          {feedback.score}
        </Button>
      </form>
    </div >
  );
}