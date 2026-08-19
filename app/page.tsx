"use client";

import { useEffect, useRef, useState } from "react";
import { getExperimentGroup, logEvent } from "@/lib/analytics";

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
  {
    name: "떡볶이",
    reason: "매콤하고 자극적인 음식이 당길 때 잘 맞아요.",
    tastes: ["매콤"],
    mealTimes: ["점심", "저녁", "야식"],
    priceLevel: 1,
  },
  {
    name: "리조또",
    reason: "부드럽고 고소한 한 끼를 먹고 싶을 때 좋아요.",
    tastes: ["느끼", "든든"],
    mealTimes: ["점심", "저녁"],
    priceLevel: 2,
  },
];

export default function Home() {
  const [mealTime, setMealTime] = useState("");
  const [taste, setTaste] = useState("");
  const [budget, setBudget] = useState("");

  const [recommendations, setRecommendations] = useState<Menu[]>([]);

  const [recommendationId, setRecommendationId] =
    useState<string | null>(null);

  const [selectedMenu, setSelectedMenu] =
    useState<Menu | null>(null);

  // 매우 빠르게 여러 번 클릭하는 경우도 막기 위한 잠금
  const selectionLocked = useRef(false);

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

        // 원하는 느낌과 일치
        if (menu.tastes.includes(taste)) {
          score += 3;
        }

        // 식사 시간과 일치
        if (menu.mealTimes.includes(mealTime)) {
          score += 2;
        }

        // 저예산 조건에서 저렴한 메뉴
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

    // A그룹 = 3개
    // B그룹 = 5개
    const recommendationCount =
      experimentGroup === "A" ? 3 : 5;

    const menus = scoredMenus.slice(
      0,
      recommendationCount
    );

    const newRecommendationId =
      crypto.randomUUID();

    setRecommendationId(newRecommendationId);
    setRecommendations(menus);

    // 새 추천 결과에서는 다시 메뉴 선택 가능
    selectionLocked.current = false;

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
      newRecommendationId
    );

    // 추천 결과 위치로 부드럽게 이동
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  const handleMenuSelect = async (
    menu: Menu,
    index: number
  ) => {
    // 이미 선택했으면 추가 클릭 무시
    if (selectionLocked.current) {
      return;
    }

    selectionLocked.current = true;

    // 화면을 즉시 선택 완료 상태로 바꿈
    // 로그 저장을 기다리는 동안 중복 클릭하는 것을 방지
    setSelectedMenu(menu);

    await logEvent(
      "menu_click",
      {
        menu_name: menu.name,
        rank: index + 1,
        meal_time: mealTime,
        taste,
        budget,
      },
      recommendationId
    );
  };

  const handleGoHome = () => {
    setMealTime("");
    setTaste("");
    setBudget("");

    setRecommendations([]);
    setRecommendationId(null);
    setSelectedMenu(null);

    selectionLocked.current = false;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const canRecommend =
    mealTime !== "" &&
    taste !== "" &&
    budget !== "";

  // ========================================
  // 메뉴 선택 완료 화면
  // ========================================

  if (selectedMenu) {
    return (
      <main className="min-h-screen bg-gray-50 text-gray-900 flex justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-sm p-6 sm:p-8">

          <div className="py-14 sm:py-20 text-center">

            <div className="text-6xl mb-6">
              🍽️
            </div>

            <p className="text-gray-500 mb-3">
              오늘의 메뉴 선택 완료!
            </p>

            <h1 className="text-3xl font-bold mb-4">
              {selectedMenu.name}
            </h1>

            <p className="text-gray-600 leading-relaxed mb-10">
              {selectedMenu.reason}
            </p>

            <button
              type="button"
              onClick={handleGoHome}
              className="
                w-full
                cursor-pointer
                bg-black
                text-white
                py-4
                rounded-xl
                font-semibold
                transition-all
                duration-150
                hover:bg-gray-800
                active:scale-[0.98]
              "
            >
              다시 추천받기
            </button>

          </div>

          <p className="text-xs leading-relaxed text-gray-400 text-center">
            서비스 개선을 위해 익명의 이용 기록
            (선택 조건, 추천 조회 및 메뉴 선택)이 수집됩니다.
            이름, 이메일 등 개인식별정보는 수집하지 않습니다.
          </p>

        </div>
      </main>
    );
  }

  // ========================================
  // 메인 화면
  // ========================================

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 flex justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-sm p-6 sm:p-8">

        <h1 className="text-3xl font-bold mb-2">
          🍽️ 오늘 뭐 먹지?
        </h1>

        <p className="text-gray-500 mb-10">
          지금 먹고 싶은 느낌을 알려주세요.
        </p>


        {/* ===================================
            식사 시간
        =================================== */}

        <section className="mb-9">
          <h2 className="font-semibold mb-3">
            지금 식사는?
          </h2>

          <div className="flex gap-2 flex-wrap">
            {["아침", "점심", "저녁", "야식"].map(
              (item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setMealTime(item)}
                  aria-pressed={mealTime === item}
                  className={`
                    cursor-pointer
                    px-4 py-2
                    rounded-full
                    border
                    transition-all
                    duration-150
                    active:scale-95

                    ${
                      mealTime === item
                        ? `
                          bg-black
                          text-white
                          border-black
                          hover:bg-gray-800
                        `
                        : `
                          bg-white
                          text-gray-900
                          border-gray-200
                          hover:bg-gray-100
                          hover:border-gray-400
                        `
                    }
                  `}
                >
                  {item}
                </button>
              )
            )}
          </div>
        </section>


        {/* ===================================
            느낌
        =================================== */}

        <section className="mb-9">
          <h2 className="font-semibold mb-3">
            어떤 느낌?
          </h2>

          <div className="flex gap-2 flex-wrap">
            {[
              "매콤",
              "담백",
              "든든",
              "가벼움",
              "느끼",
              "상큼",
            ].map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setTaste(item)}
                aria-pressed={taste === item}
                className={`
                  cursor-pointer
                  px-4 py-2
                  rounded-full
                  border
                  transition-all
                  duration-150
                  active:scale-95

                  ${
                    taste === item
                      ? `
                        bg-black
                        text-white
                        border-black
                        hover:bg-gray-800
                      `
                      : `
                        bg-white
                        text-gray-900
                        border-gray-200
                        hover:bg-gray-100
                        hover:border-gray-400
                      `
                  }
                `}
              >
                {item}
              </button>
            ))}
          </div>
        </section>


        {/* ===================================
            예산
        =================================== */}

        <section className="mb-9">
          <h2 className="font-semibold mb-3">
            예산은?
          </h2>

          <div className="flex gap-2 flex-wrap">
            {[
              "1만원 이하",
              "1~2만원",
              "상관없음",
            ].map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setBudget(item)}
                aria-pressed={budget === item}
                className={`
                  cursor-pointer
                  px-4 py-2
                  rounded-full
                  border
                  transition-all
                  duration-150
                  active:scale-95

                  ${
                    budget === item
                      ? `
                        bg-black
                        text-white
                        border-black
                        hover:bg-gray-800
                      `
                      : `
                        bg-white
                        text-gray-900
                        border-gray-200
                        hover:bg-gray-100
                        hover:border-gray-400
                      `
                  }
                `}
              >
                {item}
              </button>
            ))}
          </div>
        </section>


        {/* ===================================
            추천 버튼
        =================================== */}

        <button
          type="button"
          onClick={handleRecommend}
          disabled={!canRecommend}
          className={`
            w-full
            py-4
            rounded-xl
            font-semibold
            transition-all
            duration-150

            ${
              canRecommend
                ? `
                  cursor-pointer
                  bg-black
                  text-white
                  hover:bg-gray-800
                  active:scale-[0.98]
                `
                : `
                  cursor-not-allowed
                  bg-gray-200
                  text-gray-400
                `
            }
          `}
        >
          메뉴 추천받기
        </button>


        {/* ===================================
            추천 결과
        =================================== */}

        {recommendations.length > 0 && (
          <section className="mt-12">

            <div className="mb-5">
              <p className="text-sm text-gray-400 mb-1">
                취향에 맞춰 골라봤어요
              </p>

              <h2 className="text-2xl font-bold">
                오늘의 추천 🍴
              </h2>
            </div>

            <div className="space-y-4">
              {recommendations.map(
                (menu, index) => (
                  <div
                    key={`${recommendationId}-${menu.name}`}
                    className="
                      border
                      border-gray-200
                      rounded-2xl
                      p-5
                      transition-all
                      duration-150
                      hover:border-gray-300
                      hover:shadow-sm
                    "
                  >
                    <p className="text-sm text-gray-400 mb-1">
                      추천 {index + 1}
                    </p>

                    <h3 className="text-xl font-bold mb-2">
                      {menu.name}
                    </h3>

                    <p className="text-gray-600 leading-relaxed mb-5">
                      {menu.reason}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        handleMenuSelect(
                          menu,
                          index
                        )
                      }
                      className="
                        cursor-pointer
                        px-4 py-2.5
                        bg-gray-100
                        rounded-lg
                        font-medium
                        transition-all
                        duration-150
                        hover:bg-black
                        hover:text-white
                        active:scale-95
                      "
                    >
                      이거 먹을래
                    </button>
                  </div>
                )
              )}
            </div>
          </section>
        )}


        {/* ===================================
            로그 수집 안내
        =================================== */}

        <p className="mt-12 text-xs leading-relaxed text-gray-400 text-center">
          서비스 개선을 위해 익명의 이용 기록
          (선택 조건, 추천 조회 및 메뉴 선택)이 수집됩니다.
          이름, 이메일 등 개인식별정보는 수집하지 않습니다.
        </p>

      </div>
    </main>
  );
}