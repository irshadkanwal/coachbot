import MessengersList from '@/components/account/MessengersList';

export default function Messengers() {
  return (
    <div className="relative flex size-full pb-5">
      <div className="w-full">
        <div className="mx-auto">
          <MessengersList />
        </div>
      </div>
    </div>
  );
}
