"use client";

import { useEffect, useState } from "react";
import { logEvent, getExperimentGroup } from "@/lib/analytics";

type Menu = {
  name: string;
  reason: string;
  tastes: string[];
  mealTimes: string[];
  priceLevel: number;
};

const menuPool: Menu[] = [
  {
    name: "제육덮밥",
    reason: "매콤하고 든든한 한 끼를 먹고 싶을 때 잘 맞아요.",
    tastes: ["매콤", "든든"],
    mealTimes: ["점심", "저녁"],
    priceLevel: 1,
  },
  {
    name: "순두부찌개",
    reason: "얼큰하면서도 부담 없이 따뜻하게 먹기 좋아요.",
    tastes: ["매콤", "담백"],
    mealTimes: ["아침", "점심", "저녁"],
    priceLevel: 1,
  },
  {
    name: "닭갈비",
    reason: "매콤하고 든든한 식사를 원할 때 좋아요.",
    tastes: ["매콤", "든든"],
    mealTimes: ["점심", "저녁"],
    priceLevel: 2,
  },
  {
    name: "김치찌개",
    reason: "얼큰하고 든든한 밥 메뉴를 찾을 때 잘 맞아요.",
    tastes: ["매콤", "든든"],
    mealTimes: ["점심", "저녁"],
    priceLevel: 1,
  },
  {
    name: "샌드위치",
    reason: "가볍고 간단하게 식사하고 싶을 때 좋아요.",
    tastes: ["가벼움", "담백"],
    mealTimes: ["아침", "점심"],
    priceLevel: 1,
  },
  {
    name: "샐러드",
    reason: "부담 없이 산뜻하게 먹고 싶을 때 잘 맞아요.",
    tastes: ["가벼움", "상큼"],
    mealTimes: ["아침", "점심", "저녁"],
    priceLevel: 1,
  },
  {
    name: "포케",
    reason: "신선하면서 적당히 든든한 식사를 원할 때 좋아요.",
    tastes: ["가벼움", "상큼", "든든"],
    mealTimes: ["점심", "저녁"],
    priceLevel: 2,
  },
  {
    name: "쌀국수",
    reason: "담백한 국물과 부담 없는 한 끼를 원할 때 좋아요.",
    tastes: ["담백", "가벼움"],
    mealTimes: ["점심", "저녁"],
    priceLevel: 1,
  },
  {
    name: "돈까스",
    reason: "바삭하고 든든한 식사가 당길 때 좋아요.",
    tastes: ["든든", "느끼"],
    mealTimes: ["점심", "저녁"],
    priceLevel: 1,
  },
  {
    name: "치즈돈까스",
    reason: "고소하고 진한 맛을 든든하게 즐기고 싶을 때 좋아요.",
    tastes: ["느끼", "든든"],
    mealTimes: ["점심", "저녁"],
    priceLevel: 2,
  },
  {
    name: "크림파스타",
    reason: "부드럽고 고소한 음식이 당길 때 잘 맞아요.",
    tastes: ["느끼"],
    mealTimes: ["점심", "저녁"],
    priceLevel: 2,
  },
  {
    name: "비빔국수",
    reason: "새콤하고 매콤한 맛을 가볍게 즐기기 좋아요.",
    tastes: ["상큼", "매콤"],
    mealTimes: ["점심", "저녁"],
    priceLevel: 1,
  },
  {
    name: "냉모밀",
    reason: "깔끔하고 시원한 음식을 먹고 싶을 때 좋아요.",
    tastes: ["상큼", "담백", "가벼움"],
    mealTimes: ["점심", "저녁"],
    priceLevel: 1,
  },
  {
    name: "죽",
    reason: "아침이나 늦은 시간에 부담 없이 먹기 좋아요.",
    tastes: ["담백", "가벼움"],
    mealTimes: ["아침", "야식"],
    priceLevel: 1,
  },
  {
    name: "요거트볼",
    reason: "상큼하고 가벼운 아침 식사를 원할 때 좋아요.",
    tastes: ["상큼", "가벼움"],
    mealTimes: ["아침"],
    priceLevel: 1,
  },
  {
    name: "라면",
    reason: "간단하면서 매콤하고 든든한 야식으로 좋아요.",
    tastes: ["매콤", "든든"],
    mealTimes: ["야식"],
    priceLevel: 1,
  },
];

export default function Home() {
  const [mealTime, setMealTime] = useState("");
  const [taste, setTaste] = useState("");
  const [budget, setBudget] = useState("");

  const [recommendations, setRecommendations] = useState<Menu[]>([]);

    const [recommendationId, setRecommendationId] =
    useState<string | null>(null);

  useEffect(() => {
    const alreadyLogged =
      sessionStorage.getItem("app_open_logged");

    if (!alreadyLogged) {
      logEvent("app_open");

      sessionStorage.setItem(
        "app_open_logged",
        "true"
      );
    }
  }, []);

  const handleRecommend = async () => {
  if (!mealTime || !taste || !budget) {
    alert("식사 시간, 느낌, 예산을 모두 선택해주세요.");
    return;
  }

  await logEvent("preference_submit", {
    meal_time: mealTime,
    taste,
    budget,
  });

  const budgetLevel =
    budget === "1만원 이하"
      ? 1
      : budget === "1~2만원"
      ? 2
      : 99;

  const scoredMenus = menuPool
    .filter((menu) => menu.priceLevel <= budgetLevel)
    .map((menu) => {
      let score = 0;

      if (menu.tastes.includes(taste)) {
        score += 3;
      }

      if (menu.mealTimes.includes(mealTime)) {
        score += 2;
      }

      if (
        budget === "1만원 이하" &&
        menu.priceLevel === 1
      ) {
        score += 1;
      }

      return {
        ...menu,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);

  const experimentGroup = getExperimentGroup();

  const recommendationCount =
    experimentGroup === "A" ? 3 : 5;

  const menus = scoredMenus.slice(
    0,
    recommendationCount
  );

  // ⭐ 여기 추가
  const newRecommendationId = crypto.randomUUID();

  setRecommendationId(newRecommendationId);

  setRecommendations(menus);

  await logEvent(
    "recommendation_view",
    {
      meal_time: mealTime,
      taste,
      budget,
      menu_count: menus.length,
      experiment_group: experimentGroup,


      menus: menus.map((menu, index) => ({
        name: menu.name,
        rank: index + 1,
        score: menu.score,
      })),
    },

    // ⭐ 세 번째 인자로 recommendation_id 전달
    newRecommendationId
  );
};

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 flex justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-sm p-8">

        <h1 className="text-3xl font-bold mb-2">
          🍽️ 오늘 뭐 먹지?
        </h1>

        <p className="text-gray-500 mb-8">
          지금 먹고 싶은 느낌을 알려주세요.
        </p>

        {/* 식사 시간 */}
        <section className="mb-8">
          <h2 className="font-semibold mb-3">
            지금 식사는?
          </h2>

          <div className="flex gap-2 flex-wrap">
            {["아침", "점심", "저녁", "야식"].map((item) => (
              <button
                key={item}
                onClick={() => setMealTime(item)}
                className={`px-4 py-2 rounded-full border ${
                  mealTime === item
                    ? "bg-black text-white"
                    : "bg-white text-gray-900"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* 음식 취향 */}
        <section className="mb-8">
          <h2 className="font-semibold mb-3">
            어떤 느낌?
          </h2>

          <div className="flex gap-2 flex-wrap">
            {["매콤", "담백", "든든", "가벼움", "느끼", "상큼"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => setTaste(item)}
                  className={`px-4 py-2 rounded-full border ${
                    taste === item
                      ? "bg-black text-white"
                      : "bg-white text-gray-900"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>
        </section>

        {/* 예산 */}
        <section className="mb-8">
          <h2 className="font-semibold mb-3">
            예산은?
          </h2>

          <div className="flex gap-2 flex-wrap">
            {["1만원 이하", "1~2만원", "상관없음"].map((item) => (
              <button
                key={item}
                onClick={() => setBudget(item)}
                className={`px-4 py-2 rounded-full border ${
                  budget === item
                    ? "bg-black text-white"
                    : "bg-white text-gray-900"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* 추천 버튼 */}
        <button
          onClick={handleRecommend}
          className="w-full bg-black text-white py-4 rounded-xl font-semibold"
        >
          메뉴 추천받기
        </button>

        {/* 추천 결과 */}
        {recommendations.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold mb-4">
              오늘의 추천 🍴
            </h2>

            <div className="space-y-4">
              {recommendations.map((menu, index) => (
                <div
                  key={menu.name}
                  className="border rounded-2xl p-5"
                >
                  <p className="text-sm text-gray-400 mb-1">
                    추천 {index + 1}
                  </p>

                  <h3 className="text-lg font-bold mb-2">
                    {menu.name}
                  </h3>

                  <p className="text-gray-600 mb-4">
                    {menu.reason}
                  </p>

                  <button
  onClick={() =>
    logEvent(
      "menu_click",
      {
        menu_name: menu.name,
        rank: index + 1,
        meal_time: mealTime,
        taste,
        budget,
      },
      recommendationId
    )
  }
  className="px-4 py-2 bg-gray-100 rounded-lg"
>
  이거 먹을래
</button>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}

<p className="mt-10 text-xs text-gray-400 text-center">
  서비스 개선을 위해 익명의 이용 기록
  (선택 조건, 추천 조회 및 메뉴 선택)이 수집됩니다.
  이름, 이메일 등 개인식별정보는 수집하지 않습니다.
</p>