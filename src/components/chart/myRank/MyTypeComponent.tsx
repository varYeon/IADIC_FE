import Badge from "@/components/common/Badge";
import ResponsiveContainer from "@/components/common/ResponsiveContainer";
import { categoryColor } from "@/utils/category";
import ChartCardTtile from "../ChartCardTtile";
import ChartPie from "../ChartPie";
import PieChartKey from "../PieChartKey";

export default function MyTypeComponent({ stats }: { stats: MyTypeDataType[] }) {
  const chartData = stats.slice(0, 2).map(item => ({ name: item.category_name, value: item.total_point }));
  const total_point = stats.reduce((acc, cur) => acc + cur.total_point, 0);
  return (
    <ResponsiveContainer className="min-h-0 w-full px-5 py-6">
      <ChartCardTtile title="유형" subTitle="총 합산 ( 게시글, 훈수, 뱃지 포인트 )" />
      <div className="max-h-100px gap mx-auto flex w-[95%] flex-col items-center justify-center gap-15 gap-y-10 md:flex-row">
        <div className="flex h-full w-[40%] flex-col items-center justify-center gap-10 pt-5">
          <ChartPie stats={chartData} total_point={total_point} innerRadius={78} height={200} labelEndText="점" />
          <PieChartKey stats={chartData} />
        </div>
        <ResponsiveContainer className="bg-bg-main min-h-[265px] w-full min-w-[250px] p-5 md:w-[45%]">
          <div className="mb-6 flex flex-col gap-1">
            <span className="text-text-sub text-sm font-semibold">당신의 유형은?</span>
            <span className="text-text-light text-sm font-semibold">
              <span className="text-text-title text-[16px]">{`${chartData[0].name} | ${chartData[1].name}`}</span>{" "}
              입니다.
            </span>
          </div>
          <div className="flex w-11/12 flex-wrap gap-6 gap-y-3">
            {stats.map(category => {
              const color = categoryColor[category.category_name];
              return (
                <div key={category.category_name} className="flex flex-col gap-1">
                  <Badge
                    text={category.category_name}
                    style={{ backgroundColor: color }}
                    className="text-bg-main font-semibold"
                    size={"sm"}
                  />
                  <span className="text-text-title text-xs font-semibold">{`${category.total_point.toLocaleString()}P`}</span>
                </div>
              );
            })}
          </div>
        </ResponsiveContainer>
      </div>
    </ResponsiveContainer>
  );
}
