import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
  user_id,
  session_id,
  event_name,
  recommendation_id = null,
  experiment_group = null,
  properties = {},
} = body;

    if (!user_id || !session_id || !event_name) {
      return NextResponse.json(
        { error: "필수 이벤트 정보가 없습니다." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("events")
      .insert({
        user_id,
        session_id,
        event_name,
        recommendation_id,
        experiment_group,
        properties,
      });

    if (error) {
      console.error(error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "이벤트 저장 실패" },
      { status: 500 }
    );
  }
}