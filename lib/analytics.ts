export function getUserId() {
  let userId = localStorage.getItem("whattoeat_user_id");

  if (!userId) {
    userId = crypto.randomUUID();

    localStorage.setItem(
      "whattoeat_user_id",
      userId
    );
  }

  return userId;
}


export function getSessionId() {
  let sessionId = sessionStorage.getItem(
    "whattoeat_session_id"
  );

  if (!sessionId) {
    sessionId = crypto.randomUUID();

    sessionStorage.setItem(
      "whattoeat_session_id",
      sessionId
    );
  }

  return sessionId;
}


export function getExperimentGroup(userId?: string) {
  const id = userId ?? getUserId();

  const lastChar = id.slice(-1).toLowerCase();
  const value = parseInt(lastChar, 16);

  return value < 8 ? "A" : "B";
}

export async function logEvent(
  eventName: string,
  properties = {},
  recommendationId: string | null = null
) {
  const userId = getUserId();
  const sessionId = getSessionId();
const experimentGroup = getExperimentGroup(userId);

  try {
    await fetch("/api/events", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        user_id: userId,
        session_id: sessionId,
        event_name: eventName,
        recommendation_id: recommendationId,
        experiment_group: experimentGroup,
        properties,
      }),
    });
  } catch (error) {
    console.error("이벤트 기록 실패:", error);
  }
}