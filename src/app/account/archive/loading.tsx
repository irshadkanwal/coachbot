import { WhiteRoundedContainer } from '@/components/shared/Container';

export default async function Loader() {
  return (
    <WhiteRoundedContainer className="gap-y-10 p-5 sm:p-[30px]">
      <h2 className="h-8 w-1/3 animate-pulse rounded-lg bg-graphic text-xl font-medium"></h2>

      <ul className="flex flex-col gap-y-5 text-[20px] text-light-gray">
        {Array.from({ length: 3 }).map((_, index: number) => (
          <li
            key={index}
            className="flex flex-nowrap items-center justify-between gap-x-14 border-b border-gray-border py-3.5 sm:justify-normal sm:px-1"
          >
            <span className="h-6 w-[30%] min-w-24 animate-pulse whitespace-nowrap rounded-xl bg-graphic"></span>

            <div className="h-14 w-[120px] animate-pulse rounded-xl bg-graphic py-3 sm:w-40"></div>
          </li>
        ))}
      </ul>
    </WhiteRoundedContainer>
  );
}
