export abstract class BaseError {
    constructor(public statusCode: number, public message: string) {}

    public abstract toJson(): any;
}


export class HttpError extends BaseError {
    constructor(
        public statusCode: number,
        public message: string,
        public code: string,
        public field: string | undefined = undefined
    ) {
        super(statusCode, message);
    }

    public toJson() {
        return {
            type: this.constructor.name,
            message: this.message,
            code: this.code,
            field: this.field,
        };
    }
}


export class ParamInvalid extends HttpError {
    constructor(public field: string, public message: string) {
        super(400, message, ErrorCodes.ParamsInvalid, field);
    }
}


export class NotFound extends BaseError {
    constructor(public message: string) {
        super(404, message);
    }

    public toJson() {
        return {
            type: this.constructor.name,
            message: this.message,
            code: '404',
        };
    }
}


export class InternalServerError extends BaseError {
    constructor() {
        super(500, 'Internal Server Error');
    }

    public toJson() {
        return {
            type: this.constructor.name,
            message: this.message,
            code: '500',
        };
    }
}


export class APIError extends BaseError {
    public code: string;
    public detail: any | undefined;

    constructor(res: any) {
        const { statusCode, body } = res;

        super(500, new String(body).toString());

        this.code = '80';

        this.statusCode = statusCode;
        this.code = body?.code;
        this.message = body?.message;
        this.detail = body?.details;
    }

    public toJson() {
        return {
            type: this.constructor.name,
            message: this.message,
            code: this.code,
            detail: this.detail,
        };
    }
}


export const ErrorCodes = {
    Forbidden: '80.403.1',
    ParamsInvalid: '80.400.1',
};
