export interface CustomError extends Error {
    error?: any;
    [key: string]: any;
}

export class AppError {
    constructor(public msg?: string, public error?: CustomError, public code?: string, status?:number) {
    }
    static fromError(error: CustomError): AppError {
        
        return new AppError(error.message, error.error, error.status);
    }
}
