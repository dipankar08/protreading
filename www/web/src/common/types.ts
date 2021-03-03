export type TObject ={
    [key: string]: any;
};

export type TArray = any[];

export type TOnSuccess= (resultObj?:  any[] | TObject,oriResp?:TObject|TArray )=>void;
export type TOnError= (msg?:string,oriResp?:TObject)=>void;