interface ContentBodyProps {
  thumbnailUrl?: string;
  title: string;
  content: string;
}

export const ContentBody = ({
  thumbnailUrl,
  title,
  content,
}: ContentBodyProps) => (
  <>
    {thumbnailUrl && (
      <div className="mb-8">
        <img
          src={thumbnailUrl || "/placeholder.svg"}
          alt={title}
          className="rounded-lg w-full h-auto max-h-[500px] object-cover"
        />
      </div>
    )}
    <div
      className="prose prose-lg max-w-none mb-10 text-primary leading-relaxed"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  </>
);
