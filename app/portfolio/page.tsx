import Image from "next/image";

export default function Page() {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="h-[500px] w-full bg-black-4 py-10">
        <div className="container space-y-10">
          <div className="flex items-center justify-between">
            <Image alt="Logo" src="/assets/logo.png" width={100} height={80} />
            <h1 className="hidden text-2xl font-bold text-white md:block">
              Portfolio ReBalancer
            </h1>
            <button>
              <Image
                alt="Logo"
                src="/assets/metamask-fox.svg"
                width={50}
                height={50}
              />
            </button>
          </div>
          <div className="">
            <Image alt="Logo" src="/assets/eth.png" width={80} height={80} />
          </div>
        </div>
      </div>
      <div className=""></div>
    </div>
  );
}
