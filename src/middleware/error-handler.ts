import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ApiError } from '@/types';

export class Errors {
  static badRequest(message: string, details?: Record<string, any>): ApiError {
    return {
      code: 'BAD_REQUEST',
      message,
      details,
    };
  }

  static unauthorized(message: string = 'Unauthorized'): ApiError {
    return {
      code: 'UNAUTHORIZED',
      message,
    };
  }

  static forbidden(message: string = 'Forbidden'): ApiError {
    return {
      code: 'FORBIDDEN',
      message,
    };
  }

  static notFound(message: string = 'Not found'): ApiError {
    return {
      code: 'NOT_FOUND',
      message,
    };
  }

  static internal(message: string = 'Internal server error'): ApiError {
    return {
      code: 'INTERNAL_ERROR',
      message,
    };
  }
}

export function withErrorHandler(handler: Function) {
  return async (request: NextRequest) => {
    try {
      return await handler(request);
    } catch (error) {
      console.error('API Error:', error);

      if (error instanceof Error) {
        const apiError = error as unknown as ApiError;
        return NextResponse.json(
          { error: apiError },
          { status: getErrorStatus(apiError.code) }
        );
      }

      return NextResponse.json(
        { error: Errors.internal() },
        { status: 500 }
      );
    }
  };
}

function getErrorStatus(code: string): number {
  switch (code) {
    case 'BAD_REQUEST':
      return 400;
    case 'UNAUTHORIZED':
      return 401;
    case 'FORBIDDEN':
      return 403;
    case 'NOT_FOUND':
      return 404;
    case 'INTERNAL_ERROR':
      return 500;
    default:
      return 500;
  }
} 