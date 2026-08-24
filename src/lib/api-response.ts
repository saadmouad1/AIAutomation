import { NextResponse } from "next/server";

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export const ApiResponse = {
  success<T>(data: T, status: number = 200) {
    return NextResponse.json(
      { success: true, data } satisfies ApiSuccessResponse<T>,
      { status }
    );
  },
  
  error(code: string, message: string, status: number = 400) {
    return NextResponse.json(
      { success: false, error: { code, message } } satisfies ApiErrorResponse,
      { status }
    );
  }
};
