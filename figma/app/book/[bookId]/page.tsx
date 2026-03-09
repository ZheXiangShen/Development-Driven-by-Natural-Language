import { BookDetailPage } from '@/src/app/pages/BookDetailPage';

interface Props {
  params: {
    bookId: string;
  };
}

export default function Page({ params }: Props) {
  return <BookDetailPage bookId={params.bookId} />;
}
