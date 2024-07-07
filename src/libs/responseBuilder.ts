type SuccessResponseType<T> = {
    message: string;
    data: Array<T>
}

type ErrorResponseType<T> = {
    status: number,
    error: string,
    message: string
}

export const successResponse = <T>(payload: { data: Array<T>, message: string }): SuccessResponseType<T> => {
    return {
        message: payload.message,
        data: payload.data,
    };
};

export const errorResponse = <T>(payload: { status: number, error: string, message: string }): ErrorResponseType<T> => {
    return {
        status: payload.status,
        error: payload.error,
        message: payload.message,
    };
};

