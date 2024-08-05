import PortfolioChart from "@/components/portfolio/portfolio-chart";
import PortfolioHeader from "@/components/portfolio/portfolio-header";

export default function Page() {
  return (
    <div className="flex h-full w-full flex-col text-white">
      <PortfolioHeader />
      <div className="-mt-20 rounded-t-[3rem] bg-white sm:mt-0">
        <div className="container py-8">
          <PortfolioChart />
        </div>
      </div>
    </div>
  );
}
