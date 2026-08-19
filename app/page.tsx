"use client";

import { useEffect, useRef, useState } from "react";
import { getExperimentGroup, logEvent } from "@/lib/analytics";

type Menu = {
  name: string;
  reason: string;
  tastes: string[];
  mealTimes: string[];
  estimatedPrice: number;
};

const menuPool: Menu[] = [
  // =========================
  // 식사류
  // =========================

  {
    name: "제육덮밥",
    reason: "매콤하고 든든한 한 끼가 당길 때 잘 맞아요.",
    tastes: ["매콤", "든든"],
    mealTimes: ["점심", "저녁"],
    estimatedPrice: 9000,
  },
  {
    name: "순두부찌개",
    reason: "얼큰하면서도 부담 없이 따뜻하게 먹기 좋아요.",
    tastes: ["매콤", "담백"],
    mealTimes: ["아침", "점심", "저녁"],
    estimatedPrice: 9000,
  },
  {
    name: "김치찌개",
    reason: "칼칼하고 든든한 밥 메뉴가 생각날 때 좋아요.",
    tastes: ["매콤", "든든"],
    mealTimes: ["점심", "저녁"],
    estimatedPrice: 9000,
  },
  {
    name: "닭갈비",
    reason: "매콤한 양념과 든든한 식사를 함께 원할 때 추천해요.",
    tastes: ["매콤", "든든"],
    mealTimes: ["점심", "저녁"],
    estimatedPrice: 15000,
  },
  {
    name: "마라탕",
    reason: "얼얼하고 자극적인 매운맛이 확실하게 당길 때 좋아요.",
    tastes: ["매콤", "든든"],
    mealTimes: ["점심", "저녁"],
    estimatedPrice: 13000,
  },
  {
    name: "쌀국수",
    reason: "깔끔한 국물과 비교적 가벼운 한 끼를 원할 때 좋아요.",
    tastes: ["담백", "가벼움"],
    mealTimes: ["점심", "저녁"],
    estimatedPrice: 11000,
  },
  {
    name: "닭곰탕",
    reason: "자극적이지 않고 따뜻한 국물 메뉴가 당길 때 잘 맞아요.",
    tastes: ["담백", "든든"],
    mealTimes: ["아침", "점심", "저녁"],
    estimatedPrice: 10000,
  },
  {
    name: "비빔밥",
    reason: "여러 재료를 한 번에 먹으면서 든든하게 채우기 좋아요.",
    tastes: ["담백", "든든"],
    mealTimes: ["점심", "저녁"],
    estimatedPrice: 9000,
  },
  {
    name: "돈까스",
    reason: "바삭하고 든든한 한 끼를 먹고 싶을 때 잘 맞아요.",
    tastes: ["든든", "고소"],
    mealTimes: ["점심", "저녁"],
    estimatedPrice: 11000,
  },
  {
    name: "치즈돈까스",
    reason: "치즈의 고소함과 바삭한 식감을 함께 즐기고 싶을 때 좋아요.",
    tastes: ["고소", "든든"],
    mealTimes: ["점심", "저녁"],
    estimatedPrice: 14000,
  },
  {
    name: "크림파스타",
    reason: "부드럽고 고소한 음식이 진하게 당길 때 추천해요.",
    tastes: ["고소", "든든"],
    mealTimes: ["점심", "저녁"],
    estimatedPrice: 16000,
  },
  {
    name: "리조또",
    reason: "부드럽고 고소하면서 포만감 있는 메뉴를 원할 때 좋아요.",
    tastes: ["고소", "든든"],
    mealTimes: ["점심", "저녁"],
    estimatedPrice: 15000,
  },
  {
    name: "샐러드",
    reason: "부담 없이 산뜻하고 가볍게 먹고 싶을 때 잘 맞아요.",
    tastes: ["가벼움", "상큼"],
    mealTimes: ["아침", "점심", "저녁"],
    estimatedPrice: 9000,
  },
  {
    name: "포케",
    reason: "신선하고 산뜻하면서도 적당히 든든하게 먹기 좋아요.",
    tastes: ["가벼움", "상큼", "든든"],
    mealTimes: ["점심", "저녁"],
    estimatedPrice: 12000,
  },
  {
    name: "냉모밀",
    reason: "깔끔하고 시원하면서 가볍게 먹고 싶을 때 추천해요.",
    tastes: ["상큼", "담백", "가벼움"],
    mealTimes: ["점심", "저녁"],
    estimatedPrice: 9000,
  },
  {
    name: "비빔국수",
    reason: "새콤하고 매콤한 맛을 가볍게 즐기고 싶을 때 좋아요.",
    tastes: ["상큼", "매콤"],
    mealTimes: ["점심", "저녁"],
    estimatedPrice: 8000,
  },
  {
    name: "죽",
    reason: "속에 부담을 덜 주면서 따뜻하게 먹고 싶을 때 좋아요.",
    tastes: ["담백", "가벼움"],
    mealTimes: ["아침", "야식"],
    estimatedPrice: 8000,
  },

  // =========================
  // 저가 식사류
  // =========================

  {
    name: "김밥",
    reason: "간단하면서도 적당히 든든한 한 끼로 좋아요.",
    tastes: ["담백", "든든"],
    mealTimes: ["아침", "점심", "저녁", "간식"],
    estimatedPrice: 4500,
  },
  {
    name: "라면",
    reason: "간단하면서 매콤하고 따뜻한 메뉴가 당길 때 좋아요.",
    tastes: ["매콤", "든든"],
    mealTimes: ["점심", "저녁", "야식"],
    estimatedPrice: 4500,
  },
  {
    name: "삼각김밥",
    reason: "시간 없을 때 간단하고 저렴하게 배를 채우기 좋아요.",
    tastes: ["담백", "가벼움"],
    mealTimes: ["아침", "점심", "야식", "간식"],
    estimatedPrice: 1800,
  },
  {
    name: "잔치국수",
    reason: "따뜻하고 담백한 면 요리를 저렴하게 먹고 싶을 때 좋아요.",
    tastes: ["담백", "가벼움"],
    mealTimes: ["점심", "저녁"],
    estimatedPrice: 5000,
  },
  {
    name: "편의점 도시락",
    reason: "예산을 아끼면서도 비교적 든든하게 먹기 좋아요.",
    tastes: ["든든"],
    mealTimes: ["점심", "저녁"],
    estimatedPrice: 5000,
  },

  // =========================
  // 간식류
  // =========================

  {
    name: "요거트볼",
    reason: "상큼하고 달달하면서 가볍게 먹기 좋은 간식이에요.",
    tastes: ["상큼", "달달", "가벼움"],
    mealTimes: ["아침", "간식"],
    estimatedPrice: 6500,
  },
  {
    name: "그릭요거트",
    reason: "상큼하면서도 비교적 든든한 간식을 원할 때 좋아요.",
    tastes: ["상큼", "가벼움", "담백"],
    mealTimes: ["아침", "간식"],
    estimatedPrice: 4500,
  },
  {
    name: "붕어빵",
    reason: "따뜻하고 달달한 간식이 당길 때 부담 없이 즐기기 좋아요.",
    tastes: ["달달"],
    mealTimes: ["간식", "야식"],
    estimatedPrice: 3000,
  },
  {
    name: "베이글",
    reason: "고소하면서도 적당히 든든한 간식을 찾을 때 좋아요.",
    tastes: ["고소", "든든"],
    mealTimes: ["아침", "간식"],
    estimatedPrice: 5000,
  },
  {
    name: "토스트",
    reason: "바삭하고 고소하면서 간단하게 배를 채우기 좋아요.",
    tastes: ["고소", "든든"],
    mealTimes: ["아침", "간식"],
    estimatedPrice: 4500,
  },
  {
    name: "쿠키",
    reason: "가볍게 달달한 게 당길 때 커피와 함께 먹기 좋아요.",
    tastes: ["달달", "고소"],
    mealTimes: ["간식"],
    estimatedPrice: 3500,
  },
  {
    name: "아이스크림",
    reason: "시원하고 달달한 간식이 당길 때 가장 간단한 선택이에요.",
    tastes: ["달달", "가벼움"],
    mealTimes: ["간식", "야식"],
    estimatedPrice: 4000,
  },
  {
    name: "크로플",
    reason: "바삭하고 달달하면서 고소한 디저트를 원할 때 좋아요.",
    tastes: ["달달", "고소"],
    mealTimes: ["간식"],
    estimatedPrice: 8000,
  },
  {
    name: "과일컵",
    reason: "달고 상큼하면서도 무겁지 않은 간식을 원할 때 좋아요.",
    tastes: ["상큼", "달달", "가벼움"],
    mealTimes: ["간식", "아침"],
    estimatedPrice: 5000,
  },
  {
    name: "떡",
    reason: "쫀득하고 은은하게 달달하면서 생각보다 든든한 간식이에요.",
    tastes: ["달달", "든든"],
    mealTimes: ["간식", "아침"],
    estimatedPrice: 4000,
  },
  {
    name: "핫도그",
    reason: "짭짤하고 고소하면서 든든한 간식을 원할 때 좋아요.",
    tastes: ["고소", "든든"],
    mealTimes: ["간식", "야식"],
    estimatedPrice: 4500,
  },
  {
    name: "타코야끼",
    reason: "따뜻하고 짭짤하면서 고소한 간식이 당길 때 추천해요.",
    tastes: ["고소", "든든"],
    mealTimes: ["간식", "야식"],
    estimatedPrice: 6000,
  },
  {
    name: "떡볶이",
    reason: "매콤하면서 달달한 자극적인 간식이 당길 때 잘 맞아요.",
    tastes: ["매콤", "달달", "든든"],
    mealTimes: ["간식", "점심", "저녁", "야식"],
    estimatedPrice: 6000,
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

  const selectionLocked = useRef(false);

  // =========================
  // 앱 접속 로그
  // =========================

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

  // =========================
  // 예산 조건
  // =========================

  const matchesBudget = (
    menu: Menu,
    selectedBudget: string
  ) => {
    if (selectedBudget === "5천원 이하") {
      return menu.estimatedPrice <= 5000;
    }

    if (selectedBudget === "5천~1만원") {
      return (
        menu.estimatedPrice > 5000 &&
        menu.estimatedPrice <= 10000
      );
    }

    if (selectedBudget === "1~2만원") {
      return (
        menu.estimatedPrice > 10000 &&
        menu.estimatedPrice <= 20000
      );
    }

    return true;
  };

  // =========================
  // 추천
  // =========================

  const handleRecommend = async () => {
    if (!mealTime || !taste || !budget) {
      return;
    }

    await logEvent("preference_submit", {
      meal_time: mealTime,
      taste,
      budget,
    });

    const scoredMenus = menuPool
      .filter((menu) =>
        matchesBudget(menu, budget)
      )
      .map((menu) => {
        let score = 0;

        // 취향 일치가 가장 중요
        if (menu.tastes.includes(taste)) {
          score += 4;
        }

        // 식사 시간 일치
        if (menu.mealTimes.includes(mealTime)) {
          score += 3;
        }

        // 취향 태그가 여러 개면 조금 더 풍부한 후보
        if (menu.tastes.length >= 2) {
          score += 1;
        }

        return {
          ...menu,
          score,
        };
      })
      .sort((a, b) => b.score - a.score);

    const experimentGroup =
      getExperimentGroup();

    // =========================
    // A/B Test
    //
    // A = 추천 3개
    // B = 추천 5개
    // =========================

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

    selectionLocked.current = false;

    await logEvent(
      "recommendation_view",
      {
        meal_time: mealTime,
        taste,
        budget,

        menu_count: menus.length,

        experiment_group:
          experimentGroup,

        menus: menus.map(
          (menu, index) => ({
            name: menu.name,
            rank: index + 1,
            score: menu.score,
            estimated_price:
              menu.estimatedPrice,
          })
        ),
      },
      newRecommendationId
    );

    setTimeout(() => {
      document
        .getElementById("recommendations")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  };

  // =========================
  // 메뉴 선택
  // =========================

  const handleMenuSelect = async (
    menu: Menu,
    index: number
  ) => {
    if (selectionLocked.current) {
      return;
    }

    selectionLocked.current = true;

    setSelectedMenu(menu);

    await logEvent(
      "menu_click",
      {
        menu_name: menu.name,
        rank: index + 1,

        meal_time: mealTime,
        taste,
        budget,

        estimated_price:
          menu.estimatedPrice,
      },
      recommendationId
    );
  };

  // =========================
  // 다시 시작
  // =========================

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

  // =========================
  // 선택 완료 화면
  // =========================

  if (selectedMenu) {
    return (
      <main className="min-h-screen bg-gray-50 text-gray-900 flex justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-9">

          <div className="py-14 sm:py-20 text-center">

            <div className="text-6xl mb-6">
              🍽️
            </div>

            <p className="text-sm font-medium text-gray-400 mb-3">
              오늘의 메뉴 선택 완료
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              {selectedMenu.name}
            </h1>

            <p className="text-lg font-semibold text-gray-700 mb-5">
              약{" "}
              {selectedMenu.estimatedPrice.toLocaleString(
                "ko-KR"
              )}
              원
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {selectedMenu.tastes.map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>

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

          <DataNotice />

        </div>
      </main>
    );
  }

  // =========================
  // 메인 화면
  // =========================

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 flex justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-9">

        {/* 제목 */}

        <div className="mb-12">
          <div className="text-4xl mb-4">
            🍽️
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            오늘 뭐 먹지?
          </h1>

          <p className="text-gray-500 leading-relaxed">
            고민은 짧게, 메뉴는 빠르게.
            <br />
            지금 당기는 걸 골라주세요.
          </p>
        </div>

        {/* =========================
            1. 식사 시간
        ========================= */}

        <section className="mb-10">
          <QuestionTitle
            number="1"
            title="언제 먹어요?"
          />

          <div className="flex gap-2 flex-wrap">
            {[
              "아침",
              "점심",
              "저녁",
              "야식",
              "간식",
            ].map((item) => {
              const selected =
                mealTime === item;

              return (
                <ChoiceButton
                  key={item}
                  selected={selected}
                  onClick={() =>
                    setMealTime(item)
                  }
                >
                  {selected
                    ? `✓ ${item}`
                    : item}
                </ChoiceButton>
              );
            })}
          </div>
        </section>

        {/* =========================
            2. 취향
        ========================= */}

        <section className="mb-10">
          <QuestionTitle
            number="2"
            title="어떤 게 당겨요?"
          />

          <div className="flex gap-2 flex-wrap">
            {[
              ["🌶️", "매콤"],
              ["🍚", "담백"],
              ["🍯", "달달"],
              ["💪", "든든"],
              ["🥗", "가벼움"],
              ["🧀", "고소"],
              ["🍋", "상큼"],
            ].map(([emoji, item]) => {
              const selected =
                taste === item;

              return (
                <ChoiceButton
                  key={item}
                  selected={selected}
                  onClick={() =>
                    setTaste(item)
                  }
                >
                  {selected
                    ? `✓ ${emoji} ${item}`
                    : `${emoji} ${item}`}
                </ChoiceButton>
              );
            })}
          </div>
        </section>

        {/* =========================
            3. 예산
        ========================= */}

        <section className="mb-10">
          <QuestionTitle
            number="3"
            title="얼마 정도 생각해요?"
          />

          <div className="grid grid-cols-2 gap-2">
            {[
              "5천원 이하",
              "5천~1만원",
              "1~2만원",
              "상관없음",
            ].map((item) => {
              const selected =
                budget === item;

              return (
                <ChoiceButton
                  key={item}
                  selected={selected}
                  onClick={() =>
                    setBudget(item)
                  }
                  fullWidth
                >
                  {selected
                    ? `✓ ${item}`
                    : item}
                </ChoiceButton>
              );
            })}
          </div>
        </section>

        {/* 추천 버튼 */}

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
          {canRecommend
            ? "메뉴 추천받기"
            : "3가지를 선택해주세요"}
        </button>

        {/* =========================
            추천 결과
        ========================= */}

        {recommendations.length > 0 && (
          <section
            id="recommendations"
            className="mt-16"
          >

            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-1">
                취향에 맞춰 골라봤어요
              </p>

              <h2 className="text-2xl font-bold">
                오늘의 추천
              </h2>
            </div>

            <div className="space-y-4">
              {recommendations.map(
                (menu, index) => (
                  <div
                    key={`${recommendationId}-${menu.name}`}
                    className="
                      group
                      border
                      border-gray-200
                      rounded-2xl
                      p-5
                      sm:p-6
                      transition-all
                      duration-200
                      hover:border-gray-400
                      hover:shadow-md
                    "
                  >

                    <div className="flex justify-between items-start gap-4 mb-3">

                      <div>
                        <span className="inline-block text-xs font-bold bg-black text-white px-2.5 py-1 rounded-full mb-3">
                          TOP {index + 1}
                        </span>

                        <h3 className="text-xl sm:text-2xl font-bold">
                          {menu.name}
                        </h3>
                      </div>

                      <p className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                        약{" "}
                        {menu.estimatedPrice.toLocaleString(
                          "ko-KR"
                        )}
                        원
                      </p>

                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {menu.tastes.map(
                        (tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                          >
                            {tag}
                          </span>
                        )
                      )}
                    </div>

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
                        w-full
                        sm:w-auto
                        cursor-pointer
                        px-5 py-3
                        bg-gray-100
                        rounded-xl
                        font-semibold
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

        <DataNotice />

      </div>
    </main>
  );
}

// =========================
// 공통 UI 컴포넌트
// =========================

function QuestionTitle({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-black text-white text-xs font-bold">
        {number}
      </span>

      <h2 className="font-bold text-lg">
        {title}
      </h2>
    </div>
  );
}

function ChoiceButton({
  children,
  selected,
  onClick,
  fullWidth = false,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  fullWidth?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`
        cursor-pointer
        px-4 py-2.5
        rounded-xl
        border
        font-medium
        transition-all
        duration-150
        active:scale-95

        ${fullWidth ? "w-full" : ""}

        ${
          selected
            ? `
              bg-black
              text-white
              border-black
              hover:bg-gray-800
            `
            : `
              bg-white
              text-gray-800
              border-gray-200
              hover:bg-gray-100
              hover:border-gray-400
            `
        }
      `}
    >
      {children}
    </button>
  );
}

function DataNotice() {
  return (
    <p className="mt-12 text-xs leading-relaxed text-gray-400 text-center">
      서비스 개선을 위해 익명의 이용 기록
      (선택 조건, 추천 조회 및 메뉴 선택)이 수집됩니다.
      <br />
      이름, 이메일 등 개인식별정보는 수집하지 않습니다.
    </p>
  );
}