import { ProfilePage } from '@/src/app/pages/ProfilePage';

interface Props {
  params: {
    userId: string;
  };
}

export default function Page({ params }: Props) {
  return <ProfilePage profileId={params.userId} />;
}
