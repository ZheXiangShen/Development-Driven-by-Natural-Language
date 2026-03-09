import { ChatPage } from '@/src/app/pages/ChatPage';

interface Props {
  params: {
    userId: string;
  };
}

export default function Page({ params }: Props) {
  return <ChatPage userId={params.userId} />;
}
